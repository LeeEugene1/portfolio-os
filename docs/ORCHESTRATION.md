# 오케스트레이션

## 목표

OS 느낌의 반응형 포트폴리오 웹앱을 만들고 Flutter WebView APK로 패키징하는 실행 순서를 정의합니다.

## 문서 책임

- 사용자용 프로젝트 소개와 빠른 시작 안내: `README.md`
- 제품 범위와 사용자 경험: `docs/PRD.md`
- 기술 구조와 책임 경계: `docs/ARCHITECTURE.md`
- 테스트 범위와 검증 명령: `docs/TEST_PLAN.md`
- 에이전트 작업 규칙, 승인 게이트, 브랜치/PR 규칙: `docs/AGENT_WORKFLOW.md`
- 로컬 개발 서버 실행, 포트 안내, 서버 정리 규칙: `docs/DEV_HARNESS.md`
- 이슈별 상세 작업: `docs/plans/*.md`

이 문서는 phase 순서, 선행 조건, 검증 게이트, PR 순서를 연결하는 실행 지도 역할만 담당합니다.

## 실행 원칙

- 각 작업은 대응되는 `docs/plans/*.md` 문서를 가집니다.
- 각 phase는 독립 PR 단위로 진행할 수 있어야 합니다.
- 작업 규칙과 승인 게이트는 `docs/AGENT_WORKFLOW.md`를 따릅니다.
- 검증 명령과 테스트 범위는 `docs/TEST_PLAN.md`를 따릅니다.
- MVP 제품 원칙은 `docs/PRD.md`와 `docs/ARCHITECTURE.md`를 기준으로 판단합니다.
- 선행 PR이 merge되지 않은 상태에서 후속 PR이 필요하면 PR 본문에 의존 브랜치와 미병합 선행 PR을 명시합니다.

## Phase Map

| Phase | 목적 | 연결 plan | 완료 게이트 |
| --- | --- | --- | --- |
| 0. 저장소와 문서 | 작업 전 제품/구조/테스트/실행 규칙 고정 | `00-agent-workflow`, `01-monorepo-setup`, `02-prd`, `03-architecture`, `04-test-plan`, `05-orchestration` | 핵심 문서가 서로 충돌하지 않고 후속 phase가 plan 문서를 가짐 |
| 1. 웹 스캐폴드와 하네스 | Next.js 웹앱과 자동 검증 기반 준비 | `06-web-scaffold`, `07-web-test-harness`, `08-web-verify-script`, `09-initial-tests`, `10-web-ci` | `apps/web`에서 verify 계열 명령과 CI 실행 기반이 준비됨 |
| 2. Core OS UI | OS 바탕화면, 앱 아이콘, 창 시스템 구현 | `11-os-ui`, `12-os-ui-tests` | 핵심 앱 아이콘, Portfolio 기본 오픈, 창 열기/닫기/포커스 동작이 검증됨 |
| 3. 기능 앱 | Store/cart, Calculator, Resume, Contact 구현 | `13-store-cart`, `14-store-cart-tests`, `15-calculator`, `16-resume`, `17-contact` | MVP 앱 기능이 창 시스템 안에서 동작하고 적절한 테스트를 가짐 |
| 4. 반응형과 E2E | PC, 모바일, WebView 근사 viewport 검증 | `18-responsive-ui`, `19-playwright-e2e` | 주요 viewport에서 핵심 흐름과 레이아웃 품질이 검증됨 |
| 5. 배포 | Vercel 배포와 production URL 확정 | `20-vercel` | preview/production 배포 경로가 확인되고 production URL이 필요한 설정에 반영됨 |
| 6. Flutter WebView 셸 | 배포된 웹앱을 Android APK로 패키징 | `21-flutter-scaffold`, `22-flutter-webview`, `23-flutter-harness`, `24-mobile-ci` | WebView 로드, back button, 로딩/에러 상태, APK 빌드가 검증됨 |
| 7. 최종 리뷰와 릴리스 | 전체 검증과 릴리스 정리 | `25-final-verification`, `26-pr-review`, `27-release` | 웹/모바일 전체 검증, 리뷰 반영, 릴리스 산출물이 완료됨 |

## PR 순서

1. `docs/0-agent-workflow`
2. `chore/1-monorepo-setup`
3. `docs/2-prd`
4. `docs/3-architecture`
5. `docs/4-test-plan`
6. `docs/5-orchestration`
7. `feat/6-web-scaffold`
8. `test/7-web-test-harness`
9. `chore/8-web-verify-script`
10. `test/9-initial-tests`
11. `ci/10-web-ci`
12. `feat/11-os-ui`
13. `test/12-os-ui-tests`
14. `feat/13-store-cart`
15. `test/14-store-cart-tests`
16. `feat/15-calculator`
17. `feat/16-resume`
18. `feat/17-contact`
19. `style/18-responsive-ui`
20. `test/19-playwright-e2e`
21. `deploy/20-vercel`
22. `feat/21-flutter-scaffold`
23. `feat/22-flutter-webview`
24. `test/23-flutter-harness`
25. `ci/24-mobile-ci`
26. `test/25-final-verification`
27. `review/26-pr-review`
28. `release/27-release`

## 빠른 확인

문서:

```bash
cat README.md
cat docs/PRD.md
cat docs/ARCHITECTURE.md
cat docs/TEST_PLAN.md
cat docs/ORCHESTRATION.md
cat docs/AGENT_WORKFLOW.md
cat docs/DEV_HARNESS.md
```

웹과 모바일의 실제 검증 명령은 `docs/TEST_PLAN.md`의 "검증 명령어" 섹션을 따릅니다.
로컬 개발 서버 실행과 포트 정리는 `docs/DEV_HARNESS.md`를 따릅니다.
