import { Pressable, StyleSheet } from 'react-native';

import { radius, size, space, state, typography, useTheme } from '@/theme';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';

type Props = {
  label: string;
  selected?: boolean;
  /** 선택 시 채울 색 (카테고리 칩은 카테고리 색) */
  color?: string;
  icon?: IconName;
  iconColor?: string;
  disabled?: boolean;
  onPress?: () => void;
};

export function Chip({ label, selected = false, color, icon, iconColor, disabled, onPress }: Props) {
  const { colors } = useTheme();
  const fill = color ?? colors.primary;
  const fg = selected ? colors.onPrimary : colors.textPrimary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? fill : colors.surface,
          borderColor: selected ? fill : colors.borderStrong,
          opacity: disabled ? state.disabledOpacity : 1,
        },
      ]}
    >
      {icon ? <Icon name={icon} size={size.iconMeta} color={selected ? fg : (iconColor ?? colors.textSecondary)} /> : null}
      <AppText variant="caption" style={{ color: fg }}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: size.chip,
    paddingHorizontal: space[3],
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
    minHeight: typography.caption.lineHeight,
  },
});
