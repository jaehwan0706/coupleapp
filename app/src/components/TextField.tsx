import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { radius, size, space, typography, useTheme } from '@/theme';
import { AppText } from './AppText';

type Props = TextInputProps & {
  label: string;
  error?: string;
  /** 글자 수 표시 (maxLength와 같이 쓴다) */
  showCount?: boolean;
};

export function TextField({ label, error, showCount, multiline, value, maxLength, style, ...rest }: Props) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const ring = error ? colors.danger : focused ? colors.primary : 'transparent';
  return (
    <View style={styles.root}>
      <AppText variant="caption" tone="secondary">
        {label}
      </AppText>
      <TextInput
        accessibilityLabel={label}
        value={value}
        maxLength={maxLength}
        multiline={multiline}
        placeholderTextColor={colors.textDisabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          typography.body,
          {
            backgroundColor: colors.surfaceAlt,
            color: colors.textPrimary,
            borderColor: ring,
            height: multiline ? undefined : size.input,
            minHeight: multiline ? size.textareaMin : undefined,
            paddingTop: multiline ? 14 : 0,
            textAlignVertical: multiline ? 'top' : 'center',
          },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <AppText variant="caption" tone="danger">
          {error}
        </AppText>
      ) : showCount && maxLength ? (
        <AppText variant="caption" tone="secondary" style={styles.count}>
          {(value ?? '').length} / {maxLength}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 6 },
  input: { borderRadius: radius.sm, paddingHorizontal: space[4], borderWidth: 1.5 },
  count: { alignSelf: 'flex-end' },
});
