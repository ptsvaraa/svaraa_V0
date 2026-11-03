import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { PhoneVerify } from '@/features/auth/PhoneVerify';
import { requestOtp, verifyOtpAndSignIn } from '@/services/auth/authApi';
import { Button, Screen, Text, useTheme } from '@/ui';

/** A2 · Phone and OTP (sign-in). */
export default function PhoneSignIn() {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <Screen>
      <Button label={t('common.back')} variant="tertiary" onPress={() => router.back()} />
      <Text variant="title1" tone="heading" accessibilityRole="header">
        {t('auth.phone.title')}
      </Text>
      <Text tone="secondary" style={{ marginBottom: theme.space[2] }}>
        {t('auth.phone.subtitle')}
      </Text>
      <PhoneVerify
        onRequest={requestOtp}
        onVerify={async (phone, code) => void (await verifyOtpAndSignIn(phone, code))}
        onVerified={() => router.replace('/')}
      />
    </Screen>
  );
}
