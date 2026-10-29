// 앱 ↔ 지도 WebView postMessage 타입 (ADR-003)
import type { PlaceCategory } from '@/theme/tokens';

export type LatLng = { lat: number; lng: number };

export type MapPin = LatLng & {
  id: string;
  category: PlaceCategory;
  status: 'want' | 'visited';
};

/** 앱 → 지도 */
export type ToMapMessage =
  | { type: 'setPins'; pins: MapPin[] }
  | { type: 'setSearchResults'; results: (LatLng & { id: string; name: string })[] }
  | { type: 'moveCamera'; center: LatLng; level?: number };

/** 지도 → 앱 */
export type FromMapMessage =
  | { type: 'ready' }
  | { type: 'pinSelected'; id: string }
  | { type: 'boundsChanged'; sw: LatLng; ne: LatLng }
  | { type: 'longPress'; position: LatLng };
