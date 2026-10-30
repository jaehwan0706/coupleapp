import { Pressable, StyleSheet, View } from 'react-native';

import { radius, shadow, size, useTheme } from '@/theme';
import { AppText } from './AppText';

type Props<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  width?: number;
};

export function Segmented<T extends string>({ options, value, onChange, width }: Props<T>) {
  const { colors } = useTheme();
  return (
    <View accessibilityRole="tablist" style={[styles.root, { backgroundColor: colors.surfaceAlt, width }]}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(o.value)}
            style={[styles.item, on && [{ backgroundColor: colors.surface }, shadow.sm]]}
          >
            <AppText variant="caption" tone={on ? 'primary' : 'secondary'} style={on ? styles.on : undefined}>
              {o.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { height: size.segment, borderRadius: radius.sm, padding: 3, flexDirection: 'row' },
  item: { flex: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  on: { fontWeight: '600' },
});
