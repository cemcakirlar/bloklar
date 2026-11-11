import { describe, expect, it } from "vitest";
import {
  clamp,
  generateExplosionParticles,
  PARTICLE_QUALITY_MULTIPLIER,
  stepParticles,
  type Particle,
} from "./particles";

describe("particles", () => {
  it("clamps values within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-2, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("respects quality multipliers", () => {
    expect(PARTICLE_QUALITY_MULTIPLIER.medium).toBe(0.8);
    expect(PARTICLE_QUALITY_MULTIPLIER.high).toBe(1);
    expect(PARTICLE_QUALITY_MULTIPLIER.ultra).toBe(1.25);
  });

  it("generates spark and dust particles within particle limits", () => {
    const particles = generateExplosionParticles({
      x: 100,
      y: 100,
      size: 10,
      vx: 2,
      vy: 2,
      quality: "high",
      intensity: 1,
      maxParticles: 50,
      currentParticleCount: 0,
    });

    expect(particles.length).toBeGreaterThan(0);
    expect(particles.length).toBeLessThanOrEqual(50);

    const hasSpark = particles.some((p) => p.kind === "spark");
    const hasDust = particles.some((p) => p.kind === "dust");
    expect(hasSpark).toBe(true);
    expect(hasDust).toBe(true);
  });

  it("returns empty array if particle limit is reached", () => {
    const particles = generateExplosionParticles({
      x: 100,
      y: 100,
      size: 10,
      vx: 2,
      vy: 2,
      quality: "high",
      intensity: 1,
      maxParticles: 50,
      currentParticleCount: 50,
    });
    expect(particles).toEqual([]);
  });

  it("steps particle physics and removes dead particles", () => {
    const liveParticle: Particle = {
      kind: "spark",
      x: 0,
      y: 0,
      dx: 1,
      dy: 1,
      size: 5,
      baseSize: 5,
      life: 0.8,
      maxLife: 1,
      color: "#FFE8B6",
      drag: 0.9,
      gravity: 0.1,
      lifeDecay: 0.1,
    };

    const dyingParticle: Particle = {
      ...liveParticle,
      life: 0.05,
      lifeDecay: 0.1,
    };

    const next = stepParticles([liveParticle, dyingParticle], 100);
    expect(next).toHaveLength(1);
    expect(next[0].x).toBeGreaterThan(0);
    expect(next[0].life).toBeCloseTo(0.7, 5);
  });
});
