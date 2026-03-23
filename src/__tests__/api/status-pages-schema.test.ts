import { describe, it, expect } from "vitest";
import { z } from "zod";

// Replicate the schema from the route handler to test it in isolation
const createSchema = z.object({
  orgId: z.string().uuid(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(60).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  brandingColor: z.string().optional(),
  monitorIds: z.array(z.string().uuid()).optional(),
});

const patchSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("add"), monitorId: z.string().uuid() }),
  z.object({ action: z.literal("remove"), monitorId: z.string().uuid() }),
]);

describe("POST /api/status-pages — schema validation", () => {
  // Use proper RFC 4122 v4 UUIDs (Zod v4 enforces strict format)
  const validBody = {
    orgId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    name: "My Status Page",
    slug: "my-status-page",
  };

  it("accepts a valid body", () => {
    expect(createSchema.safeParse(validBody).success).toBe(true);
  });

  it("accepts an optional brandingColor", () => {
    const result = createSchema.safeParse({ ...validBody, brandingColor: "#FF0000" });
    expect(result.success).toBe(true);
  });

  it("accepts an optional monitorIds array", () => {
    const result = createSchema.safeParse({
      ...validBody,
      monitorIds: ["b3db3f7e-8f9a-4b3e-a5d5-1234567890ab"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-UUID orgId", () => {
    const result = createSchema.safeParse({ ...validBody, orgId: "not-a-uuid" });
    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const result = createSchema.safeParse({ ...validBody, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects name longer than 100 chars", () => {
    const result = createSchema.safeParse({ ...validBody, name: "a".repeat(101) });
    expect(result.success).toBe(false);
  });

  it("rejects slug with uppercase letters", () => {
    const result = createSchema.safeParse({ ...validBody, slug: "My-Page" });
    expect(result.success).toBe(false);
  });

  it("rejects slug with spaces", () => {
    const result = createSchema.safeParse({ ...validBody, slug: "my page" });
    expect(result.success).toBe(false);
  });

  it("rejects slug with special characters", () => {
    const result = createSchema.safeParse({ ...validBody, slug: "my_page!" });
    expect(result.success).toBe(false);
  });

  it("accepts slug with hyphens and numbers", () => {
    const result = createSchema.safeParse({ ...validBody, slug: "my-page-123" });
    expect(result.success).toBe(true);
  });

  it("rejects slug longer than 60 chars", () => {
    const result = createSchema.safeParse({ ...validBody, slug: "a".repeat(61) });
    expect(result.success).toBe(false);
  });

  it("rejects monitorIds containing non-UUIDs", () => {
    const result = createSchema.safeParse({ ...validBody, monitorIds: ["not-a-uuid-at-all"] });
    expect(result.success).toBe(false);
  });

  it("accepts empty monitorIds array", () => {
    const result = createSchema.safeParse({ ...validBody, monitorIds: [] });
    expect(result.success).toBe(true);
  });
});

describe("PATCH /api/status-pages/[id] — schema validation", () => {
  const validMonitorId = "b3db3f7e-8f9a-4b3e-a5d5-1234567890ab";

  it("accepts add action", () => {
    const result = patchSchema.safeParse({ action: "add", monitorId: validMonitorId });
    expect(result.success).toBe(true);
  });

  it("accepts remove action", () => {
    const result = patchSchema.safeParse({ action: "remove", monitorId: validMonitorId });
    expect(result.success).toBe(true);
  });

  it("rejects unknown action", () => {
    const result = patchSchema.safeParse({ action: "delete", monitorId: validMonitorId });
    expect(result.success).toBe(false);
  });

  it("rejects non-UUID monitorId", () => {
    const result = patchSchema.safeParse({ action: "add", monitorId: "not-a-uuid" });
    expect(result.success).toBe(false);
  });

  it("rejects missing action", () => {
    const result = patchSchema.safeParse({ monitorId: validMonitorId });
    expect(result.success).toBe(false);
  });

  it("rejects missing monitorId", () => {
    const result = patchSchema.safeParse({ action: "add" });
    expect(result.success).toBe(false);
  });
});
