# 22. Flutter WebView 플랜

## 목표

Vercel 웹앱을 Flutter WebView 안에서 로드합니다.

## 작업

- WebView 의존성 추가.
- Android 권한 설정.
- Vercel production URL 로드.
- 로딩 상태 처리.
- 에러 상태 처리.
- Android back button 동작 처리.
- 필요 시 external link 처리.

## 완료 기준

- 앱이 배포된 포트폴리오 URL을 엽니다.
- back button 동작이 예측 가능합니다.
- 로딩/에러 상태가 빈 화면으로 보이지 않습니다.

## 검증

```bash
cd apps/mobile-shell
flutter analyze
flutter test
flutter build apk
```

