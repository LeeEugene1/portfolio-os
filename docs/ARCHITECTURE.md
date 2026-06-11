# 아키텍처

## 전체 구조

웹앱이 제품의 본체입니다. Flutter 앱은 배포된 웹앱을 모바일 앱 형태로 제공하는 WebView 셸입니다.

```txt
Flutter App
  └─ WebView / WKWebView
      └─ Vercel production URL
          └─ React / Next.js App
              ├─ OS desktop shell
              ├─ Window system
              ├─ App icons
              └─ Portfolio / Store / Resume / Contact / Calculator
```

반응형 UI, 앱 아이콘, 프로그램 창, 장바구니, 계산기 등 제품 기능은 모두 `apps/web` 안에서 구현합니다. `apps/mobile-shell`은 웹앱을 로드하고 모바일 앱 패키징에 필요한 네이티브 셸 동작만 담당합니다.

## 모노레포 구조

```txt
apps/
  web/            Next.js 반응형 웹앱
  mobile-shell/   Flutter WebView APK 셸

docs/
  PRD.md
  ARCHITECTURE.md
  TEST_PLAN.md
  ORCHESTRATION.md
  AGENT_WORKFLOW.md
  plans/
```

`apps/web`은 Vercel project root입니다. `apps/mobile-shell`은 Android APK 빌드 루트입니다.

## 책임 분리

### apps/web

- OS 스타일 바탕화면을 렌더링합니다.
- Portfolio, Store, Resume, Contact, Calculator 앱 아이콘을 렌더링합니다.
- 앱 아이콘 클릭/탭으로 프로그램 창을 엽니다.
- 창 열기, 닫기, 포커스, 앞으로 가져오기 동작을 담당합니다.
- 첫 로드 시 Portfolio 창을 자동 오픈합니다.
- PC 브라우저, 모바일 브라우저, Flutter WebView에 맞는 반응형 레이아웃을 담당합니다.
- 정적 상품 데이터와 `localStorage` 기반 비회원 장바구니를 담당합니다.
- 계산기 상태와 연산을 담당합니다.
- Resume, Contact 진입 UI와 외부 링크 동작을 제공합니다.
- Vercel 배포 대상입니다.

### apps/mobile-shell

- Vercel production URL을 WebView로 로드합니다.
- Android back button 동작을 처리합니다.
- 로딩/에러 상태를 처리합니다.
- Android APK를 빌드합니다.
- 제품 UI를 중복 구현하지 않습니다.
- 장바구니, 계산기, 창 상태 같은 제품 상태를 직접 관리하지 않습니다.
- 반응형 레이아웃을 직접 구현하지 않습니다.
- 백엔드 API 역할을 하지 않습니다.

## 권장 웹 스택

- Next.js App Router: 라우팅, 정적 렌더링, Vercel 배포 단위.
- React: OS 데스크톱, 창, 앱 컴포넌트 구현.
- TypeScript: 앱 정의, 상태 모델, 상품 데이터 타입 안정성.
- Tailwind CSS: 반응형 레이아웃과 UI 스타일링.
- Radix UI 또는 shadcn/ui: 접근성 있는 기본 UI primitives.
- lucide-react: MVP 앱 아이콘과 UI 아이콘.
- Zustand: 창 상태, 장바구니, 계산기 같은 클라이언트 상태.
- Vitest: 순수 로직과 상태 액션 단위 테스트.
- React Testing Library: 컴포넌트 동작 테스트.
- Playwright: 브라우저 E2E와 반응형 검증.

## 웹 앱 구조

`apps/web`의 구현은 다음 경계를 기준으로 나눕니다.

```txt
apps/web/
  app/                 Next.js App Router 엔트리
  src/
    apps/              Portfolio, Store, Resume, Contact, Calculator
    components/        공통 UI 컴포넌트
    desktop/           OS 바탕화면, 앱 아이콘, 창 시스템
    data/              정적 상품 데이터와 포트폴리오 데이터
    stores/            Zustand 상태 저장소
    tests/             테스트 유틸리티
```

실제 디렉터리명은 구현 단계에서 조정할 수 있지만, 책임 경계는 유지합니다.

