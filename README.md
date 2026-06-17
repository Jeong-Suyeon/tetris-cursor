# 테트리스 (교육용)

HTML, CSS, JavaScript만 사용하는 브라우저 테트리스 게임입니다.  
빌드 도구와 외부 라이브러리 없이 동작하며, 프론트엔드 입문 학습용으로 제작되었습니다.

## 프로젝트 소개

| 항목 | 내용 |
|------|------|
| 보드 크기 | 10열 × 20행 |
| 블록 종류 | I, O, T, S, Z, J, L (7종) |
| 기술 스택 | HTML, CSS, JavaScript (Vanilla) |
| 빌드 | 없음 — 정적 파일만으로 실행 |

플레이어는 떨어지는 블록을 이동·회전해 가로 줄을 채우고, 줄이 삭제되면 점수를 얻습니다.  
블록을 더 이상 스폰할 수 없으면 게임 오버가 됩니다.

## 실행 방법

### 로컬에서 실행

1. 저장소를 클론하거나 프로젝트 폴더를 연다.
2. `index.html`을 브라우저에서 연다.

3. 10×20 보드, 점수, 버튼, 조작법 안내가 보이면 성공이다.

### GitHub Pages에서 실행

```
https://jeong-suyeon.github.io/tetris-cursor/
```

## 조작법

| 키 | 동작 |
|----|------|
| `←` (ArrowLeft) | 왼쪽 이동 |
| `→` (ArrowRight) | 오른쪽 이동 |
| `↓` (ArrowDown) | 한 칸 빠르게 내리기 |
| `↑` (ArrowUp) | 회전 |
| `Space` | 즉시 낙하 |

## 구현 기능

- 10×20 게임 보드, 7종 테트로미노
- 자동 낙하, 충돌 판정, 블록 고정
- 키보드 조작, 라인 삭제, 점수, 게임 오버

## GitHub Pages 배포

Settings → Pages → Branch: `main` / `/ (root)` → Save

배포 URL: https://jeong-suyeon.github.io/tetris-cursor/
