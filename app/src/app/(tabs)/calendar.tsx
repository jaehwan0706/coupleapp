import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';

// 캘린더-01 (F-30~F-33): 월간 달력, 날짜별 일정, 저장한 장소 불러오기
export default function CalendarScreen() {
  return (
    <Screen title="캘린더">
      <AppText tone="secondary">캘린더는 W6에서 만든다.</AppText>
    </Screen>
  );
}
