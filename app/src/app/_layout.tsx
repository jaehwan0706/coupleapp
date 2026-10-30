import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import { StoreProvider } from '@/features/store';
import { ThemeProvider, palette } from '@/theme';

// EXPO_PUBLIC_USE_MOCK=true 이면 온보딩을 건너뛰고 예시 데이터로 시작한다.
const useMock = process.env.EXPO_PUBLIC_USE_MOCK === 'true';

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <StoreProvider withMockData={useMock}>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.light.background } }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="search" options={{ animation: 'fade' }} />
            <Stack.Screen name="place/save" options={{ presentation: 'modal' }} />
            <Stack.Screen name="event/edit" options={{ presentation: 'modal' }} />
          </Stack>
        </StoreProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
