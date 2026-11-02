import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '@/i18n';
import { env } from '@/config/env';
import { restoreLanguage } from '@/features/settings/language';
import { startMocks } from '@/services/mocks';
import { ThemeProvider, fontAssets, useTheme } from '@/ui';

const queryClient = new QueryClient();

function Screens() {
  const theme = useTheme();
  return (
    <>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.canvas } }} />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fontAssets);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void (async () => {
      if (env.useMocks) await startMocks();
      await restoreLanguage();
      setReady(true);
    })();
  }, []);

  if (!fontsLoaded || !ready) return null;
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Screens />
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
