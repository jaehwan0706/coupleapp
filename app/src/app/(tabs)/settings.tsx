import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Icon } from '@/components/Icon';
import { ListGroup, ListRow } from '@/components/ListGroup';
import { Screen } from '@/components/Screen';
import { useStore } from '@/features/store';
import { daysTogether, formatDot } from '@/lib/date';
import { radius, shadow, space, useTheme } from '@/theme';

const providerLabel = { kakao: '카카오', apple: 'Apple', google: 'Google' } as const;

// 설정-01 설정 메인 (F-03~F-05)
export default function SettingsScreen() {
  const { colors } = useTheme();
  const { couple, logout } = useStore();
  if (!couple) return null;

  return (
    <Screen title="설정" tab>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/settings/profile')}
        style={[styles.profile, shadow.sm, { backgroundColor: colors.surface }]}
      >
        <View style={[styles.avatar, { backgroundColor: colors.surfaceAlt }]}>
          <Icon name="photo" color={colors.textSecondary} />
        </View>
        <View style={styles.flex}>
          <AppText variant="title3">{couple.name}</AppText>
          <AppText variant="caption" tone="secondary">
            {formatDot(couple.startDate)}부터 · {daysTogether(couple.startDate)}일째
          </AppText>
        </View>
        <Icon name="chevronRight" size={20} color={colors.textDisabled} />
      </Pressable>

      <ListGroup title="우리">
        <ListRow label="커플 프로필" onPress={() => router.push('/settings/profile')} />
        <ListRow label="사귄 날" value={formatDot(couple.startDate)} onPress={() => router.push('/settings/start-date')} last />
      </ListGroup>

      <ListGroup title="계정">
        <ListRow label="로그인 계정" value={providerLabel[couple.loginProvider]} />
        {/* 로그아웃은 W2에서 토큰 삭제와 함께. 지금은 온보딩으로 돌아간다. */}
        <ListRow label="로그아웃" onPress={logout} last />
      </ListGroup>

      <ListGroup title="정보">
        <ListRow label="버전" value={Constants.expoConfig?.version ?? '1.0.0'} last />
      </ListGroup>

      <View style={styles.danger}>
        <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/settings/leave', params: { mode: 'disconnect' } })} style={styles.dangerLink}>
          <AppText variant="callout" tone="danger" style={styles.bold}>
            연결 해제
          </AppText>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/settings/leave', params: { mode: 'withdraw' } })} style={styles.dangerLink}>
          <AppText variant="callout" tone="secondary">
            회원 탈퇴
          </AppText>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profile: { flexDirection: 'row', alignItems: 'center', gap: space[4], padding: space[4], borderRadius: radius.md },
  avatar: { width: 56, height: 56, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  danger: { flexDirection: 'row', gap: space[4], paddingHorizontal: space[1] },
  dangerLink: { height: 44, justifyContent: 'center' },
  bold: { fontWeight: '600' },
});
