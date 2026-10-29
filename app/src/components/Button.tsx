import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';

import { radius, size, space, state, useTheme } from '@/theme';
import { AppText } from './AppText';

type Variant = 'primary' | 'secondary' | 'outline' | 'danger';

type Props = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: Variant;
  loading?: boolean;
};

export function Button({ label, variant = 'primary', loading = false, disabled, style, ...rest }: Props) {
  const { colors } = useTheme();
  const look = {
    primary: { bg: colors.primary, pressed: colors.primaryPressed, fg: colors.onPrimary, border: undefined },
    secondary: { bg: colors.primarySoft, pressed: '#F3D5DA', fg: colors.primary, border: undefined },
    outline: { bg: 'transparent', pressed: colors.border, fg: colors.textPrimary, border: colors.borderStrong },
    danger: { bg: colors.danger, pressed: '#A92631', fg: '#FFFFFF', border: undefined },
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, busy: loading }}
      disabled={disabled || loading}
      style={(s) => [
        styles.base,
        {
          height: variant === 'outline' ? size.buttonSmall : size.button,
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
        <AppText variant="bodyStrong" style={{ color: look.fg }}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: space[2],
  },
});
