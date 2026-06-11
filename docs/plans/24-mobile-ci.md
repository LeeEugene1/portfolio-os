# 24. Mobile CI Plan

## Goal

Add GitHub Actions for Flutter validation and APK build.

## Tasks

- Create `.github/workflows/mobile-ci.yml`.
- Set up Flutter.
- Run `flutter analyze`.
- Run `flutter test`.
- Run `flutter build apk`.
- Upload APK artifact if desired.

## Acceptance Criteria

- Mobile CI runs on pull requests.
- Mobile CI runs on pushes to `main`.
- CI fails if analyze, tests, or APK build fails.

## Validation

```bash
gh workflow list
```

