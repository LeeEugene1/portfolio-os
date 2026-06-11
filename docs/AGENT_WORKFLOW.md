# 에이전트 작업 흐름

## 목적

GitHub Issue 링크 하나를 기준으로 플랜 검토, 개발, 테스트, 커밋, PR 생성을 일관되게 수행합니다.

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
5. 사용자 승인 전까지 구현 파일을 수정하지 않습니다.
6. 사용자가 승인하면 브랜치를 생성합니다.
7. 구현합니다.
8. 검증 명령어를 실행합니다.
9. 실패하면 수정 후 다시 검증합니다.
10. 커밋합니다.
11. PR을 생성합니다.

## 승인 게이트

에이전트는 사용자가 플랜을 승인하기 전까지 다음 작업을 하지 않습니다.

- 구현 파일 수정.
- 의존성 설치.
- 기능 코드 작성.
- 테스트 코드 작성.
- 커밋.
- PR 생성.

문서나 플랜 자체를 작성하는 이슈라면, 해당 문서 수정도 사용자 플랜 승인 이후에 진행합니다.

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

권장 형식:

```txt
chore/01-monorepo-setup
docs/02-prd
feat/06-web-scaffold
test/14-store-cart-tests
ci/10-web-ci
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
