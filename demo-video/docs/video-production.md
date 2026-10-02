# Negosyo Tracker Video Production Guide

## Delivery summary

The showcase is a frame-driven Remotion project in `demo-video/studio`. It recreates the real Negosyo Tracker navigation, dashboard, order workflow, inventory behavior, sales record, and business metrics rather than recording a live authenticated session.

Two compositions share the same scenes and data:

| Composition ID | Resolution | Frame rate | Duration | Intended use |
| --- | ---: | ---: | ---: | --- |
| `NegosyoTrackerLaunch16x9` | 1920 × 1080 | 60 fps | 2,880 frames / 48 seconds | Website hero, YouTube, presentations |
| `NegosyoTrackerLaunch9x16` | 1080 × 1920 | 60 fps | 2,880 frames / 48 seconds | Reels, Shorts, Stories |

The landscape composition shows the full application viewport. The portrait composition uses deliberate horizontal crops of the same UI and adds a compact Order → Stock → Sale → Dashboard progress rail so the business workflow remains legible on a narrow canvas.

Rendered delivery files:

- `demo-video/studio/out/negosyo-tracker-launch-16x9.mp4`
- `demo-video/studio/out/negosyo-tracker-launch-9x16.mp4`

## Technology choice

### Deployment boundary

The web application and video studio are separate npm and TypeScript projects. The root `tsconfig.json` excludes `demo-video` so Next.js checks only the application and its other included source files. The studio uses its own `package.json`, lockfile, and `tsconfig.json` when previewing, validating, or rendering the video.

Vercel should build from the repository root using the root package install and `npm run build`. Installing the root package does not install the nested studio dependencies. Do not add Remotion packages to the root application or disable Next.js type checking to resolve video-related build errors. Keep the Remotion package dependencies in `demo-video/studio/package.json`; their classification applies to the video project, not the deployed web application.

For a fresh video checkout, run `npm ci` inside `demo-video/studio` before using its commands. Run the root build independently to validate the application deployment. Avoid importing studio source files into application code because an explicit import can bring an excluded file back into the TypeScript program.

Remotion 4 was selected because the product UI is already React-based and the video needs deterministic, reusable UI animation rather than a fragile screen recording. Every visual is rendered from the current frame with `useCurrentFrame`, `interpolate`, and spring-based motion. `@remotion/transitions` handles scene changes. Tailwind CSS 4 supports the mock interface styling, and Lucide supplies UI icons.

No live API, Clerk session, browser automation, or production database is required to render. This makes the output repeatable and prevents customer or credential exposure.

## Project structure

```text
demo-video/
├── docs/
│   ├── product-analysis.md
│   ├── video-production.md
│   └── claude-handoff.md
└── studio/
    ├── public/
    │   └── negosyo-tracker-icon.png
    ├── src/
    │   ├── video/
    │   │   ├── components/
    │   │   │   ├── AppShell.tsx
    │   │   │   ├── BrandBackdrop.tsx
    │   │   │   ├── BrowserWindow.tsx
    │   │   │   ├── Cursor.tsx
    │   │   │   ├── MetricCard.tsx
    │   │   │   ├── SceneCopy.tsx
    │   │   │   └── VerticalFlow.tsx
    │   │   ├── scenes/
    │   │   │   ├── OpeningScene.tsx
    │   │   │   ├── DashboardScene.tsx
    │   │   │   ├── CreateOrderScene.tsx
    │   │   │   ├── FulfillmentScene.tsx
    │   │   │   ├── SalesScene.tsx
    │   │   │   ├── ImpactScene.tsx
    │   │   │   └── ClosingScene.tsx
    │   │   ├── screens/
    │   │   │   ├── DashboardScreen.tsx
    │   │   │   ├── OrderCreateScreen.tsx
    │   │   │   ├── FulfillmentScreen.tsx
    │   │   │   └── SalesScreen.tsx
    │   │   ├── DemoVideo.tsx
    │   │   ├── mock-data.ts
    │   │   ├── timing.ts
    │   │   └── types.ts
    │   ├── Root.tsx
    │   ├── index.css
    │   └── index.ts
    ├── build/
    └── out/
```

## Scene timeline

Adjacent scenes overlap by 24 frames for fades. The start values below are the effective sequence starts.

| Global frames | Time | Scene | Product message and motion |
| ---: | ---: | --- | --- |
| 0–263 | 0:00–0:04.4 | Opening | Brand mark, concise value proposition, and floating commerce signals establish an all-in-one Philippine business workspace. |
| 240–623 | 0:04–0:10.4 | Dashboard | The actual dashboard structure enters inside a browser frame; sales, expenses, profit, queued orders, inventory alerts, and recent orders establish the operating picture. |
| 600–1,343 | 0:10–0:22.4 | Create order | A cursor chooses Juan Dela Cruz, names `Juan's Merienda Pack`, adds three real catalog products, and submits the ₱1,310 order. Totals update as line items appear. |
| 1,320–1,823 | 0:22–0:30.4 | Fulfillment | Order #5026 moves Pending → In Progress → Completed. Stock counts decrement only when work begins, matching backend rules. A completion signal appears when the sale is recognized. |
| 1,800–2,183 | 0:30–0:36.4 | Sales | Sale #7026 appears in the sales table with ₱1,310 revenue and ₱368.50 profit. The side detail reinforces that the sale came from the completed order. |
| 2,160–2,663 | 0:36–0:44.4 | Impact | Dashboard KPIs count to ₱53,780 sales, ₱42,830 expenses, ₱16,109.50 profit, 25 completed orders, and 5 queued orders. |
| 2,640–2,879 | 0:44–0:48 | Closing | Product icon and closing line resolve to `From order to insight — all in one flow.` |

