import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { TextField } from '@/components/TextField';
import { daysTogether, fromKey, toKey, todayKey } from '@/lib/date';
import { radius, space, useTheme } from '@/theme';

// 사귄 날 입력. 날짜 휠 피커(디자인 온보딩-03)는 네이티브 피커 라이브러리를 고른 뒤 바꾼다.

/** 'YYYY-MM-DD' 형식이고 실제 있는 날짜이며 오늘 이전인지 */
export function startDateError(value: string): string | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return '2025-06-14 형식으로 입력해 주세요';
  if (toKey(fromKey(value)) !== value) return '없는 날짜예요';
  if (value > todayKey()) return '오늘 이후 날짜는 고를 수 없어요';
  return undefined;
}

export function StartDateField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { colors } = useTheme();
  const error = value.length >= 10 ? startDateError(value) : undefined;
  return (
    <View style={styles.root}>
      <TextField
        label="사귄 날"
        placeholder="2025-06-14"
        keyboardType="numbers-and-punctuation"
        maxLength={10}
        value={value}
        onChangeText={onChange}
        error={error}
      />
      {value.length === 10 && !error ? (
        <View style={[styles.preview, { backgroundColor: colors.primarySoft }]}>
          <AppText variant="callout">오늘은 사귄 지</AppText>
          <AppText variant="title2" tone="accent">
            {daysTogether(value)}일째
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: space[6] },
  preview: { borderRadius: radius.md, padding: space[4], flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
