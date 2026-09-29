import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { BrandBackdrop } from '../components/BrandBackdrop';
import { BrowserWindow } from '../components/BrowserWindow';
import { Cursor } from '../components/Cursor';
import { SceneCopy } from '../components/SceneCopy';
import { VerticalFlow } from '../components/VerticalFlow';
import { DashboardScreen } from '../screens/DashboardScreen';
import type { VideoLayout } from '../types';

type DashboardSceneProps = {
  layout: VideoLayout;
};

export const DashboardScene = ({ layout }: DashboardSceneProps) => {
  const frame = useCurrentFrame();
  const baseScale = layout === 'portrait' ? 0.9 : 0.86;

  return (
    <BrandBackdrop>
      <div className="absolute left-[7%] top-[7%] z-20">
        <SceneCopy
          eyebrow="One operating view"
          title="Sales, stock, customers and costs. One workspace."
          layout={layout}
        />
      </div>
      <div
        className="absolute left-1/2 top-[31%] h-[900px] w-[1600px] origin-top-left"
        style={{
          marginLeft: layout === 'portrait' ? -720 : -800,
          translate: interpolate(
            frame,
            [0, 75, 340],
            ['0px 90px', '0px 0px', '-34px -18px'],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
          scale: interpolate(
            frame,
            [0, 80, 340],
            [baseScale * 0.92, baseScale, baseScale * 1.05],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              output: 'perceptual-scale',
            },
          ),
          rotate: interpolate(frame, [0, 75], ['1.5deg', '0deg'], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          opacity: interpolate(frame, [0, 35], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <div className="relative h-[900px] w-[1600px]">
          <BrowserWindow>
            <DashboardScreen mode="before" />
          </BrowserWindow>
          <Cursor
            points={[
              { frame: 145, x: 1190, y: 260 },
              { frame: 235, x: 112, y: 226 },
              { frame: 330, x: 108, y: 260 },
            ]}
            clickFrames={[330]}
            hiddenBefore={120}
          />
        </div>
      </div>
      {layout === 'portrait' && <VerticalFlow active={3} />}
    </BrandBackdrop>
  );
};
