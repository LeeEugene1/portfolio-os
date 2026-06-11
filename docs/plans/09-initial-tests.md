# 09. 초기 테스트 플랜

## 목표

기능 구현 전에 테스트 하네스가 실제로 동작하는지 smoke test로 확인합니다.

## 작업

- Vitest smoke test 1개 추가.
- Playwright home render test 1개 추가.
- 테스트가 환경에 따라 흔들리지 않도록 구성.

## 완료 기준

- Unit smoke test가 통과합니다.
- E2E smoke test가 통과합니다.
- CI에서 같은 명령어를 실행할 수 있습니다.

## 검증

```bash
cd apps/web
npm run test
npm run test:e2e
```

