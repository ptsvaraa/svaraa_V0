import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useGreetingName } from '@/features/home/useGreetingName';
import { useHousehold } from '@/features/household/store';
import { AttentionCard, ListRow, Screen, Text, useTheme } from '@/ui';

/** A4 · Home before setup. The setup card stays until a pendant is Active, and resumes where the person left off. */
export default function Home() {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const name = useGreetingName();
  const { setupStep, totalSteps, hasActiveDevice } = useHousehold();
  const started = setupStep > 0;
  const openSetup = () => router.push('/setup');

  return (
    <Screen bottomInset={false}>
      <Text variant="title1" tone="heading" accessibilityRole="header">
        {name ? t('home.greeting', { name }) : t('home.greetingNoName')}
      </Text>

      {hasActiveDevice ? null : (
        <>
          <AttentionCard
            severity="attention"
            title={t('home.setup.title')}
            detail={
              started
                ? t('home.setup.saved', { current: setupStep, total: totalSteps })
                : t('home.setup.notStarted')
            }
            action={started ? t('home.setup.continue') : t('home.setup.start')}
            onAction={openSetup}
          />
          {/* Shown while nothing is claimed: covers people who skipped the intro. */}
          <ListRow title={t('home.haveSvaraa')} actionLabel={t('home.start')} onPress={openSetup} />
        </>
      )}

      <View
        accessibilityLabel={t('home.story')}
        style={{ height: 90, borderRadius: theme.radius.xl, backgroundColor: theme.colors.sunken }}
      />
      <ListRow title={t('home.explore')} onPress={() => router.navigate('/explore')} />
      <ListRow title={t('home.buying')} onPress={() => router.navigate('/explore')} />
    </Screen>
  );
}
