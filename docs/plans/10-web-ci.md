# 10. Web CI 플랜

## 목표

웹 검증용 GitHub Actions를 추가합니다.

## 작업

- `.github/workflows/web-ci.yml` 생성.
- working directory를 `apps/web`으로 설정.
- 의존성 설치.
- `npm run verify` 실행.
- 필요하면 Playwright 설치 후 E2E 실행.

## 완료 기준

- Web CI가 pull request에서 실행됩니다.
- Web CI가 `main` push에서 실행됩니다.
- build 또는 test 실패 시 CI가 실패합니다.

## 검증

```bash
gh workflow list
```

