import { describe, expect, it } from "vitest";
import {
  calculateTextLineWidth,
  calculateWordWidth,
  layoutTextPixels,
  PIXEL_MAP,
} from "./pixel-matrix";

describe("pixel-matrix", () => {
  it("defines matrix dimensions for standard alphabet and digits", () => {
    expect(PIXEL_MAP.P).toHaveLength(5);
    expect(PIXEL_MAP.P[0]).toHaveLength(4);
    expect(PIXEL_MAP["0"]).toHaveLength(5);
  });

  it("calculates single word width correctly including letter spacing", () => {
    // P (width 4) + spacing (1) + R (width 4) -> (4*2 + 1*2) + (4*2 + 1*2) - 1*2 = 10 + 10 - 2 = 18
    const width = calculateWordWidth("PR", 2, { letter: 1, word: 3 });
    expect(width).toBe(18);
    expect(calculateWordWidth("", 2)).toBe(0);
  });

  it("calculates multi-word line width including word spacing", () => {
    const single = calculateWordWidth("P", 1);
    const line = calculateTextLineWidth("P P", 1, { letter: 1, word: 3 });
    expect(line).toBe(single * 2 + 3);
  });

  it("lays out pixels centered and marks all as unhit", () => {
    const layout = layoutTextPixels({
      canvasWidth: 800,
      canvasHeight: 600,
      scale: 1,
      firstLineText: "PROMPTING",
      secondLineText: "IS ALL YOU NEED",
    });

    expect(layout.pixels.length).toBeGreaterThan(0);
    expect(layout.adjustedLargePixelSize).toBeGreaterThan(0);
    expect(layout.adjustedSmallPixelSize).toBeGreaterThan(0);
    expect(layout.scaleFactor).toBeGreaterThan(0);

    const allUnhit = layout.pixels.every((p) => !p.hit);
    expect(allUnhit).toBe(true);

    const inBounds = layout.pixels.every(
      (p) => p.x >= 0 && p.x <= 800 && p.y >= 0 && p.y <= 600,
    );
    expect(inBounds).toBe(true);
  });
});
