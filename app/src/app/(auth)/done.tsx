import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { useStore } from '@/features/store';
import type { Couple } from '@/features/types';
import { daysTogether, formatDot, todayKey } from '@/lib/date';
import { radius, screenPadding, shadow, space, useTheme } from '@/theme';

const providers: Couple['loginProvider'][] = ['kakao', 'apple', 'google'];

// 온보딩-04 연결 완료
export default function DoneScreen() {
  const { colors } = useTheme();
  const { connect } = useStore();
  const params = useLocalSearchParams<{ provider?: string; date?: string }>();
  const date = params.date ?? todayKey();
  const provider = providers.find((p) => p === params.provider) ?? 'kakao';

  const goHome = () => {
    connect({ name: '우리', startDate: date, loginProvider: provider });
    router.replace('/');
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.center}>
        <View style={[styles.art, { backgroundColor: colors.primarySoft }]}>
          <Icon name="heart" size={56} color={colors.primary} filled />
        </View>
        <AppText variant="title1">연결됐어요</AppText>
        <AppText tone="secondary" style={styles.text}>
          이제 한 사람이 저장하면{'\n'}상대 지도와 달력에도 바로 보여요
        </AppText>
        <View style={[styles.card, shadow.sm, { backgroundColor: colors.surface }]}>
          <View>
            <AppText variant="caption" tone="secondary">
              사귄 날
            </AppText>
            <AppText variant="title3">{formatDot(date)}</AppText>
          </View>
          <View style={[styles.sep, { backgroundColor: colors.border }]} />
          <View>
            <AppText variant="caption" tone="secondary">
              오늘
            </AppText>
            <AppText variant="title3" tone="accent">
              {daysTogether(date)}일째
            </AppText>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Button label="홈으로" onPress={goHome} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space[3], paddingHorizontal: screenPadding },
  art: { width: 120, height: 120, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', marginBottom: space[3] },
  text: { textAlign: 'center' },
  card: { flexDirection: 'row', gap: space[6], borderRadius: radius.md, paddingVertical: space[4], paddingHorizontal: space[5], marginTop: space[3] },
  sep: { width: 1 },
  footer: { paddingHorizontal: screenPadding, paddingBottom: space[4] },
});
