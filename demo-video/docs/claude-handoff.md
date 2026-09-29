# Claude Handoff — Negosyo Tracker Product Showcase

## Objective

Continue, revise, or export the 48-second animated SaaS product showcase for Negosyo Tracker without repeating the repository audit. The video must feel like the real application in use, preserve its current teal visual identity, and use the Filipino fixture already encoded in the animation.

## Start here

Read these in order:

1. `demo-video/docs/product-analysis.md` — source of truth for the product, architecture, routes, features, backend behavior, data model, exact demo fixture, and storyboard.
2. `demo-video/docs/video-production.md` — source of truth for the Remotion implementation, scene timing, render commands, editing locations, and QA.
3. `demo-video/studio/src/video/mock-data.ts` — canonical values used on screen.
4. `demo-video/studio/src/video/DemoVideo.tsx` and `src/video/timing.ts` — sequence structure and duration.

Do not invent new product behavior before checking the frontend and NestJS repositories. The backend lives at:

```text
C:\Users\AlphaQuadrant\Documents\0 self project\Nest.js\business-tracker-api
```

## Current status

- Full frontend and backend analysis is complete.
- `demo-video/docs/product-analysis.md` was written before the video implementation.
- A standalone Remotion project exists at `demo-video/studio`.
- Both 1920×1080 and 1080×1920 compositions exist at 60 fps.
- Seven scenes are implemented and share the same mock data.
- Landscape and portrait representative frames were visually inspected.
- ESLint, TypeScript, and `remotion bundle` pass.
- The 16:9 H.264 delivery master is rendered to `demo-video/studio/out/negosyo-tracker-launch-16x9.mp4`.
- The 9:16 H.264 delivery master is rendered to `demo-video/studio/out/negosyo-tracker-launch-9x16.mp4`.
- The project does not call production APIs and does not need credentials.
- No production application source files were intentionally modified.

## Composition IDs

- `NegosyoTrackerLaunch16x9` — 1920×1080, 60 fps, 2,880 frames.
- `NegosyoTrackerLaunch9x16` — 1080×1920, 60 fps, 2,880 frames.

Both are registered in `demo-video/studio/src/Root.tsx`.

## Story told by the current cut

1. Introduce Negosyo Tracker as one workspace for running a business.
2. Show the dashboard and the relationship between sales, expenses, profit, orders, and low-stock products.
3. Create order #5026, `Juan's Merienda Pack`, for Juan Dela Cruz.
4. Add Ube Pandesal Box, Cebu Dried Mango 200g, and Calamansi Concentrate 500ml for ₱1,310.
5. Move the order from Pending to In Progress; inventory changes 18→16, 9→7, and 16→15.
6. Complete the order; sale #7026 appears with ₱368.50 profit.
7. Return to the dashboard as sales, profit, completed orders, and queued orders update.
8. Close on `From order to insight — all in one flow.`

This is the strongest verified workflow because it crosses the most valuable modules and mirrors real backend side effects.

## Canonical figures

Keep these reconciled if you edit the fixture:

| Metric | Before | After |
| --- | ---: | ---: |
| Sales | ₱52,470 | ₱53,780 |
| Expenses | ₱42,830 | ₱42,830 |
| Profit | ₱15,741 | ₱16,109.50 |
| Completed orders | 24 | 25 |
| Queued orders | 6 | 5 |

Hero order:

| Product | Quantity | Unit price | Line total | Stock change |
| --- | ---: | ---: | ---: | ---: |
| Ube Pandesal Box | 2 | ₱280 | ₱560 | 18 → 16 |
| Cebu Dried Mango 200g | 2 | ₱245 | ₱490 | 9 → 7 |
| Calamansi Concentrate 500ml | 1 | ₱260 | ₱260 | 16 → 15 |
| **Order total** | **5** |  | **₱1,310** |  |

## Verified domain rules

- Clerk user ID is the ownership boundary; there is no application user-role table.
- Orders may reference a registered customer or use guest customer fields.
- Orders start as `pending`.
- `pending` → `in_progress` deducts stock.
- `in_progress` → `completed` creates a Sale.
- Moving a completed order to another status reverses its Sale and requires a reason.
- Dashboard queued orders aggregate `pending` plus `in_progress`.
- Product variations and inventory transactions exist in schema history but are not active in current API/UI behavior.
- NegosyoAI, Services, and Schedules are coming-soon pages, not active demo features.
- Customer order history is currently placeholder content.

