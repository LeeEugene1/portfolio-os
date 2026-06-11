# 03. Architecture Plan

## Goal

Define the technical structure for the web app and Flutter WebView shell.

## Tasks

- Document monorepo structure.
- Define responsibilities for `apps/web` and `apps/mobile-shell`.
- Choose MVP data strategy.
- Define deployment flow.
- Define testing and CI responsibilities.

## Acceptance Criteria

- `docs/ARCHITECTURE.md` explains the app boundaries.
- Web owns responsive UI.
- Flutter owns WebView packaging only.
- Vercel root is documented as `apps/web`.

## Validation

```bash
cat docs/ARCHITECTURE.md
```

