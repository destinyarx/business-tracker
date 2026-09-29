import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { BrandBackdrop } from '../components/BrandBackdrop';
import { BrowserWindow } from '../components/BrowserWindow';
import { SceneCopy } from '../components/SceneCopy';
import { VerticalFlow } from '../components/VerticalFlow';
import { DashboardScreen } from '../screens/DashboardScreen';
import type { VideoLayout } from '../types';

type ImpactSceneProps = {
  layout: VideoLayout;
};

export const ImpactScene = ({ layout }: ImpactSceneProps) => {
  const frame = useCurrentFrame();
  const baseScale = layout === 'portrait' ? 0.9 : 0.88;

  return (
    <BrandBackdrop>
      <div className="absolute left-[7%] top-[5%] z-20">
        <SceneCopy
          eyebrow="The owner sees the result"
          title="Every update lands where the business needs it."
          layout={layout}
        />
      </div>
      <div
        className="absolute left-1/2 top-[30%] h-[900px] w-[1600px] origin-top-left"
        style={{
          marginLeft: layout === 'portrait' ? -720 : -800,
          translate: interpolate(
            frame,
            [0, 65, 200, 455],
            ['0px 75px', '0px 0px', '-35px -18px', '38px -40px'],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
          scale: interpolate(
            frame,
            [0, 70, 200, 455],
            [baseScale * 0.94, baseScale, baseScale * 1.08, baseScale * 1.13],
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
        <BrowserWindow>
          <DashboardScreen mode="after" animateImpact />
        </BrowserWindow>
      </div>
      {layout === 'portrait' && <VerticalFlow active={3} />}
    </BrandBackdrop>
  );
};
