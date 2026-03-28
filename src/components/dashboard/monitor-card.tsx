import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "./status-badge";
import { UptimeBar } from "./uptime-bar";
import { cn, formatMs, formatRelativeTime } from "@/lib/utils";

interface MonitorCardProps {
  monitor: {
    id: string;
    name: string;
    url: string;
    lastStatus: "operational" | "degraded" | "down" | "maintenance" | "unknown";
    lastCheckedAt: Date | null;
  };
  uptimeData: Array<{
    date: string;
    status: "up" | "down" | "degraded" | "no_data";
    avgResponseTime?: number;
  }>;
}

export function MonitorCard({ monitor, uptimeData }: MonitorCardProps) {
  const isOperational = monitor.lastStatus === "operational";
  return (
    <Link href={`/monitors/${monitor.id}`}>
      <Card className={cn(
        "border-transparent bg-bg-surface-2 transition-all duration-200 hover:bg-bg-surface-3",
        isOperational
          ? "shadow-[0_0_0_1px_rgba(233,193,118,0.15),0_0_16px_rgba(233,193,118,0.06)]"
          : "shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
      )}>
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-text-primary">{monitor.name}</h3>
              <p className="text-xs text-text-secondary font-mono">{monitor.url}</p>
            </div>
            <StatusBadge status={monitor.lastStatus} />
          </div>
          <UptimeBar checks={uptimeData} />
          {monitor.lastCheckedAt && (
            <p className="text-xs text-text-tertiary">
              Last checked {formatRelativeTime(monitor.lastCheckedAt)}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
