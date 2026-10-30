import { Redirect, Tabs } from 'expo-router';

import { Icon, type IconName } from '@/components/Icon';
import { useStore } from '@/features/store';
import { typography, useTheme } from '@/theme';

// v1 하단 탭 4개: 홈 · 지도 · 캘린더 · 설정. 커플 연결 전에는 온보딩만 보인다.
const tabs: { name: string; title: string; icon: IconName }[] = [
  { name: 'index', title: '홈', icon: 'home' },
  { name: 'map', title: '지도', icon: 'map' },
  { name: 'calendar', title: '캘린더', icon: 'calendar' },
  { name: 'settings', title: '설정', icon: 'settings' },
];

export default function TabsLayout() {
  const { colors } = useTheme();
  const { couple } = useStore();

  if (!couple) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: typography.micro,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}
    >
      {tabs.map((t) => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{
            title: t.title,
            tabBarIcon: ({ color, focused }) => <Icon name={t.icon} color={String(color)} filled={focused && t.icon !== 'settings'} />,
          }}
        />
      ))}
    </Tabs>
  );
}
