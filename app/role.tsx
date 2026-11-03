import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useErrorText } from '@/features/auth/useErrorText';
import { useHousehold } from '@/features/household/store';
import { createHousehold, type Role } from '@/services/household/householdApi';
import { Button, Card, Option, Screen, Text, useTheme } from '@/ui';

type Pick = Role | 'unsure';

/**
 * B1 · Who are you? Wearer or caregiver. The choice creates the household with that role.
 * "Not sure" creates nothing: the setup card on Home stays at "not started".
 */
export default function RoleChoice() {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const errorText = useErrorText();
  const [pick, setPick] = useState<Pick | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const next = async () => {
    if (!pick) return;
    if (pick === 'unsure') {
      router.replace('/home');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const household = await createHousehold(pick);
      await useHousehold.getState().chooseRole(household.role, household.id);
      router.replace(household.role === 'wearer' ? '/wearer/permissions' : '/caregiver-permissions');
    } catch (e) {
      setError(errorText(e));
      setBusy(false);
    }
  };

  return (
    <Screen
      footer={
        <Button
          label={t('common.continue')}
          onPress={() => void next()}
          disabled={!pick}
          loading={busy}
          fullWidth
        />
      }
    >
      <Button label={t('common.back')} variant="tertiary" onPress={() => router.back()} />
      <Text variant="title1" tone="heading" accessibilityRole="header">
        {t('role.title')}
      </Text>
      <Text tone="secondary">{t('role.subtitle')}</Text>
      <Option
        title={t('role.wearer.title')}
        detail={t('role.wearer.detail')}
        selected={pick === 'wearer'}
        onPress={() => setPick('wearer')}
      />
      <Option
        title={t('role.caregiver.title')}
        detail={t('role.caregiver.detail')}
        selected={pick === 'caregiver'}
        onPress={() => setPick('caregiver')}
      />
      <Option
        title={t('role.unsure.title')}
        detail={t('role.unsure.detail')}
        selected={pick === 'unsure'}
        onPress={() => setPick('unsure')}
      />
      {pick === 'caregiver' ? (
        <Card style={{ gap: theme.space[2] }}>
          <Text tone="secondary">{t('role.caregiver.hint')}</Text>
        </Card>
      ) : null}
      {error ? (
        <Text tone="safety" accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </Screen>
  );
}