## Product behavior represented

The video is based on inspected frontend and backend contracts:

- Orders can use either a registered customer or guest details.
- An order starts as `pending`.
- Moving `pending` → `in_progress` deducts product stock.
- Moving `in_progress` → `completed` creates the sale record.
- The sales view and dashboard reflect the recognized revenue and profit.
- Dashboard queued orders count `pending` plus `in_progress` records.

The video does not show the frontend's general order-edit request because the current frontend uses `PUT` while the backend exposes `PATCH`. This known contract mismatch is unrelated to the demonstrated status workflow and should be repaired in the application before featuring general order editing in a later cut.

## Demo data

All canonical animation data lives in `src/video/mock-data.ts`. It is deliberately Filipino and follows the real application shapes. The main record is:

- Business: Habi Home & Pantry
- Owner: Maria Santos
- Customer: Juan Dela Cruz, Quezon City
- Order: #5026, `Juan's Merienda Pack`
- Products: 2 × Ube Pandesal Box, 2 × Cebu Dried Mango 200g, 1 × Calamansi Concentrate 500ml
- Order total: ₱1,310
- Profit: ₱368.50
- Stock changes: 18 → 16, 9 → 7, and 16 → 15
- Resulting sale: #7026

The broader fixture contains customers, products, orders, expenses, inventory warnings, chart points, and dashboard before/after metrics. See `product-analysis.md` for the complete inventory and field mapping.

## Visual system

The video preserves the application's existing visual identity:

- Sidebar gradient: `#00beaa` → `#008e85`
- Deep teal actions: `#0c4b47`
- Page canvas: `#f2f5f4`
- Primary text: `#16292b`
- Borders: `#e3e9e8`
- Rounded white cards with restrained shadows
- Inter/system sans typography
- Green for healthy growth, amber for attention, and red for low stock

Motion is clean and product-led: browser-window drift, small camera pushes, deterministic cursor paths, typed text, staged row insertion, counter changes, status chips, chart growth, and 24-frame crossfades. There are no CSS keyframe animations or runtime-random visual values.

## Run and preview

Use Node.js and npm from the Remotion project directory:

```powershell
cd 'demo-video/studio'
npm install
npm run dev
```

Remotion Studio opens the composition picker. Use the timeline to inspect individual transitions and the Composition menu to switch aspect ratios.

## Validation

```powershell
cd 'demo-video/studio'
npm run lint
npm run build
```

`npm run lint` runs ESLint and TypeScript. `npm run build` creates a browser bundle in `studio/build`.

## Render and export

Landscape delivery master:

```powershell
npx remotion render NegosyoTrackerLaunch16x9 out/negosyo-tracker-launch-16x9.mp4 --codec=h264 --crf=18
```

Portrait delivery master:

```powershell
npx remotion render NegosyoTrackerLaunch9x16 out/negosyo-tracker-launch-9x16.mp4 --codec=h264 --crf=18
```

Fast review render:

```powershell
npx remotion render NegosyoTrackerLaunch16x9 out/review.mp4 --codec=h264 --crf=28 --scale=0.5
```

Representative still:

```powershell
npx remotion still NegosyoTrackerLaunch16x9 out/dashboard-impact.png --frame=2400
```

The current deliveries are intentionally silent. Add only properly licensed music and UI sound effects. Use a calm 110–125 BPM electronic bed, subtle click accents, and one soft success tone; keep the music low enough that a later voice-over remains clear.

## Editing the video

### Change copy or demo records

Edit `src/video/mock-data.ts` for names, amounts, products, chart points, and table entries. Keep totals internally consistent. If the hero basket changes, also update stock deltas, the sale values, dashboard after-state, and the analysis documentation.

### Change timing

Edit `src/video/timing.ts`. The composition duration is derived from scene durations minus transition overlaps. Animation markers inside each scene are local frame numbers, so large duration changes may also require scene-level adjustments.

### Change visual layout

- Application chrome and navigation: `src/video/components/AppShell.tsx`
- Browser treatment: `src/video/components/BrowserWindow.tsx`
- Landscape/portrait editorial labels: `src/video/components/SceneCopy.tsx`
- Portrait workflow rail: `src/video/components/VerticalFlow.tsx`
- Feature UI: `src/video/screens/*.tsx`
- Camera framing and scene orchestration: `src/video/scenes/*.tsx`

### Add a scene

1. Build a new frame-driven scene in `src/video/scenes`.
2. Add its duration to `src/video/timing.ts`.
3. Add it to `TransitionSeries` in `src/video/DemoVideo.tsx`.
4. Confirm the derived duration in `src/Root.tsx` still matches both compositions.
5. Re-run lint, build, landscape stills, and at least one portrait still.

### Add audio

Place licensed files in `public/audio`, then use Remotion's `Audio` or `Html5Audio` with frame-based volume envelopes. Do not commit unlicensed commercial tracks. Update both this guide and the handoff with the source and license.

## QA checklist for future edits

- Confirm order totals equal the animated line items.
- Confirm stock only changes at `in_progress`.
- Confirm the sale only appears after `completed`.
- Confirm dashboard before/after figures reconcile with the new sale.
- Check frames near 240, 600, 1,320, 1,800, 2,160, and 2,640 for transition collisions.
- Inspect at least one middle frame of every scene in both aspect ratios.
- Keep text inside title-safe areas; portrait should crop UI deliberately, not scale it to illegibility.
- Run ESLint, TypeScript, and the production bundle before final rendering.
- Verify the MP4 duration, resolution, and playback after export.
