import { useState } from 'react';
import { Image, Pressable, View, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, useTheme } from '@/ui';

/** The pendant photo is 725 x 394. */
const PHOTO_RATIO = 725 / 394;

/**
 * Product card on Home (A4): the pendant photo across the full width of the card, with its name and one line
 * about it below. The photo is sized in plain numbers from the card's measured width, so it always fills the card
 * exactly, with no gap on either side and nothing cut off.
 */
export function ProductCard({ onPress }: { onPress: () => void }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();
  // Starting guess from the screen width (screen padding 2 x 20); replaced by the measured width.
  const [measured, setMeasured] = useState(0);
  const cardWidth = measured || Math.min(screenWidth, 520) - (theme.space[4] + theme.space[1]) * 2;
  // Inside the 1 px border on each side.
  const photoWidth = Math.max(0, cardWidth - 2);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${t('home.product.name')}. ${t('home.product.body')}`}
      onPress={onPress}
      onLayout={(e) => setMeasured(Math.floor(e.nativeEvent.layout.width))}
      style={{
        alignSelf: 'stretch',
        flexShrink: 0,
        overflow: 'hidden',
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
        resizeMode="cover"
        style={{
          width: photoWidth,
          height: photoWidth / PHOTO_RATIO,
          backgroundColor: theme.colors.sunken,
        }}
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
  );
}
