# Release Checklist

## Quality Gates

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build`
- `pnpm perf:budget`

## UX and Accessibility

- Verify keyboard shortcuts and focus states.
- Verify settings dialog opens/closes and screen-reader announcements.
- Validate fallback error screen appears with actionable recovery text.

## SEO

- Confirm canonical URL and Open Graph tags in page source.
- Confirm `robots.txt` and `sitemap.xml` are served.
- Validate social preview image path is reachable.
