import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { PhoneVerify } from '@/features/auth/PhoneVerify';
import { logout, requestMobile, verifyMobile } from '@/services/auth/authApi';
import { Button, Screen, Text, useTheme } from '@/ui';

/**
 * A2 · "Add your phone", for people who signed in with Google. Required before anything else.
 * pending backend: /users/me has no mobile_number yet, so "has a phone" is remembered on this phone.
 */
export default function AddPhone() {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <Screen>
      <Text variant="title1" tone="heading" accessibilityRole="header">
        {t('auth.phone.addTitle')}
      </Text>
      <Text tone="secondary" style={{ marginBottom: theme.space[2] }}>
        {t('auth.phone.addSubtitle')}
      </Text>
      <PhoneVerify onRequest={requestMobile} onVerify={verifyMobile} onVerified={() => router.replace('/')} />
      {/* Not a way around the step: signing out leaves the account as it was. */}
      <Button label={t('profile.signOut')} variant="tertiary" onPress={() => void logout()} />
    </Screen>
  );
}
