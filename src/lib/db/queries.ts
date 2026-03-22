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
