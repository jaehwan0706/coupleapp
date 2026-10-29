import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';

// 지도-01 (F-10~F-18, F-28): 카카오맵 WebView + 검색바 · 카테고리 칩 · 바텀시트
export default function MapScreen() {
  return (
    <Screen title="우리 지도">
      <AppText tone="secondary">지도 WebView 브리지는 W3에서 만든다.</AppText>
    </Screen>
  );
}
