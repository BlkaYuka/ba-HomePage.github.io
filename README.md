# 블루아카이브 페스타 부스 사이트

부스 소개/일정/미디어(영상·이미지)와 간단한 미니게임을 포함한 정적 사이트 템플릿입니다. GitHub Pages로 바로 배포할 수 있습니다.

## 사용 방법

1) 텍스트/일정/연락처 수정
- `ba-festa-booth-site/index.html`에서 문구를 원하는 내용으로 바꾸세요.
- 카운트다운 날짜: `ba-festa-booth-site/script.js:24`의 날짜를 실제 행사 시간으로 수정하세요. 예) `2025-10-12T10:00:00+09:00`.

2) 이미지/영상 교체
- 이미지: `ba-festa-booth-site/assets/` 폴더에 이미지를 넣고, `index.html`의 경로(`./assets/sample.jpg`)를 파일명으로 바꾸세요.
- 로컬 mp4: `./assets/promo.mp4`를 교체하거나 파일명을 수정하세요.
- YouTube: `index.html: 미디어 섹션`의 `iframe src`를 원하는 영상 주소로 변경하세요.

3) 미니게임
- `ba-festa-booth-site/game.html`, `ba-festa-booth-site/game.js`가 포함되어 있습니다.
- 난이도/시간: `game.js` 상단의 `timeLeft = 30`을 수정하면 제한시간 변경이 가능합니다.

## GitHub Pages 배포

방법 A: main 브랜치 루트에서 제공
- 새 GitHub 저장소를 만들고 이 폴더(`ba-festa-booth-site`)의 내용을 저장소 루트에 두세요.
- 커밋/푸시 후, GitHub 저장소 > Settings > Pages:
  - Source: `Deploy from a branch`
  - Branch: `main` / `/ (root)` 선택
  - 저장하면 `https://<사용자>.github.io/<저장소>/` 주소로 배포됩니다.

방법 B: `docs` 폴더로 제공
- 저장소 루트에 `docs/` 폴더를 만들고, 이 폴더의 파일들을 `docs/`로 이동합니다.
- Pages 설정에서 Branch를 `main`, 폴더를 `/docs`로 지정합니다.

로컬 미리보기(선택):
- 간단히 파일을 더블클릭해 브라우저로 열어도 됩니다.
- 또는 Python 간이 서버 사용: 터미널에서 다음 실행
  - `cd ba-festa-booth-site`
  - `python3 -m http.server 5173` 후 `http://localhost:5173` 접속

## 파일 구조

- `index.html`: 메인 페이지 (부스소개/일정/미디어/안내)
- `styles.css`: 전체 스타일
- `script.js`: 카운트다운/링크복사 등 스크립트
- `games.html`: 게임 선택 허브(3종)
- `game.html`: Unity WebGL 페이지(설정되면 자동 로드)
- `game-canvas.html`: HTML5 캔버스 예시 게임
- `game-embed2.html`, `game-embed3.html`: 각 `games/game2/`, `games/game3/`를 iframe으로 임베드
- `game.js`: 캔버스 예시 게임 로직
- `play.html`: 쿼리 파라미터로 경로를 받아 임베드(예: `play.html?src=./games/my/index.html&title=My%20Game`)
- `assets/`: 이미지/영상 등 정적 파일 보관용
- `unity/`: Unity WebGL 빌드 보관 폴더 (자세한 사용법 아래)
  - `unity/config.json`: 로더가 참조하는 파일명 매핑
  - `unity/Build/`: Unity가 생성한 빌드 파일 위치
  - `unity/StreamingAssets/`: 스트리밍 에셋 폴더
 - `games/`: 비-Unity HTML5 게임 폴더들
  - `games/game2/`, `games/game3/`에 각 게임 배포 파일을 넣고 `index.html` 진입점으로 설정
  - `games/config.json`: 게임 목록 구성 파일

## 라이선스/유의사항

- 코드: Apache License 2.0. 자세한 내용은 `LICENSE` 참조.
- 에셋(이미지·일러스트·오디오 등): 기본적으로 `assets/` 이하 파일은 CC BY-NC 4.0(출처표시, 비상업) 적용. `assets/LICENSE` 참조.
- 서드파티 자료: 외부에서 가져온 폰트/게임/이미지 등은 각 라이선스를 반드시 유지하세요(폴더 내 `LICENSE` 또는 출처 표기).
- 팬콘텐츠 고지: 본 템플릿은 팬메이드 예시이며, 캐릭터/상표 등 원 IP 권리는 각 권리자에게 귀속됩니다. 요청 시 삭제에 협조합니다.
- YouTube/폰트 등 외부 서비스 사용 시 해당 서비스 정책을 따르세요.

