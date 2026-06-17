# 16. Resume + Portfolio 보강 플랜

## 목표

Resume 진입점을 구현하면서 누락된 Portfolio 앱 콘텐츠도 함께 보강합니다.

- Resume은 문서 스타일로 제공합니다.
- Portfolio는 Terminal 스타일로 제공합니다.
- Portfolio UI 콘셉트와 콘텐츠 구조는 `LeeEugene1/portfolio-sample` 저장소의 `main` 브랜치를 참고합니다.

## 작업

- Portfolio 앱을 샘플 저장소의 Terminal UI 콘셉트 기반으로 보강.
  - 터미널 프레임, 탭/파트 탐색, 프로젝트별 상세 콘텐츠를 `portfolio-os` 구조에 맞게 이식.
  - 샘플의 Tailwind 구조를 그대로 복사하지 않고 현재 웹앱의 CSS/컴포넌트 패턴에 맞춰 재구성.
- Resume 앱을 문서 스타일 진입점으로 구현.
  - HTML 문서형 이력서 뷰와 PDF 보기/다운로드 링크 제공.
  - PDF는 정적 asset으로 제공.
- Portfolio와 Resume 창의 기본 크기와 반응형 표시 조정.
- 바탕화면 아이콘에서 Portfolio와 Resume을 열 수 있는 동작 검증.
- 선택한 Resume 방식과 Portfolio 콘텐츠 표시를 테스트에 반영.

## 완료 기준

- 첫 로드 시 Portfolio 창이 자동으로 열립니다.
- Portfolio 창이 Terminal 스타일로 보이고 대표 작업, 역할, 기술, 문제 해결 방식, 결과를 확인할 수 있습니다.
- Resume 진입점이 보입니다.
- 바탕화면에서 Resume을 열 수 있고 PDF 또는 문서 링크에 접근할 수 있습니다.
- 동작이 반응형과 WebView 환경에 적합합니다.
- 관련 컴포넌트 테스트가 추가 또는 갱신됩니다.

## 검증

```bash
cd apps/web
npm run verify
```

필요 시 전체 브라우저 흐름은 후속 E2E 단계에서 추가로 확인합니다.

## README 반영

사용자 실행 방식, 검증 명령, 배포 절차, 로컬 하네스 절차는 변경하지 않으므로 README는 수정하지 않습니다.
