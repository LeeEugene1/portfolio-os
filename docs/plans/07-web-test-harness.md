# 07. Web Test Harness Plan

## Goal

Install and configure the web test harness.

## Tasks

- Add Vitest.
- Add React Testing Library.
- Add jsdom or happy-dom.
- Add Playwright.
- Add test setup file.
- Add basic config files.

## Acceptance Criteria

- `npm run test` can execute Vitest.
- `npm run test:e2e` can execute Playwright.
- Test setup supports React component tests.

## Validation

```bash
cd apps/web
npm run test
npm run test:e2e
```

