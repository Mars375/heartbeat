import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMs(ms: number): string {
  return `${ms.toLocaleString()}ms`;
}

export function formatUptime(pct: number): string {
  return `${pct.toFixed(2)}%`;
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

type MonitorStatus = "operational" | "degraded" | "down" | "maintenance" | "unknown";

export function getStatusColor(status: MonitorStatus): string {
  const colors: Record<MonitorStatus, string> = {
    operational: "#34D399",
    degraded: "#FBBF24",
    down: "#FB7185",
    maintenance: "#38BDF8",
    unknown: "#7E7E86",
  };
  return colors[status];
}

export function getStatusLabel(status: MonitorStatus): string {
  const labels: Record<MonitorStatus, string> = {
    operational: "All Systems Operational",
    degraded: "Partial System Outage",
    down: "Major System Outage",
    maintenance: "Scheduled Maintenance",
    unknown: "Unknown",
  };
  return labels[status];
}
