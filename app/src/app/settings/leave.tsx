import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { useStore } from '@/features/store';
import { radius, space, useTheme } from '@/theme';

// 설정-04 연결 해제 (F-04) · 설정-05 회원 탈퇴 (F-05)
const copy = {
  disconnect: {
    title: '연결 해제',
    lead: '연결을 해제하면 둘 다 지도와 캘린더를 볼 수 없어요',
    points: ['30일 안에 다시 연결하면 그대로 복구돼요', '30일이 지나면 저장한 장소와 일정이 모두 지워져요'],
    check: '위 내용을 확인했어요',
    action: '연결 해제',
  },
  withdraw: {
    title: '회원 탈퇴',
    lead: '탈퇴하면 계정과 커플 연결이 함께 사라져요',
    points: ['상대도 우리 지도와 캘린더를 볼 수 없게 돼요', '지운 계정은 되돌릴 수 없어요'],
    check: '위 내용을 확인했고 탈퇴할게요',
    action: '탈퇴하기',
  },
} as const;

export default function LeaveScreen() {
  const { colors } = useTheme();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const { disconnect } = useStore();
  const [checked, setChecked] = useState(false);
  const c = copy[mode === 'withdraw' ? 'withdraw' : 'disconnect'];

  return (
    <Screen
      back
      title={c.title}
      footer={
        <Button
          label={c.action}
          variant="danger"
          disabled={!checked}
          onPress={() => {
            // 서버 요청(W7) 전까지는 로컬 데이터만 지우고 온보딩으로 보낸다.
            disconnect();
            router.dismissAll();
          }}
        />
      }
    >
      <AppText variant="title3">{c.lead}</AppText>
      <View style={[styles.box, { backgroundColor: colors.surfaceAlt }]}>
        {c.points.map((p) => (
          <View key={p} style={styles.point}>
            <AppText variant="callout" tone="secondary">
              ·
            </AppText>
            <AppText variant="callout" style={styles.flex}>
              {p}
            </AppText>
          </View>
        ))}
      </View>
      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} onPress={() => setChecked((v) => !v)} style={styles.check}>
        <View style={[styles.box22, { backgroundColor: checked ? colors.primary : colors.surface, borderColor: checked ? colors.primary : colors.borderStrong }]}>
          {checked ? <Icon name="check" size={16} color={colors.onPrimary} strokeWidth={2.5} /> : null}
        </View>
        <AppText>{c.check}</AppText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: radius.md, padding: space[4], gap: space[2] },
  point: { flexDirection: 'row', gap: space[2] },
  flex: { flex: 1 },
  check: { flexDirection: 'row', alignItems: 'center', gap: space[3], minHeight: 44 },
  box22: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
});
