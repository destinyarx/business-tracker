import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { ClosingScene } from './scenes/ClosingScene';
import { CreateOrderScene } from './scenes/CreateOrderScene';
import { DashboardScene } from './scenes/DashboardScene';
import { FulfillmentScene } from './scenes/FulfillmentScene';
import { ImpactScene } from './scenes/ImpactScene';
import { OpeningScene } from './scenes/OpeningScene';
import { SalesScene } from './scenes/SalesScene';
import { sceneDurations } from './timing';
import type { DemoVideoProps } from './types';

export const DemoVideo = ({ layout }: DemoVideoProps) => (
  <TransitionSeries>
    <TransitionSeries.Sequence
      durationInFrames={sceneDurations.opening}
      name="Opening"
    >
      <OpeningScene layout={layout} />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={fade()}
      timing={linearTiming({
        durationInFrames: sceneDurations.transitionFrames,
      })}
    />
    <TransitionSeries.Sequence
      durationInFrames={sceneDurations.dashboard}
      name="Dashboard overview"
    >
      <DashboardScene layout={layout} />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={fade()}
      timing={linearTiming({
        durationInFrames: sceneDurations.transitionFrames,
      })}
    />
    <TransitionSeries.Sequence
      durationInFrames={sceneDurations.order}
      name="Create order"
    >
      <CreateOrderScene layout={layout} />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={fade()}
      timing={linearTiming({
        durationInFrames: sceneDurations.transitionFrames,
      })}
    />
    <TransitionSeries.Sequence
      durationInFrames={sceneDurations.fulfillment}
      name="Fulfillment"
    >
      <FulfillmentScene layout={layout} />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={fade()}
      timing={linearTiming({
        durationInFrames: sceneDurations.transitionFrames,
      })}
    />
    <TransitionSeries.Sequence
      durationInFrames={sceneDurations.sales}
      name="Sales recognition"
    >
      <SalesScene layout={layout} />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={fade()}
      timing={linearTiming({
        durationInFrames: sceneDurations.transitionFrames,
      })}
    />
    <TransitionSeries.Sequence
      durationInFrames={sceneDurations.impact}
      name="Dashboard impact"
    >
      <ImpactScene layout={layout} />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={fade()}
      timing={linearTiming({
        durationInFrames: sceneDurations.transitionFrames,
      })}
    />
    <TransitionSeries.Sequence
      durationInFrames={sceneDurations.closing}
      name="Closing"
    >
      <ClosingScene layout={layout} />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
