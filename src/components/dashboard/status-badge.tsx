import { cn } from "@/lib/utils";

const statusConfig = {
  operational: { label: "Operational", className: "bg-positive/15 text-positive border-positive/30" },
  degraded: { label: "Degraded", className: "bg-warning/15 text-warning border-warning/30" },
  down: { label: "Down", className: "bg-negative/15 text-negative border-negative/30" },
  maintenance: { label: "Maintenance", className: "bg-info/15 text-info border-info/30" },
  unknown: { label: "Unknown", className: "bg-text-secondary/15 text-text-secondary border-text-secondary/30" },
} as const;

interface StatusBadgeProps {
  status: keyof typeof statusConfig;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", config.className, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", {
        "bg-positive": status === "operational",
        "bg-warning": status === "degraded",
        "bg-negative": status === "down",
        "bg-info": status === "maintenance",
        "bg-text-secondary": status === "unknown",
      })} />
      {config.label}
    </span>
  );
}
