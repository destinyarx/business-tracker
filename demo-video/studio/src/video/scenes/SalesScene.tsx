import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { BrandBackdrop } from '../components/BrandBackdrop';
import { BrowserWindow } from '../components/BrowserWindow';
import { Cursor } from '../components/Cursor';
import { SceneCopy } from '../components/SceneCopy';
import { VerticalFlow } from '../components/VerticalFlow';
import { SalesScreen } from '../screens/SalesScreen';
import type { VideoLayout } from '../types';

type SalesSceneProps = {
  layout: VideoLayout;
};

export const SalesScene = ({ layout }: SalesSceneProps) => {
  const frame = useCurrentFrame();
  const baseScale = 0.9;

  return (
    <BrandBackdrop>
      <div className="absolute left-[7%] top-[6%] z-20">
        <SceneCopy
          eyebrow="Recognized automatically"
          title="No second entry. The completed order becomes a Sale."
          layout={layout}
        />
      </div>
      <div
        className="absolute left-1/2 top-[27%] h-[900px] w-[1600px] origin-top-left"
        style={{
          marginLeft: layout === 'portrait' ? -720 : -800,
          translate: interpolate(
            frame,
            [0, 70, 210, 345],
            ['0px 65px', '0px 0px', '-40px -24px', '0px -14px'],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
          scale: interpolate(
            frame,
            [0, 70, 210, 345],
            [baseScale * 0.94, baseScale, baseScale * 1.08, baseScale],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              output: 'perceptual-scale',
            },
          ),
          opacity: interpolate(frame, [0, 26], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <div className="relative h-[900px] w-[1600px]">
          <BrowserWindow url="app.negosyotracker.ph/sales">
            <SalesScreen />
          </BrowserWindow>
          <Cursor
            points={[
              { frame: 100, x: 620, y: 420 },
              { frame: 188, x: 520, y: 420 },
              { frame: 235, x: 1040, y: 720 },
            ]}
            clickFrames={[188]}
            hiddenBefore={80}
          />
        </div>
      </div>
      {layout === 'portrait' && <VerticalFlow active={2} />}
    </BrandBackdrop>
  );
};
