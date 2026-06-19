# portfolio-os

## 프로젝트 소개

<img width="1433" height="683" alt="Image" src="https://github.com/user-attachments/assets/290f560c-1609-42c0-b076-8c68ebab61ab" />

portfolio-os는 운영체제(OS) UI 컨셉으로 만든 인터랙티브 포트폴리오입니다.

일반적인 이력서 페이지처럼 위에서 아래로 읽는 방식이 아니라, 데스크톱의 앱, 창, 터미널을 열듯이 탐색합니다. 사용자는 Portfolio, Resume, Store, Contact, Calculator 앱을 직접 실행하면서 개발자의 경험과 구현 역량을 확인할 수 있습니다.

웹앱이 제품의 본체이고, Flutter 앱은 배포된 웹앱을 WebView로 감싸 Android APK 형태로 제공합니다.

## 주요 기능

### OS형 포트폴리오 UI

- 앱 아이콘을 클릭하거나 탭하면 각 기능이 독립된 창으로 열립니다.
- 이미 열린 앱을 다시 실행하면 기존 창이 앞으로 이동합니다.
- 데스크톱, 모바일 브라우저, Flutter WebView에서 같은 제품 모델을 유지하되 화면 크기에 맞춰 창 레이아웃이 조정됩니다.
- Portfolio 앱은 첫 진입 시 자동으로 열려 대표 프로젝트를 바로 확인할 수 있습니다.

### 이력서

- Resume 앱에서 경력, 프로젝트, 기술 스택, 교육 이력을 문서 형태로 확인할 수 있습니다.
- 인쇄 버튼을 제공해 발표나 공유 상황에서 이력서 문서처럼 활용할 수 있습니다.
- 이메일, 전화, GitHub, Blog 링크를 함께 제공해 연락과 외부 프로필 확인으로 이어집니다.

### 포트폴리오

- Portfolio 앱은 터미널 콘셉트의 탐색 UI로 구성되어 있습니다.
- `whoami`, 프로젝트, 기술 목록을 탭처럼 전환하며 볼 수 있습니다.
- Thirtymall, Caveduck, Sheepfarm 등 실제 프로젝트의 역할, 성과, 문제 해결 내용을 정리합니다.
- 발표 자료를 순서대로 넘기는 방식이 아니라, 필요한 프로젝트를 직접 열어 보여줄 수 있습니다.

### 미니 쇼핑몰

- Store 앱은 상품 목록, 옵션 선택, 장바구니, 수량 변경, 삭제, 결제 확인 흐름을 포함한 작은 커머스 데모입니다.
- 장바구니 상태는 Zustand와 `localStorage` 기반으로 관리되어 새로고침 후에도 복원됩니다.
- 실제 결제 API 없이 주문 상품과 결제 예정 금액을 확인하는 mock checkout 구조입니다.
- 단순 소개 페이지가 아니라 상태 관리, 사용자 인터랙션, 테스트 가능한 기능 구현을 보여주는 영역입니다.

### 추가 앱

- Contact 앱은 이메일, 전화, GitHub, Blog 링크를 제공합니다.
- Calculator 앱은 기본 사칙연산을 수행하는 미니 앱입니다.
- 각 앱은 OS 창 시스템 안에서 독립 앱처럼 실행됩니다.

## 기술 스택 및 아키텍처

### 스택

- Web
  - Next.js App Router
  - React
  - TypeScript
  - CSS Modules / global CSS 기반 스타일
- 상태 관리
  - Zustand
  - `localStorage` 기반 장바구니 persist
- 아이콘
  - lucide-react
- 테스트 및 검증
  - Vitest
  - React Testing Library
  - Playwright
  - ESLint
  - TypeScript typecheck
- Mobile Shell
  - Flutter
  - webview_flutter
  - url_launcher
- CI / 배포
  - Web: GitHub Actions에서 검증 후 Vercel production으로 자동 배포
  - Mobile: Flutter WebView APK가 Vercel production URL을 로드하는 셸 구조

### 모노레포 구조

```txt
apps/
  web/            Next.js 반응형 웹
  mobile-shell/   Flutter WebView 앱

docs/
  PRD.md
  ARCHITECTURE.md
  TEST_PLAN.md
  ORCHESTRATION.md
  AGENT_WORKFLOW.md
  DEV_HARNESS.md
  plans/
```

### 실행 구조

```txt
Flutter App
  -> WebView
    -> Vercel production URL
      -> Next.js / React Web App
        -> OS desktop shell
        -> Window system
        -> Portfolio / Store / Resume / Contact / Calculator
```

Flutter 앱은 제품 UI를 다시 만들지 않고 웹앱을 로드하는 셸 역할만 담당합니다. 실제 포트폴리오 기능, 반응형 UI, 장바구니, 계산기, 이력서 화면은 `apps/web` 안에서 구현합니다.

## AI 기반 오케스트레이션 활용

