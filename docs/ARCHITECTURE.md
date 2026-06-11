# 아키텍처

## 전체 구조

```txt
Flutter App
  └─ WebView / WKWebView
      └─ Vercel에 배포된 반응형 웹
          └─ React / Next.js App
```

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

## 책임 분리

### apps/web

- 모든 포트폴리오 UI와 인터랙션을 담당합니다.
- PC/모바일 반응형 레이아웃을 담당합니다.
- MVP에서는 비회원 장바구니를 `localStorage`에 저장합니다.
- Vercel 배포 대상입니다.

### apps/mobile-shell

- Vercel production URL을 WebView로 로드합니다.
- Android back button 동작을 처리합니다.
- 로딩/에러 상태를 처리합니다.
- Android APK를 빌드합니다.

## 권장 웹 스택

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Radix UI 또는 shadcn/ui
- lucide-react
- Zustand
- Vitest
- React Testing Library
- Playwright

## 상태 모델

주요 클라이언트 상태:

- 열린 창 목록
- 포커스된 창
- 창 위치와 크기
- 비회원 장바구니 아이템
- 계산기 상태

## 장바구니 전략

MVP:

- 정적 상품 데이터.
- `localStorage` 기반 비회원 장바구니.
- 로그인 없음.
- 백엔드 API 없음.

추후 확장:

- 비회원 세션 API.
- DB 기반 장바구니.
- 로그인 후 장바구니 이전.

## 배포

- Vercel project root: `apps/web`
- Flutter WebView URL: Vercel production URL
- APK build root: `apps/mobile-shell`

