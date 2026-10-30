import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { formatMonthDay, formatTime } from '@/lib/date';
import { eventTypes, radius, shadow, space, useTheme, type EventType } from '@/theme';
import type { CalendarEvent, Place } from '../types';

/** 일정 유형 표시: 색 + 모양 (데이트 ● · 기념일 ◆ · 기타 작은 ●) */
export function EventTypeDot({ type, size = 6, color }: { type: EventType; size?: number; color?: string }) {
  const t = eventTypes[type];
  const s = t.shape === 'smallDot' ? size - 2 : size;
  return (
    <View
      style={{
        width: s,
        height: s,
        backgroundColor: color ?? t.color,
        borderRadius: t.shape === 'diamond' ? 1 : 99,
        transform: t.shape === 'diamond' ? [{ rotate: '45deg' }] : undefined,
      }}
    />
  );
}

export function eventTimeLabel(e: CalendarEvent): string {
  if (e.allDay || !e.startTime) return '종일';
  const start = formatTime(e.startTime);
  if (!e.endTime) return start;
  const end = formatTime(e.endTime);
  // 오전/오후가 같으면 끝 시간에서는 뺀다: 오후 2:00 – 8:00
  const sameHalf = start.slice(0, 2) === end.slice(0, 2);
  return `${start} – ${sameHalf ? end.slice(3) : end}`;
}

type Props = {
  event: CalendarEvent;
  places: Place[];
  /** 홈: 날짜까지 보여준다 / 캘린더: 유형 · 시간 */
  withDate?: boolean;
  onPress?: () => void;
};

export function EventCard({ event, places, withDate = false, onPress }: Props) {
  const { colors } = useTheme();
  const t = eventTypes[event.type];
  const course = event.placeIds
    .map((id) => places.find((p) => p.id === id)?.name)
    .filter(Boolean)
    .join(' → ');
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, shadow.sm, { backgroundColor: pressed ? colors.surfaceAlt : colors.surface }]}
    >
      <View style={[styles.bar, { backgroundColor: t.color }]} />
      <View style={styles.body}>
        <View style={styles.meta}>
          {withDate ? null : <EventTypeDot type={event.type} />}
          <AppText variant="caption" tone="secondary">
            {withDate ? `${formatMonthDay(event.date)} · ${eventTimeLabel(event)}` : `${t.label} · ${eventTimeLabel(event)}`}
          </AppText>
        </View>
        <AppText variant="title3">{event.title}</AppText>
        {course ? (
          <AppText variant="callout" tone="secondary" numberOfLines={1}>
            {course}
          </AppText>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.md, flexDirection: 'row', overflow: 'hidden' },
  bar: { width: 4 },
  body: { flex: 1, paddingVertical: 14, paddingHorizontal: space[4], gap: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
