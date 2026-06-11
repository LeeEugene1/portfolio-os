# 10. Web CI Plan

## Goal

Add GitHub Actions for web validation.

## Tasks

- Create `.github/workflows/web-ci.yml`.
- Set working directory to `apps/web`.
- Install dependencies.
- Run `npm run verify`.
- Optionally install Playwright and run E2E.

## Acceptance Criteria

- Web CI runs on pull requests.
- Web CI runs on pushes to `main`.
- CI fails if build or tests fail.

## Validation

```bash
gh workflow list
```

