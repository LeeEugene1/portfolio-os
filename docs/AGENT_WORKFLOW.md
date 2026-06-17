# 에이전트 작업 흐름

## 목적

GitHub Issue 링크 하나를 기준으로 플랜 검토, 개발, 테스트, 커밋, PR 생성을 일관되게 수행합니다.

이 문서는 에이전트 작업 규칙, 승인 게이트, 브랜치/PR 규칙의 기준 문서입니다. 실행 phase 순서는 `docs/ORCHESTRATION.md`, 검증 명령과 테스트 범위는 `docs/TEST_PLAN.md`를 따릅니다.

로컬 개발 서버 실행, 포트 안내, 작업 완료 후 서버 정리는 `docs/DEV_HARNESS.md`를 따릅니다.

## 입력

사용자는 GitHub Issue 링크를 전달합니다.

예시:

```txt
https://github.com/LeeEugene1/portfolio-os/issues/6
이 이슈 진행해줘. 먼저 플랜부터 세워줘.
```

## 필수 흐름

1. GitHub Issue를 읽습니다.
2. 연결된 `docs/plans/*.md` 문서를 읽습니다.
3. 관련 상위 문서(`PRD.md`, `ARCHITECTURE.md`, `TEST_PLAN.md`, `ORCHESTRATION.md`)를 확인합니다.
4. 구현 플랜을 작성합니다.
5. 사용자에게 플랜 검토를 요청합니다.
6. 사용자가 이슈 또는 대화에서 승인하기 전까지 브랜치 생성, 구현, 커밋, PR 생성을 하지 않습니다.
7. 사용자가 승인하면 이슈 번호에 맞는 브랜치를 생성합니다.
8. 구현합니다.
9. 검증 명령어를 실행합니다.
10. 실패하면 수정 후 다시 검증합니다.
11. 커밋합니다.
12. 브랜치를 push합니다.
13. PR을 생성하고 사용자 검수를 기다립니다.

## 승인 게이트

에이전트는 사용자가 플랜을 승인하기 전까지 다음 작업을 하지 않습니다.

- 브랜치 생성.
- 구현 파일 수정.
- 의존성 설치.
- 기능 코드 작성.
- 테스트 코드 작성.
- 커밋.
- 브랜치 push.
- PR 생성.

문서나 플랜 자체를 작성하는 이슈라면, 해당 문서 수정도 사용자 플랜 승인 이후에 진행합니다.

승인 방식은 아래 중 하나로 처리합니다.

- 대화에서 사용자가 명시적으로 승인합니다.
- GitHub Issue에 승인 댓글이 달립니다.
- GitHub Issue에 승인용 label이 붙습니다.

권장 label:

```txt
plan:review
plan:approved
plan:blocked
```

## Git worktree 사용 원칙

- 이슈 작업은 가능하면 이슈별 전용 `git worktree`에서 진행합니다.
- 하나의 작업 디렉터리를 여러 브랜치가 공유하면, 파일 수정은 현재 체크아웃된 브랜치의 워크트리에 생기고 커밋도 현재 브랜치에 기록됩니다.
- 전용 worktree를 만들 수 없는 경우에는 브랜치 생성, 구현, 커밋, push 전에 `git branch --show-current`와 `git status --short`로 현재 브랜치와 변경 범위를 확인합니다.
- 문서 최적화, CI 수정처럼 다른 브랜치가 동시에 진행 중이면, 이슈 브랜치를 최신 `main`에 rebase 또는 merge한 뒤 충돌과 검증 결과를 확인합니다.
- 실수로 다른 브랜치에 커밋한 경우에는 해당 커밋을 올바른 이슈 브랜치로 먼저 옮기고, 원래 브랜치 포인터를 원격 기준 상태로 정리한 뒤 작업을 계속합니다.

## 브랜치와 PR 검수 규칙

- 모든 이슈 작업은 별도 브랜치에서 진행합니다.
- `main`에는 직접 push하지 않습니다.
- PR은 해당 이슈를 닫도록 `Closes #이슈번호`를 포함합니다.
- 사용자가 PR을 검수하기 전까지 merge하지 않습니다.
- 검증 실패가 있으면 PR 본문에 실패 명령어와 원인을 남깁니다.
- 검수 중 요청된 수정은 같은 브랜치에 추가 커밋으로 반영합니다.

## 플랜 응답 형식

이슈 링크를 받으면 에이전트는 먼저 아래 형식으로 답합니다.

```md
## 이슈 요약

- 대상 이슈:
- 연결 플랜:
- 목표:

## 작업 범위

- 포함:
- 제외:

## 변경 예정 파일

- 파일 경로와 변경 이유

## 구현 순서

1. ...
2. ...
3. ...

## 검증 계획

- 실행할 명령어:
- 확인할 동작:

## 리스크 / 확인 필요사항

- ...
```

## 브랜치 네이밍

브랜치명에는 콜론(`:`)을 쓰지 않습니다. 콜론은 커밋 메시지 prefix에만 사용합니다.

기본 형식:

```txt
<type>/<issue-number>-<short-description>
```

규칙:

- `type`은 작업 성격을 나타냅니다.
- `issue-number`는 GitHub Issue 번호를 사용합니다.
- `short-description`은 영어 kebab-case를 사용합니다.
- 한 이슈는 하나의 작업 브랜치를 기본으로 합니다.
- 같은 이슈의 검수 수정은 같은 브랜치에 추가 커밋으로 반영합니다.

권장 type:

```txt
docs     문서 작업
feat     기능 추가
test     테스트 추가/수정
ci       GitHub Actions, CI/CD
chore    설정, 하네스, 구조 작업
style    UI/반응형/스타일 조정
deploy   배포 설정
review   리뷰/정리
release  릴리스
```

예시:

```txt
docs/28-agent-workflow
chore/1-monorepo-setup
docs/2-prd
feat/6-web-scaffold
test/14-store-cart-tests
ci/10-web-ci
style/18-responsive-ui
deploy/20-vercel
release/27-release
```

## 커밋 메시지

권장 형식:

```txt
chore: set up monorepo structure
docs: write product requirements
feat: scaffold next app
test: add cart tests
ci: add web ci workflow
```

브랜치명과 커밋 메시지는 분리해서 관리합니다.

```txt
브랜치명: feat/6-web-scaffold
커밋 메시지: feat: scaffold next app
```

## PR 본문

PR에는 아래 내용을 포함합니다.

```md
## 요약

- ...

## 연결 이슈

Closes #이슈번호

## 검증

- [ ] 명령어 또는 검증 결과

## 참고

- ...
```

## 검증 규칙

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

## 예외 규칙

- 네트워크 접근이 필요한 명령은 사용자 승인을 받은 뒤 실행합니다.
- 실패한 검증은 숨기지 않고 최종 응답과 PR 본문에 남깁니다.
- 관련 없는 파일 변경은 하지 않습니다.
- 기존 사용자 변경사항을 되돌리지 않습니다.
