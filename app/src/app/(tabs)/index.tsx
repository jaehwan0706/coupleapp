import { Link, router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { InlineEmpty } from '@/components/EmptyState';
import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { EventCard } from '@/features/events/EventCard';
import { PlaceRow } from '@/features/places/PlaceRow';
import { useStore } from '@/features/store';
import { daysTogether, formatDot, isWithinWeek, upcomingAnniversaries } from '@/lib/date';
import { radius, space, useTheme } from '@/theme';

// 홈-01 (F-50, F-52): 사귄 지 N일, 다가오는 기념일, 이번 주 일정, 최근 저장한 장소
export default function HomeScreen() {
  const { colors } = useTheme();
  const { couple, places, events } = useStore();
  if (!couple) return null;

  const anniversaries = upcomingAnniversaries(couple.startDate, 2);
  const thisWeek = events
    .filter((e) => isWithinWeek(e.date))
    .sort((a, b) => (a.date + (a.startTime ?? '')).localeCompare(b.date + (b.startTime ?? '')));
  const recent = [...places].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3);

  return (
    <Screen title={couple.name} tab>
      <View style={[styles.dday, { backgroundColor: colors.primarySoft }]} accessibilityLabel={`우리 사귄 지 ${daysTogether(couple.startDate)}일`}>
        <AppText variant="callout" tone="secondary">
          우리 사귄 지
        </AppText>
        <View style={styles.ddayRow}>
          <AppText variant="display">{daysTogether(couple.startDate)}</AppText>
          <AppText variant="title2">일</AppText>
        </View>
        <AppText variant="caption" tone="secondary">
          {formatDot(couple.startDate)}부터
        </AppText>
      </View>

      <Section title="다가오는 기념일">
        <View style={styles.grid}>
          {anniversaries.map((a) => (
            <View key={a.label} style={[styles.anni, { backgroundColor: colors.secondarySoft }]}>
              <Icon name="heart" size={20} color={colors.secondary} filled />
              <AppText variant="title3">{a.label}</AppText>
              <View style={styles.anniRow}>
                <AppText variant="bodyStrong" tone="accent">
                  {a.dday === 0 ? 'D-Day' : `D-${a.dday}`}
                </AppText>
                <AppText variant="caption" tone="secondary">
                  {formatDot(a.date)}
                </AppText>
              </View>
            </View>
          ))}
        </View>
      </Section>

      <Section title="이번 주 일정" link="/calendar" linkLabel="캘린더">
        {thisWeek.length ? (
          thisWeek.map((e) => <EventCard key={e.id} event={e} places={places} withDate onPress={() => router.push(`/event/${e.id}`)} />)
        ) : (
          <InlineEmpty text="이번 주 일정이 없어요" actionLabel="일정 추가" actionIcon="plus" onAction={() => router.push('/event/edit')} />
        )}
      </Section>

      <Section title="최근 저장한 장소" link="/map" linkLabel="지도">
        {recent.length ? (
          recent.map((p) => <PlaceRow key={p.id} place={p} onPress={() => router.push(`/place/${p.id}`)} />)
        ) : (
          <InlineEmpty text="아직 저장한 장소가 없어요" actionLabel="장소 검색" actionIcon="search" onAction={() => router.push('/search')} />
        )}
      </Section>
    </Screen>
  );
}

function Section({ title, link, linkLabel, children }: { title: string; link?: '/calendar' | '/map'; linkLabel?: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <AppText variant="title3">{title}</AppText>
        {link ? (
          <Link href={link} style={styles.link}>
            <AppText variant="callout" tone="accent">
              {linkLabel}
            </AppText>
          </Link>
        ) : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  dday: { borderRadius: radius.lg, padding: space[5], gap: 2 },
  ddayRow: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  section: { gap: space[3] },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 36 },
  link: { paddingVertical: space[2], paddingLeft: space[3] },
  grid: { flexDirection: 'row', gap: space[3] },
  anni: { flex: 1, borderRadius: radius.md, padding: space[4], gap: 6 },
  anniRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
});
