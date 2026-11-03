import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '@/i18n';
import { env } from '@/config/env';
import { useHousehold } from '@/features/household/store';
import { restoreLanguage } from '@/features/settings/language';
import { startMocks } from '@/services/mocks';
import { useSession } from '@/services/auth/session';
import { ThemeProvider, fontAssets, useTheme } from '@/ui';

const queryClient = new QueryClient();

/** Keeps per-person data in step with who is signed in. */
function useSessionEffects() {
  const userId = useSession((s) => s.userId);
  useEffect(() => {
    if (userId) void useHousehold.getState().load(userId);
    else {
      useHousehold.getState().unload();
      queryClient.clear(); // never show one person's data to the next
    }
  }, [userId]);
}

function Screens() {
  const theme = useTheme();
  const status = useSession((s) => s.status);
  const signedIn = status === 'signedIn';
  const needsPhone = useSession((s) => s.status === 'signedIn' && s.method === 'google' && !s.mobile);
  useSessionEffects();
  return (
    <>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.canvas } }}>
        <Stack.Screen name="index" />
        {/* Auth guard: each group is reachable only in the state it belongs to. */}
        <Stack.Protected guard={!signedIn}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={needsPhone}>
          <Stack.Screen name="add-phone" />
        </Stack.Protected>
        <Stack.Protected guard={signedIn && !needsPhone}>
          <Stack.Screen name="intro" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="role" />
          <Stack.Screen name="caregiver-permissions" />
          <Stack.Screen name="wearer/permissions" />
          <Stack.Screen name="setup" />
        </Stack.Protected>
        <Stack.Screen name="(dev)/components" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fontAssets);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void (async () => {
      if (env.useMocks) await startMocks();
      await Promise.all([restoreLanguage(), useSession.getState().restore()]);
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
