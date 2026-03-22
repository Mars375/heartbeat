import { describe, it, expect } from "vitest";

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hexToRgb(hex1));
  const l2 = relativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe("Design System — WCAG AA Contrast", () => {
  const BG_PRIMARY = "#0A0A0C";
  const BG_SURFACE_1 = "#111113";
  const BG_SURFACE_2 = "#1A1A1D";
  const TEXT_PRIMARY = "#EDEDEF";
  const TEXT_SECONDARY = "#7E7E86";
  const ACCENT = "#10B981";

  it("text-primary on bg-primary >= 4.5:1", () => {
    expect(contrastRatio(TEXT_PRIMARY, BG_PRIMARY)).toBeGreaterThanOrEqual(4.5);
  });

  it("text-primary on bg-surface-1 >= 4.5:1", () => {
    expect(contrastRatio(TEXT_PRIMARY, BG_SURFACE_1)).toBeGreaterThanOrEqual(4.5);
  });

  it("text-primary on bg-surface-2 >= 4.5:1", () => {
    expect(contrastRatio(TEXT_PRIMARY, BG_SURFACE_2)).toBeGreaterThanOrEqual(4.5);
  });

  it("text-secondary on bg-primary >= 4.5:1", () => {
    expect(contrastRatio(TEXT_SECONDARY, BG_PRIMARY)).toBeGreaterThanOrEqual(4.5);
  });

  it("text-secondary on bg-surface-1 >= 4.5:1", () => {
    expect(contrastRatio(TEXT_SECONDARY, BG_SURFACE_1)).toBeGreaterThanOrEqual(4.5);
  });

  it("accent on bg-primary >= 3:1 (large text)", () => {
    expect(contrastRatio(ACCENT, BG_PRIMARY)).toBeGreaterThanOrEqual(3);
  });

  it("accent on bg-surface-1 >= 3:1 (large text)", () => {
    expect(contrastRatio(ACCENT, BG_SURFACE_1)).toBeGreaterThanOrEqual(3);
  });

  // Semantic colors against dark backgrounds
  const POSITIVE = "#34D399";
  const NEGATIVE = "#FB7185";
  const WARNING = "#FBBF24";
  const INFO = "#38BDF8";

  it("positive on bg-primary >= 3:1", () => {
    expect(contrastRatio(POSITIVE, BG_PRIMARY)).toBeGreaterThanOrEqual(3);
  });

  it("negative on bg-primary >= 3:1", () => {
    expect(contrastRatio(NEGATIVE, BG_PRIMARY)).toBeGreaterThanOrEqual(3);
  });

  it("warning on bg-primary >= 3:1", () => {
    expect(contrastRatio(WARNING, BG_PRIMARY)).toBeGreaterThanOrEqual(3);
  });

  it("info on bg-primary >= 3:1", () => {
    expect(contrastRatio(INFO, BG_PRIMARY)).toBeGreaterThanOrEqual(3);
  });
});
