import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';

import { radius, size, space, state, useTheme } from '@/theme';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';

type Variant = 'primary' | 'secondary' | 'outline' | 'danger' | 'text';

type Props = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: Variant;
  icon?: IconName;
  loading?: boolean;
  compact?: boolean;
  /** false면 글자 길이만큼만 차지한다 (텍스트 버튼은 항상 false) */
  fullWidth?: boolean;
};

export function Button({ label, variant = 'primary', icon, loading = false, compact = false, fullWidth = true, disabled, style, ...rest }: Props) {
  const { colors } = useTheme();
  const look = {
    primary: { bg: colors.primary, pressed: colors.primaryPressed, fg: colors.onPrimary, border: undefined },
    secondary: { bg: colors.primarySoft, pressed: '#F3D5DA', fg: colors.primary, border: undefined },
    outline: { bg: 'transparent', pressed: colors.border, fg: colors.textPrimary, border: colors.borderStrong },
    danger: { bg: colors.danger, pressed: '#A92631', fg: '#FFFFFF', border: undefined },
    text: { bg: 'transparent', pressed: colors.primarySoft, fg: colors.primary, border: undefined },
  }[variant];
  const height = compact || variant === 'outline' || variant === 'text' ? size.buttonSmall : size.button;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled, busy: loading }}
      disabled={disabled || loading}
      style={(s) => [
        styles.base,
        {
          height,
          alignSelf: fullWidth && variant !== 'text' ? 'stretch' : undefined,
          paddingHorizontal: variant === 'text' ? space[2] : space[4],
          backgroundColor: s.pressed ? look.pressed : look.bg,
          borderColor: look.border,
          borderWidth: look.border ? 1 : 0,
          opacity: disabled ? state.disabledOpacity : 1,
        },
        typeof style === 'function' ? style(s) : style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={look.fg} />
      ) : (
        <>
          {icon ? <Icon name={icon} size={size.iconList} color={look.fg} /> : null}
          <AppText variant="bodyStrong" style={{ color: look.fg }}>
            {label}
          </AppText>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: space[2],
  },
});
