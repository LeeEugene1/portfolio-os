# 23. Flutter 하네스 플랜

## 목표

반복 가능한 Flutter 검증 명령어를 정리합니다.

## 작업

- `flutter analyze` 확인.
- `flutter test` 확인.
- `flutter build apk` 확인.
- 필요하면 README에 모바일 검증 방법 문서화.

## 완료 기준

- Flutter 셸을 로컬에서 검증할 수 있습니다.
- APK 빌드 명령이 성공합니다.

## 검증

```bash
cd apps/mobile-shell
flutter analyze
flutter test
flutter build apk
```

