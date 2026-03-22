import { requireAuth } from "@/lib/auth";
import { getMonitors, getMonitorUptimeByDay } from "@/lib/db/queries";
import { Topbar } from "@/components/dashboard/topbar";
import { MonitorCard } from "@/components/dashboard/monitor-card";
import { MonitorFormWrapper } from "./monitor-form-wrapper";

export default async function MonitorsPage() {
  const { orgId, user } = await requireAuth();
  const monitorsList = await getMonitors(orgId);

  const monitorsWithUptime = await Promise.all(
    monitorsList.map(async (monitor) => {
      const uptimeRaw = await getMonitorUptimeByDay(monitor.id);
      const uptimeData = uptimeRaw.map((day) => ({
        date: day.date,
        status: (day.upChecks === day.totalChecks ? "up" : day.upChecks > 0 ? "degraded" : "down") as "up" | "down" | "degraded",
        avgResponseTime: day.avgResponseTime,
      }));
      return { monitor, uptimeData };
    })
  );

  return (
    <div>
      <Topbar title="Monitors">
        <MonitorFormWrapper orgId={orgId} plan={user.org?.plan ?? "free"} monitorCount={monitorsList.length} />
      </Topbar>
      <div className="p-6 space-y-4">
        {monitorsWithUptime.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-text-secondary text-lg">No monitors yet</p>
            <p className="text-text-tertiary text-sm mt-1">Add your first monitor to start tracking uptime</p>
          </div>
        ) : (
          monitorsWithUptime.map(({ monitor, uptimeData }) => (
            <MonitorCard key={monitor.id} monitor={monitor} uptimeData={uptimeData} />
          ))
        )}
      </div>
    </div>
  );
}
