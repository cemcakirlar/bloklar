# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-11-11

### Added
- Pure game engine modules under `lib/game/`:
  - `pixel-matrix.ts`: Matrix mapping and text pixel layout.
  - `particles.ts`: Particle physics simulation, life cycle decay, and explosion generator.
  - `physics.ts`: Ball wall reflection, paddle tracking, collision handling, and trail color calculation.
- Comprehensive test suite under `lib/game/*.test.ts`, `components/*.test.tsx`, and `src/*.test.tsx`.
- Mock canvas 2D rendering context in `src/test/setup.ts` to support interactive canvas component tests in jsdom.

### Changed
- Refactored `prompting.tsx` to separate rendering and state from pure mathematical and physics calculations.
- Updated `vitest.config.ts` to include tests from `lib/` and `components/`.
- Raised overall test coverage to satisfy CI thresholds (`lines > 82%`, `branches > 70%`, `functions > 62%`, `statements > 79%`).

## [0.1.1] - 2026-11-11

### Initial Release
- Breakout/Arkanoid style canvas demonstration.
- Text customization and trail particle settings.
- Cloudflare Pages / Worker SPA deployment setup.
