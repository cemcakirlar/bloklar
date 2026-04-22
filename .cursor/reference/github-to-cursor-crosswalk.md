# GitHub to Cursor Crosswalk (37/37)

Canonical policy location: `.cursor/*` and root `AGENTS.md`.

Status values:

- `migrated`: active in Cursor-native structure
- `reference`: copied as supporting documentation
- `archived`: preserved but not active by default

| Source file                                                                | Target                                                                                                 | Status    |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | --------- |
| `.github/agents/accessibility.agent.md`                                    | `.cursor/agents/accessibility-auditor.agent.md`                                                        | migrated  |
| `.github/agents/accessibility-runtime-tester.agent.md`                     | `.cursor/agents/accessibility-runtime-tester.agent.md`                                                 | migrated  |
| `.github/agents/devtools-regression-investigator.agent.md`                 | `.cursor/agents/regression-investigator.agent.md`                                                      | migrated  |
| `.github/agents/expert-react-frontend-engineer.agent.md`                   | `.cursor/agents/react-frontend-engineer.agent.md`                                                      | migrated  |
| `.github/agents/frontend-performance-investigator.agent.md`                | `.cursor/agents/frontend-perf-investigator.agent.md`                                                   | migrated  |
| `.github/agents/playwright-tester.agent.md`                                | `.cursor/agents/playwright-tester.agent.md`                                                            | migrated  |
| `.github/agents/polyglot-test-fixer.agent.md`                              | `.cursor/archive-github-guidance/polyglot-test-fixer.agent.md`                                         | archived  |
| `.github/agents/polyglot-test-generator.agent.md`                          | `.cursor/archive-github-guidance/polyglot-test-generator.agent.md`                                     | archived  |
| `.github/instructions/a11y.instructions.md`                                | `.cursor/rules/accessibility-wcag22.rule.md`                                                           | migrated  |
| `.github/instructions/code-review-generic.instructions.md`                 | `.cursor/rules/review-quality.rule.md`                                                                 | migrated  |
| `.github/instructions/github-actions-ci-cd-best-practices.instructions.md` | `.cursor/reference/github-actions-ci-cd-best-practices.instructions.md`                                | reference |
| `.github/instructions/markdown-content-creation.instructions.md`           | `.cursor/archive-github-guidance/markdown-content-creation.instructions.md`                            | archived  |
| `.github/instructions/markdown-gfm.instructions.md`                        | `.cursor/rules/markdown-gfm.rule.md`                                                                   | migrated  |
| `.github/instructions/nodejs-javascript-vitest.instructions.md`            | `.cursor/rules/frontend-react19-vite-ts.rule.md` and `.cursor/rules/testing-playwright-vitest.rule.md` | migrated  |
| `.github/instructions/performance-optimization.instructions.md`            | `.cursor/rules/performance-cwv.rule.md`                                                                | migrated  |
| `.github/instructions/playwright-typescript.instructions.md`               | `.cursor/rules/testing-playwright-vitest.rule.md`                                                      | migrated  |
| `.github/instructions/security-and-owasp.instructions.md`                  | `.cursor/rules/security-owasp.rule.md`                                                                 | migrated  |
| `.github/instructions/tailwind-v4-vite.instructions.md`                    | `.cursor/archive-github-guidance/tailwind-v4-vite.instructions.md`                                     | archived  |
| `.github/skills/gh-cli/SKILL.md`                                           | `.cursor/archive-github-guidance/gh-cli.SKILL.md`                                                      | archived  |
| `.github/skills/gsap-framer-scroll-animation/SKILL.md`                     | `.cursor/skills/ui-motion-gsap-motion/SKILL.md`                                                        | migrated  |
| `.github/skills/gsap-framer-scroll-animation/references/framer.md`         | `.cursor/reference/motion-framer-reference.md`                                                         | reference |
| `.github/skills/gsap-framer-scroll-animation/references/gsap.md`           | `.cursor/reference/gsap-reference.md`                                                                  | reference |
| `.github/skills/premium-frontend-ui/SKILL.md`                              | `.cursor/skills/premium-ui-direction/SKILL.md`                                                         | migrated  |
| `.github/skills/react19-source-patterns/SKILL.md`                          | `.cursor/skills/react19-migrations/SKILL.md`                                                           | migrated  |
| `.github/skills/react19-source-patterns/references/api-migrations.md`      | `.cursor/reference/react19-api-migrations.md`                                                          | reference |
| `.github/skills/react19-test-patterns/SKILL.md`                            | `.cursor/skills/react19-migrations/SKILL.md`                                                           | migrated  |
| `.github/skills/security-review/SKILL.md`                                  | `.cursor/skills/security-review/SKILL.md`                                                              | migrated  |
| `.github/skills/security-review/references/language-patterns.md`           | `.cursor/reference/security-language-patterns.md`                                                      | reference |
| `.github/skills/security-review/references/report-format.md`               | `.cursor/reference/security-report-format.md`                                                          | reference |
| `.github/skills/security-review/references/secret-patterns.md`             | `.cursor/reference/security-secret-patterns.md`                                                        | reference |
| `.github/skills/security-review/references/vuln-categories.md`             | `.cursor/reference/security-vuln-categories.md`                                                        | reference |
| `.github/skills/security-review/references/vulnerable-packages.md`         | `.cursor/reference/security-vulnerable-packages.md`                                                    | reference |
| `.github/skills/web-design-reviewer/SKILL.md`                              | `.cursor/skills/premium-ui-direction/SKILL.md`                                                         | migrated  |
| `.github/skills/web-design-reviewer/references/framework-fixes.md`         | `.cursor/reference/web-design-framework-fixes.md`                                                      | reference |
| `.github/skills/web-design-reviewer/references/visual-checklist.md`        | `.cursor/reference/web-design-visual-checklist.md`                                                     | reference |
| `.github/skills/webapp-testing/SKILL.md`                                   | `.cursor/skills/webapp-playwright-testing/SKILL.md`                                                    | migrated  |
| `.github/skills/webapp-testing/assets/test-helper.js`                      | `.cursor/archive-github-guidance/webapp-testing-test-helper.js`                                        | archived  |

## Canonical Source Note

- Active governance now lives in `.cursor/rules`, `.cursor/skills`, `.cursor/agents`, and root `AGENTS.md`.
- `.github/*` remains as historical source input and should not be treated as the primary active policy layer.
