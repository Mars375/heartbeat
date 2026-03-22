import { db } from "@/lib/db";
import { monitors, monitorChecks, incidents, incidentUpdates, statusPages, statusPageMonitors, subscribers, apiKeys, organizations, users, incidentMonitors } from "./schema";
import { eq, desc, and, gte, sql, count } from "drizzle-orm";

export async function getMonitors(orgId: string) {
  return db.select().from(monitors)
    .where(eq(monitors.orgId, orgId))
    .orderBy(desc(monitors.createdAt));
}

export async function getMonitorById(id: string, orgId: string) {
  return db.select().from(monitors)
    .where(and(eq(monitors.id, id), eq(monitors.orgId, orgId)))
    .then((rows) => rows[0] ?? null);
}

export async function getMonitorChecks(monitorId: string, limit = 100) {
  return db.select().from(monitorChecks)
    .where(eq(monitorChecks.monitorId, monitorId))
    .orderBy(desc(monitorChecks.checkedAt))
    .limit(limit);
}

export async function getMonitorUptimeByDay(monitorId: string, days = 90) {
  const since = new Date(Date.now() - days * 86400000);
  return db.select({
    date: sql<string>`DATE(${monitorChecks.checkedAt})`,
    totalChecks: count(),
    upChecks: sql<number>`COUNT(*) FILTER (WHERE ${monitorChecks.status} = 'up')`,
    avgResponseTime: sql<number>`AVG(${monitorChecks.responseTimeMs})`,
  })
    .from(monitorChecks)
    .where(and(
      eq(monitorChecks.monitorId, monitorId),
      gte(monitorChecks.checkedAt, since)
    ))
    .groupBy(sql`DATE(${monitorChecks.checkedAt})`)
    .orderBy(sql`DATE(${monitorChecks.checkedAt})`);
}

export async function createMonitor(data: {
  orgId: string;
  name: string;
  url: string;
  method: string;
  intervalSeconds: number;
  expectedStatus: number;
}) {
  const [monitor] = await db.insert(monitors).values(data).returning();
  return monitor;
}

export async function getActiveMonitorsForChecking() {
  return db.select().from(monitors)
    .where(eq(monitors.isPaused, false));
}

export async function insertMonitorCheck(data: {
  monitorId: string;
  status: "up" | "down" | "degraded";
  responseTimeMs: number | null;
  statusCode: number | null;
  errorMessage: string | null;
}) {
  const [check] = await db.insert(monitorChecks).values({
    ...data,
    responseTimeMs: data.responseTimeMs ?? undefined,
    statusCode: data.statusCode ?? undefined,
  }).returning();
  return check;
}

export async function updateMonitorStatus(id: string, status: "operational" | "degraded" | "down") {
  await db.update(monitors).set({
    lastStatus: status,
    lastCheckedAt: new Date(),
    updatedAt: new Date(),
  }).where(eq(monitors.id, id));
}

// --- Incident queries ---

export async function getIncidents(orgId: string) {
  return db.select().from(incidents)
    .where(eq(incidents.orgId, orgId))
    .orderBy(desc(incidents.createdAt));
}

export async function getIncidentById(id: string, orgId: string) {
  return db.select().from(incidents)
    .where(and(eq(incidents.id, id), eq(incidents.orgId, orgId)))
    .then((rows) => rows[0] ?? null);
}

export async function getIncidentUpdates(incidentId: string) {
  return db.select().from(incidentUpdates)
    .where(eq(incidentUpdates.incidentId, incidentId))
    .orderBy(desc(incidentUpdates.createdAt));
}

export async function createIncident(data: {
  orgId: string;
  title: string;
  severity: "minor" | "major" | "critical";
  monitorIds: string[];
}) {
  const [incident] = await db.insert(incidents).values({
    orgId: data.orgId,
    title: data.title,
    severity: data.severity,
  }).returning();

  if (data.monitorIds.length > 0) {
    await db.insert(incidentMonitors).values(
      data.monitorIds.map((monitorId) => ({
        incidentId: incident.id,
        monitorId,
      }))
    );
  }

  await db.insert(incidentUpdates).values({
    incidentId: incident.id,
    status: "investigating",
    message: "We are investigating this issue.",
  });

  return incident;
}

export async function addIncidentUpdate(data: {
  incidentId: string;
  status: "investigating" | "identified" | "monitoring" | "resolved";
  message: string;
}) {
  const [update] = await db.insert(incidentUpdates).values(data).returning();

  await db.update(incidents).set({
    status: data.status,
    updatedAt: new Date(),
    ...(data.status === "resolved" ? { resolvedAt: new Date() } : {}),
  }).where(eq(incidents.id, data.incidentId));

  return update;
}

// --- Status page queries ---

export async function getStatusPages(orgId: string) {
  return db.select().from(statusPages)
    .where(eq(statusPages.orgId, orgId))
    .orderBy(desc(statusPages.createdAt));
}

export async function getStatusPageById(id: string, orgId: string) {
  return db.select().from(statusPages)
    .where(and(eq(statusPages.id, id), eq(statusPages.orgId, orgId)))
    .then((rows) => rows[0] ?? null);
}

export async function getStatusPageBySlug(slug: string) {
  const page = await db.select().from(statusPages)
    .where(and(eq(statusPages.slug, slug), eq(statusPages.isPublic, true)))
    .then((rows) => rows[0] ?? null);

  if (!page) return null;

  const pageMonitors = await db
    .select({ monitor: monitors })
    .from(statusPageMonitors)
    .innerJoin(monitors, eq(statusPageMonitors.monitorId, monitors.id))
    .where(eq(statusPageMonitors.statusPageId, page.id))
    .orderBy(statusPageMonitors.displayOrder);

  const activeIncidents = await db.select().from(incidents)
    .where(and(
      eq(incidents.orgId, page.orgId),
      sql`${incidents.status} != 'resolved'`
    ))
    .orderBy(desc(incidents.createdAt));

  return { page, monitors: pageMonitors.map((r) => r.monitor), activeIncidents };
}

export async function createStatusPage(data: {
  orgId: string;
  name: string;
  slug: string;
  brandingColor?: string;
}) {
  const [page] = await db.insert(statusPages).values(data).returning();
  return page;
}

export async function getSubscribers(statusPageId: string) {
  return db.select().from(subscribers)
    .where(and(eq(subscribers.statusPageId, statusPageId), eq(subscribers.verified, true)));
}
