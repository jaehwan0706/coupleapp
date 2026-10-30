import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { StartDateField, startDateError } from '@/features/couple/StartDateField';
import { space } from '@/theme';

// 온보딩-03 사귄 날 입력 (F-03)
export default function StartDateScreen() {
  const { provider } = useLocalSearchParams<{ provider?: string }>();
  const [date, setDate] = useState('');
  const ok = !startDateError(date);

  return (
    <Screen
      back
      right={
        <AppText variant="caption" tone="secondary" style={styles.step}>
          3 / 3
        </AppText>
      }
      footer={<Button label="다음" disabled={!ok} onPress={() => router.replace({ pathname: '/done', params: { provider, date } })} />}
    >
      <View style={styles.head}>
        <AppText variant="title1">우리가 사귄 날은{'\n'}언제예요?</AppText>
        <AppText variant="callout" tone="secondary">
          사귄 날을 1일로 세어요. 나중에 설정에서 바꿀 수 있어요.
        </AppText>
      </View>
      <StartDateField value={date} onChange={setDate} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  step: { paddingRight: space[3] },
  head: { gap: space[2] },
});
