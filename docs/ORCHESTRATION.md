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
- 각 phase는 연결된 plan 문서와 검증 게이트를 통과한 뒤 다음 phase로 넘어갑니다.
- 이전 phase의 미완료 항목은 다음 phase PR 본문에 명시하지 않는 한 이어서 구현하지 않습니다.

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

각 phase는 독립 PR 단위로 진행할 수 있어야 합니다. 같은 phase 안에서도 작업 크기가 커지면 plan 문서 단위로 PR을 나눌 수 있습니다.

### Phase 0. 저장소와 문서

목적:

- 구현 전에 작업 규칙, 제품 범위, 아키텍처, 테스트 전략, 실행 순서를 고정합니다.

플랜:

- `docs/plans/00-agent-workflow.md`
- `docs/plans/01-monorepo-setup.md`
- `docs/plans/02-prd.md`
- `docs/plans/03-architecture.md`
- `docs/plans/04-test-plan.md`
- `docs/plans/05-orchestration.md`

산출물:

- 에이전트 작업 흐름 문서
- 모노레포 구조
- PRD
- 아키텍처 문서
- 테스트 계획
- 오케스트레이션 문서

검증:

```bash
tree -L 3
git status
cat docs/PRD.md
cat docs/ARCHITECTURE.md
cat docs/TEST_PLAN.md
cat docs/ORCHESTRATION.md
```

완료 게이트:

- 핵심 문서가 서로 충돌하지 않습니다.
- 모든 후속 구현 phase가 대응되는 plan 문서를 가집니다.
- 사용자 승인 전에는 브랜치 생성, 구현, 커밋, PR 생성을 하지 않는 규칙이 문서화되어 있습니다.

### Phase 1. 웹 스캐폴드와 하네스

목적:

- 제품 기능 구현 전에 Next.js 웹앱과 자동 검증 기반을 먼저 준비합니다.

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
npm run verify:full
```

완료 게이트:

- `apps/web`에서 lint, typecheck, unit/component 테스트를 실행할 수 있습니다.
- Playwright E2E를 실행할 수 있는 npm script가 준비되어 있습니다.
- CI가 웹 검증 명령을 실행합니다.

### Phase 2. Core OS UI

목적:

- 포트폴리오 웹앱의 기본 사용 모델인 OS 바탕화면, 앱 아이콘, 창 시스템을 구현합니다.

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
npm run verify:full
```

완료 게이트:

- Portfolio, Store, Resume, Contact, Calculator 아이콘이 렌더링됩니다.
- 첫 로드 시 Portfolio 창이 자동으로 열립니다.
- 창 열기, 닫기, 포커스 변경 동작이 테스트됩니다.

### Phase 3. 기능 앱

목적:

