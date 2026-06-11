# 18. Responsive UI Plan

## Goal

Polish responsive behavior for desktop, mobile browser, and Flutter WebView.

## Tasks

- Define desktop layout.
- Define mobile layout.
- Ensure windows fit mobile viewport.
- Ensure touch targets are usable.
- Remove horizontal overflow.

## Acceptance Criteria

- Desktop layout keeps OS desktop feeling.
- Mobile layout is usable inside WebView.
- No incoherent overlap on key viewports.

## Validation

```bash
cd apps/web
npm run verify:full
```

