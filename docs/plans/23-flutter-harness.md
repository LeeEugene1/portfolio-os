# 23. Flutter Harness Plan

## Goal

Add repeatable Flutter validation commands.

## Tasks

- Confirm `flutter analyze`.
- Confirm `flutter test`.
- Confirm `flutter build apk`.
- Document mobile validation in README if needed.

## Acceptance Criteria

- Flutter shell can be validated locally.
- APK build command succeeds.

## Validation

```bash
cd apps/mobile-shell
flutter analyze
flutter test
flutter build apk
```

