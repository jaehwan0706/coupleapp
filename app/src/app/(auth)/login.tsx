import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';

// 온보딩-01 로그인 (F-01): 카카오 · 애플 · 구글
export default function LoginScreen() {
  return (
    <Screen title="로그인">
      <Button label="카카오로 시작하기" />
    </Screen>
  );
}
