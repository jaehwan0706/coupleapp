import type { EventType, PlaceCategory } from '@/theme/tokens';

export type PlaceStatus = 'want' | 'visited';

/** 저장한 핀 (F-12~F-15) */
export type Place = {
  id: string;
  name: string;
  category: PlaceCategory;
  status: PlaceStatus;
  address: string;
  phone?: string;
  memo?: string;
  lat: number;
  lng: number;
  /** 카카오 장소 ID. 직접 찍은 위치는 없음 */
  kakaoId?: string;
  createdAt: string;
};

/** 카카오 로컬 검색 결과 (저장 전) */
export type SearchResult = {
  kakaoId: string;
  name: string;
  category: PlaceCategory;
  address: string;
  phone?: string;
  lat: number;
  lng: number;
};

/** 일정 (F-30~F-33) */
export type CalendarEvent = {
  id: string;
  title: string;
  type: EventType;
  date: string;
  allDay: boolean;
  startTime?: string;
  endTime?: string;
  memo?: string;
  placeIds: string[];
};

export type Couple = {
  name: string;
  startDate: string;
  loginProvider: 'kakao' | 'apple' | 'google';
};
