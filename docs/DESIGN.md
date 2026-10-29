# 꽁냥 디자인 시스템 (DESIGN.md)

원본: Claude Design 「커플 앱 UI 설계」 → DESIGN 페이지 (토큰 · 기본 컴포넌트 · 지도 핀·카드·캘린더).
v1~v4 모든 화면은 이 토큰과 컴포넌트만 쓴다. 기준 화면 390×844, 단위 pt = dp.
코드 토큰: [`app/src/theme/tokens.ts`](../app/src/theme/tokens.ts)

## 1. 원칙

1. 지도와 달력이 주인공 — 장식은 빈 상태·온보딩·기념일에서만
2. 둘이 같은 공간 — 작성자 표시 없음
3. 따뜻하지만 유치하지 않게 — 일러스트는 화면당 한 곳 이하
4. 색에만 의존하지 않는다 — 아이콘·모양으로도 구분
5. 한 손으로 쓴다 — 주요 동작은 시트 하단 고정 버튼

## 2. 컬러

| 토큰 | 라이트 | 다크 |
| --- | --- | --- |
| primary | `#CF3F57` | `#FF7A8E` |
| primary.pressed | `#B23047` | `#E8667A` |
| primary.soft | `#FDE8EB` | `#3D2027` |
| onPrimary | `#FFFFFF` | `#1A1517` |
| secondary | `#F2A65A` | `#F5B877` |
| secondary.soft | `#FFF1E2` | `#3A2B1C` |
| background | `#FFFAF7` | `#1A1517` |
| surface | `#FFFFFF` | `#241D20` |
| surface.alt | `#F7F1EE` | `#2E2629` |
| text.primary | `#2B2325` | `#F5EEF0` |
| text.secondary | `#6E6266` | `#B9ADB1` |
| text.disabled | `#B8AEB1` | `#6B6064` |
| border | `#EDE3E0` | `#3A3135` |
| border.strong | `#D9CCC8` | `#4A3F43` |
| success | `#23805A` | `#4FC48D` |
| warning | `#9A6416` | `#E8B04B` |
| danger | `#C62F3B` | `#FF6B6B` |
| overlay | `rgba(43,35,37,0.40)` | `rgba(0,0,0,0.60)` |

### 장소 카테고리 (항상 색 + 아이콘)

| 카테고리 | 색 | soft |
| --- | --- | --- |
| 음식점 | `#E8553E` | `#FDECE8` |
| 카페 | `#9B6A43` | `#F5EDE6` |
| 놀거리 | `#6C5CE7` | `#EFEDFD` |
| 숙소 | `#2D8FD6` | `#E6F2FB` |
| 기타 | `#6B7A85` | `#EEF1F3` |

사용자 추가 카테고리 (v2): `#D4A017` `#2A9D8F` `#E76F9A` `#5C7AEA` `#8D6E63` `#43A047`

### 일정 유형 (색 + 점 모양)

| 유형 | 색 | 모양 |
| --- | --- | --- |
| 데이트 | primary | ● |
| 기념일 | secondary | ◆ |
| 기타 | `#8A7F83` | ● 작게 |
| 공휴일 (v2) | danger | 날짜 숫자만 |

## 3. 타이포그래피 — Pretendard

| 토큰 | 크기/행간 | 굵기 | 자간 | 용도 |
| --- | --- | --- | --- | --- |
| display | 40/48 | Bold | -0.5 | 홈 D-day |
| title1 | 24/32 | Bold | -0.3 | 화면 제목 |
| title2 | 20/28 | SemiBold | -0.2 | 바텀시트 제목 |
| title3 | 17/24 | SemiBold | -0.2 | 카드 제목 |
| body | 16/24 | Regular | 0 | 본문 |
| bodyStrong | 16/24 | SemiBold | 0 | 버튼 라벨 |
| callout | 15/22 | Regular | 0 | 메모·보조 설명 |
| caption | 13/18 | Medium | 0 | 메타 정보 |
| micro | 11/14 | SemiBold | 0.2 | 배지·탭 라벨 |

## 4. 간격 · 모서리 · 그림자 · 아이콘

- 간격(4pt): space.1=4, 2=8, 3=12, 4=16, 5=20, 6=24, 8=32, 10=40. 화면 좌우 여백 = space.5 (20)
- 모서리: xs 6 · sm 10 · md 14 · lg 20 · xl 28 · full 999
- 그림자(라이트): sm `0 1 3 / 8%` 카드 · md `0 4 12 / 12%` 지도 위 요소 · lg `0 -4 24 / 12%` 시트·탭바. 다크는 그림자 대신 surface 밝기 차이
- 아이콘: 둥근 끝 라인, 선 1.75, 기본 24 / 리스트·칩 20 / 메타 16. 기본 text.secondary, 활성은 primary 채움

## 5. 기본 컴포넌트

상태: 기본 / 눌림(8% 어둡게) / 비활성(40%) / 선택 / 에러(danger 테두리 + caption 문구)

| 컴포넌트 | 규격 |
| --- | --- |
| 하단 탭바 | 높이 56 + 안전 영역, 비선택 라인 아이콘 / 선택 채움 + primary, 라벨 micro |
| 상단 앱바 | 높이 56, 오른쪽 아이콘 버튼 최대 2개, 스크롤 시 아래 border |
| 버튼 | 주(primary) · 보조(primary.soft) · 외곽선(border.strong, 44) · 위험(danger). 높이 52, 모서리 md(14) |
| 텍스트 버튼 / 아이콘 버튼 | 높이 44 / 44×44 |
| 입력창 | 높이 52, 모서리 sm(10), 배경 surface.alt, 포커스 primary 1.5 테두리, 에러 danger 테두리 + caption |
| 여러 줄 입력 | 최소 높이 96 |
| 검색바 | 높이 48, full 모서리, surface + shadow.md |
| 칩 | 높이 36, full 모서리, border.strong 테두리. 선택 = primary 채움, 카테고리 칩 선택 = 카테고리 색 채움 |
| 세그먼트 | 높이 36, surface.alt 바탕, 선택 칸 surface + shadow.sm |
| 토글 / 체크박스 | 51×31 / 22 |
| 바텀시트 | 위 모서리 28, 손잡이 36×4, 미리보기 30% → 펼침 85%, 지도 미리보기 단계는 딤 없음 |
| 모달 | 화면 − 40, 모서리 20 |
| 토스트 | 높이 48, text.primary 바탕, 흰 글자, 액션은 다크 primary(`#FF7A8E`) |
| 빈 상태 | 일러스트 120 · 제목 title3 · 설명 callout · 주 버튼 1개 |
| 스켈레톤 | surface.alt + shimmer 1.2초 |
