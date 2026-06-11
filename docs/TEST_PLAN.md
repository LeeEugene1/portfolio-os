# Test Plan

## Test Strategy

Use a small but strict test harness before feature implementation.

## Web Unit Tests

- Cart item add/remove/update.
- Cart total calculation.
- Calculator operations.
- Window state actions.

## Web Component Tests

- Desktop icon rendering.
- Window open/close behavior.
- Portfolio window default open state.
- Store cart UI.

## Web E2E Tests

- Home page renders.
- Portfolio window opens on initial load.
- Store icon opens store window.
- Product can be added to cart.
- Cart persists after reload.
- Calculator can perform a basic operation.
- Resume entry opens the configured PDF flow.
- Contact entry opens the configured contact flow.

## Responsive Tests

Use Playwright viewport coverage:

- Desktop browser viewport.
- Mobile browser viewport.
- WebView-like mobile viewport.

## Mobile Shell Tests

- Flutter analyze passes.
- Flutter tests pass.
- APK build succeeds.
- WebView loads the configured Vercel URL.
- Android back button behavior is defined.

## Validation Commands

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

