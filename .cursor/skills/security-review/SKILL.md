# Security Review

Use this skill for targeted application security assessments.

## Trigger

- User asks for security review, vulnerability triage, or hardening suggestions.

## Workflow

1. Enumerate trust boundaries and sensitive surfaces.
2. Inspect for high-risk classes: injection, authz/authn, secrets, data exposure.
3. Validate mitigation patterns and identify missing controls.
4. Report by severity with exploitability and fix guidance.

## Output

- Severity-sorted findings.
- Impact and attack scenario summary per finding.
- Recommended fixes with priority order.

## References

- `/.cursor/reference/security-vuln-categories.md`
- `/.cursor/reference/security-secret-patterns.md`
- `/.cursor/reference/security-vulnerable-packages.md`
- `/.cursor/reference/security-language-patterns.md`
- `/.cursor/reference/security-report-format.md`
