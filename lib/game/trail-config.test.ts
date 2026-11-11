import { describe, expect, it } from "vitest";
import {
  DEFAULT_TRAIL_CONFIG,
  MAX_FIRST_LINE_LENGTH,
  MAX_SECOND_LINE_LENGTH,
  sanitizeDisplayText,
} from "./trail-config";

describe("trail-config", () => {
  it("provides sensible defaults", () => {
    expect(DEFAULT_TRAIL_CONFIG.firstLineText).toBe("CEM");
    expect(DEFAULT_TRAIL_CONFIG.secondLineText).toBe("IS ALL YOU NEED");
    expect(DEFAULT_TRAIL_CONFIG.particleEffects).toBe(true);
    expect(DEFAULT_TRAIL_CONFIG.particleQuality).toBe("high");
  });

  it("sanitizes text, removes extra whitespace and enforces maxLength", () => {
    const sanitized = sanitizeDisplayText(
      "hello world 123",
      "FALLBACK",
      11,
    );
    expect(sanitized).toBe("HELLO WORLD");
  });

  it("returns fallback if raw input has unsupported characters or is empty", () => {
    const fallbackInvalid = sanitizeDisplayText("@@@$$$***", "DEFAULT", 10);
    expect(fallbackInvalid).toBe("DEFAULT");

    const fallbackEmpty = sanitizeDisplayText("   ", "DEFAULT", 10);
    expect(fallbackEmpty).toBe("DEFAULT");
  });

  it("handles standard line lengths", () => {
    expect(MAX_FIRST_LINE_LENGTH).toBe(20);
    expect(MAX_SECOND_LINE_LENGTH).toBe(30);
  });
});
