import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Icon } from '@/components/Icon';
import { IconButton, Screen } from '@/components/Screen';
import { CategoryIcon } from '@/features/places/PlaceRow';
import { CategoryPicker, MemoField, StatusPicker } from '@/features/places/PlaceForm';
import { useStore } from '@/features/store';
import { placeCategories, radius, space, useTheme } from '@/theme';

// 지도-07 저장한 핀 (F-13~F-15). 우리 기록(방문 날짜·한 줄)은 서버 스키마 확정(W4) 후 붙인다.
export default function PlaceDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { places, events, updatePlace, removePlace } = useStore();
  const place = places.find((p) => p.id === id);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!place) {
    return (
      <Screen back>
        <EmptyState icon="pin" title="지워진 장소예요" description="상대가 삭제했을 수 있어요" />
      </Screen>
    );
  }

  const usedIn = events.filter((e) => e.placeIds.includes(place.id)).length;
  const c = placeCategories[place.category];

  return (
    <Screen
      back
      right={
        <>
          <IconButton icon="edit" label={editing ? '수정 끝내기' : '수정'} onPress={() => setEditing((v) => !v)} color={editing ? colors.primary : undefined} />
          <IconButton icon="trash" label="삭제" onPress={() => setConfirmDelete(true)} />
        </>
      }
      footer={<Button label="일정에 넣기" icon="calendar" variant="secondary" onPress={() => router.push({ pathname: '/event/edit', params: { placeId: place.id } })} />}
    >
      <View style={styles.head}>
        <CategoryIcon category={place.category} size={48} />
        <View style={styles.flex}>
          <AppText variant="title2">{place.name}</AppText>
          <AppText variant="caption" style={{ color: c.color }}>
            {c.label} · <AppText variant="caption" tone="secondary">{place.address}</AppText>
          </AppText>
        </View>
      </View>

      {confirmDelete ? (
        <View style={[styles.confirm, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <AppText variant="title3">이 핀을 삭제할까요?</AppText>
          <AppText variant="callout" tone="secondary">
            상대 지도에서도 함께 사라져요.{usedIn ? ` 일정 ${usedIn}개의 코스에서도 빠져요.` : ''}
          </AppText>
          <View style={styles.row}>
            <View style={styles.flex}>
              <Button label="취소" variant="outline" onPress={() => setConfirmDelete(false)} />
            </View>
            <View style={styles.flex}>
              <Button
                label="삭제"
                variant="danger"
                compact
                onPress={() => {
                  router.back();
                  removePlace(place.id);
                }}
              />
            </View>
          </View>
        </View>
      ) : null}

      <StatusPicker value={place.status} onChange={(status) => updatePlace(place.id, { status })} />

      {editing ? (
        <>
          <CategoryPicker value={place.category} onChange={(category) => updatePlace(place.id, { category })} />
          <MemoField value={place.memo ?? ''} onChange={(memo) => updatePlace(place.id, { memo })} />
        </>
      ) : place.memo ? (
        <View style={[styles.memo, { backgroundColor: colors.surfaceAlt }]}>
          <Icon name="memo" size={20} color={colors.textSecondary} />
          <AppText variant="callout" style={styles.flex}>
            {place.memo}
          </AppText>
        </View>
      ) : null}

      <View>
        {place.phone ? (
          <Pressable accessibilityRole="link" onPress={() => Linking.openURL(`tel:${place.phone}`)} style={styles.link}>
            <Icon name="phone" size={20} color={colors.textSecondary} />
            <AppText>{place.phone}</AppText>
          </Pressable>
        ) : null}
        {place.kakaoId ? (
          // 사진·리뷰는 카카오 장소 페이지 (ADR-011). 앱 안 웹뷰는 W4.
          <Pressable accessibilityRole="link" onPress={() => Linking.openURL(`https://place.map.kakao.com/${place.kakaoId}`)} style={styles.link}>
            <AppText variant="bodyStrong" tone="accent">
              카카오맵에서 사진·리뷰 보기
            </AppText>
            <Icon name="external" size={16} color={colors.primary} />
          </Pressable>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  flex: { flex: 1 },
  row: { flexDirection: 'row', gap: space[2], alignItems: 'center' },
  confirm: { borderWidth: 1, borderRadius: radius.lg, padding: space[5], gap: space[2] },
  memo: { flexDirection: 'row', gap: space[2], borderRadius: radius.sm, paddingVertical: space[3], paddingHorizontal: space[4] },
  link: { flexDirection: 'row', alignItems: 'center', gap: space[2], minHeight: 44 },
});
