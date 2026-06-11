# 18. 반응형 UI 플랜

## 목표

PC, 모바일 브라우저, Flutter WebView 기준으로 반응형 동작을 정리합니다.

## 작업

- PC 레이아웃 정의.
- 모바일 레이아웃 정의.
- 창이 모바일 viewport에 맞도록 조정.
- 터치 타깃 크기 확인.
- 가로 overflow 제거.

## 완료 기준

- PC 레이아웃은 OS 바탕화면 느낌을 유지합니다.
- 모바일 레이아웃은 WebView 안에서 사용 가능합니다.
- 주요 viewport에서 UI 요소가 비정상적으로 겹치지 않습니다.

## 검증

```bash
cd apps/web
npm run verify:full
```

