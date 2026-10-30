import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { radius, screenPadding, size, space, useTheme } from '@/theme';

// 온보딩-01 로그인 (F-01). 실제 소셜 로그인 SDK 연동은 W2.
const providers = [
  { key: 'kakao', label: '카카오로 시작하기', bg: '#FEE500', fg: '#191919' },
  { key: 'apple', label: 'Apple로 시작하기', bg: '#000000', fg: '#FFFFFF' },
  { key: 'google', label: 'Google로 시작하기', bg: '#FFFFFF', fg: '#2B2325' },
] as const;

export default function LoginScreen() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.hero}>
        <View style={[styles.art, { backgroundColor: colors.primarySoft }]} aria-hidden>
          <View style={[styles.drop, { left: 26, top: 28, backgroundColor: colors.primary }]} />
          <View style={[styles.drop, { left: 56, top: 40, backgroundColor: colors.secondary, borderWidth: 3, borderColor: colors.primarySoft }]} />
        </View>
        <AppText variant="title1">꽁냥</AppText>
        <AppText tone="secondary" style={styles.center}>
          둘이 가고 싶은 곳은 지도에,{'\n'}함께할 날은 달력에
        </AppText>
      </View>
      <View style={styles.actions}>
        {providers.map((p) => (
          <Pressable
            key={p.key}
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/connect', params: { provider: p.key } })}
            style={({ pressed }) => [
              styles.provider,
              { backgroundColor: p.bg, opacity: pressed ? 0.85 : 1 },
              p.key === 'google' && { borderWidth: 1, borderColor: colors.borderStrong },
            ]}
          >
            <AppText variant="bodyStrong" style={{ color: p.fg }}>
              {p.label}
            </AppText>
          </Pressable>
        ))}
        <AppText variant="caption" tone="secondary" style={[styles.center, styles.terms]}>
          시작하면 이용약관과 개인정보 처리방침에 동의하게 돼요
        </AppText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space[3], paddingHorizontal: screenPadding },
  art: { width: 120, height: 120, borderRadius: radius.full, marginBottom: space[3] },
  drop: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    transform: [{ rotate: '-45deg' }],
  },
  center: { textAlign: 'center' },
  actions: { paddingHorizontal: screenPadding, paddingBottom: space[4], gap: space[2] },
  provider: { height: size.button, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  terms: { marginTop: space[2] },
});
