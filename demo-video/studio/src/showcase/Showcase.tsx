import { TransitionSeries, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import type { ComponentType } from 'react';
import { ShowcaseAudio } from './audio/ShowcaseAudio';
import { BrandScene, HookScene, OutroScene } from './IntroScenes';
import {
  DashboardTour,
  FulfillmentFlow,
  ImpactFlow,
  OrderFlow,
  SalesFlow,
} from './ProductScenes';
import { TRANSITION_FRAMES, beats } from './timeline';
import type { BeatName } from './timeline';

export { SHOWCASE_FRAMES } from './timeline';

const scenes: Record<BeatName, ComponentType> = {
  Hook: HookScene,
  Brand: BrandScene,
  Dashboard: DashboardTour,
  Order: OrderFlow,
  Fulfillment: FulfillmentFlow,
  Sales: SalesFlow,
  Impact: ImpactFlow,
  Outro: OutroScene,
};

const timing = springTiming({
  config: { damping: 200 },
  durationInFrames: TRANSITION_FRAMES,
});

export const Showcase = () => (
  <>
    <TransitionSeries>
      {beats.flatMap(({ name, frames, enter }, index) => {
        const Scene = scenes[name];
        return [
          ...(index === 0
            ? []
            : [
                <TransitionSeries.Transition
                  key={`${name}-in`}
                  timing={timing}
                  presentation={
                    enter === 'slide' ? slide({ direction: 'from-right' }) : fade()
                  }
                />,
              ]),
          <TransitionSeries.Sequence key={name} name={name} durationInFrames={frames}>
            <Scene />
          </TransitionSeries.Sequence>,
        ];
      })}
    </TransitionSeries>
    <ShowcaseAudio />
  </>
);
