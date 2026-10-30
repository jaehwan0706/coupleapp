import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Chip } from '@/components/Chip';
import { TextField } from '@/components/TextField';
import { placeCategories, space, type PlaceCategory } from '@/theme';
import type { PlaceStatus } from '../types';

export const MEMO_MAX = 40;

const categoryKeys = Object.keys(placeCategories) as PlaceCategory[];

export function CategoryPicker({ value, onChange }: { value: PlaceCategory; onChange: (c: PlaceCategory) => void }) {
  return (
    <View style={styles.field}>
      <AppText variant="caption" tone="secondary">
        카테고리
      </AppText>
      <View style={styles.wrap}>
        {categoryKeys.map((c) => (
          <Chip
            key={c}
            label={placeCategories[c].label}
            icon={c}
            iconColor={placeCategories[c].color}
            color={placeCategories[c].color}
            selected={value === c}
            onPress={() => onChange(c)}
          />
        ))}
      </View>
    </View>
  );
}

/** 가고 싶다 / 가봤다 (F-13) */
export function StatusPicker({ value, onChange }: { value: PlaceStatus; onChange: (s: PlaceStatus) => void }) {
  const options: { key: PlaceStatus; label: string; icon: 'heart' | 'check' }[] = [
    { key: 'want', label: '가고 싶다', icon: 'heart' },
    { key: 'visited', label: '가봤다', icon: 'check' },
  ];
  return (
    <View style={styles.field}>
      <AppText variant="caption" tone="secondary">
        상태
      </AppText>
      <View style={styles.row}>
        {options.map((o) => {
          const on = value === o.key;
          return (
            <View key={o.key} style={styles.flex}>
              <Chip label={o.label} icon={o.icon} selected={on} onPress={() => onChange(o.key)} />
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function MemoField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <TextField
      label="한 줄 메모 (선택)"
      placeholder="여기 파스타 맛있대"
      maxLength={MEMO_MAX}
      showCount
      value={value}
      onChangeText={onChange}
    />
  );
}

const styles = StyleSheet.create({
  field: { gap: space[2] },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  row: { flexDirection: 'row', gap: space[2] },
  flex: { flex: 1 },
});
