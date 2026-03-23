import { NextRequest, NextResponse } from "next/server";
import { getActiveMonitorsForChecking, insertMonitorCheck, updateMonitorStatus, getStatusPagesForMonitor, getSubscribers } from "@/lib/db/queries";
import { performCheck } from "@/lib/monitoring";
import { sendMonitorDownAlert } from "@/lib/email";

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

        // Send alert if monitor just went down
        if (monitorStatus === "down" && monitor.lastStatus !== "down") {
          const pages = await getStatusPagesForMonitor(monitor.id);
          await Promise.allSettled(
            pages.map(async (page) => {
              const subs = await getSubscribers(page.id);
              const emails = subs.map((s) => s.email);
              const pageUrl = `${process.env.NEXT_PUBLIC_APP_URL}/s/${page.slug}`;
              await sendMonitorDownAlert(emails, { name: monitor.name, url: monitor.url }, pageUrl);
            })
          );
        }

        return { monitorId: monitor.id, status: result.status };
      })
  );

  return NextResponse.json({
    checked: results.length,
    timestamp: new Date().toISOString(),
  });
}
