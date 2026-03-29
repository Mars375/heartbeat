import { notFound } from "next/navigation";
import { getStatusPageBySlug, getMonitorUptimeByDay } from "@/lib/db/queries";
import { StatusHeader } from "@/components/status/status-header";
import { MonitorRow } from "@/components/status/monitor-row";
import { SubscribeForm } from "@/components/status/subscribe-form";

export const revalidate = 60; // ISR: refresh every 60s

export default async function PublicStatusPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getStatusPageBySlug(slug);
  if (!data) notFound();

  const { page, monitors: pageMonitors, activeIncidents } = data;

  const overallStatus = pageMonitors.some((m) => m.lastStatus === "down")
    ? "down"
    : pageMonitors.some((m) => m.lastStatus === "degraded")
      ? "degraded"
      : "operational";

  const monitorsWithUptime = await Promise.all(
    pageMonitors.map(async (monitor) => {
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
    <div className="min-h-screen bg-[#131313]">
      <div className="mx-auto max-w-3xl px-4 py-16 space-y-10">
        <StatusHeader
          name={page.name}
          logoUrl={page.logoUrl}
          brandingColor={page.brandingColor}
          overallStatus={overallStatus}
        />

        <div className="rounded-sm border border-[#353534]/40 bg-[#201f1f] p-6">
          {monitorsWithUptime.map(({ monitor, uptimeData }) => (
            <MonitorRow
              key={monitor.id}
              name={monitor.name}
              status={monitor.lastStatus}
              uptimeData={uptimeData}
            />
          ))}
        </div>

        {activeIncidents.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-headline text-lg text-[#ededef]">Active Incidents</h2>
            {activeIncidents.map((incident) => (
              <div key={incident.id} className="rounded-sm border border-negative/30 bg-negative/5 p-4">
                <h3 className="font-body font-medium text-[#ededef]">{incident.title}</h3>
                <p className="text-sm text-[#9a9895] font-body capitalize">{incident.severity} — {incident.status}</p>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-sm border border-[#353534]/40 bg-[#201f1f] p-6 space-y-3">
          <h2 className="font-headline text-base text-[#ededef] text-center">Subscribe to Updates</h2>
          <p className="text-sm text-[#9a9895] font-body text-center">Get notified when something goes wrong.</p>
          <SubscribeForm slug={slug} />
        </div>

        <footer className="text-center text-xs text-[#6b6967] font-body tracking-widest uppercase">
          Powered by <span className="text-[#e9c176]">Heartbeat</span>
        </footer>
      </div>
    </div>
  );
}
