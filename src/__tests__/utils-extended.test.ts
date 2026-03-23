import { describe, it, expect, vi, afterEach } from "vitest";
import { formatRelativeTime, getStatusLabel, getStatusColor } from "@/lib/utils";

describe("formatRelativeTime", () => {
  afterEach(() => { vi.useRealTimers(); });

  it("returns 'Just now' for less than 60 seconds ago", () => {
    const date = new Date(Date.now() - 30_000);
    expect(formatRelativeTime(date)).toBe("Just now");
  });

  it("returns '0 seconds' edge case as Just now", () => {
    const date = new Date(Date.now() - 1_000);
    expect(formatRelativeTime(date)).toBe("Just now");
  });

  it("returns minutes for 1-59 minutes ago", () => {
    const date = new Date(Date.now() - 5 * 60_000);
    expect(formatRelativeTime(date)).toBe("5m ago");
  });

  it("returns '1m ago' for exactly 60 seconds", () => {
    const date = new Date(Date.now() - 60_000);
    expect(formatRelativeTime(date)).toBe("1m ago");
  });

  it("returns '59m ago' for just under an hour", () => {
    const date = new Date(Date.now() - 59 * 60_000);
    expect(formatRelativeTime(date)).toBe("59m ago");
  });

  it("returns hours for 1-23 hours ago", () => {
    const date = new Date(Date.now() - 3 * 3600_000);
    expect(formatRelativeTime(date)).toBe("3h ago");
  });

  it("returns '1h ago' for exactly 60 minutes", () => {
    const date = new Date(Date.now() - 60 * 60_000);
    expect(formatRelativeTime(date)).toBe("1h ago");
  });

  it("returns days for 24+ hours ago", () => {
    const date = new Date(Date.now() - 2 * 86400_000);
    expect(formatRelativeTime(date)).toBe("2d ago");
  });

  it("returns '1d ago' for exactly 24 hours", () => {
    const date = new Date(Date.now() - 24 * 3600_000);
    expect(formatRelativeTime(date)).toBe("1d ago");
  });
});

describe("getStatusLabel — full coverage", () => {
  it("returns degraded label", () => {
    expect(getStatusLabel("degraded")).toBe("Degraded Performance");
  });

  it("returns down label", () => {
    expect(getStatusLabel("down")).toBe("Major Outage");
  });

  it("returns maintenance label", () => {
    expect(getStatusLabel("maintenance")).toBe("Under Maintenance");
  });

  it("returns unknown label for unknown status", () => {
    expect(getStatusLabel("unknown")).toBe("Status Unknown");
  });

  it("returns fallback for unrecognized status", () => {
    expect(getStatusLabel("totally-made-up")).toBe("Status Unknown");
  });
});

describe("getStatusColor — edge cases", () => {
  it("returns fallback color for unknown status", () => {
    expect(getStatusColor("unknown")).toBe("#7E7E86");
  });

  it("returns fallback for unrecognized status", () => {
    expect(getStatusColor("not-a-status")).toBe("#7E7E86");
  });
});
