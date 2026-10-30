import { router } from 'expo-router';
import { useState } from 'react';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { useStore } from '@/features/store';

// 설정-02 커플 프로필 수정 (F-03). 대표 사진·서로의 애칭은 S3 업로드(ADR-010)와 함께 붙인다.
export default function ProfileScreen() {
  const { couple, updateCouple } = useStore();
  const [name, setName] = useState(couple?.name ?? '');
  const trimmed = name.trim();

  return (
    <Screen
      back
      title="커플 프로필"
      footer={
        <Button
          label="저장하기"
          disabled={!trimmed}
          onPress={() => {
            updateCouple({ name: trimmed });
            router.back();
          }}
        />
      }
    >
      <TextField label="커플 이름" placeholder="봄날" maxLength={12} showCount value={name} onChangeText={setName} />
    </Screen>
  );
}
