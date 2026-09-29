import { Cursor } from '../video/components/Cursor';
import { DashboardScreen } from '../video/screens/DashboardScreen';
import { FulfillmentScreen } from '../video/screens/FulfillmentScreen';
import { OrderCreateScreen } from '../video/screens/OrderCreateScreen';
import { SalesScreen } from '../video/screens/SalesScreen';
import { BrandCanvas, Callout, Caption } from './brand';
import { Stage, wide } from './Stage';

// Camera targets are in stage pixels (1600×900 browser + 12px bezel).
// Screen components keep their own local timelines; frame numbers below line up with them.

export const DashboardTour = () => (
  <BrandCanvas>
    <Stage
      tiltIn
      url="app.negosyotracker.ph/dashboard"
      shots={[
        wide(0),
        wide(90),
        { at: 150, x: 918, y: 262, zoom: 1.45 },
        { at: 215, x: 918, y: 262, zoom: 1.45 },
        { at: 275, x: 720, y: 690, zoom: 1.4 },
      ]}
    >
      <DashboardScreen mode="before" />
    </Stage>
    <Caption
      at={40}
      step="01 · Dashboard"
      title="See the whole shop at a glance"
      body="Sales, expenses, profit and what needs doing, on one screen."
    />
  </BrandCanvas>
);

export const OrderFlow = () => (
  <BrandCanvas>
    <Stage
      url="app.negosyotracker.ph/orders"
      shots={[
        wide(0),
        wide(40),
        { at: 85, x: 640, y: 300, zoom: 1.7 },
        { at: 190, x: 640, y: 300, zoom: 1.7 },
        { at: 240, x: 640, y: 610, zoom: 1.5 },
        { at: 425, x: 640, y: 610, zoom: 1.5 },
        { at: 470, x: 1020, y: 520, zoom: 1.55 },
        { at: 515, x: 1020, y: 600, zoom: 1.55 },
        { at: 548, x: 960, y: 480, zoom: 1.25 },
        { at: 600, x: 1250, y: 330, zoom: 1.25 },
        wide(655),
      ]}
    >
      <OrderCreateScreen />
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
    </Stage>
    <Caption
      at={20}
      step="02 · Orders"
      title="Build an order in seconds"
      body="Pick a saved customer and add products from stock. The total adds itself up."
    />
    <Callout
      at={625}
      x={1390}
      y={640}
      eyebrow="Order #5026 · Pending"
      title="₱1,310.00"
      rows={[
        ['Customer', 'Juan Dela Cruz'],
        ['Items', '5 units'],
      ]}
    />
  </BrandCanvas>
);

export const FulfillmentFlow = () => (
  <BrandCanvas>
    <Stage
      url="app.negosyotracker.ph/orders"
      shots={[
        wide(0),
        { at: 45, x: 560, y: 470, zoom: 1.5 },
        { at: 112, x: 560, y: 470, zoom: 1.5 },
        { at: 160, x: 1230, y: 390, zoom: 1.5 },
        { at: 205, x: 1230, y: 390, zoom: 1.5 },
        { at: 238, x: 560, y: 500, zoom: 1.5 },
        { at: 292, x: 560, y: 500, zoom: 1.5 },
        { at: 340, x: 1060, y: 470, zoom: 1.1 },
      ]}
    >
      <FulfillmentScreen />
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
    </Stage>
    <Caption
      at={20}
      step="03 · Fulfillment"
      title="Move the order. Stock follows."
      body="Start it and inventory drops. Complete it and the sale is recorded."
    />
    <Callout
      at={175}
      until={228}
      x={96}
      y={96}
      eyebrow="Inventory · updated"
      title="Stock deducted"
      rows={[
        ['Ube Pandesal Box', '18 → 16'],
        ['Cebu Dried Mango', '9 → 7'],
        ['Calamansi Concentrate', '16 → 15'],
      ]}
    />
    <Callout
      at={300}
      x={1390}
      y={96}
      eyebrow="Sale #7026 · Recognized"
      title="₱1,310.00"
      rows={[
        ['Profit', '₱368.50'],
        ['From', 'Order #5026'],
      ]}
    />
  </BrandCanvas>
);

export const SalesFlow = () => (
  <BrandCanvas>
    <Stage
      url="app.negosyotracker.ph/sales"
      shots={[
        wide(0),
        { at: 40, x: 800, y: 330, zoom: 1.45 },
        { at: 190, x: 800, y: 330, zoom: 1.45 },
        { at: 230, x: 812, y: 470, zoom: 1.45 },
      ]}
    >
      <SalesScreen />
      <Cursor
        points={[
          { frame: 100, x: 620, y: 420 },
          { frame: 188, x: 520, y: 420 },
          { frame: 235, x: 1040, y: 720 },
        ]}
        clickFrames={[188]}
        hiddenBefore={90}
      />
    </Stage>
    <Caption
      at={20}
      step="04 · Sales"
      title="Sales record themselves"
      body="Every completed order becomes a sale. No second entry."
    />
    <Callout
      at={85}
      until={195}
      x={1390}
      y={96}
      eyebrow="New sale · No re-typing"
      title="+₱1,310.00"
      rows={[['Juan’s Merienda Pack', 'Sale #7026']]}
    />
  </BrandCanvas>
);

export const ImpactFlow = () => (
  <BrandCanvas>
    <Stage
      url="app.negosyotracker.ph/dashboard"
      shots={[
        wide(0),
        { at: 45, x: 918, y: 262, zoom: 1.45 },
        { at: 215, x: 918, y: 262, zoom: 1.45 },
        wide(275),
      ]}
    >
      <DashboardScreen mode="after" animateImpact />
    </Stage>
    <Caption
      at={20}
      step="05 · Dashboard"
      title="Your numbers, always current"
      body="Sales, profit and the order queue update as soon as the work is done."
    />
    <Callout
      at={255}
      x={1390}
      y={96}
      eyebrow="This month"
      title="₱16,109.50 profit"
      rows={[
        ['Sales', '₱52,470 → ₱53,780'],
        ['Completed orders', '24 → 25'],
        ['In the queue', '6 → 5'],
      ]}
    />
  </BrandCanvas>
);
