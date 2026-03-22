export const PLAN_LIMITS = {
  free: { monitors: 3, checks_interval: 300, status_pages: 1, team_members: 1 },
  starter: { monitors: 10, checks_interval: 60, status_pages: 3, team_members: 3 },
  pro: { monitors: 50, checks_interval: 30, status_pages: 10, team_members: 10 },
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;

export const CHECK_TIMEOUT_MS = 10_000;

export const INCIDENT_STATUSES = ["investigating", "identified", "monitoring", "resolved"] as const;
export type IncidentStatus = (typeof INCIDENT_STATUSES)[number];

export const SEVERITY_LEVELS = ["minor", "major", "critical"] as const;
export type SeverityLevel = (typeof SEVERITY_LEVELS)[number];

export const MONITOR_METHODS = ["GET", "HEAD", "POST"] as const;
export type MonitorMethod = (typeof MONITOR_METHODS)[number];
