# Orchestration

## Goal

Build an OS-inspired responsive portfolio web app and package it as a Flutter WebView APK.

## Principles

- Web is the source of truth.
- Flutter is a WebView shell.
- Tests and CI are added before feature implementation.
- Each feature should have a plan, implementation, and validation.
- MVP uses static product data and localStorage cart.
- Backend/API work is deferred until explicitly approved.

## Repository Structure

```txt
apps/
  web/
  mobile-shell/

docs/
  PRD.md
  ARCHITECTURE.md
  TEST_PLAN.md
  ORCHESTRATION.md
  plans/
```

## Work Phases

### Phase 0. Repository and Documentation

Plans:

- `docs/plans/01-monorepo-setup.md`
- `docs/plans/02-prd.md`
- `docs/plans/03-architecture.md`
- `docs/plans/04-test-plan.md`
- `docs/plans/05-orchestration.md`

Outputs:

- Monorepo structure
- PRD
- Architecture document
- Test plan
- Orchestration document

Validation:

```bash
tree -L 3
git status
```

### Phase 1. Web Scaffold and Harness

Plans:

- `docs/plans/06-web-scaffold.md`
- `docs/plans/07-web-test-harness.md`
- `docs/plans/08-web-verify-script.md`
- `docs/plans/09-initial-tests.md`
- `docs/plans/10-web-ci.md`

Outputs:

- Next.js app
- TypeScript setup
- Vitest setup
- React Testing Library setup
- Playwright setup
- GitHub Actions Web CI

Validation:

```bash
cd apps/web
npm run verify
npm run test:e2e
```

### Phase 2. Core OS UI

Plans:

- `docs/plans/11-os-ui.md`
- `docs/plans/12-os-ui-tests.md`

Outputs:

- OS desktop shell
- App icons
- Window system
- Portfolio window opens by default

Validation:

```bash
cd apps/web
npm run verify
npm run test:e2e
```

### Phase 3. Feature Apps

Plans:

- `docs/plans/13-store-cart.md`
- `docs/plans/14-store-cart-tests.md`
- `docs/plans/15-calculator.md`
- `docs/plans/16-resume.md`
- `docs/plans/17-contact.md`

Outputs:

- Store app
- Guest cart
- Calculator app
- Resume app
- Contact app

Validation:

```bash
cd apps/web
npm run verify
npm run test:e2e
```

### Phase 4. Responsive and E2E

Plans:

- `docs/plans/18-responsive-ui.md`
- `docs/plans/19-playwright-e2e.md`

Outputs:

- Desktop responsive layout
- Mobile responsive layout
- WebView-friendly layout
- E2E scenarios

Validation:

```bash
cd apps/web
npm run verify:full
```

### Phase 5. Deployment

Plans:

- `docs/plans/20-vercel.md`

Outputs:

- Vercel preview deployment
- Vercel production deployment

Validation:

- Open deployed URL on desktop browser.
- Open deployed URL on mobile browser.

### Phase 6. Flutter WebView Shell

Plans:

- `docs/plans/21-flutter-scaffold.md`
- `docs/plans/22-flutter-webview.md`
- `docs/plans/23-flutter-harness.md`
- `docs/plans/24-mobile-ci.md`

Outputs:

- Flutter app
- WebView loading Vercel URL
- Android APK build
- Mobile CI

Validation:

```bash
cd apps/mobile-shell
flutter analyze
flutter test
flutter build apk
```

### Phase 7. Final Review and Release

Plans:

- `docs/plans/25-final-verification.md`
- `docs/plans/26-pr-review.md`
- `docs/plans/27-release.md`

Outputs:

- Final PR
- Passing CI
- Production web deployment
- APK artifact
- README update

Validation:

```bash
cd apps/web
npm run verify:full

cd ../mobile-shell
flutter analyze
flutter test
flutter build apk
```

## Workflow Rules

- Do not implement a feature without a matching plan document.
- Do not merge if `npm run verify` fails.
- Do not add backend work in MVP unless explicitly approved.
- Keep cart as guest/localStorage in MVP.
- Keep Flutter as a WebView shell.
- Keep responsive behavior inside the Next.js app.
- Add or update tests when feature behavior changes.
- Update docs when architecture or workflow changes.

## PR Strategy

1. Repository and docs
2. Web scaffold and test harness
3. OS UI
4. Store/cart
5. Calculator, Resume, Contact
6. Responsive and E2E
7. Vercel deployment
8. Flutter WebView shell
9. Mobile CI and APK release

## Command Checklist

Web:

```bash
cd apps/web
npm run verify
npm run verify:full
```

Mobile:

```bash
cd apps/mobile-shell
flutter analyze
flutter test
flutter build apk
```

