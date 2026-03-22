import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getMonitorById, getMonitorChecks, getMonitorUptimeByDay } from "@/lib/db/queries";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { UptimeBar } from "@/components/dashboard/uptime-bar";
import { ResponseTimeChart } from "@/components/dashboard/response-time-chart";
import { ChecksLog } from "@/components/dashboard/checks-log";

export default async function MonitorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { orgId } = await requireAuth();
  const monitor = await getMonitorById(id, orgId);
  if (!monitor) notFound();

  const [checks, uptimeRaw] = await Promise.all([
    getMonitorChecks(id, 50),
    getMonitorUptimeByDay(id),
  ]);

  const uptimeData = uptimeRaw.map((day) => ({
    date: day.date,
    status: (day.upChecks === day.totalChecks ? "up" : day.upChecks > 0 ? "degraded" : "down") as "up" | "down" | "degraded",
    avgResponseTime: day.avgResponseTime,
  }));

  const chartData = checks
    .slice(0, 30)
    .reverse()
    .map((c) => ({
      time: new Date(c.checkedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      responseTime: c.responseTimeMs ?? 0,
    }));

  return (
    <div>
      <Topbar title={monitor.name} />
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <StatusBadge status={monitor.lastStatus} />
          <span className="text-sm text-text-secondary font-mono">{monitor.url}</span>
        </div>

        <Card className="border-border-default bg-bg-surface-1">
          <CardHeader><CardTitle className="text-text-primary">Uptime (90 days)</CardTitle></CardHeader>
          <CardContent><UptimeBar checks={uptimeData} /></CardContent>
        </Card>

        <Card className="border-border-default bg-bg-surface-1">
          <CardHeader><CardTitle className="text-text-primary">Response Time</CardTitle></CardHeader>
          <CardContent><ResponseTimeChart data={chartData} /></CardContent>
        </Card>

        <Card className="border-border-default bg-bg-surface-1">
          <CardHeader><CardTitle className="text-text-primary">Recent Checks</CardTitle></CardHeader>
          <CardContent><ChecksLog checks={checks} /></CardContent>
        </Card>
      </div>
    </div>
  );
}
