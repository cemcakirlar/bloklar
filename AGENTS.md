# Agent Contract

This repository uses Cursor-native guidance under `.cursor/`.

## Canonical Sources

- Active behavior sources:
  - `.cursor/rules/*`
  - `.cursor/skills/*`
  - `.cursor/agents/*`
- Deep references:
  - `.cursor/reference/*`
- Archived/non-default guidance:
  - `.cursor/archive-github-guidance/*`

## Rule Precedence

Apply rules in this order when multiple rules are relevant:

1. `security-owasp.rule.mdc`
2. `testing-playwright-vitest.rule.mdc`
3. `review-quality.rule.mdc`
4. `performance-cwv.rule.mdc`
5. `accessibility-wcag22.rule.mdc`
6. `frontend-react19-vite-ts.rule.mdc`
7. `markdown-gfm.rule.mdc`

## Stack Constraints

- Primary stack: React 19 + Vite + TypeScript + Tailwind v3.
- Do not apply Next.js-only guidance unless explicitly requested.
- Do not apply Tailwind v4 migration guidance unless explicitly requested.

## Agent Routing

Use `.cursor/agents/*` specialists for focused work:

- Accessibility audit: `accessibility-auditor.agent.md`
- Runtime accessibility testing: `accessibility-runtime-tester.agent.md`
- Frontend performance diagnosis: `frontend-perf-investigator.agent.md`
- Playwright E2E design/debugging: `playwright-tester.agent.md`
- React implementation/refactor: `react-frontend-engineer.agent.md`
- Regression triage: `regression-investigator.agent.md`

## Skill Routing

Use `.cursor/skills/*` for repeatable method packs:

- Security audit flow: `security-review/SKILL.md`
- React migration flow: `react19-migrations/SKILL.md`
- Playwright test flow: `webapp-playwright-testing/SKILL.md`
- Motion design: `ui-motion-gsap-motion/SKILL.md`
- UI polish: `premium-ui-direction/SKILL.md`

## Output Quality Gates

- Never commit hardcoded secrets or credentials.
- Security/correctness findings are reported before style suggestions.
- New behavior should include tests or an explicit test-gap note.
- UI-impacting changes should consider accessibility and performance.

## Archive Handling

Guidance in `.cursor/archive-github-guidance/` is opt-in only and not part of default behavior.
