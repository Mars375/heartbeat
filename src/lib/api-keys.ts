import { randomBytes, createHash } from "crypto";

export function generateApiKey(): string {
  return `hb_${randomBytes(16).toString("hex")}`;
}

export async function hashApiKey(key: string): Promise<string> {
  return createHash("sha256").update(key).digest("hex");
}

export function getKeyPrefix(key: string): string {
  return `${key.slice(0, 7)}...${key.slice(-1)}`;
}
