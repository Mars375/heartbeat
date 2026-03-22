import { describe, it, expect } from "vitest";
import { cn, formatMs, formatUptime, getStatusColor, getStatusLabel } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });
  it("resolves Tailwind conflicts", () => {
    expect(cn("px-4", "px-2")).toBe("px-2");
  });
});

describe("formatMs", () => {
  it("formats milliseconds", () => {
    expect(formatMs(1234)).toBe("1,234ms");
  });
  it("formats sub-second", () => {
    expect(formatMs(42)).toBe("42ms");
  });
});

describe("formatUptime", () => {
  it("formats 100%", () => {
    expect(formatUptime(100)).toBe("100.00%");
  });
  it("formats 99.95%", () => {
    expect(formatUptime(99.95)).toBe("99.95%");
  });
});

describe("getStatusColor", () => {
  it("returns green for operational", () => {
    expect(getStatusColor("operational")).toBe("#34D399");
  });
  it("returns yellow for degraded", () => {
    expect(getStatusColor("degraded")).toBe("#FBBF24");
  });
  it("returns red for down", () => {
    expect(getStatusColor("down")).toBe("#FB7185");
  });
  it("returns blue for maintenance", () => {
    expect(getStatusColor("maintenance")).toBe("#38BDF8");
  });
});

describe("getStatusLabel", () => {
  it("returns 'All Systems Operational' when all up", () => {
    expect(getStatusLabel("operational")).toBe("All Systems Operational");
  });
});
