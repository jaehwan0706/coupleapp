import { Tabs } from 'expo-router';

import { shadow, typography, useTheme } from '@/theme';

// v1 하단 탭 4개: 홈 · 지도 · 캘린더 · 설정. 아이콘은 DESIGN.md 라인 아이콘으로 교체 예정.
export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: typography.micro,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, ...shadow.lg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: '홈' }} />
      <Tabs.Screen name="map" options={{ title: '지도' }} />
      <Tabs.Screen name="calendar" options={{ title: '캘린더' }} />
      <Tabs.Screen name="settings" options={{ title: '설정' }} />
    </Tabs>
  );
}
