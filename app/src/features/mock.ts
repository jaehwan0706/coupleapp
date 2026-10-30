// 서버(W2~W6) 연결 전까지 쓰는 목업 데이터. 화면 설계의 예시 값을 그대로 쓴다.
import { addDays, todayKey } from '@/lib/date';
import type { CalendarEvent, Couple, Place, SearchResult } from './types';

export const mockCouple: Couple = {
  name: '봄날',
  startDate: '2025-06-14',
  loginProvider: 'kakao',
};

const created = '2026-10-20T12:00:00.000Z';

export const mockPlaces: Place[] = [
  { id: 'p1', name: '달빛 정원', category: 'cafe', status: 'want', address: '서울 성동구 서울숲4길 17', phone: '02-1234-5678', lat: 37.5459, lng: 127.0423, kakaoId: 'k1', createdAt: '2026-10-28T12:00:00.000Z' },
  { id: 'p2', name: '온도 커피 성수점', category: 'cafe', status: 'want', address: '서울 성동구 연무장길 12', phone: '02-2222-3333', memo: '창가 자리 예약하고 가기', lat: 37.5428, lng: 127.0559, kakaoId: 'k2', createdAt: created },
  { id: 'p3', name: '골목 화덕피자', category: 'food', status: 'visited', address: '서울 성동구 서울숲2길 8', lat: 37.5448, lng: 127.0405, kakaoId: 'k3', createdAt: created },
  { id: 'p4', name: '도자기 공방 흙', category: 'play', status: 'want', address: '서울 성동구 성수이로 7', lat: 37.5412, lng: 127.0538, kakaoId: 'k4', createdAt: created },
  { id: 'p5', name: '한강 벤치 자리', category: 'etc', status: 'want', address: '직접 찍은 위치', lat: 37.5395, lng: 127.0461, createdAt: created },
  { id: 'p6', name: '숲속 스테이', category: 'stay', status: 'visited', address: '강원 춘천시', lat: 37.5372, lng: 127.0498, kakaoId: 'k6', createdAt: created },
];

/** 카카오 로컬 검색 프록시(W3) 대신 쓰는 결과 */
export const mockSearchResults: SearchResult[] = [
  { kakaoId: 'k1', name: '달빛 정원', category: 'cafe', address: '서울 성동구 서울숲4길 17', phone: '02-1234-5678', lat: 37.5459, lng: 127.0423 },
  { kakaoId: 'k10', name: '성수 연방', category: 'play', address: '서울 성동구 성수이로14길 14', lat: 37.5432, lng: 127.0571 },
  { kakaoId: 'k11', name: '소금빵 공장', category: 'cafe', address: '서울 성동구 연무장5길 9', phone: '02-3333-4444', lat: 37.5421, lng: 127.0552 },
  { kakaoId: 'k12', name: '성수 감자탕', category: 'food', address: '서울 성동구 아차산로 82', phone: '02-5555-6666', lat: 37.5446, lng: 127.0537 },
  { kakaoId: 'k13', name: '서울숲 피크닉 대여', category: 'play', address: '서울 성동구 뚝섬로 273', lat: 37.5444, lng: 127.0374 },
];

const today = todayKey();

export const mockEvents: CalendarEvent[] = [
  { id: 'e1', title: '성수 카페 투어', type: 'date', date: addDays(today, 2), allDay: false, startTime: '14:00', endTime: '20:00', memo: '2시에 성수역 3번 출구에서 만나기', placeIds: ['p2', 'p3'] },
  { id: 'e2', title: '친구 결혼식', type: 'etc', date: addDays(today, 3), allDay: true, placeIds: [] },
  { id: 'e3', title: '다음 주 여행 짐 싸기', type: 'etc', date: addDays(today, 2), allDay: false, startTime: '21:00', placeIds: [] },
  { id: 'e4', title: '전시 보러 가기', type: 'date', date: addDays(today, -6), allDay: false, startTime: '13:00', placeIds: ['p4'] },
];
