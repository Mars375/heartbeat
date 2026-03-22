import { redis } from "./redis";

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

export async function rateLimit(
  key: string,
  limit: number = 60,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  const now = Math.floor(Date.now() / 1000);
  const windowKey = `rl:${key}:${Math.floor(now / windowSeconds)}`;

  const count = await redis.incr(windowKey);
  if (count === 1) {
    await redis.expire(windowKey, windowSeconds);
  }

  return {
    success: count <= limit,
    remaining: Math.max(0, limit - count),
    reset: (Math.floor(now / windowSeconds) + 1) * windowSeconds,
  };
}
