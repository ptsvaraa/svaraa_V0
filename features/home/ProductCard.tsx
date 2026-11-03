import { useState } from 'react';
import { Image, Pressable, View, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, useTheme } from '@/ui';

/** The pendant photo is 725 x 394. */
const PHOTO_RATIO = 725 / 394;
/** The photo never gets wider than this, so it stays a comfortable size on big phones and tablets. */
const PHOTO_MAX_WIDTH = 300;

/**
 * Product card on Home (A4): the pendant photo, its name and one line about it.
 * The photo is sized in plain numbers from the card's measured width and centred inside the card with space
 * around it, so it can never run past an edge or sit off to one side.
 */
export function ProductCard({ onPress }: { onPress: () => void }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();
  const pad = theme.space[4];
  // Starting guess from the screen width (screen padding 2 x space[5], card border 2 x 1); replaced by the measured width.
  const [measured, setMeasured] = useState(0);
  const cardWidth = measured || Math.min(screenWidth, 520) - theme.space[5] * 2;
  const photoWidth = Math.max(0, Math.min(cardWidth - pad * 2 - 2, PHOTO_MAX_WIDTH));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${t('home.product.name')}. ${t('home.product.body')}`}
      onPress={onPress}
      onLayout={(e) => setMeasured(Math.floor(e.nativeEvent.layout.width))}
      style={{
        alignSelf: 'stretch',
        flexShrink: 0,
        alignItems: 'center',
        padding: pad,
        gap: theme.space[3],
        borderRadius: theme.radius.xl,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        backgroundColor: theme.colors.surfaceSolid,
      }}
    >
      <Image
        source={require('../../assets/story/pendant.webp')}
        accessibilityRole="image"
        accessibilityLabel={t('home.product.alt')}
        resizeMode="contain"
        style={{
          width: photoWidth,
          height: photoWidth / PHOTO_RATIO,
          borderRadius: theme.radius.lg,
          backgroundColor: theme.colors.sunken,
        }}
      />
      <View style={{ alignSelf: 'stretch', gap: theme.space[1], alignItems: 'center' }}>
        <Text variant="heading" tone="heading" style={{ textAlign: 'center' }}>
          {t('home.product.name')}
        </Text>
        <Text variant="bodySm" tone="secondary" style={{ textAlign: 'center' }}>
          {t('home.product.body')}
        </Text>
      </View>
    </Pressable>
  );
}
