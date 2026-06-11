# 테스트 계획

## 전략

기능 구현 전에 작지만 엄격한 테스트 하네스를 먼저 구성합니다.

## 웹 Unit 테스트

- 장바구니 추가/삭제/수량 변경.
- 장바구니 총액 계산.
- 계산기 연산.
- 창 상태 액션.

## 웹 Component 테스트

- 데스크톱 아이콘 렌더링.
- 창 열기/닫기 동작.
- 포트폴리오 창 기본 오픈 상태.
- Store 장바구니 UI.

## 웹 E2E 테스트

- 홈 화면 렌더링.
- 첫 로드 시 포트폴리오 창 표시.
- Store 아이콘 클릭 시 Store 창 열림.
- 상품 장바구니 추가.
- 새로고침 후 장바구니 유지.
- 계산기 기본 연산.
- Resume 진입 동작.
- Contact 진입 동작.

## 반응형 테스트

Playwright viewport 기준:

- PC 브라우저 viewport.
- 모바일 브라우저 viewport.
- WebView에 가까운 모바일 viewport.

## 모바일 셸 테스트

- `flutter analyze` 통과.
- `flutter test` 통과.
- APK 빌드 성공.
- WebView가 Vercel URL 로드.
- Android back button 동작 정의.

## 검증 명령어

웹:

```bash
cd apps/web
npm run verify
npm run verify:full
```

모바일:

```bash
cd apps/mobile-shell
flutter analyze
flutter test
flutter build apk
```

