export type TrailMode = "rainbow" | "gradient" | "pulse";
export type ParticleQuality = "medium" | "high" | "ultra";

export interface TrailConfig {
  width: number;
  maxLength: number;
  fadeSpeed: number;
  mode: TrailMode;
  ballSize: number;
  ballSpeed: number;
  firstLineText: string;
  secondLineText: string;
  particleEffects: boolean;
  particleIntensity: number;
  particleQuality: ParticleQuality;
  maxParticles: number;
}

export const DEFAULT_TRAIL_CONFIG: TrailConfig = {
  width: 1,
  maxLength: 50,
  fadeSpeed: 0.02,
  mode: "rainbow",
  ballSize: 1,
  ballSpeed: 1,
  firstLineText: "CEM",
  secondLineText: "IS ALL YOU NEED",
  particleEffects: true,
  particleIntensity: 1.3,
  particleQuality: "high",
  maxParticles: 650,
};

export const MAX_FIRST_LINE_LENGTH = 20;
export const MAX_SECOND_LINE_LENGTH = 30;
const SUPPORTED_TEXT_CHARS = /^[A-Z0-9 ]+$/;

export function sanitizeDisplayText(raw: string, fallback: string, maxLength: number): string {
  const normalized = raw.toUpperCase().replace(/\s+/g, " ").trim();
  if (!normalized || !SUPPORTED_TEXT_CHARS.test(normalized)) {
    return fallback;
  }
  return normalized.slice(0, maxLength);
}
