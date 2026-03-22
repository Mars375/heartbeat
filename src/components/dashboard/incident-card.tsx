import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface IncidentCardProps {
  incident: {
    id: string;
    title: string;
    status: string;
    severity: string;
    startedAt: Date;
    resolvedAt: Date | null;
  };
}

const severityColors = {
  minor: "bg-warning/15 text-warning border-warning/30",
  major: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  critical: "bg-negative/15 text-negative border-negative/30",
};

const statusLabels: Record<string, string> = {
  investigating: "Investigating",
  identified: "Identified",
  monitoring: "Monitoring",
  resolved: "Resolved",
};

export function IncidentCard({ incident }: IncidentCardProps) {
  return (
    <Link href={`/incidents/${incident.id}`}>
      <Card className="border-border-default bg-bg-surface-1 transition-colors hover:border-border-strong">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-medium text-text-primary">{incident.title}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={cn("text-xs", severityColors[incident.severity as keyof typeof severityColors])}>
                {incident.severity}
              </Badge>
              <span className="text-xs text-text-secondary">{statusLabels[incident.status]}</span>
              <span className="text-xs text-text-tertiary">{formatRelativeTime(incident.startedAt)}</span>
            </div>
          </div>
          {incident.resolvedAt && (
            <Badge variant="outline" className="bg-positive/15 text-positive border-positive/30 text-xs">
              Resolved
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
