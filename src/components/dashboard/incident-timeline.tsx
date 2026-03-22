import { cn } from "@/lib/utils";

interface TimelineItem {
  id: string;
  status: string;
  message: string;
  createdAt: Date;
}

interface IncidentTimelineProps {
  updates: TimelineItem[];
}

const statusColors: Record<string, string> = {
  investigating: "bg-warning",
  identified: "bg-orange-400",
  monitoring: "bg-info",
  resolved: "bg-positive",
};

export function IncidentTimeline({ updates }: IncidentTimelineProps) {
  return (
    <div className="space-y-0">
      {updates.map((update, i) => (
        <div key={update.id} className="relative flex gap-4 pb-6">
          {i < updates.length - 1 && (
            <div className="absolute left-[7px] top-4 h-full w-px bg-border-default" />
          )}
          <div className={cn("mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-bg-primary", statusColors[update.status] ?? "bg-text-secondary")} />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-text-primary capitalize">{update.status}</span>
              <span className="text-xs text-text-tertiary">
                {new Date(update.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-text-secondary">{update.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