## Unity WebGL 빌드 올리기

1) Unity 설정
- `File > Build Settings > WebGL` 플랫폼으로 전환
- `Player Settings`:
  - Resolution: 캔버스 크기는 반응형으로 페이지에서 조절합니다(기본 960x540)
  - Publishing Settings:
    - Compression Format: `Brotli` 권장
    - Decompression Fallback: `체크` (GitHub Pages 같은 정적 호스팅에서 필요)
    - Name Files As Hashes: 자유(사용 시 파일명이 달라지므로 아래 config.json에 반영)

2) 빌드/복사
- Unity가 생성한 빌드 폴더(예: `Build`, `StreamingAssets`)를 통째로 `ba-festa-booth-site/unity/`에 복사합니다.
  - 결과 예: `ba-festa-booth-site/unity/Build/Build.loader.js`, `Build.data.unityweb`, `Build.framework.js.unityweb`, `Build.wasm.unityweb` 등

3) 경로 매핑
- `ba-festa-booth-site/unity/config.json`에 실제 파일명을 반영합니다.
  - 예) `Build.loader.js` → 해시 사용 시 `123abc.loader.js`로 변경
  - `.unityweb` 확장자를 사용하는 경우에도 경로 그대로 적으면 됩니다. (로더가 복호화 처리)

4) 동작 원리
- `game.html`은 `unity/config.json`을 읽어 로더 스크립트를 동적으로 삽입하고, 성공 시 Unity WebGL을 실행합니다.
- `config.json`이 없거나 로딩 실패 시 자동으로 예시 캔버스 게임(`game.js`)을 표시합니다.

5) 주의 사항
- GitHub Pages는 서버 압축 헤더 설정이 불가하므로 `Decompression Fallback`을 반드시 켜세요.
- iOS Safari는 WebGL/메모리 제한이 있을 수 있습니다. `WebGL Memory Size`를 과도하게 높이지 마세요.
- 크로스오리진 문제를 피하려면 동일 저장소 내 상대경로를 유지하세요(서브도메인 교차참조 지양).

## 비-Unity(HTML5) 게임 2종 올리기

1) 배포 파일 복사
- 각 게임의 정적 배포 파일(HTML/CSS/JS/에셋)을 아래 폴더에 복사합니다.
  - 두 번째 게임: `ba-festa-booth-site/games/game2/`
  - 세 번째 게임: `ba-festa-booth-site/games/game3/`

2) 진입점 파일명
- 각 폴더의 시작 파일명을 `index.html`로 두면 그대로 동작합니다.
- 다른 파일명을 쓰고 싶다면 `game-embed2.html` 또는 `game-embed3.html`의 iframe `src`를 수정하세요.

3) 보안/정책
- 일부 프레임워크 빌드는 `X-Frame-Options` 없이 정적 제공이 필요합니다. 외부 CDN에서 임베드하면 차단될 수 있으니 로컬 폴더에 함께 올리세요.

## 일반 HTML5 게임 쉽게 추가하기

1) 게임 폴더 넣기
- 배포된 정적 파일을 `ba-festa-booth-site/games/<폴더명>/`에 복사하고 진입점을 `index.html`로 둡니다.
- 예: `games/shooter/index.html`

2) 목록에 추가 (`games/config.json`)
- 아래 형식으로 항목을 하나 추가합니다.
```json
{
  "title": "Shooter",
  "desc": "웹용 HTML5 게임",
  "cover": "./assets/sample.jpg",
  "src": "./games/shooter/index.html"
}
```
- 저장 후 `games.html`을 열면 자동으로 카드가 생성됩니다.

3) 바로 실행(테스트용)
- 별도 목록에 넣지 않아도 `play.html`로 경로만 넘기면 됩니다:
- 예: `play.html?src=./games/shooter/index.html&title=Shooter`

주의사항
- `src`는 동일 저장소 내 상대경로만 허용합니다(보안/임베드 정책 상 외부 URL 불가).
- 프레임워크 빌드(예: Phaser, Construct, Godot HTML5 등)는 자체 정책에 따라 키입력/사운드 트리거가 제한될 수 있습니다.
