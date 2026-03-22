import { db } from "@/lib/db";
import {
  organizations,
  users,
  monitors,
  monitorChecks,
  incidents,
  incidentUpdates,
  incidentMonitors,
  statusPages,
  statusPageMonitors,
  subscribers,
} from "./schema";

// Simple seeded PRNG for deterministic data
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export async function seedDatabase() {
  const rng = mulberry32(42);

  // 1. Create demo org
  const [org] = await db.insert(organizations).values({
    name: "Acme Corp",
    slug: "demo",
    plan: "pro",
  }).returning();

  // 2. Create demo user
  await db.insert(users).values({
    clerkId: "demo-user",
    email: "demo@heartbeat.dev",
    name: "Demo User",
    orgId: org.id,
    role: "owner",
  });

  // 3. Create 5 monitors
  const monitorData = [
    { name: "API Gateway", url: "https://api.example.com/health", method: "GET", intervalSeconds: 60, expectedStatus: 200 },
    { name: "Web App", url: "https://app.example.com", method: "GET", intervalSeconds: 60, expectedStatus: 200 },
    { name: "Auth Service", url: "https://auth.example.com/ping", method: "GET", intervalSeconds: 120, expectedStatus: 200 },
    { name: "CDN", url: "https://cdn.example.com/status", method: "HEAD", intervalSeconds: 300, expectedStatus: 200 },
    { name: "Database Proxy", url: "https://db-proxy.example.com/health", method: "GET", intervalSeconds: 60, expectedStatus: 200 },
  ];

  const createdMonitors = await db.insert(monitors).values(
    monitorData.map((m) => ({ ...m, orgId: org.id, lastStatus: "operational" as const }))
  ).returning();

  // 4. Generate 90 days of checks per monitor (~13k rows)
  const now = Date.now();
  const checksToInsert = [];

  for (const monitor of createdMonitors) {
    for (let day = 89; day >= 0; day--) {
      const checksPerDay = monitor.intervalSeconds <= 60 ? 24 : monitor.intervalSeconds <= 120 ? 12 : 5;
      for (let c = 0; c < checksPerDay; c++) {
        const timestamp = new Date(now - day * 86400000 + c * (86400000 / checksPerDay));
        const rand = rng();
        const isDown = rand < 0.02; // 2% failure rate
        const isDegraded = !isDown && rand < 0.07; // 5% degraded
        const responseTime = isDown ? null : Math.round(50 + rng() * (isDegraded ? 3000 : 300));

        checksToInsert.push({
          monitorId: monitor.id,
          status: (isDown ? "down" : isDegraded ? "degraded" : "up") as "up" | "down" | "degraded",
          responseTimeMs: responseTime,
          statusCode: isDown ? (rng() > 0.5 ? 500 : null) : 200,
          errorMessage: isDown ? "Connection timeout" : null,
          checkedAt: timestamp,
        });
      }
    }
  }

  // Insert in batches of 500
  for (let i = 0; i < checksToInsert.length; i += 500) {
    await db.insert(monitorChecks).values(checksToInsert.slice(i, i + 500));
  }

  // 5. Create 3 incidents
  const incidentData = [
    { title: "API Gateway Latency Spike", severity: "major" as const, daysAgo: 12, resolved: true },
    { title: "CDN Cache Invalidation Failure", severity: "minor" as const, daysAgo: 5, resolved: true },
    { title: "Database Connection Pool Exhaustion", severity: "critical" as const, daysAgo: 1, resolved: false },
  ];

  for (const inc of incidentData) {
    const startedAt = new Date(now - inc.daysAgo * 86400000);
    const [incident] = await db.insert(incidents).values({
      orgId: org.id,
      title: inc.title,
      severity: inc.severity,
      status: inc.resolved ? "resolved" : "investigating",
      startedAt,
      resolvedAt: inc.resolved ? new Date(startedAt.getTime() + 3600000 * (2 + rng() * 4)) : null,
    }).returning();

    // Link to corresponding monitor
    await db.insert(incidentMonitors).values({
      incidentId: incident.id,
      monitorId: createdMonitors[incidentData.indexOf(inc)].id,
    });

    // Add updates
    const statuses = inc.resolved
      ? ["investigating", "identified", "monitoring", "resolved"] as const
      : ["investigating"] as const;

    for (let s = 0; s < statuses.length; s++) {
      await db.insert(incidentUpdates).values({
        incidentId: incident.id,
        status: statuses[s],
        message: `${statuses[s] === "investigating" ? "We are investigating this issue." : statuses[s] === "identified" ? "Root cause identified." : statuses[s] === "monitoring" ? "Fix deployed, monitoring for stability." : "Issue has been resolved."}`,
        createdAt: new Date(startedAt.getTime() + s * 1800000),
      });
    }
  }

  // 6. Create public status page
  const [statusPage] = await db.insert(statusPages).values({
    orgId: org.id,
    name: "Acme Status",
    slug: "demo",
    brandingColor: "#10B981",
    isPublic: true,
  }).returning();

  // Link all monitors to status page
  await db.insert(statusPageMonitors).values(
    createdMonitors.map((m, i) => ({
      statusPageId: statusPage.id,
      monitorId: m.id,
      displayOrder: i,
    }))
  );

  // 7. Add demo subscribers
  await db.insert(subscribers).values([
    { statusPageId: statusPage.id, email: "alice@example.com", verified: true, verifyToken: "token-1" },
    { statusPageId: statusPage.id, email: "bob@example.com", verified: true, verifyToken: "token-2" },
  ]);

  return { orgId: org.id, statusPageSlug: "demo" };
}