## Known application caveat

The frontend general order update function currently uses `PUT`, while the backend exposes `PATCH`. The showcase avoids that request and focuses on the verified order-status endpoint. If you expand the video to show editing order metadata, fix and test this API mismatch in the production app first.

## Visual rules to preserve

- Teal sidebar gradient `#00beaa` → `#008e85`.
- Deep teal primary action `#0c4b47`.
- Soft gray-green canvas `#f2f5f4`.
- Dark blue-green text `#16292b`.
- White cards, restrained shadow, roughly 18–20 px corner radius.
- Keep real product labels: Dashboard, Orders, Products, Inventory, Customers, Expenses, Sales.
- Do not add unverified automation, AI, notification, team-role, or reporting claims.
- Use Philippine names, locations, `+63` numbers, and peso formatting.
- Portrait framing should crop into the interface while the workflow rail supplies context. Do not shrink the entire desktop UI until it is unreadable.

## Motion rules

- All animation must remain frame-derived and deterministic.
- Use Remotion `interpolate`, `spring`, and transition primitives.
- Do not introduce CSS keyframe animations or CSS transitions for timeline motion.
- Do not use random values unless seeded.
- Keep cursor paths purposeful: target, click, visible result.
- Favor subtle camera pushes and clean crossfades over spectacle.
- Review scene boundaries at frames 240, 600, 1,320, 1,800, 2,160, and 2,640.

## Important source files

| Responsibility | Path |
| --- | --- |
| Composition registration | `demo-video/studio/src/Root.tsx` |
| Scene sequence | `demo-video/studio/src/video/DemoVideo.tsx` |
| Durations | `demo-video/studio/src/video/timing.ts` |
| Filipino fixtures | `demo-video/studio/src/video/mock-data.ts` |
| Shared types | `demo-video/studio/src/video/types.ts` |
| Product shell/navigation | `demo-video/studio/src/video/components/AppShell.tsx` |
| Portrait flow rail | `demo-video/studio/src/video/components/VerticalFlow.tsx` |
| Dashboard mock | `demo-video/studio/src/video/screens/DashboardScreen.tsx` |
| Order mock | `demo-video/studio/src/video/screens/OrderCreateScreen.tsx` |
| Fulfillment mock | `demo-video/studio/src/video/screens/FulfillmentScreen.tsx` |
| Sales mock | `demo-video/studio/src/video/screens/SalesScreen.tsx` |

## Commands

```powershell
cd 'demo-video/studio'
npm install
npm run lint
npm run build
npm run dev
```

Render landscape:

```powershell
npx remotion render NegosyoTrackerLaunch16x9 out/negosyo-tracker-launch-16x9.mp4 --codec=h264 --crf=18
```

Render portrait:

```powershell
npx remotion render NegosyoTrackerLaunch9x16 out/negosyo-tracker-launch-9x16.mp4 --codec=h264 --crf=18
```

## Skills and conventions for follow-up work

Use the Remotion best-practices router and its create, markup, and render guidance for scene changes or exports. Follow the repository's `AGENTS.md` for TypeScript and editing standards. Apply the project's anti-slop writing convention to on-screen copy. If touching the production Next.js UI, also use its frontend architecture guidelines; do not treat the video mock as authorization to refactor the application.

## Recommended next actions

1. Play the rendered 16:9 master end to end and inspect sync, pacing, clipping, and encoding artifacts.
2. Render the 9:16 master if a vertical delivery is required immediately.
3. If audio is desired, source a licensed track and subtle interface effects, then document the license.
4. If a voice-over is desired, write to the existing 48-second beat map and leave pauses around order submission, completion, and KPI resolution.
5. Re-run lint and build after every source change, then review both compositions before re-exporting.

## Do not redo

- Do not repeat the full repository scan unless the application changed after this handoff.
- Do not replace the Filipino fixture with generic American SaaS placeholders.
- Do not convert the showcase into a browser screen recording.
- Do not connect the renderer to live production data.
- Do not claim coming-soon or inactive modules are functional.
- Do not overwrite the user's existing modification in `src/features/auth/components/AuthShell.tsx`.
