import { useRef, useState } from 'react';
import { FlatList, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSession } from '@/services/auth/session';
import { Button, Screen, Text, useTheme } from '@/ui';

const PAGES = ['p1', 'p2', 'p3'] as const;

/** A3 · Intro. Shown once after a new account is created. Every way out ends the intro. */
export default function Intro() {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const pageWidth = Math.min(width, 520) - theme.space[5] * 2;
  const [page, setPage] = useState(0);
  const list = useRef<FlatList>(null);

  const leave = (then: () => void) => {
    useSession.getState().finishIntro();
    router.replace('/home');
    then();
  };

  return (
    <Screen
      footer={
        <>
          <Button
            label={t('intro.haveSvaraa')}
            onPress={() => leave(() => router.push('/setup'))}
            fullWidth
          />
          <Button
            label={t('intro.explore')}
            variant="secondary"
            onPress={() => leave(() => router.navigate('/explore'))}
            fullWidth
          />
          <Button
            label={t('intro.skip')}
            variant="tertiary"
            onPress={() => leave(() => undefined)}
            fullWidth
          />
        </>
      }
    >
      <View style={{ flex: 1, justifyContent: 'center', gap: theme.space[4] }}>
        <FlatList
          ref={list}
          data={PAGES}
          keyExtractor={(p) => p}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={pageWidth}
          decelerationRate="fast"
          onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / pageWidth))}
          style={{ flexGrow: 0 }}
          renderItem={({ item }) => (
            <View
              style={{ width: pageWidth, gap: theme.space[3], paddingVertical: theme.space[6] }}
              accessible
              accessibilityLabel={`${t(`intro.${item}.title`)}. ${t(`intro.${item}.body`)}`}
            >
              <View
                style={{
                  height: 150,
                  borderRadius: theme.radius.xl,
                  backgroundColor: theme.colors.sunken,
                  marginBottom: theme.space[3],
                }}
              />
              <Text variant="title1" tone="heading" accessibilityRole="header">
                {t(`intro.${item}.title`)}
              </Text>
              <Text tone="secondary">{t(`intro.${item}.body`)}</Text>
            </View>
          )}
        />
        <View
          accessible
          accessibilityLabel={t('intro.page', { n: page + 1, total: PAGES.length })}
          style={{ flexDirection: 'row', gap: theme.space[2], justifyContent: 'center' }}
        >
          {PAGES.map((p, i) => (
            <View
              key={p}
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: i === page ? theme.colors.action : theme.colors.border,
              }}
            />
          ))}
        </View>
      </View>
    </Screen>
  );
}
