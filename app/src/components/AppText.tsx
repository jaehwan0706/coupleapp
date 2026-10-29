import { Text, type TextProps } from 'react-native';

import { typography, useTheme, type TypographyVariant } from '@/theme';

type Props = TextProps & {
  variant?: TypographyVariant;
  tone?: 'primary' | 'secondary' | 'disabled' | 'accent' | 'danger';
};

export function AppText({ variant = 'body', tone = 'primary', style, ...rest }: Props) {
  const { colors } = useTheme();
  const color = {
    primary: colors.textPrimary,
    secondary: colors.textSecondary,
    disabled: colors.textDisabled,
    accent: colors.primary,
    danger: colors.danger,
  }[tone];
  return <Text style={[typography[variant], { color }, style]} {...rest} />;
}
