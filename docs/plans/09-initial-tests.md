# 09. Initial Tests Plan

## Goal

Add smoke tests so the harness is proven before feature work.

## Tasks

- Add one Vitest smoke test.
- Add one Playwright home render test.
- Ensure tests are deterministic.

## Acceptance Criteria

- Unit test passes.
- E2E smoke test passes.
- CI can run the same commands.

## Validation

```bash
cd apps/web
npm run test
npm run test:e2e
```

