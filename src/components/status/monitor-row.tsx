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
      "space-y-3 py-4 border-b border-[#353534]/40 last:border-0 transition-all duration-200",
      isOperational
        ? "border-l-0"
        : "pl-3 border-l-2 border-l-negative/40"
    )}>
      <div className="flex items-center justify-between">
        <span className="font-body text-sm font-medium text-[#ededef]">{name}</span>
        <StatusBadge status={status} />
      </div>
      <UptimeBar checks={uptimeData} />
    </div>
  );
}
