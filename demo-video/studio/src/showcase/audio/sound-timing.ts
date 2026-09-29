import { beatStarts, beats } from '../timeline';
import type { BeatName } from '../timeline';
import { WHOOSH_LEAD_FRAMES } from './audio-config';
import type { SoundName } from './audio-config';

type LocalCue = { frame: number; sound: SoundName; note: string };

export type SoundCue = { frame: number; sound: SoundName; label: string };

// Cues in each beat's local frames. They match the animation frames in
// IntroScenes.tsx, ProductScenes.tsx and the screen components in src/video/screens.
// Rule of thumb: one impact per reveal, sound only for actions the viewer sees.
const cuesByBeat: Record<BeatName, LocalCue[]> = {
  Hook: [
    { frame: 28, sound: 'click', note: 'Notebooks struck through' },
    { frame: 68, sound: 'click', note: 'Group chats struck through' },
    { frame: 108, sound: 'click', note: 'Spreadsheets struck through' },
    { frame: 150, sound: 'impact', note: 'One place for the whole negosyo' },
  ],
  Brand: [
    { frame: 4, sound: 'impact', note: 'Logo reveal' },
    { frame: 96, sound: 'data', note: 'Module cards cascade in' },
  ],
  Dashboard: [{ frame: 12, sound: 'impact', note: 'Dashboard tilts into view' }],
  Order: [
    { frame: 8, sound: 'impact', note: 'Create order screen' },
    { frame: 35, sound: 'click', note: 'Customer picked' },
    { frame: 255, sound: 'click', note: 'Ube Pandesal added' },
    { frame: 330, sound: 'click', note: 'Dried Mango added' },
    { frame: 410, sound: 'click', note: 'Calamansi added' },
    { frame: 465, sound: 'click', note: 'Quantity stepped' },
    { frame: 520, sound: 'click', note: 'Place order' },
    { frame: 530, sound: 'pop', note: 'Confirm dialog' },
    { frame: 555, sound: 'click', note: 'Confirm place order' },
    { frame: 610, sound: 'success', note: 'Order created toast' },
    { frame: 625, sound: 'pop', note: 'Order #5026 callout' },
  ],
  Fulfillment: [
    { frame: 8, sound: 'impact', note: 'Order lifecycle screen' },
    { frame: 60, sound: 'click', note: 'Update status' },
    { frame: 105, sound: 'click', note: 'In Progress' },
    { frame: 118, sound: 'data', note: 'Stock ticks down' },
    { frame: 175, sound: 'pop', note: 'Stock deducted callout' },
    { frame: 210, sound: 'click', note: 'Update status' },
    { frame: 245, sound: 'click', note: 'Completed' },
    { frame: 285, sound: 'success', note: 'Order completed, sale recognized' },
    { frame: 300, sound: 'pop', note: 'Sale #7026 callout' },
  ],
  Sales: [
    { frame: 8, sound: 'impact', note: 'Sales screen' },
    { frame: 55, sound: 'data', note: 'New sale row inserts' },
    { frame: 85, sound: 'pop', note: '+₱1,310 callout' },
    { frame: 188, sound: 'click', note: 'Open sale row' },
    { frame: 205, sound: 'pop', note: 'Sale detail dialog' },
  ],
  Impact: [
    { frame: 8, sound: 'impact', note: 'Dashboard returns' },
    { frame: 70, sound: 'data', note: 'KPIs roll to new values' },
    { frame: 255, sound: 'pop', note: 'Profit callout' },
  ],
  Outro: [
    { frame: 6, sound: 'impact', note: 'Logo and tagline' },
    { frame: 62, sound: 'pop', note: 'Get started free' },
  ],
};

const transitionCues: SoundCue[] = beats.slice(1).map((beat) => ({
  frame: beatStarts[beat.name] - WHOOSH_LEAD_FRAMES,
  sound: 'whoosh',
  label: `Transition into ${beat.name}`,
}));

// Every cue on the global timeline, in order.
export const soundCues: SoundCue[] = [
  ...transitionCues,
  ...beats.flatMap((beat) =>
    cuesByBeat[beat.name].map((cue) => ({
      frame: beatStarts[beat.name] + cue.frame,
      sound: cue.sound,
      label: `${beat.name} · ${cue.note}`,
    })),
  ),
].sort((first, second) => first.frame - second.frame);
