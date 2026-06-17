# portfolio-os

OS 느낌의 반응형 포트폴리오 웹앱과 Flutter WebView APK를 만드는 프로젝트입니다.

## 구조

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

## 실행 방식

이 프로젝트는 문서, GitHub Issue, PR, 검증 스크립트를 기준으로 진행합니다.

기본 흐름:

```txt
이슈 링크 전달
  -> 에이전트가 플랜 작성
  -> 사용자가 플랜 검토/승인
  -> 에이전트가 이슈 브랜치 생성
  -> 에이전트가 개발
  -> 테스트 실행
  -> 커밋
  -> 브랜치 push
  -> PR 생성
  -> 사용자 검수
```

시작 문서:

```bash
cat docs/ORCHESTRATION.md
cat docs/AGENT_WORKFLOW.md
cat docs/DEV_HARNESS.md
```

이슈 PR을 올릴 때 사용자 실행 방식, 검증 방식, 배포/하네스 절차가 바뀌면 `README.md`도 함께 업데이트합니다.
