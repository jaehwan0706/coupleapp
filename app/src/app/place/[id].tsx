import { useLocalSearchParams } from 'expo-router';

import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';

// 지도-05 장소 상세 (F-15): 우리 기록 + 카카오 장소 웹뷰 (ADR-011)
export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <Screen title="장소 상세">
      <AppText tone="secondary">장소 {id}</AppText>
    </Screen>
  );
}
