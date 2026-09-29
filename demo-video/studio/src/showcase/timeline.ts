// Scene order and lengths, shared by the picture (Showcase.tsx) and the sound map.
export const TRANSITION_FRAMES = 24;

export const beats = [
  { name: 'Hook', frames: 250, enter: 'fade' },
  { name: 'Brand', frames: 250, enter: 'fade' },
  { name: 'Dashboard', frames: 330, enter: 'fade' },
  { name: 'Order', frames: 740, enter: 'slide' },
  { name: 'Fulfillment', frames: 420, enter: 'slide' },
  { name: 'Sales', frames: 330, enter: 'slide' },
  { name: 'Impact', frames: 380, enter: 'slide' },
  { name: 'Outro', frames: 280, enter: 'fade' },
] as const;

export type BeatName = (typeof beats)[number]['name'];

// Global frame where each beat begins (transitions overlap neighbouring beats).
export const beatStarts = Object.fromEntries(
  beats.map((beat, index) => [
    beat.name,
    beats
      .slice(0, index)
      .reduce((start, previous) => start + previous.frames - TRANSITION_FRAMES, 0),
  ]),
) as Record<BeatName, number>;

export const SHOWCASE_FRAMES =
  beats.reduce((total, beat) => total + beat.frames, 0) -
  TRANSITION_FRAMES * (beats.length - 1);
