import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, FlatList, Image, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AUTO_ADVANCE_MS, STORIES, STORY_IMAGE_RATIO } from '@/features/intro/stories';
import { useSession } from '@/services/auth/session';
import { Button, Screen, Text, useTheme } from '@/ui';

/**
 * A3 · Intro: swipe through the product story (the seven Svaraas, from the marketing site).
 * Shown once after a new account is created. Every way out ends the intro.
 */
export default function Intro() {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const pageWidth = Math.min(width, 520) - theme.space[5] * 2;
  const [page, setPage] = useState(0);
  const list = useRef<FlatList>(null);
  const [touching, setTouching] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  // Move to the next story every 3 s, and back to the first after the last. Waits while a finger is on it,
  // and starts a fresh 3 s after any swipe. Off when the phone asks for reduced motion.
  useEffect(() => {
    if (touching || reduceMotion) return;
    const id = setTimeout(() => {
      const next = (page + 1) % STORIES.length;
      list.current?.scrollToIndex({ index: next, animated: true });
      setPage(next);
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(id);
  }, [page, touching, reduceMotion]);

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
          data={STORIES}
          keyExtractor={(story) => story.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={pageWidth}
          decelerationRate="fast"
          getItemLayout={(_, index) => ({ length: pageWidth, offset: pageWidth * index, index })}
          onScrollBeginDrag={() => setTouching(true)}
          onMomentumScrollEnd={(e) => {
            setPage(Math.round(e.nativeEvent.contentOffset.x / pageWidth));
            setTouching(false);
          }}
          style={{ flexGrow: 0 }}
          renderItem={({ item, index }) => {
            const key = `intro.story.${item.id}`;
            return (
              <View style={{ width: pageWidth, gap: theme.space[3] }}>
                <Image
                  source={item.image}
                  accessibilityRole="image"
                  accessibilityLabel={t(`${key}.alt`)}
                  resizeMode="cover"
                  style={{
                    width: pageWidth,
                    height: pageWidth / STORY_IMAGE_RATIO,
                    borderRadius: theme.radius.xl,
                    backgroundColor: theme.colors.sunken,
                  }}
                />
                <View accessible accessibilityRole="header" style={{ gap: theme.space[2] }}>
                  <Text variant="kicker" tone="spirit">
                    {String(index + 1).padStart(2, '0')} · {t(`${key}.label`)}
                  </Text>
                  <Text variant="title2" tone="heading">
                    {t(`${key}.lead`)}
                    {item.accent ? (
                      <Text variant="title2" tone="accent" italic>
                        {t(`${key}.accent`)}
                      </Text>
                    ) : null}
                  </Text>
                </View>
                <Text tone="secondary">{t(`${key}.sub`)}</Text>
              </View>
            );
          }}
        />
        <View
          accessible
          accessibilityLabel={t('intro.page', { n: page + 1, total: STORIES.length })}
          style={{ flexDirection: 'row', gap: theme.space[2], justifyContent: 'center' }}
        >
          {STORIES.map((story, i) => (
            <View
              key={story.id}
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
