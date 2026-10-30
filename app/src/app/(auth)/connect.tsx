import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { radius, shadow, space, useTheme } from '@/theme';

// 온보딩-02 커플 연결 (F-02). 코드 발급·검증 API는 W2. 지금은 6자리 형식만 확인한다.
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function makeCode() {
  return Array.from({ length: 6 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');
}

export default function ConnectScreen() {
  const { colors } = useTheme();
  const { provider } = useLocalSearchParams<{ provider?: string }>();
  const [myCode] = useState(makeCode);
  const [code, setCode] = useState('');
  const [touched, setTouched] = useState(false);
  const valid = /^[A-Z0-9]{6}$/.test(code);

  return (
    <Screen
      back
      right={
        <AppText variant="caption" tone="secondary" style={styles.step}>
          2 / 3
        </AppText>
      }
      footer={
        <Button
          label="연결하기"
          disabled={!valid}
          onPress={() => router.push({ pathname: '/start-date', params: { provider } })}
        />
      }
    >
      <View style={styles.head}>
        <AppText variant="title1">상대와 연결해요</AppText>
        <AppText variant="callout" tone="secondary">
          한 사람이 코드를 만들고, 다른 한 사람이 입력하면 돼요
        </AppText>
      </View>

      <View style={[styles.card, shadow.sm, { backgroundColor: colors.surface }]}>
        <AppText variant="caption" tone="secondary">
          내 초대코드
        </AppText>
        <AppText variant="display" style={styles.code} selectable>
          {myCode}
        </AppText>
        <AppText variant="caption" tone="secondary">
          24시간 동안 쓸 수 있어요
        </AppText>
        <View style={styles.start}>
          <Button label="코드 공유하기" icon="share" variant="secondary" compact fullWidth={false} onPress={() => Share.share({ message: `꽁냥 초대코드: ${myCode}` })} />
        </View>
      </View>

      <View style={styles.divider}>
        <View style={[styles.line, { backgroundColor: colors.border }]} />
        <AppText variant="caption" tone="secondary">
          코드를 받았다면
        </AppText>
        <View style={[styles.line, { backgroundColor: colors.border }]} />
      </View>

      <TextField
        label="상대에게 받은 코드"
        placeholder="6자리 코드 입력"
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={6}
        value={code}
        onChangeText={(t) => setCode(t.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
        onBlur={() => setTouched(true)}
        error={touched && code.length > 0 && !valid ? '코드는 6자리예요' : undefined}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  step: { paddingRight: space[3] },
  head: { gap: space[2] },
  card: { borderRadius: radius.md, padding: space[5], gap: space[3] },
  code: { letterSpacing: 2 },
  start: { alignItems: 'flex-start' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  line: { flex: 1, height: 1 },
});
