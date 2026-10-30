import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { EmptyState } from '@/components/EmptyState';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/Screen';
import { mockSearchResults } from '@/features/mock';
import { PlaceRow } from '@/features/places/PlaceRow';
import { useStore } from '@/features/store';
import { radius, screenPadding, shadow, size, space, typography, useTheme } from '@/theme';

// 지도-02 가게 검색 결과 (F-10). 카카오 로컬 검색 프록시(W3) 전까지 목업 결과에서 찾는다.
export default function SearchScreen() {
  const { colors } = useTheme();
  const { places } = useStore();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return mockSearchResults.filter((r) => r.name.includes(q) || r.address.includes(q));
  }, [query]);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.head}>
        <IconButton icon="back" label="뒤로" onPress={() => router.back()} />
        <View style={[styles.bar, shadow.md, { backgroundColor: colors.surface }]}>
          <Icon name="search" size={20} color={colors.textSecondary} />
          <TextInput
            autoFocus
            accessibilityLabel="장소 검색"
            placeholder="가게, 역, 동네 검색"
            placeholderTextColor={colors.textDisabled}
            returnKeyType="search"
            value={query}
            onChangeText={setQuery}
            style={[styles.input, typography.body, { color: colors.textPrimary }]}
          />
          {query ? <IconButton icon="close" label="지우기" onPress={() => setQuery('')} color={colors.textSecondary} /> : null}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled">
        {!query.trim() ? (
          <AppText variant="callout" tone="secondary" style={styles.hint}>
            예: 성수, 카페, 피자
          </AppText>
        ) : results.length ? (
          results.map((r) => {
            const saved = places.find((p) => p.kakaoId === r.kakaoId);
            return (
              <PlaceRow
                key={r.kakaoId}
                place={{ ...r, status: saved?.status }}
                onPress={() => (saved ? router.replace(`/place/${saved.id}`) : router.push({ pathname: '/place/save', params: { kakaoId: r.kakaoId } }))}
              />
            );
          })
        ) : (
          <EmptyState icon="search" title="검색 결과가 없어요" description="가게 이름이나 동네 이름으로 다시 찾아보세요" />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  head: { flexDirection: 'row', alignItems: 'center', paddingLeft: space[2], paddingRight: screenPadding, paddingVertical: space[2], gap: space[1] },
  bar: { flex: 1, height: size.searchBar, borderRadius: radius.full, flexDirection: 'row', alignItems: 'center', gap: space[2], paddingLeft: space[4], paddingRight: space[1] },
  input: { flex: 1, minWidth: 0 },
  list: { padding: screenPadding, gap: space[3] },
  hint: { textAlign: 'center', marginTop: space[8] },
});
