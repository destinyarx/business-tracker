import { Easing, interpolate, useCurrentFrame } from 'remotion';
import type { VideoLayout } from '../types';

type SceneCopyProps = {
  eyebrow: string;
  title: string;
  layout: VideoLayout;
  align?: 'left' | 'center';
  enterAt?: number;
};

export const SceneCopy = ({
  eyebrow,
  title,
  layout,
  align = 'left',
  enterAt = 0,
}: SceneCopyProps) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        textAlign: align,
        opacity: interpolate(frame, [enterAt, enterAt + 18], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        translate: interpolate(
          frame,
          [enterAt, enterAt + 26],
          ['0px 28px', '0px 0px'],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          },
        ),
      }}
    >
      <p className="mb-3 font-mono text-[18px] font-semibold uppercase tracking-[.18em] text-[#5eebdd]">
        {eyebrow}
      </p>
      <h2
        className="m-0 font-semibold leading-[1.04] tracking-[-.045em] text-white"
        style={{
          fontSize: layout === 'portrait' ? 68 : 64,
          maxWidth: layout === 'portrait' ? 860 : 900,
        }}
      >
        {title}
      </h2>
    </div>
  );
};
