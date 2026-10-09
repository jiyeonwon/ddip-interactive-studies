# INTERACTIVE STUDIES

네 개의 인터랙티브 디자인 실습을 독립 iframe으로 보여주는 정적 웹사이트입니다.

| 탭 | 경로 | 기능 |
| --- | --- | --- |
| SYMBOL | `projects/symbol/` | 원본 기호 순환 버튼 |
| CLOCK | `projects/clock/` | 이미지 원판과 실시간 아날로그 시계 |
| HALFTONE | `projects/halftone/` | 블루 DOT / ASCII 카메라, 크기 조절 |
| EMOJI CAM | `projects/emoji/` | MediaPipe 얼굴 추적, ⭐️ 🎱 💵 👑 |

## 실행

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

http://127.0.0.1:8765 에 접속합니다. 카메라는 localhost 또는 HTTPS에서 허용해야 합니다. HALFTONE은 START CAMERA 버튼으로 시작하며 EMOJI CAM은 모델 로딩 후 시작합니다. p5.js와 MediaPipe 및 모델은 원본에서 사용하던 외부 CDN에서 로드하므로 인터넷 연결이 필요합니다.

## 통합 방식

- 원본 프로젝트 폴더는 수정하지 않고 파일을 복사했습니다.
- 기본 탭은 SYMBOL이며, 탭 이동 시 메인 페이지는 새로고침하지 않습니다.
- 탭 전환 시 기존 iframe의 카메라 트랙을 종료하고 iframe을 제거합니다. 재진입은 새 iframe으로 실행합니다.
- 권한 요청이 진행 중일 때 탭을 닫아도 뒤늦게 반환된 스트림을 종료합니다.
- 각 프로젝트의 CSS, p5.js 버전, 전역 변수는 독립 문서에 격리됩니다.
- 시계 이미지 파일명을 NFC 형식으로 맞추고 누락된 CSS 및 viewport 연결을 추가했습니다. 원본 지름 391px는 유지하고 작은 화면에서만 축소합니다.
- 하프캠의 컨테이너 폭만 작은 화면에 대응하도록 제한했습니다.
- 이모지캠의 귀를 제거하고 왕관 오프셋을 눈 사이 거리의 0.55배로 적용했습니다.
- 카메라 영상은 브라우저에서 처리하며 서버 업로드 코드는 없습니다.

## 검증

```sh
node --test tests/camera-lifecycle.test.cjs
```

실제 카메라/얼굴 추적은 카메라 권한과 장치가 필요합니다. 자동 테스트는 스트림 종료·권한 거부·재진입 로직을 검증하며 실제 얼굴 인식 정확도를 검증하지 않습니다.

## GitHub Pages

저장소 Settings → Pages에서 `Deploy from a branch`, `main`, `/ (root)`를 선택합니다. 모든 프로젝트 경로는 상대 경로이며 `.nojekyll`을 포함합니다.