## 상태 모델

주요 클라이언트 상태:

- 열린 창 목록.
- 포커스된 창.
- 창 위치와 크기.
- 앱별 열림 여부.
- 비회원 장바구니 아이템.
- 장바구니 수량과 합계 계산.
- 계산기 입력값과 연산 상태.

MVP 상태는 클라이언트에서 관리합니다. 서버 세션, DB, 인증 기반 상태는 후속 확장 범위입니다.

## OS UI 모델

- 바탕화면은 앱 아이콘 목록과 열린 창을 포함하는 최상위 UI입니다.
- 앱 정의는 아이콘, 라벨, 창 제목, 기본 크기, 렌더링할 앱 컴포넌트를 포함합니다.
- 앱 아이콘은 `lucide-react` 아이콘을 사용합니다.
- 앱 아이콘을 클릭하거나 탭하면 해당 앱 창이 열립니다.
- 이미 열린 앱을 다시 실행하면 기존 창을 앞으로 가져옵니다.
- Portfolio 창은 첫 로드 시 자동으로 열립니다.
- 모바일과 WebView에서는 같은 앱 모델을 유지하되 창 표현은 전체 화면 또는 단순화된 레이아웃으로 바꿀 수 있습니다.

## 장바구니 전략

MVP:

- 정적 상품 데이터.
- `localStorage` 기반 비회원 장바구니.
- 로그인 없음.
- 백엔드 API 없음.
- 결제 없음.
- 상품 관리자 없음.

추후 확장:

- 비회원 세션 API.
- DB 기반 장바구니.
- 로그인 후 장바구니 이전.
- 결제 mock.
- 상품 관리자 페이지.

## 데이터 전략

- Portfolio 콘텐츠는 MVP에서 정적 데이터 또는 정적 문서로 관리합니다.
- Store 상품은 MVP에서 정적 데이터로 관리합니다.
- Cart는 `localStorage`에 저장합니다.
- Resume은 PDF 또는 문서 링크를 정적 자산이나 외부 링크로 제공합니다.
- Contact는 이메일과 외부 프로필 링크 중심으로 제공합니다.
- 백엔드 API, DB, 인증은 MVP 아키텍처에 포함하지 않습니다.

## 배포

- Vercel project root: `apps/web`.
- Vercel production URL은 웹앱의 canonical runtime URL입니다.
- Flutter WebView URL: Vercel production URL.
- APK build root: `apps/mobile-shell`.
- Flutter 앱 배포 전 production URL이 PC 브라우저와 모바일 브라우저에서 검증되어야 합니다.

## 테스트와 CI 책임

웹:

- 창 상태 액션은 단위 테스트로 검증합니다.
- 장바구니 추가, 삭제, 수량 변경, 합계 계산은 단위 테스트로 검증합니다.
- 계산기 연산은 단위 테스트로 검증합니다.
- 앱 아이콘 렌더링, 창 열기/닫기, Portfolio 기본 오픈은 컴포넌트 테스트로 검증합니다.
- 핵심 사용자 흐름과 반응형 동작은 Playwright E2E로 검증합니다.
- 웹 검증 명령은 `apps/web`에서 실행합니다.

```bash
npm run verify
npm run verify:full
```

모바일 셸:

- Flutter 정적 분석과 테스트를 실행합니다.
- APK 빌드를 검증합니다.
- WebView가 Vercel production URL을 로드하는지 확인합니다.
- Android back button, 로딩, 에러 상태를 검증합니다.

```bash
flutter analyze
flutter test
flutter build apk
```

## 아키텍처 원칙

- 웹이 제품의 본체입니다.
- Flutter는 WebView 패키징 셸입니다.
- 반응형 동작은 Next.js 웹앱 안에서 처리합니다.
- MVP는 정적 데이터와 클라이언트 상태로 구현합니다.
- 명시 승인 전까지 백엔드, DB, 인증을 추가하지 않습니다.
- 앱 아이콘과 앱 구현은 분리해 추후 자체 아이콘 세트로 교체할 수 있게 합니다.
- PostHog는 UI/UX 레퍼런스로만 참고하고 브랜드 고유 자산은 사용하지 않습니다.
