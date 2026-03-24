"use client";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DayCheck {
  date: string;
  status: "up" | "down" | "degraded" | "no_data";
  avgResponseTime?: number;
}

interface UptimeBarProps {
  checks: DayCheck[];
  className?: string;
}

export function UptimeBar({ checks, className }: UptimeBarProps) {
  const upDays = checks.filter((c) => c.status === "up").length;
  const uptime = checks.length > 0 ? (upDays / checks.length) * 100 : 0;

  return (
    <div className={cn("space-y-1.5", className)}>
      <TooltipProvider delay={0}>
        <div className="flex gap-[2px]">
          {checks.map((check, i) => (
            <Tooltip key={i}>
              <TooltipTrigger
                className={cn("h-6 flex-1 rounded-[3px] transition-all hover:opacity-90 hover:scale-y-110 origin-bottom", {
                  "bg-positive shadow-[0_0_4px_rgba(52,211,153,0.3)]": check.status === "up",
                  "bg-negative": check.status === "down",
                  "bg-warning": check.status === "degraded",
                  "bg-bg-surface-3": check.status === "no_data",
                })}
                data-segment
              />
              <TooltipContent className="bg-bg-surface-2 border-border-default text-text-primary">
                <p className="text-xs font-medium">{check.date}</p>
                <p className="text-xs text-text-secondary capitalize">{check.status.replace("_", " ")}</p>
                {check.avgResponseTime && (
                  <p className="text-xs text-text-secondary">{Math.round(check.avgResponseTime)}ms avg</p>
                )}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
      <div className="flex justify-between text-xs text-text-secondary">
        <span>90 days ago</span>
        <span>{uptime.toFixed(2)}% uptime</span>
        <span>Today</span>
      </div>
    </div>
  );
}
