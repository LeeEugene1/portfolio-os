# 25. 최종 검증 플랜

## 목표

릴리스 전에 전체 검증을 실행합니다.

## 작업

- 웹 full verification 실행.
- Flutter 검증 실행.
- Vercel 배포 URL 확인.
- APK WebView 동작 확인.
- 변경된 명령어가 있다면 문서 업데이트.

## 완료 기준

- 웹 검증이 통과합니다.
- 모바일 검증이 통과합니다.
- 배포 URL이 동작합니다.
- APK가 배포 URL을 로드합니다.

## 검증

```bash
cd apps/web
npm run verify:full

cd ../mobile-shell
flutter analyze
flutter test
flutter build apk
```

