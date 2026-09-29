import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { BrandBackdrop } from '../components/BrandBackdrop';
import { BrowserWindow } from '../components/BrowserWindow';
import { Cursor } from '../components/Cursor';
import { SceneCopy } from '../components/SceneCopy';
import { VerticalFlow } from '../components/VerticalFlow';
import { OrderCreateScreen } from '../screens/OrderCreateScreen';
import type { VideoLayout } from '../types';

type CreateOrderSceneProps = {
  layout: VideoLayout;
};

export const CreateOrderScene = ({ layout }: CreateOrderSceneProps) => {
  const frame = useCurrentFrame();
  const baseScale = layout === 'portrait' ? 0.9 : 0.89;

  return (
    <BrandBackdrop tone="ink">
      <div className="absolute left-[7%] top-[4.5%] z-20">
        <SceneCopy
          eyebrow="A connected order"
          title="Build it from records you already trust."
          layout={layout}
        />
      </div>
      <div
        className="absolute left-1/2 top-[23%] h-[900px] w-[1600px] origin-top-left"
        style={{
          marginLeft: layout === 'portrait' ? -720 : -800,
          translate: interpolate(
            frame,
            [0, 80, 250, 455, 700],
            ['0px 70px', '0px 0px', '-34px -16px', '38px -25px', '0px -12px'],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
          scale: interpolate(
            frame,
            [0, 80, 260, 455, 700],
            [
              baseScale * 0.94,
              baseScale,
              baseScale * 1.06,
              baseScale * 1.1,
              baseScale,
            ],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              output: 'perceptual-scale',
            },
          ),
          opacity: interpolate(frame, [0, 28], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <div className="relative h-[900px] w-[1600px]">
          <BrowserWindow url="app.negosyotracker.ph/orders/new">
            <OrderCreateScreen />
          </BrowserWindow>
          <Cursor
            points={[
              { frame: 10, x: 1110, y: 210 },
              { frame: 35, x: 1060, y: 245 },
              { frame: 70, x: 410, y: 245 },
              { frame: 210, x: 390, y: 700 },
              { frame: 255, x: 390, y: 707 },
              { frame: 330, x: 602, y: 707 },
              { frame: 410, x: 816, y: 707 },
              { frame: 465, x: 1378, y: 407 },
              { frame: 520, x: 1416, y: 818 },
              { frame: 555, x: 1030, y: 610 },
              { frame: 675, x: 1480, y: 118 },
            ]}
            clickFrames={[35, 255, 330, 410, 465, 520, 555]}
          />
        </div>
      </div>
      {layout === 'portrait' && <VerticalFlow active={0} />}
    </BrandBackdrop>
  );
};
