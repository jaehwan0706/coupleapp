import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { IconButton, Screen } from '@/components/Screen';
import { mockSearchResults } from '@/features/mock';
import { CategoryPicker, MemoField, StatusPicker } from '@/features/places/PlaceForm';
import { useStore } from '@/features/store';
import type { PlaceStatus } from '@/features/types';
import { space, type PlaceCategory } from '@/theme';

// 지도-05c 저장 시트 (F-12~F-14). 카카오 분류로 카테고리를 미리 골라 둔다.
export default function SavePlaceScreen() {
  const { kakaoId } = useLocalSearchParams<{ kakaoId: string }>();
  const { addPlace } = useStore();
  const result = mockSearchResults.find((r) => r.kakaoId === kakaoId);

  const [category, setCategory] = useState<PlaceCategory>(result?.category ?? 'etc');
  const [status, setStatus] = useState<PlaceStatus>('want');
  const [memo, setMemo] = useState('');

  if (!result) {
    return (
      <Screen back title="장소 저장">
        <EmptyState icon="search" title="장소를 찾을 수 없어요" description="검색에서 다시 골라 주세요" />
      </Screen>
    );
  }

  const save = () => {
    const place = addPlace({
      name: result.name,
      address: result.address,
      phone: result.phone,
      lat: result.lat,
      lng: result.lng,
      kakaoId: result.kakaoId,
      category,
      status,
      memo: memo.trim() || undefined,
    });
    router.dismissAll();
    router.push(`/place/${place.id}`);
  };

  return (
    <Screen
      title="장소 저장"
      right={<IconButton icon="close" label="닫기" onPress={() => router.back()} />}
      footer={<Button label="저장하기" onPress={save} />}
    >
      <View style={styles.head}>
        <AppText variant="title3">{result.name}</AppText>
        <AppText variant="caption" tone="secondary">
          {result.address}
        </AppText>
      </View>
      <View style={styles.gap}>
        <CategoryPicker value={category} onChange={setCategory} />
        <AppText variant="caption" tone="secondary">
          카카오 분류를 보고 미리 골라뒀어요
        </AppText>
      </View>
      <StatusPicker value={status} onChange={setStatus} />
      <MemoField value={memo} onChange={setMemo} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { gap: 2 },
  gap: { gap: space[2] },
});
