# 22. Flutter WebView Plan

## Goal

Load the Vercel web app inside Flutter WebView.

## Tasks

- Add WebView dependency.
- Configure Android permissions.
- Load Vercel production URL.
- Handle loading state.
- Handle error state.
- Handle Android back button behavior.
- Handle external links if needed.

## Acceptance Criteria

- App opens the deployed portfolio URL.
- Back button behavior is predictable.
- Loading and error states are not blank.

## Validation

```bash
cd apps/mobile-shell
flutter analyze
flutter test
flutter build apk
```

