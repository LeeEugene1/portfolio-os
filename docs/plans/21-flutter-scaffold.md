# 21. Flutter 스캐폴드 플랜

## 목표

`apps/mobile-shell`에 Flutter 앱 셸을 생성합니다.

## 작업

- Flutter 앱 생성.
- Android build target 존재 확인.
- Flutter UI는 최소한으로 유지.
- 필요한 Flutter 버전 문서화.

## 완료 기준

- `apps/mobile-shell/pubspec.yaml`이 존재합니다.
- `flutter analyze`를 실행할 수 있습니다.
- WebView 통합 전 기본 앱이 빌드 가능합니다.

## 검증

```bash
cd apps/mobile-shell
flutter analyze
flutter test
```

