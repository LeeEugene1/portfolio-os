# 03. 아키텍처 작성 플랜

## 목표

웹앱과 Flutter WebView 셸의 기술 구조를 정의합니다.

## 작업

- 모노레포 구조 문서화.
- `apps/web`과 `apps/mobile-shell`의 책임 정의.
- MVP 데이터 전략 정의.
- 배포 흐름 정의.
- 테스트와 CI 책임 정의.

## 완료 기준

- `docs/ARCHITECTURE.md`가 앱 경계를 설명합니다.
- 웹이 반응형 UI를 담당합니다.
- Flutter는 WebView 패키징만 담당합니다.
- Vercel root가 `apps/web`으로 문서화됩니다.

## 검증

```bash
cat docs/ARCHITECTURE.md
```

