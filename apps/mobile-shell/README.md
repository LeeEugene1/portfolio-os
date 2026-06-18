# Portfolio OS Mobile Shell

Flutter WebView shell for packaging the Portfolio OS web app as an Android APK.

The shell loads the production web app and keeps product UI inside `apps/web`.
Flutter is responsible for native packaging, WebView loading, load failure UI,
external link handling, and Android back-button behavior.

## Tooling

- Flutter SDK: stable channel, 3.32.x or newer.
- Dart SDK: bundled with Flutter.
- Android SDK: required for Android builds.

## Runtime URL

The default WebView URL is:

```bash
https://web-six-chi-49.vercel.app
```

Override it for local or preview builds with `--dart-define`:

```bash
flutter run --dart-define=PORTFOLIO_OS_URL=http://10.0.2.2:3000
flutter build apk --dart-define=PORTFOLIO_OS_URL=https://web-six-chi-49.vercel.app
```

Use `10.0.2.2` for an Android emulator that needs to reach a dev server running
on the host machine.

## Verification

```bash
flutter analyze
flutter test
flutter build apk
```
