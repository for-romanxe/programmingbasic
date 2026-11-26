# 경슐랭 학생식당 프론트엔드

제공된 화면 시안을 React·TypeScript·CSS로 구현한 프론트엔드다. 음식 사진과 공식 로고만 이미지이며, 화면 구성·글자·버튼·입력·QR은 코드로 구현했다. 좌석 예약은 포함하지 않는다.

## 실행

```sh
npm ci
npm run dev
```

Chrome에서 http://127.0.0.1:5173/menu 를 연다. 터미널에서 Control+C로 종료한다.

기본값은 브라우저 시연 모드다. `.env.local`이 있으면 그 설정이 우선한다. `.env.example`을 참고해 `VITE_DATA_SOURCE=demo`로 설정하면 외부 서버 없이 실행된다. 모드를 바꾸면 개발 서버를 다시 실행한다.

## Flask 서버 연결

별도 `cafeteria-backend` 프로젝트를 실행하고 `.env.local`에 아래 한 줄을 저장한다.

```ini
VITE_DATA_SOURCE=server
```

Vite가 `/api`와 `/ping` 요청을 `http://127.0.0.1:5001`로 전달한다. 서버 실행·DB 초기화·메뉴 및 시간대 입력·입금 안내 설정은 백엔드 README를 따른다. 현재 GitHub 업로드 범위에는 백엔드 소스와 DB를 포함하지 않는다.

| API                      | 요청·응답                                                  |
| ------------------------ | ---------------------------------------------------------- |
| `GET /api/menus`         | `Option<SectionModel[]>`                                   |
| `GET /api/reservations`  | `Option<ReservationListModel>`                             |
| `POST /api/orders`       | `OrderMakingSendModel` → `Option<OrderMakingReceiveModel>` |
| `POST /api/orders/check` | `OrderCheckSendModel` → `Option<OrderCheckReceiveModel>`   |

실제 서버 연결과 실결제 연결은 별개다. 실제 은행·비트코인 입금 확인 서비스는 연결하지 않았다. 검증에는 별도 임시 SQLite DB와 시연용 입금 정보를 사용했다. 화면의 시연 안내와 가짜 계좌·주소로 실제 송금을 하지 않는다.

## 구현 범위

- 만권화밥·숑숑돈까스·위델가 메뉴 탭, 메뉴 담기
- 장바구니 수량 변경·삭제, 총수량·총금액
- 방문 시간대 잔여 건수, 마감 선택 제한, 빈 시간대 안내
- 무통장입금·비트코인 주문 요청 및 서버 발급 니모닉 저장
- `m1`, `m2`, `m3`, `m4`, `exp` 키 형식·누락·범위·만료 검증
- 조회 실패 시 저장 정보 삭제 및 수동 조회, 주문 실패 시 오류와 함께 홈 이동
- 결제 대기·성공·실패 표시 및 서버 상태 재조회
- 서버의 BTC 주소·문자열 금액으로 QR 생성, 계좌·주소·니모닉 복사
- 계획서의 기본 버튼·링크·이미지·모서리 변형, 레이아웃·카드·섹션·컨테이너
- React Compiler 빌드 적용, 모바일 대응

홈 화면의 무작위 명언은 사용자의 후보 승인 후 구현한다. 명언 데이터와 무작위 표시 기능은 아직 포함하지 않는다. `lang/ko.ts`는 현재 한국어 공통 문구를 관리하며, 다른 언어 전환 기능은 구현하지 않는다.

## 저장과 시연 데이터

자동 조회 정보는 브라우저에 1시간 저장한다. 만료는 주문 자체를 삭제하지 않으며, 니모닉을 직접 입력하면 다시 조회할 수 있다. 장바구니는 새로고침하면 초기화된다.

브라우저 시연 모드의 주문은 `kgu-demo-orders-v2`에 저장된다. 다른 브라우저와 공유되지 않는다. 메뉴·가격·매장별 배정·환산 기준은 예시이고, 방문 시간은 실행 시점의 다음 날 기준이다. QR은 실제 인코딩된 QR이며 시연 모드의 주소는 의도적으로 송금 불가능한 문자열을 사용한다.

서버 모드의 주문은 서버 DB에 저장한다. 주문 금액 계산·니모닉 발급·중복 확인·동시 요청 및 트랜잭션은 백엔드가 담당한다. 프론트엔드는 서버 응답을 표시한다.

## 파일 구성

| 위치              | 역할                                           |
| ----------------- | ---------------------------------------------- |
| `src/elements/`   | 기본 버튼·링크·이미지와 모서리 변형            |
| `src/components/` | 카드·로고·레이아웃·섹션·오류·팝업              |
| `src/containers/` | 공통 화면 틀과 단계 이동 내비게이션            |
| `src/pages/`      | 홈·메뉴·장바구니·방문 시간·결제·조회·없는 주소 |
| `src/api/`        | HTTP 클라이언트와 시연 API                     |
| `src/util/`       | 계획서 자료형, 조회 정보 저장, QR URI          |
| `src/lang/`       | 한국어 공통 문구                               |
| `src/store/`      | Zustand 전역 선택 상태                         |
| `tests/`          | 저장 정보·결제·HTTP 계약 회귀 테스트           |

## 검증

```sh
npm test
npm run build
```

20개 회귀 테스트로 조회 정보 누락·손상·만료·저장 실패 복구, BTC 문자열 보존, 결제 상태, API 오류와 JSON 계약을 확인한다. Chrome에서도 메뉴 선택 → 시간 선택 → 주문 접수 → 조회·QR 표시를 실제 Flask·임시 SQLite DB로 확인했다. 서버 내부 상태 갱신 후 성공·실패 표시와 주문 직전 마감 오류 후 홈 이동도 확인했다.

React Compiler는 Vite 8 및 `@vitejs/plugin-react` 6의 `reactCompilerPreset`과 `@rolldown/plugin-babel`로 명시적으로 활성화한다. [React 공식 설정 안내](https://react.dev/learn/react-compiler/installation)를 참고했다.

로고는 [경기대학교 공식 UI 안내](https://www.kyonggi.ac.kr/www/contents.do?key=5093)의 [SVG 원본](https://www.kyonggi.ac.kr/site/www/images/contents/key5093_img01_.svg)을 사용했다. 원본 색상과 비율을 유지한다.
