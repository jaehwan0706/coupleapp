import { StyleSheet, View } from 'react-native';

import { radius, space, useTheme } from '@/theme';
import { AppText } from './AppText';
import { Button } from './Button';
import { Icon, type IconName } from './Icon';

type Props = {
  icon: IconName;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** 빈 상태: 일러스트 · 제목 title3 · 설명 callout · 주 버튼 1개 */
export function EmptyState({ icon, title, description, actionLabel, onAction }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.root}>
      <View style={[styles.art, { backgroundColor: colors.primarySoft }]}>
        <Icon name={icon} size={32} color={colors.primary} />
      </View>
      <AppText variant="title3" style={styles.center}>
        {title}
      </AppText>
      {description ? (
        <AppText variant="callout" tone="secondary" style={styles.center}>
          {description}
        </AppText>
      ) : null}
      {actionLabel ? (
        <View style={styles.action}>
          <Button label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

/** 섹션 안의 작은 빈 상태 (점선 박스 + 보조 버튼) */
export function InlineEmpty({ text, actionLabel, actionIcon, onAction }: { text: string; actionLabel: string; actionIcon: IconName; onAction: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.inline, { borderColor: colors.borderStrong }]}>
      <AppText variant="callout" tone="secondary" style={styles.flex}>
        {text}
      </AppText>
      <Button label={actionLabel} icon={actionIcon} variant="secondary" compact fullWidth={false} onPress={onAction} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', gap: space[2], paddingVertical: space[10] },
  art: { width: 72, height: 72, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', marginBottom: space[2] },
  center: { textAlign: 'center' },
  action: { alignSelf: 'stretch', marginTop: space[4] },
  inline: { borderWidth: 1, borderStyle: 'dashed', borderRadius: radius.md, padding: space[4], flexDirection: 'row', alignItems: 'center', gap: space[3] },
  flex: { flex: 1 },
});
