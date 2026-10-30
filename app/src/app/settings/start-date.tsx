import { router } from 'expo-router';
import { useState } from 'react';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { StartDateField, startDateError } from '@/features/couple/StartDateField';
import { useStore } from '@/features/store';

// 설정-03 사귄 날 수정 (F-03, F-51)
export default function EditStartDateScreen() {
  const { couple, updateCouple } = useStore();
  const [date, setDate] = useState(couple?.startDate ?? '');
  const ok = !startDateError(date);

  return (
    <Screen
      back
      title="사귄 날"
      footer={
        <Button
          label="저장하기"
          disabled={!ok}
          onPress={() => {
            updateCouple({ startDate: date });
            router.back();
          }}
        />
      }
    >
      <AppText variant="callout" tone="secondary">
        바꾸면 D-day와 자동 기념일이 다시 계산돼요. 상대 화면에도 같이 바뀌어요.
      </AppText>
      <StartDateField value={date} onChange={setDate} />
    </Screen>
  );
}
