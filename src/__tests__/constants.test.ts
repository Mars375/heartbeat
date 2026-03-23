import { describe, it, expect } from "vitest";
import {
  PLAN_LIMITS,
  INCIDENT_STATUSES,
  SEVERITY_LEVELS,
  MONITOR_METHODS,
  CHECK_TIMEOUT_MS,
} from "@/lib/constants";

describe("PLAN_LIMITS", () => {
  it("free plan allows 3 monitors", () => {
    expect(PLAN_LIMITS.free.monitors).toBe(3);
  });

  it("starter plan allows 10 monitors", () => {
    expect(PLAN_LIMITS.starter.monitors).toBe(10);
  });

  it("pro plan allows 50 monitors", () => {
    expect(PLAN_LIMITS.pro.monitors).toBe(50);
  });

  it("free plan has 1 status page", () => {
    expect(PLAN_LIMITS.free.status_pages).toBe(1);
  });

  it("pro plan has 10 status pages", () => {
    expect(PLAN_LIMITS.pro.status_pages).toBe(10);
  });

  it("check interval decreases with higher plan (more frequent checks)", () => {
    expect(PLAN_LIMITS.pro.checks_interval).toBeLessThan(PLAN_LIMITS.starter.checks_interval);
    expect(PLAN_LIMITS.starter.checks_interval).toBeLessThan(PLAN_LIMITS.free.checks_interval);
  });

  it("team members scale with plan tier", () => {
    expect(PLAN_LIMITS.pro.team_members).toBeGreaterThan(PLAN_LIMITS.starter.team_members);
    expect(PLAN_LIMITS.starter.team_members).toBeGreaterThan(PLAN_LIMITS.free.team_members);
  });

  it("free plan has exactly 1 team member", () => {
    expect(PLAN_LIMITS.free.team_members).toBe(1);
  });
});

describe("INCIDENT_STATUSES", () => {
  it("contains investigating", () => {
    expect(INCIDENT_STATUSES).toContain("investigating");
  });

  it("contains identified", () => {
    expect(INCIDENT_STATUSES).toContain("identified");
  });

  it("contains monitoring", () => {
    expect(INCIDENT_STATUSES).toContain("monitoring");
  });

  it("contains resolved", () => {
    expect(INCIDENT_STATUSES).toContain("resolved");
  });

  it("has exactly 4 statuses", () => {
    expect(INCIDENT_STATUSES).toHaveLength(4);
  });
});

describe("SEVERITY_LEVELS", () => {
  it("contains minor", () => {
    expect(SEVERITY_LEVELS).toContain("minor");
  });

  it("contains major", () => {
    expect(SEVERITY_LEVELS).toContain("major");
  });

  it("contains critical", () => {
    expect(SEVERITY_LEVELS).toContain("critical");
  });

  it("has exactly 3 levels", () => {
    expect(SEVERITY_LEVELS).toHaveLength(3);
  });
});

describe("MONITOR_METHODS", () => {
  it("contains GET", () => {
    expect(MONITOR_METHODS).toContain("GET");
  });

  it("contains HEAD", () => {
    expect(MONITOR_METHODS).toContain("HEAD");
  });

  it("contains POST", () => {
    expect(MONITOR_METHODS).toContain("POST");
  });
});

describe("CHECK_TIMEOUT_MS", () => {
  it("is a positive number", () => {
    expect(CHECK_TIMEOUT_MS).toBeGreaterThan(0);
  });

  it("is 10 seconds", () => {
    expect(CHECK_TIMEOUT_MS).toBe(10_000);
  });
});
