# 25. Final Verification Plan

## Goal

Run complete validation before release.

## Tasks

- Run web full verification.
- Run Flutter validation.
- Check deployed Vercel URL.
- Check APK WebView behavior.
- Update docs for any changed commands.

## Acceptance Criteria

- Web verification passes.
- Mobile verification passes.
- Deployed URL works.
- APK loads the deployed URL.

## Validation

```bash
cd apps/web
npm run verify:full

cd ../mobile-shell
flutter analyze
flutter test
flutter build apk
```

