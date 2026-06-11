# 21. Flutter Scaffold Plan

## Goal

Create the Flutter app shell in `apps/mobile-shell`.

## Tasks

- Scaffold Flutter app.
- Confirm Android build target exists.
- Keep Flutter UI minimal.
- Document required Flutter version.

## Acceptance Criteria

- `apps/mobile-shell/pubspec.yaml` exists.
- `flutter analyze` can run.
- Default app can build before WebView integration.

## Validation

```bash
cd apps/mobile-shell
flutter analyze
flutter test
```

