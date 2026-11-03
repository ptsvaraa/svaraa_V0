import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/ui';

/** Home, Explore, Alerts, Profile (wireframe A4). */
export default function TabsLayout() {
  const theme = useTheme();
  const { t } = useTranslation();
  const c = theme.colors;
  const tab = (title: string) => ({
    title,
    tabBarIcon: () => null,
    tabBarIconStyle: { display: 'none' as const },
  });
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: c.canvas },
        tabBarActiveTintColor: c.action,
        tabBarInactiveTintColor: c.textSecondary,
        tabBarStyle: { backgroundColor: c.surfaceSolid, borderTopColor: c.border },
        tabBarItemStyle: { minHeight: theme.minTarget, justifyContent: 'center' },
        tabBarLabelStyle: { fontSize: 14 * theme.fontScale, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="home" options={tab(t('tabs.home'))} />
      <Tabs.Screen name="explore" options={tab(t('tabs.explore'))} />
      <Tabs.Screen name="alerts" options={tab(t('tabs.alerts'))} />
      <Tabs.Screen name="profile" options={tab(t('tabs.profile'))} />
    </Tabs>
  );
}
