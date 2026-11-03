import type { ImageSourcePropType } from 'react-native';

/**
 * The product story shown in the intro (A3): the seven Svaraas from the marketing site. Text is in i18n under `intro.story.<id>`;
 * `accent` marks stories whose headline has an italic second half.
 */
export const STORIES: { id: string; image: ImageSourcePropType; accent: boolean }[] = [
  { id: 'recite', image: require('../../assets/story/recite.webp'), accent: true },
  { id: 'respond', image: require('../../assets/story/respond.webp'), accent: true },
  { id: 'remind', image: require('../../assets/story/remind.webp'), accent: true },
  { id: 'rescue', image: require('../../assets/story/rescue.webp'), accent: false },
  { id: 'recall', image: require('../../assets/story/recall.webp'), accent: false },
  { id: 'repository', image: require('../../assets/story/repo.webp'), accent: true },
  { id: 'riddle', image: require('../../assets/story/riddle.webp'), accent: true },
];

/** Photos are 800 x 600. */
export const STORY_IMAGE_RATIO = 800 / 600;

/** The story moves on by itself every 2 seconds. */
export const AUTO_ADVANCE_MS = 2000;
