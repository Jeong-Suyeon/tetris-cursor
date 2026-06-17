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

   - **방법 A:** `index.html` 더블클릭
   - **방법 B:** 주소창에 파일 경로 입력

     ```
     file:///C:/DEV/tetris-cursor/index.html
     ```

3. 10×20 보드, 점수, 버튼, 조작법 안내가 보이면 성공이다.

> 별도 설치·빌드 과정이 필요하지 않다.

### GitHub Pages에서 실행

배포 후 아래 주소 형식으로 접속한다.

```
https://<GitHub-사용자명>.github.io/<저장소-이름>/
```

예시 (저장소 이름이 `tetris-cursor`인 경우):

```
https://jeong-suyeon.github.io/tetris-cursor/
```

## 조작법

게임이 진행 중일 때 키보드를 사용한다.

| 키 | 동작 |
|----|------|
| `←` (ArrowLeft) | 왼쪽 이동 |
| `→` (ArrowRight) | 오른쪽 이동 |
| `↓` (ArrowDown) | 한 칸 빠르게 내리기 (막히면 고정) |
| `↑` (ArrowUp) | 시계 방향 90° 회전 |
| `Space` | 즉시 낙하 (hard drop) |

- 모든 조작은 충돌 판정(`canMove`)을 통과할 때만 적용된다.
- 회전 후 벽이나 고정 블록과 충돌하면 회전은 취소된다.
- 게임 오버 후에는 키 입력이 무시된다.

### 버튼

| 버튼 | 동작 |
|------|------|
| **시작** | 보드·점수·상태를 초기화하고 게임을 시작한다 |
| **재시작** | 시작 버튼과 동일하게 전체를 초기화한다 |

## 구현 기능

- [x] 10×20 게임 보드 (CSS Grid)
- [x] 7종 테트로미노 생성 및 렌더링
- [x] 자동 낙하 (800ms 간격)
- [x] 충돌 판정 및 블록 고정
- [x] 키보드 조작 (이동, 회전, soft drop, hard drop)
- [x] 가득 찬 줄 삭제 및 위 블록 하강
- [x] 줄 삭제 점수 계산
- [x] 게임 오버 처리 및 오버레이 UI
- [x] 시작 / 재시작

## 점수 규칙

한 번에 삭제한 줄 수에 따라 점수가 더해진다.

| 삭제 줄 수 | 점수 |
|-----------|------|
| 1줄 | 100 |
| 2줄 | 300 |
| 3줄 | 500 |
| 4줄 | 800 |

## 품질 점검 방법

### 1. 파일 연결 확인

브라우저 개발자 도구(F12) → **Network** 탭에서 새로고침 후 다음이 `200`으로 로드되는지 확인한다.

- `index.html`
- `style.css`
- `script.js`

### 2. 콘솔 에러 확인

F12 → **Console** 탭에서 페이지 로드·플레이·재시작 시 빨간 에러가 없는지 확인한다.

### 3. 기능 스모크 테스트

| # | 확인 항목 | 기대 결과 |
|---|-----------|-----------|
| 1 | 페이지 로드 | 게임 오버 화면 없이 블록 낙하 시작 |
| 2 | `←` `→` | 벽 전까지 좌우 이동 |
| 3 | `↑` | 회전 (충돌 시 취소) |
| 4 | `↓` / `Space` | soft drop / hard drop |
| 5 | 줄 가득 채우기 | 줄 삭제 및 점수 증가 |
| 6 | 보드 상단까지 쌓기 | 게임 오버 표시 |
| 7 | **재시작** | 보드·점수·오버레이 초기화 |

### 4. GitHub Pages 배포 후 확인

- 배포 URL에서 게임이 로드되는지 확인
- `style.css`, `script.js`가 404가 아닌지 Network 탭에서 확인
- 모바일이 아닌 **데스크톱 브라우저 + 키보드** 환경에서 조작 테스트

## GitHub Pages 배포 방법

### 사전 준비

1. GitHub에 저장소를 생성한다.
2. 아래 **배포 대상 파일**만 커밋·푸시한다. (`.cursor/` 등은 제외)
3. 저장소 루트에 `index.html`이 있어야 한다.

### 배포 설정 (GitHub UI)

1. GitHub 저장소 → **Settings** → **Pages**
2. **Source**: `Deploy from a branch`
3. **Branch**: `main` (또는 `master`) / **`/ (root)`**
4. **Save** 클릭
5. 1~2분 후 표시되는 URL로 접속해 확인

### 배포 전 명령어 예시

```bash
git init
git add index.html style.css script.js README.md .gitignore
git commit -m "Prepare Tetris game for GitHub Pages"
git branch -M main
git remote add origin https://github.com/Jeong-Suyeon/tetris-cursor.git
git push -u origin main
```

### 배포 후 URL

```
https://jeong-suyeon.github.io/tetris-cursor/
```

## 파일 구성

| 파일 | 설명 |
|------|------|
| `index.html` | 게임 화면 구조 |
| `style.css` | 레이아웃 및 스타일 |
| `script.js` | 게임 로직 |
| `README.md` | 프로젝트 문서 |

## 게임 오버

새 블록을 스폰 위치에 둘 수 없으면 게임 오버가 된다.  
자동 낙하와 키보드 조작이 중지되며, **시작** 또는 **재시작** 버튼으로 다시 플레이할 수 있다.
