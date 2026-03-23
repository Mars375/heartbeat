import { describe, it, expect, vi, beforeEach } from "vitest";
import { performCheck } from "@/lib/monitoring";

// This file tests the cron monitoring logic in isolation:
// status transition detection, alert triggering conditions, and check aggregation.

describe("Cron monitor — status transition logic", () => {
  // Mirrors the status mapping in the cron route
  function mapCheckStatus(checkStatus: "up" | "down" | "degraded"): "operational" | "degraded" | "down" {
    if (checkStatus === "up") return "operational";
    if (checkStatus === "degraded") return "degraded";
    return "down";
  }

  it("maps 'up' check result to 'operational' monitor status", () => {
    expect(mapCheckStatus("up")).toBe("operational");
  });

  it("maps 'degraded' check result to 'degraded' monitor status", () => {
    expect(mapCheckStatus("degraded")).toBe("degraded");
  });

  it("maps 'down' check result to 'down' monitor status", () => {
    expect(mapCheckStatus("down")).toBe("down");
  });

  // Mirrors the alert trigger condition: only fire if JUST went down
  function shouldSendAlert(newStatus: string, previousStatus: string | null): boolean {
    return newStatus === "down" && previousStatus !== "down";
  }

  it("sends alert when transitioning to down from operational", () => {
    expect(shouldSendAlert("down", "operational")).toBe(true);
  });

  it("sends alert when transitioning to down from degraded", () => {
    expect(shouldSendAlert("down", "degraded")).toBe(true);
  });

  it("sends alert when monitor was never checked (null previous status)", () => {
    expect(shouldSendAlert("down", null)).toBe(true);
  });

  it("does NOT send alert when already down (prevents repeat alerts)", () => {
    expect(shouldSendAlert("down", "down")).toBe(false);
  });

  it("does NOT send alert when transitioning to operational", () => {
    expect(shouldSendAlert("operational", "down")).toBe(false);
  });

  it("does NOT send alert when transitioning to degraded", () => {
    expect(shouldSendAlert("degraded", "operational")).toBe(false);
  });
});

describe("Cron monitor — interval filter logic", () => {
  // Mirrors the interval check in the cron route
  function shouldCheck(lastCheckedAt: Date | null, intervalSeconds: number, now: number): boolean {
    if (!lastCheckedAt) return true;
    const elapsed = now - lastCheckedAt.getTime();
    return elapsed >= intervalSeconds * 1000;
  }

  it("checks monitor that has never been checked", () => {
    expect(shouldCheck(null, 300, Date.now())).toBe(true);
  });

  it("checks monitor whose interval has elapsed", () => {
    const lastChecked = new Date(Date.now() - 400_000); // 400s ago
    expect(shouldCheck(lastChecked, 300, Date.now())).toBe(true);
  });

  it("skips monitor whose interval has not elapsed", () => {
    const lastChecked = new Date(Date.now() - 100_000); // 100s ago, interval is 300s
    expect(shouldCheck(lastChecked, 300, Date.now())).toBe(false);
  });

  it("checks monitor exactly at interval boundary", () => {
    const lastChecked = new Date(Date.now() - 300_000); // exactly 300s ago
    expect(shouldCheck(lastChecked, 300, Date.now())).toBe(true);
  });

  it("respects per-monitor interval (60s vs 300s)", () => {
    const lastChecked = new Date(Date.now() - 120_000); // 120s ago
    expect(shouldCheck(lastChecked, 60, Date.now())).toBe(true);   // 60s interval → check
    expect(shouldCheck(lastChecked, 300, Date.now())).toBe(false);  // 300s interval → skip
  });
});

describe("Cron monitor — performCheck integration", () => {
  beforeEach(() => { vi.restoreAllMocks(); });

  it("returns down with a responseTimeMs on network error (timing is always recorded)", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("connect ECONNREFUSED"));
    const result = await performCheck({ url: "https://unreachable.example.com", method: "GET", expectedStatus: 200, timeoutMs: 5000 });
    expect(result.status).toBe("down");
    expect(result.responseTimeMs).toBeGreaterThanOrEqual(0);
  });

  it("returns up with a responseTimeMs on success", async () => {
    global.fetch = vi.fn().mockResolvedValue({ status: 200, ok: true });
    const result = await performCheck({ url: "https://example.com/health", method: "GET", expectedStatus: 200, timeoutMs: 5000 });
    expect(result.status).toBe("up");
    expect(result.responseTimeMs).toBeGreaterThanOrEqual(0);
  });

  it("records the actual HTTP status code", async () => {
    global.fetch = vi.fn().mockResolvedValue({ status: 503, ok: false });
    const result = await performCheck({ url: "https://example.com", method: "GET", expectedStatus: 200, timeoutMs: 5000 });
    expect(result.statusCode).toBe(503);
  });

  it("records null statusCode on network error", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Timeout"));
    const result = await performCheck({ url: "https://example.com", method: "GET", expectedStatus: 200, timeoutMs: 5000 });
    expect(result.statusCode).toBeNull();
  });

  it("returns up when actual status matches expected non-200", async () => {
    global.fetch = vi.fn().mockResolvedValue({ status: 201, ok: true });
    const result = await performCheck({ url: "https://example.com", method: "POST", expectedStatus: 201, timeoutMs: 5000 });
    expect(result.status).toBe("up");
  });
});
