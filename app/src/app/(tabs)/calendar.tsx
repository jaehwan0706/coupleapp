import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { InlineEmpty } from '@/components/EmptyState';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/Screen';
import { EventCard, EventTypeDot } from '@/features/events/EventCard';
import { useStore } from '@/features/store';
import type { CalendarEvent } from '@/features/types';
import { formatMonthDayLong, monthCells, todayKey, upcomingAnniversaries } from '@/lib/date';
import { radius, screenPadding, shadow, size, space, typography, useTheme } from '@/theme';

// 캘린더-01 월간 달력 (F-30, F-32, F-51). 기념일은 사귄 날로 자동 계산해 ◆로 표시한다.
export default function CalendarScreen() {
  const { colors } = useTheme();
  const { couple, events, places } = useStore();
  const today = todayKey();
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [selected, setSelected] = useState(today);

  const cells = useMemo(() => monthCells(cursor.year, cursor.month), [cursor]);

  const anniversaries = useMemo(
    () => (couple ? upcomingAnniversaries(couple.startDate, 40, cells[0].key) : []),
    [couple, cells],
  );

  const byDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) map.set(e.date, [...(map.get(e.date) ?? []), e]);
    // 종일 일정이 먼저, 나머지는 시작 시간 순
    const order = (e: CalendarEvent) => (e.allDay ? '' : (e.startTime ?? ''));
    for (const list of map.values()) list.sort((a, b) => order(a).localeCompare(order(b)));
    return map;
  }, [events]);

  const moveMonth = (delta: number) =>
    setCursor(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  const goToday = () => {
    const d = new Date();
    setCursor({ year: d.getFullYear(), month: d.getMonth() });
    setSelected(today);
  };

  const dayEvents = byDate.get(selected) ?? [];
  const dayAnni = anniversaries.filter((a) => a.date === selected);

  return (
    <SafeAreaView edges={['top']} style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.bar}>
        <IconButton icon="chevronLeft" label="이전 달" onPress={() => moveMonth(-1)} />
        <AppText variant="title2">
          {cursor.year}년 {cursor.month + 1}월
        </AppText>
        <IconButton icon="chevronRight" label="다음 달" onPress={() => moveMonth(1)} />
        <View style={styles.flex} />
        <Button label="오늘" variant="text" onPress={goToday} />
      </View>

      <View style={styles.grid}>
        {['일', '월', '화', '수', '목', '금', '토'].map((w, i) => (
          <AppText key={w} variant="micro" style={[styles.weekday, { color: i === 0 ? colors.danger : i === 6 ? '#2D8FD6' : colors.textSecondary }]}>
            {w}
          </AppText>
        ))}
        {cells.map((c) => {
          const list = byDate.get(c.key) ?? [];
          const isAnni = anniversaries.some((a) => a.date === c.key);
          const isSel = c.key === selected;
          const isToday = c.key === today;
          const color = !c.inMonth ? colors.textDisabled : c.weekday === 0 ? colors.danger : c.weekday === 6 ? '#2D8FD6' : colors.textPrimary;
          return (
            <Pressable
              key={c.key}
              accessibilityRole="button"
              accessibilityLabel={`${formatMonthDayLong(c.key)}${list.length ? `, 일정 ${list.length}개` : ''}`}
              accessibilityState={{ selected: isSel }}
              onPress={() => setSelected(c.key)}
              style={styles.cell}
            >
              <View style={[styles.num, isSel && { backgroundColor: colors.primary }, isToday && !isSel && [styles.today, { borderBottomColor: colors.primary }]]}>
                <AppText variant="callout" style={{ color: isSel ? colors.onPrimary : color, fontWeight: isSel || isToday ? '600' : '400' }}>
                  {c.day}
                </AppText>
              </View>
              <View style={styles.dots}>
                {isAnni ? <EventTypeDot type="anniversary" /> : null}
                {list.slice(0, isAnni ? 2 : 3).map((e) => (
                  <EventTypeDot key={e.id} type={e.type} />
                ))}
                {list.length > (isAnni ? 2 : 3) ? <AppText style={[typography.micro, styles.more]}>+</AppText> : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <ScrollView contentContainerStyle={styles.list}>
        <View style={styles.dayHead}>
          <AppText variant="title3">{formatMonthDayLong(selected)}</AppText>
          {dayEvents.length ? (
            <AppText variant="caption" tone="secondary">
              일정 {dayEvents.length}
            </AppText>
          ) : null}
        </View>
        {dayAnni.map((a) => (
          <View key={a.label} style={[styles.anni, { backgroundColor: colors.secondarySoft }]}>
            <Icon name="heart" size={20} color={colors.secondary} filled />
            <AppText variant="title3">{a.label}</AppText>
          </View>
        ))}
        {dayEvents.map((e) => (
          <EventCard key={e.id} event={e} places={places} onPress={() => router.push(`/event/${e.id}`)} />
        ))}
        {!dayEvents.length && !dayAnni.length ? (
          <InlineEmpty text="이날은 일정이 없어요" actionLabel="일정 추가" actionIcon="plus" onAction={() => router.push({ pathname: '/event/edit', params: { date: selected } })} />
        ) : null}
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="일정 추가"
        onPress={() => router.push({ pathname: '/event/edit', params: { date: selected } })}
        style={({ pressed }) => [styles.fab, shadow.md, { backgroundColor: pressed ? colors.primaryPressed : colors.primary }]}
      >
        <Icon name="plus" color={colors.onPrimary} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  bar: { height: size.appBar, flexDirection: 'row', alignItems: 'center', paddingHorizontal: space[2] },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: screenPadding },
  weekday: { width: `${100 / 7}%`, textAlign: 'center', height: 24, lineHeight: 24 },
  cell: { width: `${100 / 7}%`, height: 48, alignItems: 'center', paddingTop: 2, gap: 2 },
  num: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  today: { borderRadius: 0, width: 22, borderBottomWidth: 2 },
  dots: { flexDirection: 'row', gap: 3, height: 8, alignItems: 'center' },
  more: { lineHeight: 8 },
  divider: { height: 1, marginTop: space[2] },
  list: { padding: screenPadding, gap: space[3], paddingBottom: 96 },
  dayHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  anni: { flexDirection: 'row', alignItems: 'center', gap: space[3], borderRadius: radius.md, padding: space[4] },
  fab: { position: 'absolute', right: screenPadding, bottom: space[5], width: 56, height: 56, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
});
