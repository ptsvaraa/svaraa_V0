import { useTranslation } from 'react-i18next';
import { Screen, Text } from '@/ui';

export default function Explore() {
  const { t } = useTranslation();
  return (
    <Screen bottomInset={false}>
      <Text variant="title1" tone="heading" accessibilityRole="header">
        {t('tabs.explore')}
      </Text>
      <Text tone="secondary">{t('placeholder.comingSoon')}</Text>
    </Screen>
  );
}
