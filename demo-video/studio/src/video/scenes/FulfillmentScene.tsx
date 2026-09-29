import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { BrandBackdrop } from '../components/BrandBackdrop';
import { BrowserWindow } from '../components/BrowserWindow';
import { Cursor } from '../components/Cursor';
import { SceneCopy } from '../components/SceneCopy';
import { VerticalFlow } from '../components/VerticalFlow';
import { FulfillmentScreen } from '../screens/FulfillmentScreen';
import type { VideoLayout } from '../types';

type FulfillmentSceneProps = {
  layout: VideoLayout;
};

export const FulfillmentScene = ({ layout }: FulfillmentSceneProps) => {
  const frame = useCurrentFrame();
  const baseScale = 0.9;

  return (
    <BrandBackdrop>
      <div className="absolute left-[7%] top-[5%] z-20">
        <SceneCopy
          eyebrow="The records move together"
          title="Start the work. Stock follows. Complete it. A Sale is recognized."
          layout={layout}
        />
      </div>
      <div
        className="absolute left-1/2 top-[25%] h-[900px] w-[1600px] origin-top-left"
        style={{
          marginLeft: layout === 'portrait' ? -720 : -800,
          translate: interpolate(
            frame,
            [0, 60, 180, 430],
            ['0px 60px', '0px 0px', '-20px -10px', '30px -12px'],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
          scale: interpolate(
            frame,
            [0, 70, 180, 430],
            [baseScale * 0.94, baseScale, baseScale * 1.08, baseScale * 1.02],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              output: 'perceptual-scale',
            },
          ),
          opacity: interpolate(frame, [0, 30], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <div className="relative h-[900px] w-[1600px]">
          <BrowserWindow url="app.negosyotracker.ph/orders">
            <FulfillmentScreen />
          </BrowserWindow>
          <Cursor
            points={[
              { frame: 15, x: 650, y: 620 },
              { frame: 60, x: 650, y: 620 },
              { frame: 105, x: 470, y: 650 },
              { frame: 210, x: 650, y: 620 },
              { frame: 245, x: 470, y: 650 },
              { frame: 340, x: 1220, y: 730 },
            ]}
            clickFrames={[60, 105, 210, 245]}
          />
        </div>
      </div>
      {layout === 'portrait' && <VerticalFlow active={frame >= 285 ? 2 : 1} />}
    </BrandBackdrop>
  );
};
