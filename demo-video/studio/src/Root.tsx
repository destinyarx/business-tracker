import { Composition, Folder } from 'remotion';
import { SHOWCASE_FRAMES, Showcase } from './showcase/Showcase';
import { DemoVideo } from './video/DemoVideo';
import { FPS, TOTAL_FRAMES } from './video/timing';
import './index.css';

export const RemotionRoot = () => (
  <>
    <Folder name="NegosyoTracker-Launch">
      <Composition
        id="NegosyoTrackerLaunch16x9"
        component={DemoVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ layout: 'landscape' }}
      />
      <Composition
        id="NegosyoTrackerLaunch9x16"
        component={DemoVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ layout: 'portrait' }}
      />
    </Folder>
    <Folder name="NegosyoTracker-Showcase">
      <Composition
        id="NegosyoTrackerShowcase"
        component={Showcase}
        durationInFrames={SHOWCASE_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </Folder>
  </>
);
