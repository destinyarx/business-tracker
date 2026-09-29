import type { ReactNode } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrowserWindow } from '../video/components/BrowserWindow';
import { outExpo, smooth } from './brand';

// A camera keyframe: at frame `at`, centre the screen on stage point (x, y) at `zoom`.
export type Shot = { at: number; x: number; y: number; zoom: number };

const STAGE_W = 1624;
const STAGE_H = 924;
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

type StageProps = {
  shots: readonly Shot[];
  url: string;
  children: ReactNode;
  tiltIn?: boolean;
};

// The app in a browser, framed by the landing page's lime→teal bezel, filmed by a keyframed camera.
export const Stage = ({ shots, url, children, tiltIn = false }: StageProps) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const at = shots.map((shot) => shot.at);
  const track = (key: 'x' | 'y' | 'zoom'): number =>
    interpolate(
      frame,
      at,
      shots.map((shot) => shot[key]),
      { ...clamp, easing: smooth },
    );
  const zoom = track('zoom');
  const tilt = tiltIn
    ? interpolate(frame, [0, 70], [24, 0], { ...clamp, easing: outExpo })
    : 0;
  const rise = tiltIn
    ? interpolate(frame, [0, 70], [260, 0], { ...clamp, easing: outExpo })
    : 0;

  return (
    <div style={{ position: 'absolute', inset: 0, perspective: 2200 }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: STAGE_W,
          height: STAGE_H,
          transformOrigin: '0 0',
          transform: `translate(${width / 2 - track('x') * zoom}px, ${height / 2 - track('y') * zoom + rise}px) scale(${zoom}) rotateX(${tilt}deg)`,
          padding: 12,
          borderRadius: 38,
          background: 'linear-gradient(150deg, #A8D97C, #12CDBE 52%, #7FE0DA)',
          boxShadow: '0 60px 120px -50px rgba(12,75,71,.6)',
        }}
      >
        <div className="relative h-[900px] w-[1600px]">
          <BrowserWindow url={url} className="!border-0 !shadow-none">
            {children}
          </BrowserWindow>
        </div>
      </div>
    </div>
  );
};

// Framing that fits the full stage above the caption.
export const wide = (at: number): Shot => ({ at, x: 812, y: 470, zoom: 0.9 });
