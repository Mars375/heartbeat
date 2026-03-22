import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function formatMs(ms: number): string {
  return `${ms.toLocaleString("en-US")}ms`;
}

export function formatUptime(pct: number): string {
  return `${pct.toFixed(2)}%`;
}

const statusColors: Record<string, string> = {
  operational: "#34D399",
  degraded: "#FBBF24",
  down: "#FB7185",
  maintenance: "#38BDF8",
  unknown: "#7E7E86",
};

export function getStatusColor(status: string): string {
  return statusColors[status] ?? "#7E7E86";
}

const statusLabels: Record<string, string> = {
  operational: "All Systems Operational",
  degraded: "Degraded Performance",
  down: "Major Outage",
  maintenance: "Under Maintenance",
  unknown: "Status Unknown",
};

export function getStatusLabel(status: string): string {
  return statusLabels[status] ?? "Status Unknown";
}
