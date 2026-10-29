import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';

// 홈-01 (F-50, F-52): 사귄 지 N일, 다가오는 기념일, 이번 주 일정, 최근 저장한 장소
export default function HomeScreen() {
  return (
    <Screen title="꽁냥">
      <AppText variant="display" tone="accent">
        D+1
      </AppText>
      <AppText tone="secondary">홈 화면은 W6에서 만든다.</AppText>
    </Screen>
  );
}
