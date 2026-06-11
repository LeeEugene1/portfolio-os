# 오케스트레이션

## 목표

OS 느낌의 반응형 포트폴리오 웹앱을 만들고 Flutter WebView APK로 패키징합니다.

## 원칙

- 웹이 제품의 본체입니다.
- Flutter는 WebView 셸입니다.
- 기능 구현 전에 테스트와 CI 하네스를 먼저 구성합니다.
- 각 기능은 플랜, 구현, 검증을 함께 가집니다.
- MVP는 정적 상품 데이터와 `localStorage` 장바구니를 사용합니다.
- 백엔드/API 작업은 명시적으로 승인되기 전까지 제외합니다.

## 저장소 구조

```txt
apps/
  web/
  mobile-shell/

docs/
  PRD.md
  ARCHITECTURE.md
  TEST_PLAN.md
  ORCHESTRATION.md
  AGENT_WORKFLOW.md
  plans/
```

## 작업 단계

### Phase 0. 저장소와 문서

플랜:

- `docs/plans/01-monorepo-setup.md`
- `docs/plans/02-prd.md`
- `docs/plans/03-architecture.md`
- `docs/plans/04-test-plan.md`
- `docs/plans/05-orchestration.md`

산출물:

- 모노레포 구조
- PRD
- 아키텍처 문서
- 테스트 계획
- 오케스트레이션 문서

검증:

```bash
tree -L 3
git status
```

### Phase 1. 웹 스캐폴드와 하네스

플랜:

- `docs/plans/06-web-scaffold.md`
- `docs/plans/07-web-test-harness.md`
- `docs/plans/08-web-verify-script.md`
- `docs/plans/09-initial-tests.md`
- `docs/plans/10-web-ci.md`

산출물:

- Next.js 앱
- TypeScript 설정
- Vitest 설정
- React Testing Library 설정
- Playwright 설정
- GitHub Actions Web CI

검증:

```bash
cd apps/web
npm run verify
npm run test:e2e
```

### Phase 2. Core OS UI

플랜:

- `docs/plans/11-os-ui.md`
- `docs/plans/12-os-ui-tests.md`

산출물:

- OS 바탕화면 셸
- 앱 아이콘
- 창 시스템
- 첫 로드 시 포트폴리오 창 자동 오픈

검증:

```bash
cd apps/web
npm run verify
npm run test:e2e
```

### Phase 3. 기능 앱

플랜:

- `docs/plans/13-store-cart.md`
- `docs/plans/14-store-cart-tests.md`
- `docs/plans/15-calculator.md`
- `docs/plans/16-resume.md`
- `docs/plans/17-contact.md`

산출물:

- Store 앱
- 비회원 장바구니
- 계산기 앱
- Resume 앱
- Contact 앱

검증:

```bash
cd apps/web
npm run verify
npm run test:e2e
```

### Phase 4. 반응형과 E2E

플랜:

- `docs/plans/18-responsive-ui.md`
- `docs/plans/19-playwright-e2e.md`

산출물:

- PC 반응형 레이아웃
- 모바일 반응형 레이아웃
- WebView 친화 레이아웃
- E2E 시나리오

검증:

```bash
cd apps/web
npm run verify:full
```

### Phase 5. 배포

플랜:

- `docs/plans/20-vercel.md`

산출물:

- Vercel preview 배포
- Vercel production 배포

검증:

- PC 브라우저에서 배포 URL 확인.
- 모바일 브라우저에서 배포 URL 확인.

### Phase 6. Flutter WebView 셸

플랜:

- `docs/plans/21-flutter-scaffold.md`
- `docs/plans/22-flutter-webview.md`
- `docs/plans/23-flutter-harness.md`
- `docs/plans/24-mobile-ci.md`

산출물:

- Flutter 앱
- Vercel URL을 로드하는 WebView
- Android APK 빌드
- Mobile CI

검증:

```bash
cd apps/mobile-shell
flutter analyze
flutter test
flutter build apk
```

### Phase 7. 최종 리뷰와 릴리스

플랜:

- `docs/plans/25-final-verification.md`
- `docs/plans/26-pr-review.md`
- `docs/plans/27-release.md`

산출물:

- 최종 PR
- 통과된 CI
- Production 웹 배포
- APK artifact
- README 업데이트

검증:

```bash
cd apps/web
npm run verify:full

cd ../mobile-shell
flutter analyze
flutter test
flutter build apk
```

## 작업 규칙

- 대응되는 플랜 문서 없이 기능을 구현하지 않습니다.
- `npm run verify`가 실패하면 merge하지 않습니다.
- 명시 승인 없이 MVP에 백엔드를 추가하지 않습니다.
- MVP 장바구니는 `localStorage` 기반 비회원 장바구니로 유지합니다.
- Flutter는 WebView 셸로 유지합니다.
- 반응형 동작은 Next.js 앱 안에서 처리합니다.
- 기능 동작이 바뀌면 테스트도 추가하거나 수정합니다.
- 아키텍처나 작업 흐름이 바뀌면 문서도 업데이트합니다.

## PR 전략

1. 저장소와 문서
2. 웹 스캐폴드와 테스트 하네스
3. OS UI
4. Store/cart
5. Calculator, Resume, Contact
6. 반응형과 E2E
7. Vercel 배포
8. Flutter WebView 셸
9. Mobile CI와 APK 릴리스

## 명령어 체크리스트

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

