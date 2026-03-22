import { describe, it, expect, vi, beforeEach } from "vitest";
import { performCheck } from "@/lib/monitoring";

describe("Monitoring Engine", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns up for successful response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
    });

    const result = await performCheck({
      url: "https://example.com",
      method: "GET",
      expectedStatus: 200,
      timeoutMs: 5000,
    });

    expect(result.status).toBe("up");
    expect(result.statusCode).toBe(200);
    expect(result.responseTimeMs).toBeGreaterThanOrEqual(0);
  });

  it("returns down for wrong status code", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 500,
      ok: false,
    });

    const result = await performCheck({
      url: "https://example.com",
      method: "GET",
      expectedStatus: 200,
      timeoutMs: 5000,
    });

    expect(result.status).toBe("down");
    expect(result.statusCode).toBe(500);
  });

  it("returns down for network error", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("ECONNREFUSED"));

    const result = await performCheck({
      url: "https://example.com",
      method: "GET",
      expectedStatus: 200,
      timeoutMs: 5000,
    });

    expect(result.status).toBe("down");
    expect(result.errorMessage).toBe("ECONNREFUSED");
    expect(result.statusCode).toBeNull();
  });

  it("returns degraded for slow response", async () => {
    global.fetch = vi.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ status: 200, ok: true }), 50);
      });
    });

    const result = await performCheck({
      url: "https://example.com",
      method: "GET",
      expectedStatus: 200,
      timeoutMs: 5000,
      degradedThresholdMs: 10,
    });

    expect(result.status).toBe("degraded");
  });

  it("uses the specified HTTP method", async () => {
    global.fetch = vi.fn().mockResolvedValue({ status: 200, ok: true });

    await performCheck({
      url: "https://example.com",
      method: "HEAD",
      expectedStatus: 200,
      timeoutMs: 5000,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://example.com",
      expect.objectContaining({ method: "HEAD" })
    );
  });
});