이 프로젝트는 문서, GitHub Issue, PR, 검증 스크립트를 기준으로 진행했습니다. 반복되는 이슈 처리 흐름은 Codex skill로 묶어 사용했습니다.

```txt
$portfolio-os-issue-runner 이슈 #6 진행해줘.
```

```txt
$portfolio-os-issue-runner 이슈
    ↓
AGENT_WORKFLOW (진입점)
    ↓ "상위 문서 확인해라"
ORCHESTRATION (지금 몇 phase? 어떤 PR 순서?)
    ↓ 현재 위치 파악 후 돌아옴
AGENT_WORKFLOW (승인 게이트 / 브랜치 규칙 / 플랜 형식)
    ↓
TEST_PLAN (검증 명령 / 범위)
    ↓
DEV_HARNESS (서버 실행 / 포트)
```

기본 작업 흐름은 사람이 승인 지점을 잡고, 에이전트가 구현과 검증을 반복하는 구조입니다.

```txt
플랜 -> 승인(사람) -> 구현/테스트 -> PR -> 승인(사람)
```

이 방식으로 작업 순서, 브랜치 규칙, 검증 명령, PR 형식을 문서화하고 이슈별로 재사용했습니다.

### AI 기반 작업 방식

이 프로젝트는 문서, GitHub Issue, PR, 검증 스크립트를 기준으로 작업을 진행합니다.

반복되는 이슈 처리 흐름은 로컬 Codex skill로 묶어 사용했고, 에이전트는 `docs/
AGENT_WORKFLOW.md`를 진입점으로 삼아 작업 규칙을 확인합니다.

작업 흐름:

```txt
GitHub Issue
  -> AGENT_WORKFLOW.md: 승인 게이트, 브랜치 규칙, PR 규칙 확인
  -> ORCHESTRATION.md: phase와 PR 순서 확인
  -> TEST_PLAN.md: 검증 명령 확인
  -> DEV_HARNESS.md: 개발 서버와 포트 규칙 확인
  -> 구현
  -> 테스트
  -> PR
  -> 사용자 검수
```

  ### 하네스와 트러블슈팅

  병렬 에이전트 작업에서는 구현 자체뿐 아니라 실행 환경을 일관되게 유지하는 것이 중요
  했습니다. 그래서 개발 서버 실행, 포트 관리, 검증 명령을 하네스로 문서화했습니다.

  - `DEV_HARNESS.md`: 포트 확인, 서버 실행, 빈 포트 선택, 종료 시점을 문서화해 에이전
  트가 매번 같은 절차로 개발 서버를 다루도록 했습니다.
  - `TEST_PLAN.md`: `npm run verify`, `npm run verify:full`, `flutter analyze`,
  `flutter test`, `flutter build apk`를 기준 검증 명령으로 묶었습니다.
  - 디렉터리 공유로 브랜치와 파일 변경이 섞이는 문제는 이슈별 `git worktree`를 사용해
  작업 공간을 분리했습니다.
  - 로컬 포트 충돌은 `DEV_HARNESS.md`의 포트 확인과 빈 포트 선택 규칙으로 대응했습니
  다.
  - README 누락은 사용자 실행 방식, 검증 방식, 배포/하네스 절차가 바뀌면 README 업데
  이트를 PR 조건에 포함하도록 했습니다.
  - 오래된 `main` 기준 PR로 충돌이 나는 문제는 브랜치 생성, 구현 시작, 커밋, push, PR
  생성 직전에 `git merge-base --is-ancestor origin/main HEAD`로 최신 `origin/main` 포
  함 여부를 확인하도록 해결했습니다.

## 데모

1. Web: https://web-six-chi-49.vercel.app
2. Mobile WebView APK: `apps/mobile-shell/build/app/outputs/flutter-apk/portfolio-os-demo-signed.apk`

Flutter 앱의 기본 로드 URL은 `https://web-six-chi-49.vercel.app`입니다.

## 로컬 실행 및 검증

### Web

```bash
cd apps/web
npm install
npm run dev
```

검증:

```bash
cd apps/web
npm run verify
npm run verify:full
```

### Mobile Shell

```bash
cd apps/mobile-shell
flutter pub get
flutter analyze
flutter test
flutter build apk
```

빌드 후 APK 산출물은 Flutter 프로젝트 내부의 `build/app/outputs/flutter-apk/` 경로에 생성됩니다.

## 참고 문서

- `docs/PRD.md`: 제품 범위와 사용자 경험
- `docs/ARCHITECTURE.md`: 기술 구조와 책임 경계
- `docs/TEST_PLAN.md`: 테스트 범위와 검증 명령
- `docs/ORCHESTRATION.md`: phase 순서와 PR 흐름
- `docs/AGENT_WORKFLOW.md`: 에이전트 승인 게이트, 브랜치, PR 규칙
- `docs/DEV_HARNESS.md`: 로컬 개발 서버와 포트 관리
