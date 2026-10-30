// 날짜는 기기 로컬 기준 'YYYY-MM-DD' 문자열로 다룬다. 시간대 변환은 서버 연동(W6) 때 정한다.

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function toKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function fromKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey(): string {
  return toKey(new Date());
}

function daysBetween(fromKeyStr: string, toKeyStr: string): number {
  // 자정 기준 Date끼리 빼면 서머타임이 없는 한국에서는 정확히 하루 단위로 떨어진다.
  return Math.round((fromKey(toKeyStr).getTime() - fromKey(fromKeyStr).getTime()) / DAY_MS);
}

export function addDays(key: string, n: number): string {
  const d = fromKey(key);
  d.setDate(d.getDate() + n);
  return toKey(d);
}

/** 사귄 날 = 1일 (F-50) */
export function daysTogether(startKey: string, today = todayKey()): number {
  return daysBetween(startKey, today) + 1;
}

export type Anniversary = { label: string; date: string; dday: number };

/** 100일 단위·1주년 단위 기념일 (F-51). today 이후 것만 가까운 순으로. */
export function upcomingAnniversaries(startKey: string, count = 2, today = todayKey()): Anniversary[] {
  const result: Anniversary[] = [];
  const passed = daysTogether(startKey, today);

  for (let n = Math.max(100, Math.ceil(passed / 100) * 100); n <= passed + 3650; n += 100) {
    result.push({ label: `${n}일`, date: addDays(startKey, n - 1), dday: 0 });
  }
  const start = fromKey(startKey);
  for (let y = 1; y <= 10; y++) {
    const d = new Date(start.getFullYear() + y, start.getMonth(), start.getDate());
    result.push({ label: `${y}주년`, date: toKey(d), dday: 0 });
  }

  return result
    .map((a) => ({ ...a, dday: daysBetween(today, a.date) }))
    .filter((a) => a.dday >= 0)
    .sort((a, b) => a.dday - b.dday)
    .slice(0, count);
}

export function formatDot(key: string): string {
  return key.split('-').join('.');
}

/** 10월 31일 (토) */
export function formatMonthDay(key: string): string {
  const d = fromKey(key);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAYS[d.getDay()]})`;
}

/** 10월 31일 토요일 */
export function formatMonthDayLong(key: string): string {
  const d = fromKey(key);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${WEEKDAYS[d.getDay()]}요일`;
}

/** '14:00' → 오후 2:00 */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const half = h < 12 ? '오전' : '오후';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${half} ${h12}:${String(m).padStart(2, '0')}`;
}

export type MonthCell = { key: string; day: number; inMonth: boolean; weekday: number };

/** 달력 칸: 첫 주 일요일부터 마지막 주 토요일까지 */
export function monthCells(year: number, month: number): MonthCell[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startKey = addDays(toKey(first), -first.getDay());
  const total = first.getDay() + last.getDate() + (6 - last.getDay());
  return Array.from({ length: total }, (_, i) => {
    const key = addDays(startKey, i);
    const d = fromKey(key);
    return { key, day: d.getDate(), inMonth: d.getMonth() === month, weekday: i % 7 };
  });
}

export function isWithinWeek(key: string, today = todayKey()): boolean {
  const diff = daysBetween(today, key);
  return diff >= 0 && diff < 7;
}
