# 테스트 계획

## 전략

기능 구현 전에 작지만 엄격한 테스트 하네스를 먼저 구성합니다. 웹앱이 제품의 본체이고 Flutter 앱은 WebView 셸이므로, 제품 동작 검증은 `apps/web`을 중심으로 수행하고 모바일 셸은 웹앱 로드, 네이티브 래핑, Android 동작을 검증합니다.

이 문서는 테스트 범위와 검증 명령의 기준 문서입니다. 실행 phase와 PR 순서는 `docs/ORCHESTRATION.md`, 에이전트 승인/브랜치/PR 규칙은 `docs/AGENT_WORKFLOW.md`를 따릅니다.

테스트는 다음 우선순위로 설계합니다.

1. 순수 상태와 계산 로직은 Unit 테스트로 빠르게 검증합니다.
2. OS 데스크톱, 앱 아이콘, 창 시스템처럼 사용자가 직접 조작하는 UI는 Component 테스트로 검증합니다.
3. 핵심 사용자 흐름, 브라우저별 동작, 반응형 레이아웃은 Playwright E2E로 검증합니다.
4. Flutter 셸은 정적 분석, Flutter 테스트, APK 빌드, WebView 수동 확인으로 검증합니다.

## 웹 Unit 테스트

Unit 테스트는 브라우저 렌더링보다 상태 전이와 계산 정확성이 중요한 대상을 다룹니다.

대상:

- 창 상태 액션:
  - 앱 창 열기.
  - 이미 열린 앱을 다시 실행할 때 기존 창 앞으로 가져오기.
  - 창 닫기.
  - 포커스된 창 변경.
  - Portfolio 창의 초기 자동 오픈 상태.
- 장바구니 상태:
  - 상품 추가.
  - 상품 삭제.
  - 수량 증가와 감소.
  - 수량이 0 이하가 되지 않는 방어 동작.
  - 장바구니 총 수량과 총액 계산.
  - `localStorage` 저장값 복원.
- 계산기 로직:
  - 덧셈, 뺄셈, 곱셈, 나눗셈.
  - 연속 입력과 연산자 변경.
  - 초기화.
  - 0 나누기 또는 잘못된 입력의 표시 정책.
- 정적 데이터:
  - Store 상품 데이터에 필수 필드가 있는지.
  - Portfolio 프로젝트 데이터에 표시용 필드가 있는지.
  - 앱 정의에 아이콘, 라벨, 창 제목, 기본 크기가 있는지.

## 웹 Component 테스트

Component 테스트는 React Testing Library 기준으로 사용자 관점의 렌더링과 조작을 검증합니다.

대상:

- OS 데스크톱:
  - Portfolio, Store, Resume, Contact, Calculator 아이콘 렌더링.
  - 아이콘 라벨과 접근 가능한 이름 제공.
  - 첫 로드 시 Portfolio 창 자동 표시.
- 창 시스템:
  - 앱 아이콘 클릭 또는 탭으로 창 열기.
  - 창 닫기 버튼으로 창 닫기.
  - 여러 창을 열었을 때 포커스된 창이 앞으로 오는지.
  - 창 제목과 앱 콘텐츠가 올바르게 연결되는지.
- Portfolio 앱:
  - 대표 작업, 역할, 기술, 문제 해결 방식, 결과 표시.
- Store 앱:
  - 상품 목록 렌더링.
  - 장바구니 추가 버튼 동작.
  - 장바구니 수량과 합계 표시.
  - 새로고침 복원은 E2E에서 최종 확인하고, Component 테스트에서는 저장소 mock으로 상태 반영을 확인.
- Resume 앱:
  - 이력서 또는 문서 진입 링크 렌더링.
  - WebView에서도 사용할 수 있는 링크 속성 제공.
- Contact 앱:
  - 이메일과 외부 프로필 링크 렌더링.
  - 메일 링크가 명확한 `mailto:` 진입점을 제공.
- Calculator 앱:
  - 숫자와 연산자 버튼 렌더링.
  - 기본 사칙연산 결과 표시.
  - 초기화 버튼 동작.

## 웹 E2E 테스트

Playwright E2E는 실제 브라우저에서 MVP 핵심 흐름을 검증합니다.

핵심 흐름:

