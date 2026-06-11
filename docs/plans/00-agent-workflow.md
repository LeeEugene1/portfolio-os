# 00. 에이전트 워크플로우 플랜

## 목표

GitHub Issue 링크를 기준으로 플랜 검토, 개발, 테스트, 커밋, PR 생성까지 이어지는 에이전트 작업 흐름을 정의합니다.

## 배경

이 프로젝트는 이슈와 플랜 문서를 실행 단위로 사용합니다. 사용자가 각 이슈 링크를 전달하면 에이전트가 바로 구현하지 않고 먼저 작업 계획을 작성하고, 사용자가 승인한 뒤 개발을 진행해야 합니다.

## 작업

- `docs/AGENT_WORKFLOW.md` 추가.
- 이슈 링크 기반 작업 흐름 정의.
- 사용자 승인 게이트 정의.
- 플랜 응답 형식 정의.
- 브랜치 네이밍 규칙 정의.
- 커밋 메시지 규칙 정의.
- PR 본문 형식 정의.
- GitHub Issue 템플릿 추가.
- GitHub PR 템플릿 추가.

## 완료 기준

- 사용자가 이슈 링크를 전달했을 때 에이전트가 따라야 할 절차가 명확합니다.
- 사용자 승인 전에는 구현 파일을 수정하지 않는 규칙이 문서화됩니다.
- Issue/Plan/Branch/Commit/PR 흐름이 문서화됩니다.
- GitHub Issue와 PR 템플릿이 존재합니다.

## 검증

```bash
cat docs/AGENT_WORKFLOW.md
cat .github/ISSUE_TEMPLATE/plan-task.md
cat .github/PULL_REQUEST_TEMPLATE.md
```

