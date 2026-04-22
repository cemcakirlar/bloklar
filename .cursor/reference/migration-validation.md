# Migration Validation

This file tracks the plan-required validation scenarios after `.github` to `.cursor` migration.

## Structural Validation

- `.cursor/rules` exists with 7 active rule files.
- `.cursor/skills` exists with 8 migrated skill files.
- `.cursor/agents` exists with active specialist agent files plus existing `noop.md`.
- `.cursor/reference` exists with migrated deep references.
- `.cursor/archive-github-guidance` exists with archived/conflicting source docs.
- `AGENTS.md` exists at repository root and defines precedence/routing.

## Prompt-Behavior Validation Matrix

These checks validate that the required policy artifacts are present and route correctly.

1. Review request
   - Expected: severity-first format.
   - Source: `review-quality.rule.md`.
   - Status: configured.

2. Security audit request
   - Expected: OWASP-oriented findings and mitigation direction.
   - Source: `security-owasp.rule.md` + `security-review/SKILL.md`.
   - Status: configured.

3. Playwright testing request
   - Expected: resilient locators + web-first assertions.
   - Source: `testing-playwright-vitest.rule.md` + `playwright-tester.agent.md`.
   - Status: configured.

4. Accessibility request
   - Expected: WCAG-oriented checks and keyboard/focus validation.
   - Source: `accessibility-wcag22.rule.md` + accessibility agents/skill.
   - Status: configured.

5. Performance diagnosis request
   - Expected: bottleneck + prioritized fix list.
   - Source: `performance-cwv.rule.md` + `frontend-perf-investigator.agent.md`.
   - Status: configured.

6. React 19 migration request
   - Expected: Vite-compatible migration guidance without Next-only assumptions.
   - Source: `frontend-react19-vite-ts.rule.md` + `react19-migrations/SKILL.md`.
   - Status: configured.

## Notes

- Validation here is configuration-level verification of routing and policy availability.
- Runtime behavior can be additionally smoke-tested by issuing one prompt per scenario.
