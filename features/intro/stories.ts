/**
 * The intro (A3) for v0: how setting up Svaraa works, in four steps. Text is in i18n under `intro.story.<id>`.
 * Each slide shows a numbered placeholder card until real illustrations are made (see docs/open-items.md).
 */
export const STORIES: { id: string }[] = [
  { id: 'claim' },
  { id: 'pair' },
  { id: 'contacts' },
  { id: 'drill' },
];

/** Width / height of the placeholder card. */
export const STORY_IMAGE_RATIO = 4 / 3;

/** The story moves on by itself every 2.5 seconds. */
export const AUTO_ADVANCE_MS = 2500;

/** Time to let the slide onto the repeated first story finish before jumping back to the real one. */
export const SLIDE_SETTLE_MS = 450;
