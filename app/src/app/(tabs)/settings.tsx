import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';

// 설정-01 (F-03~F-05): 커플 프로필, 사귄 날, 연결 해제, 회원 탈퇴
export default function SettingsScreen() {
  return (
    <Screen title="설정">
      <AppText tone="secondary">설정은 W7에서 만든다.</AppText>
    </Screen>
  );
}
