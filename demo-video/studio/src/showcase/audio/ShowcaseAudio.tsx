import {
  Html5Audio,
  Sequence,
  interpolate,
  staticFile,
  useVideoConfig,
} from 'remotion';
import { dbToGain, levels, music, sounds } from './audio-config';
import type { SoundName } from './audio-config';
import { soundCues } from './sound-timing';

type SoundEffectProps = {
  sound: SoundName;
  at: number;
  label?: string;
};

// One UI sound, starting at global frame `at`, at the shared UI level.
export const SoundEffect = ({ sound, at, label }: SoundEffectProps) => {
  const { fps } = useVideoConfig();
  const definition = sounds[sound];
  return (
    <Sequence
      from={at}
      durationInFrames={Math.ceil(definition.seconds * fps)}
      layout="none"
      name={label ?? sound}
    >
      <Html5Audio
        src={staticFile(definition.file)}
        volume={() => dbToGain(levels.uiDb)}
      />
    </Sequence>
  );
};

// Ambient bed at the music level, faded in and out over the composition.
export const BackgroundMusic = () => {
  const { durationInFrames } = useVideoConfig();
  const gain = dbToGain(levels.musicDb);
  return (
    <Html5Audio
      name="Music bed"
      src={staticFile(music.file)}
      volume={(frame) =>
        gain *
        interpolate(
          frame,
          [
            0,
            music.fadeInFrames,
            durationInFrames - music.fadeOutFrames,
            durationInFrames,
          ],
          [0, 1, 1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        )
      }
    />
  );
};

export const ShowcaseAudio = () => (
  <>
    <BackgroundMusic />
    {soundCues.map((cue) => (
      <SoundEffect
        key={`${cue.frame}-${cue.sound}`}
        sound={cue.sound}
        at={cue.frame}
        label={cue.label}
      />
    ))}
  </>
);
