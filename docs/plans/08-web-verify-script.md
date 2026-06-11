# 08. Web Verify Script Plan

## Goal

Add repeatable web validation scripts.

## Tasks

- Add `lint`.
- Add `typecheck`.
- Add `test`.
- Add `test:e2e`.
- Add `build`.
- Add `verify`.
- Add `verify:full`.

## Acceptance Criteria

- `npm run verify` runs lint, typecheck, unit tests, and build.
- `npm run verify:full` also runs Playwright E2E.

## Validation

```bash
cd apps/web
npm run verify
```

