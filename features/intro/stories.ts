import type { ImageSourcePropType } from 'react-native';

/**
 * The product story shown in the intro (A3): three of the seven Svaraas from the marketing site
 * (voice, reminders, SOS). Text is in i18n under `intro.story.<id>`;
 * `accent` marks stories whose headline has an italic second half.
 */
export const STORIES: { id: string; image: ImageSourcePropType; accent: boolean }[] = [
  { id: 'respond', image: require('../../assets/story/respond.webp'), accent: true },
  { id: 'remind', image: require('../../assets/story/remind.webp'), accent: true },
  { id: 'rescue', image: require('../../assets/story/rescue.webp'), accent: false },
];

/** Photos are 800 x 600. */
export const STORY_IMAGE_RATIO = 800 / 600;

/** The story moves on by itself every 3 seconds. */
export const AUTO_ADVANCE_MS = 3000;