1. 홈 화면이 OS 데스크톱으로 렌더링된다.
2. 첫 로드 시 Portfolio 창이 자동으로 열린다.
3. Store 아이콘을 클릭하거나 탭하면 Store 창이 열린다.
4. 상품을 장바구니에 추가하면 수량과 합계가 갱신된다.
5. 새로고침 후에도 `localStorage` 기반 장바구니가 유지된다.
6. Calculator 아이콘을 열고 기본 사칙연산을 수행한다.
7. Resume 아이콘을 열고 이력서 진입 링크를 확인한다.
8. Contact 아이콘을 열고 이메일과 외부 프로필 링크를 확인한다.
9. 여러 창을 연 뒤 다른 창을 선택하면 포커스가 변경된다.
10. 창 닫기 후 해당 앱 콘텐츠가 화면에서 사라진다.

E2E에서 확인할 품질 기준:

- 주요 버튼과 링크는 키보드 또는 터치에 가까운 입력으로 조작 가능해야 합니다.
- 앱 아이콘, 창 헤더, 닫기 버튼, 장바구니 컨트롤은 안정적인 selector 또는 accessible name으로 찾을 수 있어야 합니다.
- 테스트는 실제 결제, 백엔드 API, 인증 흐름을 기대하지 않습니다.

## 반응형 테스트

Playwright viewport 기준으로 PC 브라우저, 모바일 브라우저, WebView에 가까운 모바일 화면을 검증합니다.

권장 viewport:

- Desktop: `1440x900`.
- Tablet 또는 narrow desktop: `1024x768`.
- Mobile: `390x844`.
- Small mobile: `360x740`.
- WebView 근사값: `393x873`.

검증 항목:

- 앱 아이콘이 화면 밖으로 밀리거나 겹치지 않는다.
- 창 헤더, 제목, 닫기 버튼이 서로 겹치지 않는다.
- 모바일에서는 창이 전체 화면 또는 작은 화면에 맞는 단순화 레이아웃으로 표시된다.
- 텍스트, 아이콘, 버튼이 가로 스크롤을 만들지 않는다.
- Store 상품 목록과 장바구니 UI가 작은 화면에서 읽히고 조작된다.
- Calculator 버튼 그리드가 작은 화면에서 잘리지 않는다.
- Resume, Contact 링크가 터치 가능한 크기와 간격을 가진다.
- Flutter WebView에 가까운 viewport에서도 첫 화면과 핵심 앱 진입이 가능하다.

## 모바일 셸 테스트

Flutter 앱은 제품 UI를 중복 구현하지 않고 Vercel production URL을 로드하는 WebView 셸로 검증합니다.

자동 검증:

- `flutter analyze` 통과.
- `flutter test` 통과.
- `flutter build apk` 성공.

수동 또는 에뮬레이터 검증:

- 앱 실행 시 WebView가 Vercel production URL을 로드한다.
- 웹앱 로딩 중 로딩 상태가 표시된다.
- 네트워크 오류 또는 로드 실패 시 에러 상태가 표시된다.
- Android back button이 WebView history 뒤로 가기 또는 앱 종료 정책에 맞게 동작한다.
- Portfolio 기본 오픈, Store 장바구니, Calculator, Resume, Contact 흐름을 WebView 안에서 사용할 수 있다.
- Contact의 이메일 링크와 외부 프로필 링크가 WebView 정책에 막히지 않는다.

모바일 셸에서 검증하지 않는 것:

- 장바구니 상태 관리 재구현.
- 계산기 로직 재구현.
- 반응형 레이아웃의 별도 Flutter 구현.
- 백엔드 API 또는 인증.

## 검증 명령어

웹:

```bash
cd apps/web
npm run verify
npm run verify:full
```

`npm run verify`는 빠른 개발 검증 명령입니다. lint, typecheck, Unit 테스트, Component 테스트처럼 PR 전 기본 품질을 확인하는 항목을 포함해야 합니다.

`npm run verify:full`은 전체 웹 검증 명령입니다. `npm run verify`에 더해 Playwright E2E와 반응형 viewport 검증을 포함해야 합니다.

모바일:

```bash
cd apps/mobile-shell
flutter analyze
flutter test
flutter build apk
```

전체 릴리스 전에는 웹과 모바일 셸 검증을 모두 실행합니다.

```bash
cd apps/web
npm run verify:full

cd ../mobile-shell
flutter analyze
flutter test
flutter build apk
```
