import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Icon } from '@/components/Icon';
import { placeCategories, radius, shadow, space, useTheme, type PlaceCategory } from '@/theme';
import type { Place, PlaceStatus } from '../types';

export function CategoryIcon({ category, size = 40 }: { category: PlaceCategory; size?: number }) {
  const c = placeCategories[category];
  return (
    <View style={[styles.cat, { width: size, height: size, backgroundColor: c.soft }]}>
      <Icon name={category} size={size / 2} color={c.color} />
    </View>
  );
}

export function StatusTag({ status }: { status: PlaceStatus }) {
  const { colors } = useTheme();
  const want = status === 'want';
  return (
    <View style={[styles.tag, { backgroundColor: want ? colors.primarySoft : colors.surfaceAlt }]}>
      <Icon name={want ? 'heart' : 'check'} size={12} color={want ? colors.primary : colors.success} strokeWidth={want ? 1.75 : 2.5} />
      <AppText variant="micro" style={{ color: want ? colors.primary : colors.success }}>
        {want ? '가고 싶다' : '가봤다'}
      </AppText>
    </View>
  );
}

/** 장소 카드: 카테고리 아이콘 · 이름 · 메타 · 상태 */
export function PlaceRow({ place, onPress, meta }: { place: Pick<Place, 'name' | 'category' | 'address'> & { status?: PlaceStatus }; onPress?: () => void; meta?: string }) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.card, shadow.sm, { backgroundColor: pressed ? colors.surfaceAlt : colors.surface }]}
    >
      <CategoryIcon category={place.category} />
      <View style={styles.text}>
        <AppText variant="title3" numberOfLines={1}>
          {place.name}
        </AppText>
        <AppText variant="caption" tone="secondary" numberOfLines={1}>
          {meta ?? `${placeCategories[place.category].label} · ${place.address}`}
        </AppText>
      </View>
      {place.status ? <StatusTag status={place.status} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cat: { borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  tag: { height: 22, paddingHorizontal: space[2], borderRadius: radius.xs, flexDirection: 'row', alignItems: 'center', gap: 3 },
  card: { borderRadius: radius.md, padding: space[4], flexDirection: 'row', alignItems: 'center', gap: space[3] },
  text: { flex: 1, minWidth: 0 },
});
