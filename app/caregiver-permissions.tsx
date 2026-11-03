import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useErrorText } from '@/features/auth/useErrorText';
import { useHousehold } from '@/features/household/store';
import {
  getPermission,
  openSettings,
  requestPermission,
  savePushToken,
  type PermissionStatus,
} from '@/services/notifications/notificationsApi';
import { Button, Card, Chip, Screen, Text, useTheme } from '@/ui';

/**
 * B3 · Permissions for caregivers: notifications only. Explain, ask, and if the person said no,
 * point to Settings (the system will not ask a second time). Then save the push token (pending backend).
 */
export default function CaregiverPermissions() {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const errorText = useErrorText();
  const [status, setStatus] = useState<PermissionStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => void getPermission().then(setStatus), []);
  useEffect(() => {
    refresh();
    // Coming back from Settings: read the permission again.
    const sub = AppState.addEventListener('change', (s) => s === 'active' && refresh());
    return () => sub.remove();
  }, [refresh]);

  const finish = async () => {
    await savePushToken();
    await useHousehold.getState().finishNotifications();
    router.replace('/setup'); // D1 (FE-04) will take over here
  };

  const allow = async () => {
    setBusy(true);
    setError(null);
    try {
      const now = status === 'granted' ? 'granted' : await requestPermission();
      setStatus(now);
      if (now === 'granted') await finish();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };

  const denied = status === 'denied';
  return (
    <Screen
      footer={
        denied ? (
          <Button label={t('permissions.openSettings')} onPress={() => void openSettings()} fullWidth />
        ) : (
          <Button
            label={status === 'granted' ? t('common.continue') : t('permissions.allow')}
            onPress={() => void allow()}
            loading={busy}
            disabled={status === null}
            fullWidth
          />
        )
      }
    >
      <Button label={t('common.back')} variant="tertiary" onPress={() => router.back()} />
      <Text variant="title1" tone="heading" accessibilityRole="header">
        {t('permissions.caregiver.title')}
      </Text>
      <Text tone="secondary">{t('permissions.caregiver.body')}</Text>
      <Card>
        <Text variant="heading">{t('permissions.notifications.title')}</Text>
        <Text tone="secondary">{t('permissions.notifications.detail')}</Text>
        <Chip
          label={
            status === 'granted'
              ? t('permissions.state.granted')
              : denied
                ? t('permissions.state.denied')
                : t('permissions.state.required')
          }
          tone={status === 'granted' ? 'good' : denied ? 'safety' : 'attention'}
        />
      </Card>
      {denied ? (
        <Card style={{ gap: theme.space[2] }}>
          <Text variant="heading">{t('permissions.denied.title')}</Text>
          <Text tone="secondary">{t('permissions.denied.body')}</Text>
        </Card>
      ) : null}
      <Text tone="secondary">{t('permissions.caregiver.note')}</Text>
      {error ? (
        <Text tone="safety" accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </Screen>
  );
}
