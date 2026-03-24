import { cn } from "@/lib/utils";
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
  const isOperational = status === "operational";
  return (
    <div className={cn(
      "space-y-2 rounded-lg bg-bg-surface-2 p-4 transition-all duration-200",
      isOperational
        ? "shadow-[0_0_0_1px_rgba(16,185,129,0.15),0_0_16px_rgba(16,185,129,0.06)]"
        : "shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
    )}>
      <div className="flex items-center justify-between">
        <span className="font-medium text-text-primary">{name}</span>
        <StatusBadge status={status} />
      </div>
      <UptimeBar checks={uptimeData} />
    </div>
  );
}
