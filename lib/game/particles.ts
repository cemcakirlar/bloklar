import type { ParticleQuality } from "./trail-config";

export interface Particle {
  kind: "spark" | "dust";
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  baseSize: number;
  life: number;
  maxLife: number;
  color: string;
  drag: number;
  gravity: number;
  lifeDecay: number;
}

export const PARTICLE_QUALITY_MULTIPLIER: Record<ParticleQuality, number> = {
  medium: 0.8,
  high: 1,
  ultra: 1.25,
};

export const SPARK_COLORS = ["#FFE8B6", "#FFD27A", "#FFB347", "#FF9234", "#FF6B35"];
export const DUST_COLORS = ["#E0D6C5", "#D2C2A8", "#BDAE97", "#9E907E"];

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export interface SpawnExplosionOptions {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  quality: ParticleQuality;
  intensity: number;
  maxParticles: number;
  currentParticleCount: number;
  randomFn?: () => number;
}

export function generateExplosionParticles({
  x,
  y,
  size,
  vx,
  vy,
  quality,
  intensity,
  maxParticles,
  currentParticleCount,
  randomFn = Math.random,
}: SpawnExplosionOptions): Particle[] {
  const room = Math.max(0, maxParticles - currentParticleCount);
  if (room <= 0) return [];

  const qualityMultiplier = PARTICLE_QUALITY_MULTIPLIER[quality] ?? 1;
  const speed = Math.hypot(vx, vy);
  const energy = clamp(speed / 6, 0.8, 2.2) * intensity;
  const direction = Math.atan2(vy, vx);
  const coneSpread = Math.PI * (0.5 + randomFn() * 0.2);

  const sparkCount = Math.round((9 + randomFn() * 6) * energy * qualityMultiplier);
  const dustCount = Math.round((7 + randomFn() * 5) * energy * qualityMultiplier);

  const particles: Particle[] = [];

  for (let i = 0; i < sparkCount; i++) {
    const angle = direction + (randomFn() - 0.5) * coneSpread;
    const sparkSpeed = (2.6 + randomFn() * 3.8) * energy;
    const baseSize = (size * (0.26 + randomFn() * 0.22)) / 2;
    particles.push({
      kind: "spark",
      x: x + (randomFn() - 0.5) * (size * 0.25),
      y: y + (randomFn() - 0.5) * (size * 0.25),
      dx: Math.cos(angle) * sparkSpeed,
      dy: Math.sin(angle) * sparkSpeed,
      size: baseSize,
      baseSize,
      life: 1,
      maxLife: 1,
      color: SPARK_COLORS[Math.floor(randomFn() * SPARK_COLORS.length)] || SPARK_COLORS[0],
      drag: 0.985,
      gravity: 0.05 + randomFn() * 0.03,
      lifeDecay: 0.024 + randomFn() * 0.018,
    });
  }

  for (let i = 0; i < dustCount; i++) {
    const angle = direction + (randomFn() - 0.5) * (coneSpread * 1.25);
    const dustSpeed = (0.9 + randomFn() * 1.7) * energy;
    const baseSize = (size * (0.32 + randomFn() * 0.28)) / 2;
    particles.push({
      kind: "dust",
      x: x + (randomFn() - 0.5) * (size * 0.35),
      y: y + (randomFn() - 0.5) * (size * 0.35),
      dx: Math.cos(angle) * dustSpeed * 0.85,
      dy: Math.sin(angle) * dustSpeed - (0.18 + randomFn() * 0.2),
      size: baseSize,
      baseSize,
      life: 1,
      maxLife: 1,
      color: DUST_COLORS[Math.floor(randomFn() * DUST_COLORS.length)] || DUST_COLORS[0],
      drag: 0.95,
      gravity: 0.014 + randomFn() * 0.015,
      lifeDecay: 0.011 + randomFn() * 0.007,
    });
  }

  return particles.slice(0, room);
}

export function updateParticlePhysics(particle: Particle): boolean {
  particle.dx *= particle.drag;
  particle.dy = particle.dy * particle.drag + particle.gravity;
  if (particle.kind === "dust") {
    particle.dy -= 0.01;
  }

  particle.x += particle.dx;
  particle.y += particle.dy;

  particle.life -= particle.lifeDecay;
  const lifeRatio = clamp(particle.life / particle.maxLife, 0, 1);
  if (particle.kind === "spark") {
    particle.size = particle.baseSize * (0.65 + lifeRatio * 0.75);
  } else {
    particle.size = particle.baseSize * (0.9 + (1 - lifeRatio) * 0.45);
  }

  return particle.life > 0;
}

export function stepParticles(particles: Particle[], maxParticles: number): Particle[] {
  const bounded = particles.length > maxParticles ? particles.slice(-maxParticles) : particles;
  return bounded.filter(updateParticlePhysics);
}
