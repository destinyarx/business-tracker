import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { BrandBackdrop } from '../components/BrandBackdrop';
import type { VideoLayout } from '../types';

type ClosingSceneProps = {
  layout: VideoLayout;
};

export const ClosingScene = ({ layout }: ClosingSceneProps) => {
  const frame = useCurrentFrame();

  return (
    <BrandBackdrop>
      <AbsoluteFill className="flex items-center justify-center px-24 text-center">
        <div
          style={{
            opacity: interpolate(frame, [12, 42], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            translate: interpolate(frame, [12, 48], ['0px 34px', '0px 0px'], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          <Img
            src={staticFile('negosyo-tracker-icon.png')}
            className="mx-auto size-28 rounded-full shadow-[0_24px_80px_-28px_rgba(18,205,190,.8)]"
          />
          <p className="mt-5 text-[27px] font-semibold tracking-[-.03em] text-[#7fe0da]">
            NegosyoTracker
          </p>
          <h2
            className="mx-auto mt-5 max-w-[1120px] text-balance font-semibold leading-[1.02] tracking-[-.05em] text-white"
            style={{ fontSize: layout === 'portrait' ? 78 : 86 }}
          >
            Run the whole negosyo from one clear view.
          </h2>
          <p className="mt-6 text-[29px] text-white/65">
            Track your business. Grow with confidence.
          </p>
          <div className="mx-auto mt-9 h-1 w-28 rounded-full bg-gradient-to-r from-[#a8d97c] to-[#12cdbe]" />
        </div>
      </AbsoluteFill>
    </BrandBackdrop>
  );
};
