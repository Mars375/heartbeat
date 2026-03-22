import { StatusBadge } from "@/components/dashboard/status-badge";
import { UptimeBar } from "@/components/dashboard/uptime-bar";

interface MonitorRowProps {
  name: string;
  status: "operational" | "degraded" | "down" | "maintenance" | "unknown";
  uptimeData: Array<{
    date: string;
    status: "up" | "down" | "degraded" | "no_data";
    avgResponseTime?: number;
  }>;
}

export function MonitorRow({ name, status, uptimeData }: MonitorRowProps) {
  return (
    <div className="space-y-2 rounded-lg border border-border-default bg-bg-surface-1 p-4">
      <div className="flex items-center justify-between">
        <span className="font-medium text-text-primary">{name}</span>
        <StatusBadge status={status} />
      </div>
      <UptimeBar checks={uptimeData} />
    </div>
  );
}
