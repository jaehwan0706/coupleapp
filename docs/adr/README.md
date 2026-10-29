# 기술 결정 (ADR)

모든 기술 선택은 세 가지 기준으로 골랐다. ① 1인이 만들고 운영할 수 있는가 ② 두 사람의 데이터가 어긋나지 않는가(실시간·권한) ③ 백엔드 취업 포트폴리오로 설명할 수 있는가.

## ADR-001. 지도·장소 데이터는 카카오로 통일

- **결정**: 지도는 카카오맵, 장소 검색은 카카오 로컬 API.
- **이유**: 네이버 지역검색 API는 최대 5개 결과, 좌표·반경 검색이 없다. 카카오 로컬은 카테고리 검색(FD6, CE7 등), 중심+반경(최대 20km)·화면 영역(rect) 검색, 15개 페이지, 거리순 정렬을 지원한다.
- **영향**: 길찾기는 카카오맵 앱으로 연결. "내 위치"는 위치기반서비스사업 신고 후 v2.
- **확인할 것**: 검색 결과 DB 저장 범위. 핀에는 사용자가 고른 장소만 저장한다.

## ADR-002. 앱은 Expo(React Native) + TypeScript

- **결정**: Expo + Expo Router + TypeScript. 서버 상태 TanStack Query, 폼 react-hook-form + zod. 카카오 로그인 등 네이티브 모듈 때문에 개발 빌드(development build) 사용.
- **이유**: 코드 하나로 iOS·Android, 맥 없이 EAS 클라우드 빌드.
- **대안**: Flutter(언어가 다름), 네이티브 2벌(1인 감당 불가).
- **재검토**: 지도 성능이 WebView로 해결되지 않으면 지도만 네이티브 모듈로.

## ADR-003. 지도는 카카오맵 JavaScript API를 WebView로

- **배경**: react-native-kakao가 2025년 3월 지도 패키지를 제거했다.
- **결정**: 지도 화면만 WebView(카카오맵 JS + 클러스터러). 앱 ↔ WebView는 postMessage. 앱 → 지도: 핀 목록, 검색 결과, 카메라 이동. 지도 → 앱: 핀 선택, 영역 변경, 길게 누름. 검색바·칩·바텀시트는 RN 네이티브 UI로 위에 올린다.
- **트레이드오프**: 핀이 아주 많을 때 성능. JS 키는 등록 도메인에서만 동작하므로 WebView baseUrl을 등록 도메인으로 맞춘다.
- **재검토**: 핀 500개 이상에서 끊기거나 조작이 불편하다는 피드백.

## ADR-004. 서버는 Spring Boot 단일 서버

Java 21 + Spring Boot 3, Spring Data JPA, Spring Security. v3 AI 기능은 FastAPI 분리 검토. Firebase는 포트폴리오 가치·권한 규칙 문제로 제외.

## ADR-005. DB는 PostgreSQL + Flyway

관계가 명확한 데이터, 스키마 이력은 Flyway. 좌표는 위도·경도 컬럼 + 인덱스. v4 정복 지도에서 PostGIS 검토.

## ADR-006. 실시간 동기화는 WebSocket(STOMP)

- 커플마다 채널 `/topic/couples/{coupleId}`.
- DB 커밋 뒤에만 발행(`@TransactionalEventListener(AFTER_COMMIT)`). 이벤트: `place.created/updated/deleted`, `event.*`, `couple.updated`.
- 재연결·앱 복귀 시 `GET /sync?since=`로 변경분. 삭제는 `deleted_at` 소프트 삭제.
- 동시 수정은 마지막 저장이 이긴다(v1).
- **재검토**: 서버 2대 이상이면 Redis Pub/Sub 브로커.

## ADR-007. Redis는 캐시·호출 제한·토큰에만

① 카카오 검색 단기 캐시 ② 사용자별 검색 호출 제한 ③ 리프레시 토큰 블랙리스트. 카카오 REST 키는 서버에만 둔다.

## ADR-008. 인증은 카카오·애플·구글 + JWT

SDK 토큰을 서버가 검증하고 자체 JWT 발급. Access 15분, Refresh 30일(앱 SecureStore, 서버에는 해시만). iOS 정책상 애플 로그인 포함.

## ADR-009. 인프라는 EC2 1대 + Docker Compose

Spring·PostgreSQL·Redis·Nginx를 Compose로, 매일 DB 백업 S3. CI/CD는 GitHub Actions, 앱은 EAS Build → TestFlight·구글 내부 테스트, 오류 추적 Sentry. 사용자가 늘면 RDS.

## ADR-010. 사진은 S3 Presigned, 푸시는 Expo Notifications (v2)

앱에서 리사이즈(긴 변 1600px) 후 Presigned URL로 직접 업로드. 푸시는 일정·기념일 알림만.

## ADR-011. 장소 상세는 우리 기록 + 카카오 장소 웹뷰

위쪽은 우리 데이터(이름·카테고리·상태·메모)와 "우리 기록"(방문 날짜·한 줄), 사진·리뷰는 카카오 장소 페이지를 앱 안 웹뷰로.
