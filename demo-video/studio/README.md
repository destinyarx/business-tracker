# Negosyo Tracker Launch Video

Frame-driven Remotion project for the 48-second Negosyo Tracker product showcase.

## Preview

```powershell
npm install
npm run dev
```

Choose `NegosyoTrackerLaunch16x9` or `NegosyoTrackerLaunch9x16` in Remotion Studio.

## Validate

```powershell
npm run lint
npm run build
```

## Render

```powershell
npx remotion render NegosyoTrackerLaunch16x9 out/negosyo-tracker-launch-16x9.mp4 --codec=h264 --crf=18
npx remotion render NegosyoTrackerLaunch9x16 out/negosyo-tracker-launch-9x16.mp4 --codec=h264 --crf=18
```

The detailed product audit, fixture, storyboard, production notes, and Claude handoff are in [`../docs`](../docs).

## Showcase cut (v2)

`NegosyoTrackerShowcase` (1920×1080, 60 fps, ~47 s) is the redesigned cut in `src/showcase/`. It reuses the screen mocks and fixture from `src/video/`, but uses the landing page's own brand: a mint canvas, the lime→teal bezel, and Poppins + IBM Plex Mono. A keyframed camera (`Stage.tsx`) zooms into the UI so the text stays readable.

```powershell
npx remotion render NegosyoTrackerShowcase out/negosyo-tracker-showcase.mp4 --codec=h264 --crf=18
```

Beats and durations live in `src/showcase/Showcase.tsx`. Camera shots and callouts are in `src/showcase/ProductScenes.tsx`, and their frame numbers follow each screen's local timeline.

### Audio

All showcase audio is synthesized by `scripts/generate-audio.mts` into `public/audio/`. There is no third-party audio, so there is nothing to license. Each file is normalized to a -1 dBFS peak. Regenerate after editing the script:

```powershell
npm run audio
```

| File | Role |
| --- | --- |
| `src/showcase/audio/audio-config.ts` | Levels (music -24 dB, UI -12 dB), music fades, sound library |
| `src/showcase/audio/sound-timing.ts` | Cue map in each scene's local frames. Whooshes are derived from `timeline.ts` |
| `src/showcase/audio/ShowcaseAudio.tsx` | `BackgroundMusic`, `SoundEffect` and the combined audio layer |
| `src/showcase/timeline.ts` | Scene order and lengths, shared by picture and sound |

If you change a scene's length in `timeline.ts`, the sound cues move with it. If you change an animation's frame inside a scene, update the matching cue in `sound-timing.ts`.
