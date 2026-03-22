import { NextRequest, NextResponse } from "next/server";
import { getActiveMonitorsForChecking, insertMonitorCheck, updateMonitorStatus } from "@/lib/db/queries";
import { performCheck } from "@/lib/monitoring";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const monitors = await getActiveMonitorsForChecking();
  const now = Date.now();

  const results = await Promise.allSettled(
    monitors
      .filter((m) => {
        if (!m.lastCheckedAt) return true;
        const elapsed = now - m.lastCheckedAt.getTime();
        return elapsed >= m.intervalSeconds * 1000;
      })
      .map(async (monitor) => {
        const result = await performCheck({
          url: monitor.url,
          method: monitor.method,
          expectedStatus: monitor.expectedStatus,
          timeoutMs: monitor.timeoutMs,
        });

        await insertMonitorCheck({
          monitorId: monitor.id,
          status: result.status,
          responseTimeMs: result.responseTimeMs,
          statusCode: result.statusCode,
          errorMessage: result.errorMessage,
        });

        const monitorStatus = result.status === "up" ? "operational" : result.status === "degraded" ? "degraded" : "down";
        await updateMonitorStatus(monitor.id, monitorStatus);

        return { monitorId: monitor.id, status: result.status };
      })
  );

  return NextResponse.json({
    checked: results.length,
    timestamp: new Date().toISOString(),
  });
}
