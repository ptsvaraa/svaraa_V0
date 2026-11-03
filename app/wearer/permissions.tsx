import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button, Screen, Text } from '@/ui';

/**
 * PLACEHOLDER for B2 (permissions for wearers) and the wearer-first path (C1 onwards), built in FE-B's branch.
 * FE-03 only sends wearers here after they choose their role at B1. FE-B replaces this file.
 */
export default function WearerPermissions() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <Screen>
      <Button label={t('common.back')} variant="tertiary" onPress={() => router.back()} />
      <Text variant="title1" tone="heading" accessibilityRole="header">
        {t('wearer.title')}
      </Text>
      <Text tone="secondary">{t('wearer.body')}</Text>
    </Screen>
  );
}
