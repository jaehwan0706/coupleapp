import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { screenPadding, size, space, useTheme } from '@/theme';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';

type Props = {
  title?: string;
  /** 앱바 왼쪽 뒤로 가기 */
  back?: boolean;
  /** 앱바 오른쪽 (아이콘 버튼 최대 2개) */
  right?: ReactNode;
  /** 화면 아래 고정 영역 (주 버튼) */
  footer?: ReactNode;
  scroll?: boolean;
  /** 탭 화면은 탭바가 아래 안전 영역을 처리한다 */
  tab?: boolean;
  children?: ReactNode;
};

/** 화면 기본 틀: 배경 + 앱바(56) + 좌우 여백 20 + 하단 고정 버튼 */
export function Screen({ title, back = false, right, footer, scroll = true, tab = false, children }: Props) {
  const { colors } = useTheme();
  const body = <View style={styles.body}>{children}</View>;
  return (
    <SafeAreaView edges={tab ? ['top'] : ['top', 'bottom']} style={[styles.root, { backgroundColor: colors.background }]}>
      {title || back || right ? (
        <View style={[styles.bar, { paddingLeft: back ? space[2] : screenPadding }]}>
          {back ? <IconButton icon="back" label="뒤로" onPress={() => router.back()} /> : null}
          <AppText variant={back ? 'title2' : 'title1'} style={styles.title} numberOfLines={1}>
            {title}
          </AppText>
          <View style={styles.right}>{right}</View>
        </View>
      ) : null}
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {scroll ? (
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            {body}
          </ScrollView>
        ) : (
          body
        )}
        {footer ? <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function IconButton({ icon, label, onPress, color }: { icon: IconName; label: string; onPress?: () => void; color?: string }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={4} style={styles.iconButton}>
      <Icon name={icon} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bar: { height: size.appBar, flexDirection: 'row', alignItems: 'center', paddingRight: space[2], gap: space[1] },
  title: { flex: 1 },
  right: { flexDirection: 'row' },
  scroll: { flexGrow: 1, paddingBottom: space[8] },
  body: { flex: 1, paddingHorizontal: screenPadding, paddingTop: space[1], gap: space[6] },
  footer: { paddingHorizontal: screenPadding, paddingTop: space[3], paddingBottom: space[3], borderTopWidth: StyleSheet.hairlineWidth },
  iconButton: { width: size.iconButton, height: size.iconButton, alignItems: 'center', justifyContent: 'center', borderRadius: 999 },
});
