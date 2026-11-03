import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSettings, type SchemePreference } from '@/features/settings/store';
import { logout } from '@/services/auth/authApi';
import { useSession } from '@/services/auth/session';
import { Button, Card, Choice, LanguageSwitch, ListRow, Screen, Text, useTheme, type ThemeMode } from '@/ui';

/** Profile tab: account, display settings (theme and language) and sign out. */
export default function Profile() {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { method, mobile } = useSession();
  const { themeMode, scheme, setThemeMode, setScheme } = useSettings();
  const [busy, setBusy] = useState(false);

  return (
    <Screen bottomInset={false}>
      <Text variant="title1" tone="heading" accessibilityRole="header">
        {t('profile.title')}
      </Text>

      <Card>
        <Text variant="kicker" tone="spirit">
          {t('profile.account')}
        </Text>
        <Text>
          {t('profile.signedInWith')}: {method === 'google' ? t('profile.google') : t('profile.phone')}
        </Text>
        <Text>
          {t('profile.mobile')}: {mobile ?? t('profile.mobileNone')}
        </Text>
      </Card>

      <Card>
        <Text variant="kicker" tone="spirit">
          {t('profile.display')}
        </Text>
        <View style={{ gap: theme.space[2] }}>
          <Text variant="label" tone="secondary">
            {t('profile.language')}
          </Text>
          <LanguageSwitch />
        </View>
        <View style={{ gap: theme.space[2] }}>
          <Text variant="label" tone="secondary">
            {t('profile.mode')}
          </Text>
          <Choice<ThemeMode>
            label={t('profile.mode')}
            value={themeMode}
            onChange={setThemeMode}
            options={[
              { id: 'caregiver', label: t('demo.theme.caregiver') },
              { id: 'wearer', label: t('demo.theme.wearer') },
            ]}
          />
        </View>
        <View style={{ gap: theme.space[2] }}>
          <Text variant="label" tone="secondary">
            {t('profile.scheme')}
          </Text>
          <Choice<SchemePreference>
            label={t('profile.scheme')}
            value={scheme}
            onChange={setScheme}
            options={[
              { id: 'system', label: t('demo.theme.system') },
              { id: 'light', label: t('demo.theme.light') },
              { id: 'dark', label: t('demo.theme.dark') },
            ]}
          />
        </View>
      </Card>

      {__DEV__ ? <ListRow title={t('profile.dev')} onPress={() => router.push('/components')} /> : null}

      <Button
        label={t('profile.signOut')}
        variant="secondary"
        loading={busy}
        onPress={() => {
          setBusy(true);
          void logout(); // the auth guard then sends the person to sign-in
        }}
        fullWidth
      />
    </Screen>
  );
}
