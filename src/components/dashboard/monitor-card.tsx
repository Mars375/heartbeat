import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "./status-badge";
import { UptimeBar } from "./uptime-bar";
import { formatMs, formatRelativeTime } from "@/lib/utils";

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
  return (
    <Link href={`/monitors/${monitor.id}`}>
      <Card className="border-border-default bg-bg-surface-1 transition-colors hover:border-border-strong">
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
