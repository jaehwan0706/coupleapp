import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { radius, shadow, space, useTheme } from '@/theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

export function ListGroup({ title, children }: { title?: string; children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      {title ? (
        <AppText variant="caption" tone="secondary" style={styles.title}>
          {title}
        </AppText>
      ) : null}
      <View style={[styles.group, shadow.sm, { backgroundColor: colors.surface }]}>{children}</View>
    </View>
  );
}

type RowProps = {
  label: string;
  value?: string;
  onPress?: () => void;
  right?: ReactNode;
  tone?: 'primary' | 'danger';
  last?: boolean;
};

export function ListRow({ label, value, onPress, right, tone = 'primary', last }: RowProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: colors.border, borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth },
        pressed && { backgroundColor: colors.surfaceAlt },
      ]}
    >
      <AppText tone={tone} style={styles.label}>
        {label}
      </AppText>
      {value ? (
        <AppText variant="callout" tone="secondary">
          {value}
        </AppText>
      ) : null}
      {right}
      {onPress && !right ? <Icon name="chevronRight" size={20} color={colors.textDisabled} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: { gap: space[2] },
  title: { paddingHorizontal: space[1] },
  group: { borderRadius: radius.md, overflow: 'hidden' },
  row: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: space[3], paddingLeft: space[4], paddingRight: space[3] },
  label: { flex: 1 },
});
