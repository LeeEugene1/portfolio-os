# 24. Mobile CI 플랜

## 목표

Flutter 검증과 APK 빌드용 GitHub Actions를 추가합니다.

## 작업

- `.github/workflows/mobile-ci.yml` 생성.
- Flutter 설정.
- `flutter analyze` 실행.
- `flutter test` 실행.
- `flutter build apk` 실행.
- 필요하면 APK artifact 업로드.

## 완료 기준

- Mobile CI가 pull request에서 실행됩니다.
- Mobile CI가 `main` push에서 실행됩니다.
- analyze, test, APK build 실패 시 CI가 실패합니다.

## 검증

```bash
gh workflow list
```

