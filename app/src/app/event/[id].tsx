import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Icon } from '@/components/Icon';
import { IconButton, Screen } from '@/components/Screen';
import { EventTypeDot, eventTimeLabel } from '@/features/events/EventCard';
import { CategoryIcon } from '@/features/places/PlaceRow';
import { useStore } from '@/features/store';
import { formatMonthDay } from '@/lib/date';
import { eventTypes, placeCategories, radius, space, useTheme } from '@/theme';

// 캘린더-02 일정 상세 (F-31, F-33)
export default function EventDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { events, places, removeEvent } = useStore();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <Screen back>
        <EmptyState icon="calendar" title="지워진 일정이에요" description="상대가 삭제했을 수 있어요" />
      </Screen>
    );
  }

  const t = eventTypes[event.type];
  const course = event.placeIds.map((pid) => places.find((p) => p.id === pid)).filter((p) => p !== undefined);

  return (
    <Screen
      back
      right={
        <>
          <IconButton icon="edit" label="수정" onPress={() => router.push({ pathname: '/event/edit', params: { id: event.id } })} />
          <IconButton icon="trash" label="삭제" onPress={() => setConfirmDelete(true)} />
        </>
      }
    >
      <View style={styles.head}>
        <View style={styles.type}>
          <EventTypeDot type={event.type} size={8} />
          <AppText variant="caption" style={{ color: t.color }}>
            {t.label}
          </AppText>
        </View>
        <AppText variant="title1">{event.title}</AppText>
        <View style={styles.type}>
          <Icon name="clock" size={16} color={colors.textSecondary} />
          <AppText variant="callout" tone="secondary">
            {formatMonthDay(event.date)} {eventTimeLabel(event)}
          </AppText>
        </View>
      </View>

      {confirmDelete ? (
        <View style={[styles.confirm, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <AppText variant="title3">이 일정을 삭제할까요?</AppText>
          <AppText variant="callout" tone="secondary">
            상대 달력에서도 함께 사라져요.
          </AppText>
          <View style={styles.row}>
            <View style={styles.flex}>
              <Button label="취소" variant="outline" onPress={() => setConfirmDelete(false)} />
            </View>
            <View style={styles.flex}>
              <Button
                label="삭제"
                variant="danger"
                compact
                onPress={() => {
                  router.back();
                  removeEvent(event.id);
                }}
              />
            </View>
          </View>
        </View>
      ) : null}

      {course.length ? (
        <View style={styles.section}>
          <AppText variant="title3">코스 {course.length}곳</AppText>
          {course.map((p, i) => (
            <Pressable key={p.id} accessibilityRole="link" onPress={() => router.push(`/place/${p.id}`)} style={styles.stop}>
              <View style={[styles.no, { backgroundColor: colors.primary }]}>
                <AppText variant="micro" style={{ color: colors.onPrimary }}>
                  {i + 1}
                </AppText>
              </View>
              <CategoryIcon category={p.category} />
              <View style={styles.flex}>
                <AppText variant="title3" numberOfLines={1}>
                  {p.name}
                </AppText>
                <AppText variant="caption" tone="secondary" numberOfLines={1}>
                  {placeCategories[p.category].label} · {p.address}
                </AppText>
              </View>
              <Icon name="chevronRight" size={20} color={colors.textDisabled} />
            </Pressable>
          ))}
        </View>
      ) : null}

      {event.memo ? (
        <View style={styles.section}>
          <AppText variant="title3">메모</AppText>
          <View style={[styles.memo, { backgroundColor: colors.surfaceAlt }]}>
            <AppText variant="callout">{event.memo}</AppText>
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { gap: space[2] },
  type: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  section: { gap: space[3] },
  stop: { flexDirection: 'row', alignItems: 'center', gap: space[3], minHeight: 52 },
  no: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  memo: { borderRadius: radius.sm, paddingVertical: space[3], paddingHorizontal: space[4] },
  confirm: { borderWidth: 1, borderRadius: radius.lg, padding: space[5], gap: space[2] },
  row: { flexDirection: 'row', gap: space[2], alignItems: 'center' },
  flex: { flex: 1 },
});
