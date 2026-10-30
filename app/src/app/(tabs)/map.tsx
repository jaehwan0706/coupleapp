import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Chip } from '@/components/Chip';
import { EmptyState } from '@/components/EmptyState';
import { Icon } from '@/components/Icon';
import { Segmented } from '@/components/Segmented';
import { PlaceMap } from '@/features/places/PlaceMap';
import { PlaceRow } from '@/features/places/PlaceRow';
import { useStore } from '@/features/store';
import type { Place, PlaceStatus } from '@/features/types';
import { placeCategories, radius, screenPadding, shadow, size, space, typography, useTheme, type PlaceCategory } from '@/theme';

type View_ = 'map' | 'list';
type Sort = 'recent' | 'name';

const categoryKeys = Object.keys(placeCategories) as PlaceCategory[];

// 지도-01 기본 · 지도-08 필터 · 지도-09 목록 보기 (F-12, F-13, F-16, F-17)
export default function MapScreen() {
  const { colors } = useTheme();
  const { places } = useStore();
  const [mode, setMode] = useState<View_>('map');
  const [categories, setCategories] = useState<PlaceCategory[]>([]);
  const [status, setStatus] = useState<PlaceStatus | null>(null);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('recent');
  const [selected, setSelected] = useState<Place | null>(null);

  const filtered = useMemo(
    () =>
      places.filter(
        (p) => (categories.length === 0 || categories.includes(p.category)) && (status === null || p.status === status),
      ),
    [places, categories, status],
  );

  const listed = useMemo(() => {
    const q = query.trim();
    const rows = q ? filtered.filter((p) => p.name.includes(q)) : filtered;
    // 거리순은 내 위치(F-29, v2)가 생기면 추가한다.
    return [...rows].sort((a, b) => (sort === 'recent' ? b.createdAt.localeCompare(a.createdAt) : a.name.localeCompare(b.name, 'ko')));
  }, [filtered, query, sort]);

  const toggleCategory = (c: PlaceCategory) =>
    setCategories((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));

  const filters = (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
      <Chip label="가고 싶다" icon="heart" selected={status === 'want'} onPress={() => setStatus(status === 'want' ? null : 'want')} />
      <Chip label="가봤다" icon="check" selected={status === 'visited'} onPress={() => setStatus(status === 'visited' ? null : 'visited')} />
      <View style={[styles.sep, { backgroundColor: colors.border }]} />
      {categoryKeys.map((c) => (
        <Chip
          key={c}
          label={placeCategories[c].label}
          icon={c}
          iconColor={placeCategories[c].color}
          color={placeCategories[c].color}
          selected={categories.includes(c)}
          onPress={() => toggleCategory(c)}
        />
      ))}
    </ScrollView>
  );

  if (mode === 'list') {
    return (
      <SafeAreaView edges={['top']} style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={styles.listHead}>
          <AppText variant="title2">우리 지도</AppText>
          <Segmented width={120} options={[{ value: 'map', label: '지도' }, { value: 'list', label: '목록' }]} value={mode} onChange={setMode} />
        </View>
        <View style={styles.listTools}>
          <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Icon name="search" size={20} color={colors.textSecondary} />
            <TextInput
              accessibilityLabel="저장한 장소 이름으로 찾기"
              placeholder="저장한 장소 이름으로 찾기"
              placeholderTextColor={colors.textDisabled}
              value={query}
              onChangeText={setQuery}
              style={[styles.searchInput, typography.body, { color: colors.textPrimary }]}
            />
          </View>
        </View>
        {filters}
        <View style={styles.sortRow}>
          <Chip label="최신순" selected={sort === 'recent'} onPress={() => setSort('recent')} />
          <Chip label="이름순" selected={sort === 'name'} onPress={() => setSort('name')} />
          <AppText variant="caption" tone="secondary" style={styles.count}>
            {listed.length}곳
          </AppText>
        </View>
        <ScrollView contentContainerStyle={styles.list}>
          {listed.length ? (
            listed.map((p) => <PlaceRow key={p.id} place={p} onPress={() => router.push(`/place/${p.id}`)} />)
          ) : places.length ? (
            <EmptyState icon="search" title="조건에 맞는 장소가 없어요" description="필터를 바꾸거나 이름을 다시 확인해 주세요" />
          ) : (
            <EmptyState icon="pin" title="아직 저장한 장소가 없어요" description="가고 싶은 곳을 검색해서 둘의 지도를 채워보세요" actionLabel="장소 검색" onAction={() => router.push('/search')} />
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      <PlaceMap places={filtered} selectedId={selected?.id} onSelect={setSelected} />
      <SafeAreaView edges={['top']} style={styles.overlay} pointerEvents="box-none">
        <Pressable
          accessibilityRole="search"
          accessibilityLabel="가게, 역, 동네 검색"
          onPress={() => router.push('/search')}
          style={[styles.searchBar, shadow.md, { backgroundColor: colors.surface }]}
        >
          <Icon name="search" size={20} color={colors.textSecondary} />
          <AppText tone="disabled">가게, 역, 동네 검색</AppText>
        </Pressable>
        {filters}
      </SafeAreaView>

      <View style={styles.fabs} pointerEvents="box-none">
        <Pressable accessibilityRole="button" accessibilityLabel="목록으로 보기" onPress={() => setMode('list')} style={[styles.fab, shadow.md, { backgroundColor: colors.surface }]}>
          <Icon name="list" />
        </Pressable>
      </View>

      {places.length === 0 ? (
        <View style={[styles.emptyCard, shadow.md, { backgroundColor: colors.surface }]}>
          <AppText variant="title3">아직 저장한 장소가 없어요</AppText>
          <AppText variant="callout" tone="secondary">
            가고 싶은 곳을 검색해서 둘의 지도를 채워보세요
          </AppText>
        </View>
      ) : null}

      {selected ? (
        <View style={[styles.peek, shadow.lg, { backgroundColor: colors.surface }]}>
          <View style={[styles.grab, { backgroundColor: colors.borderStrong }]} />
          <PlaceRow place={selected} onPress={() => router.push(`/place/${selected.id}`)} />
          <Pressable accessibilityRole="button" accessibilityLabel="닫기" onPress={() => setSelected(null)} style={styles.peekClose}>
            <AppText variant="callout" tone="secondary">
              닫기
            </AppText>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  overlay: { position: 'absolute', left: 0, right: 0, top: 0, gap: space[3], paddingTop: space[2] },
  searchBar: {
    marginHorizontal: screenPadding,
    height: size.searchBar,
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingHorizontal: space[4],
  },
  chips: { paddingHorizontal: screenPadding, gap: space[2], alignItems: 'center' },
  sep: { width: 1, height: 20 },
  fabs: { position: 'absolute', right: screenPadding, bottom: space[6] },
  fab: { width: 48, height: 48, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  emptyCard: { position: 'absolute', left: screenPadding, right: screenPadding, bottom: space[6] + 64, borderRadius: radius.lg, padding: space[5], gap: space[1] },
  peek: { position: 'absolute', left: 0, right: 0, bottom: 0, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: space[5], paddingTop: space[2], gap: space[3] },
  grab: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: space[2] },
  peekClose: { alignSelf: 'center', paddingVertical: space[2], paddingHorizontal: space[4] },
  listHead: { height: size.appBar, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: screenPadding },
  listTools: { paddingHorizontal: screenPadding, marginBottom: space[3] },
  searchBox: { height: size.searchBar, borderRadius: radius.full, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: space[2], paddingHorizontal: space[4] },
  searchInput: { flex: 1, minWidth: 0 },
  sortRow: { flexDirection: 'row', alignItems: 'center', gap: space[2], paddingHorizontal: screenPadding, marginTop: space[3] },
  count: { marginLeft: 'auto' },
  list: { padding: screenPadding, gap: space[3] },
});
