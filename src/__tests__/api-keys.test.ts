import { describe, it, expect } from "vitest";
import { generateApiKey, hashApiKey, getKeyPrefix } from "@/lib/api-keys";

describe("API Key System", () => {
  it("generates a key starting with hb_", () => {
    const key = generateApiKey();
    expect(key.startsWith("hb_")).toBe(true);
  });

  it("generates keys of consistent length", () => {
    const key = generateApiKey();
    expect(key.length).toBe(35); // "hb_" + 32 hex chars
  });

  it("generates unique keys", () => {
    const keys = new Set(Array.from({ length: 100 }, () => generateApiKey()));
    expect(keys.size).toBe(100);
  });

  it("hashes a key to hex string", async () => {
    const hash = await hashApiKey("hb_test123");
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("hashing is deterministic", async () => {
    const a = await hashApiKey("hb_test123");
    const b = await hashApiKey("hb_test123");
    expect(a).toBe(b);
  });

  it("different keys produce different hashes", async () => {
    const a = await hashApiKey("hb_aaa");
    const b = await hashApiKey("hb_bbb");
    expect(a).not.toBe(b);
  });

  it("extracts key prefix", () => {
    expect(getKeyPrefix("hb_abc123def456")).toBe("hb_abc1...6");
  });
});
