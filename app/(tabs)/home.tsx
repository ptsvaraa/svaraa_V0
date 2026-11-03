import { Image, Pressable, View } from 'react-native';
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

      {/* Product story: the pendant, from the marketing site. Opens Explore. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${t('home.product.name')}. ${t('home.product.body')}`}
        onPress={() => router.navigate('/explore')}
        style={{
          borderRadius: theme.radius.xl,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: theme.colors.borderSubtle,
          backgroundColor: theme.colors.surfaceSolid,
        }}
      >
        <Image
          source={require('../../assets/story/pendant.webp')}
          accessibilityRole="image"
          accessibilityLabel={t('home.product.alt')}
          resizeMode="cover"
          style={{ width: '100%', aspectRatio: 725 / 394, backgroundColor: theme.colors.sunken }}
        />
        <View style={{ padding: theme.space[4], gap: theme.space[1] }}>
          <Text variant="heading" tone="heading">
            {t('home.product.name')}
          </Text>
          <Text variant="bodySm" tone="secondary">
            {t('home.product.body')}
          </Text>
        </View>
      </Pressable>
      <ListRow title={t('home.explore')} onPress={() => router.navigate('/explore')} />
      <ListRow title={t('home.buying')} onPress={() => router.navigate('/explore')} />
    </Screen>
  );
}
