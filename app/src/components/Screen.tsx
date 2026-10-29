import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { screenPadding, space, useTheme } from '@/theme';
import { AppText } from './AppText';

/** 화면 기본 틀: 배경 + 앱바 제목(title1) + 좌우 여백 20 */
export function Screen({ title, children }: { title?: string; children?: ReactNode }) {
  const { colors } = useTheme();
  return (
    <SafeAreaView edges={['top']} style={[styles.root, { backgroundColor: colors.background }]}>
      {title ? (
        <View style={styles.bar}>
          <AppText variant="title1">{title}</AppText>
        </View>
      ) : null}
      <View style={styles.body}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bar: { height: 56, justifyContent: 'center', paddingHorizontal: screenPadding },
  body: { flex: 1, paddingHorizontal: screenPadding, gap: space[6] },
});
