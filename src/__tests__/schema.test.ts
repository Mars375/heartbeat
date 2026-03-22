import { describe, it, expect } from "vitest";
import * as schema from "@/lib/db/schema";

describe("DB Schema", () => {
  it("exports organizations table", () => {
    expect(schema.organizations).toBeDefined();
  });
  it("exports monitors table", () => {
    expect(schema.monitors).toBeDefined();
  });
  it("exports monitorChecks table", () => {
    expect(schema.monitorChecks).toBeDefined();
  });
  it("exports incidents table", () => {
    expect(schema.incidents).toBeDefined();
  });
  it("exports incidentUpdates table", () => {
    expect(schema.incidentUpdates).toBeDefined();
  });
  it("exports statusPages table", () => {
    expect(schema.statusPages).toBeDefined();
  });
  it("exports subscribers table", () => {
    expect(schema.subscribers).toBeDefined();
  });
  it("exports apiKeys table", () => {
    expect(schema.apiKeys).toBeDefined();
  });
  it("exports plan enum with free/starter/pro", () => {
    expect(schema.planEnum.enumValues).toEqual(["free", "starter", "pro"]);
  });
  it("exports monitor status enum", () => {
    expect(schema.monitorStatusEnum.enumValues).toEqual(["operational", "degraded", "down", "maintenance", "unknown"]);
  });
  it("exports incident status enum", () => {
    expect(schema.incidentStatusEnum.enumValues).toEqual(["investigating", "identified", "monitoring", "resolved"]);
  });
  it("exports severity enum", () => {
    expect(schema.severityEnum.enumValues).toEqual(["minor", "major", "critical"]);
  });
  it("exports check status enum", () => {
    expect(schema.checkStatusEnum.enumValues).toEqual(["up", "down", "degraded"]);
  });
});
