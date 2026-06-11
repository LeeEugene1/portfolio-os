# 08. 웹 verify 스크립트 플랜

## 목표

반복 가능한 웹 검증 스크립트를 추가합니다.

## 작업

- `lint` 추가.
- `typecheck` 추가.
- `test` 추가.
- `test:e2e` 추가.
- `build` 추가.
- `verify` 추가.
- `verify:full` 추가.

## 완료 기준

- `npm run verify`가 lint, typecheck, unit test, build를 실행합니다.
- `npm run verify:full`이 Playwright E2E까지 실행합니다.

## 검증

```bash
cd apps/web
npm run verify
```

