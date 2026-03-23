import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Redis before importing rate-limit
let redisCounter = 0;
const mockIncr = vi.fn().mockImplementation(() => Promise.resolve(++redisCounter));
const mockExpire = vi.fn().mockResolvedValue(1);

vi.mock("@/lib/redis", () => ({
  redis: { incr: mockIncr, expire: mockExpire },
}));

const { rateLimit } = await import("@/lib/rate-limit");

describe("rateLimit", () => {
  beforeEach(() => {
    redisCounter = 0;
    mockIncr.mockClear();
    mockExpire.mockClear();
  });

  it("returns success=true when under limit", async () => {
    const result = await rateLimit("test-key", 10, 60);
    expect(result.success).toBe(true);
  });

  it("returns success=false when over limit", async () => {
    mockIncr.mockResolvedValueOnce(11); // over limit of 10
    const result = await rateLimit("test-key", 10, 60);
    expect(result.success).toBe(false);
  });

  it("returns correct remaining count", async () => {
    mockIncr.mockResolvedValueOnce(3);
    const result = await rateLimit("test-key", 10, 60);
    expect(result.remaining).toBe(7);
  });

  it("returns remaining=0 when at or over limit", async () => {
    mockIncr.mockResolvedValueOnce(15);
    const result = await rateLimit("test-key", 10, 60);
    expect(result.remaining).toBe(0);
  });

  it("sets expiry on first request (count === 1)", async () => {
    mockIncr.mockResolvedValueOnce(1);
    await rateLimit("new-key", 10, 60);
    expect(mockExpire).toHaveBeenCalledOnce();
    expect(mockExpire).toHaveBeenCalledWith(expect.any(String), 60);
  });

  it("does not set expiry after first request", async () => {
    mockIncr.mockResolvedValueOnce(2);
    await rateLimit("existing-key", 10, 60);
    expect(mockExpire).not.toHaveBeenCalled();
  });

  it("returns a future reset timestamp", async () => {
    const before = Math.floor(Date.now() / 1000);
    const result = await rateLimit("test-key", 10, 60);
    expect(result.reset).toBeGreaterThan(before);
  });

  it("uses the key string to construct the Redis key", async () => {
    await rateLimit("my-unique-key", 5, 30);
    const usedKey = mockIncr.mock.calls[0][0] as string;
    expect(usedKey).toContain("my-unique-key");
  });

  it("uses default limit of 60 when not specified", async () => {
    mockIncr.mockResolvedValueOnce(60);
    const result = await rateLimit("key");
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(0);
  });
});
