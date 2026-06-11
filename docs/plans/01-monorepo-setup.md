# 01. 모노레포 생성 플랜

## 목표

`portfolio-os` 프로젝트의 초기 저장소 구조를 만듭니다.

## 범위

폴더와 루트 문서 뼈대만 만듭니다. 이 단계에서는 Next.js나 Flutter를 생성하지 않습니다.

## 작업

- `apps/web` 생성.
- `apps/mobile-shell` 생성.
- `docs` 생성.
- `docs/plans` 생성.
- `.github/workflows` 생성.
- 루트 `README.md` 생성.
- `.gitignore` 생성.

## 완료 기준

- 예상한 최상위 구조가 존재합니다.
- 문서 파일이 존재합니다.
- 앱 폴더가 존재합니다.
- Git 저장소를 초기화하고 커밋할 수 있습니다.

## 검증

```bash
tree -L 3
git status
```

