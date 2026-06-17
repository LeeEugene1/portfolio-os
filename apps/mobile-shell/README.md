# Portfolio OS Mobile Shell

Minimal Flutter app shell for packaging the Portfolio OS web app.

This issue only creates the Flutter scaffold and Android target. WebView loading,
back-button behavior, loading UI, and error handling are implemented in later
mobile-shell issues.

## Tooling

- Flutter SDK: stable channel, 3.32.x or newer.
- Dart SDK: bundled with Flutter.
- Android SDK: required for Android builds.

## Verification

```bash
flutter analyze
flutter test
```

The Android target is present under `android/` for later APK build validation.
