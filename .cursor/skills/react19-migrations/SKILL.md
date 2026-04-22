# React 19 Migrations

Use this skill when updating legacy React code to React 19 patterns.

## Trigger

- Request mentions React migration, deprecated APIs, or test breakages after React upgrade.

## Workflow

1. Identify outdated APIs/patterns in touched files.
2. Propose minimal compatible migration for the current code path.
3. Update tests impacted by React 19 behavior changes.
4. Flag risky migrations that need broader refactor scope.

## Output

- List migrated patterns.
- Call out remaining migration debt.
- Mention any test gaps caused by migration scope limits.

## References

- `/.cursor/reference/react19-api-migrations.md`
