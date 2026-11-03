import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button, Text } from '@/ui';
import { WEARER_PATH_STEPS } from './steps';

/** Back button, "Step n of 5" (or "Optional") and the screen title, as on every C screen. */
export function StepHeader({ step, title }: { step?: number; title: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <>
      <Button
        label={t('common.back')}
        variant="tertiary"
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
      />
      <Text variant="kicker" tone="spirit">
        {step ? t('steps.progress', { current: step, total: WEARER_PATH_STEPS }) : t('wearer.optional')}
      </Text>
      <Text variant="title1" tone="heading" accessibilityRole="header">
        {title}
      </Text>
    </>
  );
}