- OS 창 안에서 동작하는 MVP 앱을 구현합니다.

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
npm run verify:full
```

완료 게이트:

- Store는 정적 상품 데이터와 `localStorage` 기반 장바구니로 동작합니다.
- Calculator는 기본 사칙연산을 지원합니다.
- Resume과 Contact는 WebView에서도 접근 가능한 진입점을 제공합니다.
- 기능 동작은 unit, component, E2E 중 적절한 레벨에서 검증됩니다.

### Phase 4. 반응형과 E2E

목적:

- PC 브라우저, 모바일 브라우저, Flutter WebView에 가까운 화면에서 같은 제품 모델을 사용할 수 있게 합니다.

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

완료 게이트:

- 주요 viewport에서 텍스트, 아이콘, 창 헤더, 버튼이 겹치지 않습니다.
- 앱 열기, 장바구니, 계산기, Resume, Contact 흐름이 E2E로 검증됩니다.
- 모바일에서는 창이 작은 화면에 맞는 전체 화면 또는 단순화된 레이아웃으로 표시됩니다.

### Phase 5. 배포

목적:

- 웹앱을 Vercel에 배포하고 모바일 셸이 로드할 production URL을 확정합니다.

플랜:

- `docs/plans/20-vercel.md`

산출물:

- Vercel preview 배포
- Vercel production 배포

검증:

- PC 브라우저에서 배포 URL 확인.
- 모바일 브라우저에서 배포 URL 확인.
- Vercel production URL을 문서나 설정에 반영해야 하는 경우 해당 변경을 PR에 포함.

완료 게이트:

- Vercel preview와 production 배포 경로가 확인됩니다.
- production URL에서 웹 MVP 핵심 흐름이 동작합니다.

### Phase 6. Flutter WebView 셸

목적:

- 배포된 웹앱을 Android APK로 패키징하는 Flutter WebView 셸을 구현합니다.

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

완료 게이트:

- Flutter 앱은 Vercel production URL을 WebView로 로드합니다.
- Android back button, 로딩, 에러 상태가 정의되고 검증됩니다.
- Flutter 앱은 제품 UI나 웹 상태를 중복 구현하지 않습니다.

### Phase 7. 최종 리뷰와 릴리스

목적:

- 웹과 모바일 셸을 함께 검증하고 릴리스 가능한 상태로 정리합니다.

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

완료 게이트:

- 웹 `verify:full`이 통과합니다.
- 모바일 셸 analyze, test, APK build가 통과합니다.
- PR 리뷰에서 발견된 수정 요청이 반영됩니다.
- 릴리스 산출물과 README가 최신 상태입니다.

## 작업 규칙

- 대응되는 플랜 문서 없이 기능을 구현하지 않습니다.
- 사용자가 이슈 플랜을 승인하기 전까지 브랜치 생성, 구현, 커밋, PR 생성을 하지 않습니다.
- 모든 이슈 작업은 별도 브랜치와 PR로 검수받습니다.
- `main`에는 직접 push하지 않습니다.
- 브랜치명은 `<type>/<issue-number>-<short-description>` 형식을 사용합니다.
- `npm run verify`가 실패하면 merge하지 않습니다.
- 명시 승인 없이 MVP에 백엔드를 추가하지 않습니다.
- MVP 장바구니는 `localStorage` 기반 비회원 장바구니로 유지합니다.
- Flutter는 WebView 셸로 유지합니다.
- 반응형 동작은 Next.js 앱 안에서 처리합니다.
- 기능 동작이 바뀌면 테스트도 추가하거나 수정합니다.
- 아키텍처나 작업 흐름이 바뀌면 문서도 업데이트합니다.
- 검증 실패가 남아 있으면 PR 본문에 실패한 명령어와 원인을 기록합니다.
- PR은 연결 이슈를 닫도록 `Closes #이슈번호`를 포함합니다.
- 사용자가 PR을 검수하기 전까지 merge하지 않습니다.

## PR 전략

1. `docs/0-agent-workflow`: 에이전트 작업 흐름 정리.
2. `chore/1-monorepo-setup`: 모노레포 기본 구조 생성.
3. `docs/2-prd`: 제품 요구사항 정의.
4. `docs/3-architecture`: 아키텍처 정의.
5. `docs/4-test-plan`: 테스트 계획 정의.
6. `docs/5-orchestration`: 프로젝트 실행 순서와 PR 전략 정의.
7. `feat/6-web-scaffold`: Next.js 웹앱 스캐폴드.
8. `test/7-web-test-harness`: 웹 테스트 하네스 구성.
9. `chore/8-web-verify-script`: 웹 검증 스크립트 구성.
10. `test/9-initial-tests`: 초기 테스트 추가.
11. `ci/10-web-ci`: Web CI 구성.
12. `feat/11-os-ui`: OS UI 구현.
13. `test/12-os-ui-tests`: OS UI 테스트 추가.
14. `feat/13-store-cart`: Store/cart 구현.
15. `test/14-store-cart-tests`: Store/cart 테스트 추가.
16. `feat/15-calculator`: Calculator 구현.
17. `feat/16-resume`: Resume 구현.
18. `feat/17-contact`: Contact 구현.
19. `style/18-responsive-ui`: 반응형 UI 정리.
20. `test/19-playwright-e2e`: Playwright E2E 추가.
21. `deploy/20-vercel`: Vercel 배포 설정.
22. `feat/21-flutter-scaffold`: Flutter 앱 스캐폴드.
23. `feat/22-flutter-webview`: Flutter WebView 구현.
24. `test/23-flutter-harness`: Flutter 검증 하네스 구성.
25. `ci/24-mobile-ci`: Mobile CI 구성.
26. `test/25-final-verification`: 최종 검증.
27. `review/26-pr-review`: PR 리뷰 반영.
28. `release/27-release`: 릴리스 정리.

PR은 위 순서를 기본으로 하되, 선행 PR이 merge되지 않은 상태에서 후속 PR이 필요한 경우 후속 PR 본문에 의존 브랜치와 미병합 선행 PR을 명시합니다.

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

문서:

```bash
cat docs/PRD.md
cat docs/ARCHITECTURE.md
cat docs/TEST_PLAN.md
cat docs/ORCHESTRATION.md
```

전체 릴리스 전:

```bash
cd apps/web
npm run verify:full

cd ../mobile-shell
flutter analyze
flutter test
flutter build apk
```
