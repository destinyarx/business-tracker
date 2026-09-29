# NegosyoTracker product analysis and video brief

## Document purpose

This is the source of truth for the animated product demo. It records what the application actually does, where each behavior lives, the mock records used in the film, and the story the animation must tell. The animation must not imply that unfinished modules already work.

Repository paths:

- Frontend: `C:\Users\AlphaQuadrant\Documents\0 self project\React JS - 2025\NEXT\business-tracker`
- Backend: `C:\Users\AlphaQuadrant\Documents\0 self project\Nest.js\business-tracker-api`
- Video workspace: `demo-video`

Analysis date: 29 September 2026, Asia/Manila.

## Product overview

### What the product is

NegosyoTracker is a web workspace for a Philippine small or medium business. It keeps customers, products, stock, orders, recognized sales, and expenses in one system. The Dashboard then turns those records into a current operating view.

The product's strongest value is the connection between records. A user does not maintain separate order, inventory, and sales spreadsheets. An order uses catalog products and an optional registered customer. Moving the order through its lifecycle changes stock and creates or reverses a Sale. Dashboard and Sales queries then report the result.

### Problem it solves

The app replaces a common mix of notebooks, chat messages, separate spreadsheets, and mental arithmetic. It answers practical owner questions:

- How much did completed orders bring in?
- What did the business spend?
- Which products and customers drove sales?
- Which products are low or out of stock?
- Which orders still need action?
- What was the estimated profit captured when Sales were recognized?

### Target users

The current product language and flows fit owner-operators and small teams running retail, food, household goods, hardware, personal goods, or similar product-based businesses. The system calls the authenticated user a "Business owner." There is no implemented staff role model, permission matrix, local user table, or multi-organization UI.

### Product promise for the video

Use this line as the core idea:

> From order to stock to sales, keep the whole negosyo in one view.

The proof is the order lifecycle. Show a real order being made from registered records, processed, completed, recognized as a Sale, and reflected in the Dashboard.

## Current implementation status

### Implemented and suitable for the film

- Landing page and custom Clerk sign-in/sign-up flows
- Authenticated application shell and responsive navigation
- Dashboard overview and period switching
- Customers list, tier metrics, search, tier filters, create, edit, and delete
- Products catalog, summary metrics, search, category filter, create, view, edit, delete, image upload/URL, and barcode scanning
- Inventory summary, stock table, and stock-on-hand replacement flow
- Orders search, filters, sorting, pagination, creation, status transitions, edit, delete rules, and reversal flow
- Sales summary, period filter, search, sorting, pagination, and sale detail
- Expenses summary, category mix, filters, pagination, create, view, edit, and delete
- Account settings through Clerk
- Global confirmation dialog and top-right toast feedback
- Light and dark themes

### Present but unfinished or not filmable as working features

- NegosyoAI is a coming-soon page. The backend OpenAI module is commented out.
- Services is a coming-soon page.
- Schedules is a coming-soon page. A database table exists but no active user flow writes it.
- Customer order history at `/customers/[id]/orders` only prints a placeholder label.
- Product variations have a schema but no active controller or UI.
- Transactions have a schema and placeholder module but no active persistence flow.
- Email integration exists on the backend but is not a visible product workflow in the frontend.
- Premium pricing and its AI/export/reminder claims are marked coming soon.

Do not show these as available actions. A brief "coming next" treatment is acceptable only if it is explicitly labeled.

## Application architecture

### Frontend

- Next.js 15 App Router, React 19, and TypeScript
- Tailwind CSS 4 and project-owned shadcn/ui primitives
- Clerk for authentication, Google OAuth, profile, security, and account deletion controls
- TanStack Query 5 for server state and cache invalidation
- Zustand for narrow client state such as order cart/form mode and product drawer state
- React Hook Form and Zod for forms and validation
- Axios for authenticated API requests
- TanStack Table for the customer table
- Recharts for the Dashboard cashflow chart
- date-fns for formatting dates
- Sonner-based top-right notifications through a project wrapper
- Lucide icons

Data flow follows this pattern where implemented:

```text
Page or component
  -> feature query/mutation hook
    -> feature service
      -> feature API adapter
        -> NestJS endpoint
```

API responses are treated as untrusted. Feature services parse response bodies with Zod before returning them to the UI.

### Backend

- NestJS 11 on the Fastify adapter
- TypeScript
- PostgreSQL through Drizzle ORM
- Clerk backend token verification through a global auth guard
- Redis through Keyv for selected per-user caches
- Supabase Storage for product images
- Nodemailer/Gmail integration exists for backend email features
- Scheduled worker for durable account erasure
- Standard success envelope: `{ statusCode, message, data, timestamp, path }`
- Standard error envelope: `{ statusCode, message, error, timestamp, path }`

There is no global API prefix. The default backend port is `3001`. The frontend Axios client uses `NEXT_PUBLIC_API_BASE_URL` and attaches `Authorization: Bearer <Clerk token>`.

### Authentication and ownership

Clerk protects every authenticated frontend route and nearly every backend route. The backend derives record ownership from the verified Clerk subject. There is no local `users` table and no implemented user role enum.

TanStack Query keys include the active Clerk user ID to prevent one signed-in account from seeing cached rows from another account in the same browser session.

### External systems

| System | Use |
| --- | --- |
| Clerk | Authentication, Google OAuth, profile/security UI, account deletion event |
| PostgreSQL | Operational records |
| Drizzle ORM | Schema and query layer |
| Redis/Keyv | Selected per-user API caching and sales cache generation |
| Supabase Storage | Product image upload and deletion |
| Nodemailer/Gmail | Backend email integration, not part of the chosen film flow |
| OpenAI | Source exists but module is inactive; do not present NegosyoAI as working |

## Main user flows

### Registration and sign-in

1. A user creates an account with owner/store name, email, password, and legal acceptance, or uses Google.
2. Clerk may request an email verification code.
3. A successful sign-in opens `/dashboard`.
4. Custom auth screens are branded to NegosyoTracker; Clerk still owns identity and verification.

### Customer setup

1. Open Customers.
2. Add name, optional 11-digit phone, optional email, tier, and notes.
3. The record appears in a searchable, sortable, paginated TanStack Table.
4. The customer can be attached to an Order. Walk-in sales may stay as `Guest customer`.

### Product and inventory setup

1. Open Products and add a catalog record.
2. Add title, description, category, SKU, barcode, supplier, price, stock, profit, and an optional image.
3. The product becomes available in the Order product picker when stock is above zero.
4. Inventory projects Product records. It does not have a separate inventory table.
5. "Update stock" replaces the stock-on-hand quantity with a nonnegative whole number.

### Order to Sale

1. Open Orders and choose "New order."
2. Give the Order a name or attach a registered Customer.
3. Add in-stock Products and set quantities from 1 through current stock.
4. Place the Order. New Orders always start as `pending`.
5. Move `pending` to `in_progress`. The backend deducts stock using persisted Order items.
6. Move `in_progress` to `completed`. The backend creates or restores one active Sale for that Order.
7. Sales, Products, Orders, and Dashboard queries invalidate after the mutation.
8. Moving a completed Order away from `completed` requires a reversal reason and changes its Sale to `reverted`. Stock restoration depends on the target transition.

### Expense to Dashboard

1. Open Expenses and add a cost with title, incurred date, amount, category, and payment method.
2. The record appears in the table and current filtered-page summary.
3. Dashboard invalidates and includes the expense in the selected reporting period.

### Reporting

Dashboard supports This month, This week, and Last week. It reports completed-order Sales, Expenses, estimated profit, completed Orders, cashflow, expense categories, current attention facts, top Products, and top Customers. Date boundaries use Asia/Manila.

Sales supports Today, Yesterday, This week, and This month. Search runs locally over Order name, Customer name, and notes. It does not alter the overview totals.

## Route inventory

| Route | Access | Page | Purpose and important content |
| --- | --- | --- | --- |
| `/` | Public | Landing | Hero, browser-style dashboard preview, module overview, setup steps, pricing, FAQ, CTA |
| `/about-us` | Public | About | Product/company information |
| `/login` | Public | Custom sign-in | Email/password, Google, remember-me, forgot password |
| `/register` | Public | Custom registration | Owner/store name, email, password, legal acceptance, Google, email verification |
| `/sign-in/[[...sign-in]]` | Public | Clerk fallback | Hosted Clerk sign-in path |
| `/sign-up/[[...sign-up]]` | Public | Clerk fallback | Hosted Clerk sign-up path |
| `/sso-callback` | Public | OAuth callback | Completes Clerk redirect flow |
| `/waitlist` | Auth group | Waitlist | Present in source, not part of the operating flow |
| `/privacy` | Public legal | Privacy Notice | Philippine free-release privacy terms |
| `/terms` | Public legal | Terms of Service | Product terms |
| `/data-processing-addendum` | Public legal | DPA | Business data-processing terms |
| `/dashboard` | Authenticated | Dashboard | Cross-module metrics, chart, breakdown, alerts, rankings |
| `/sales` | Authenticated | Sales | Recognized Sales summary, filters, table, detail dialog |
| `/orders` | Authenticated | Orders | Search/filter/sort, cards, creation flow, status lifecycle |
| `/customers` | Authenticated | Customers | Metrics, tier mix, searchable table, drawer form |
| `/customers/[id]/orders` | Authenticated | Placeholder | Displays only a text placeholder for order history |
| `/products` | Authenticated | Products | Metrics, searchable/filterable card catalog, drawer form |
| `/inventory` | Authenticated | Inventory | Stock metrics, table, update-stock dialog |
| `/expenses` | Authenticated | Expenses | Filters, page summary, category mix, table, drawer form |
| `/negosyo-ai` | Authenticated | Coming soon | No working AI interaction |
| `/services` | Authenticated | Coming soon | No working Services workflow |
| `/schedules` | Authenticated | Coming soon | No working Schedules workflow |
| `/settings` | Authenticated | Account settings | Clerk profile/security UI and deletion explanation |

## Feature inventory

### Dashboard

- Purpose: one operating view across Sales, Expenses, Orders, Products, and Customers.
- Benefit: the owner sees money in, money out, profit estimate, order throughput, risks, and leaders without reconciling separate files.
- Screen: `/dashboard`.
- API: `GET /dashboard?range=this_month|this_week|last_week`.
- Database sources: `sales`, `orders`, `order_items`, `products`, `customers`, `expenses`.
- Main components: `DashboardView`, `DashboardMetricCard`, `DashboardCashflowChart`, `DashboardExpenseBreakdown`, `DashboardAttentionList`, `DashboardTopProducts`, `DashboardTopCustomers`, `DashboardPeriodSelect`.
- Metrics: sales amount, expense amount, estimated profit amount, inaccurate Sale count, completed Order count, queued Order count, total Order count.
- Attention kinds: out of stock, low stock, queued orders, lapsed customer, expense anomaly.
- Empty/loading/error: dedicated skeleton, retry state, and section-level empty copy.

### Customers

- Purpose: keep reusable Customer records for Orders and reporting.
- Benefit: faster order entry and customer rankings/history context.
- Screen: `/customers`.
- API: `GET/POST /customers`, `PATCH/DELETE /customers/:id`.
- Database table: `customers`.
- Main components: customer metrics, tier-mix bar, `CustomerTable`, `CustomerForm`, `CustomerBadge`, shadcn Sheet.
- Fields: name, phone, email, customer type, notes.
- Types: normal, loyal, deluxe, premium, VIP.
- Table columns: Name, Date added, Contact number, Customer type, Notes, Actions.
- Interactions: search across name/type/phone/email/notes, filter by type, sort name/date, pagination, edit/delete menu.
- Validation: name required, phone blank or exactly 11 digits, email blank or valid with max 50 characters, notes max 500 in frontend.

### Products

- Purpose: catalog, pricing, profit, stock, supplier, barcode, and product image management.
- Benefit: one reusable source for order entry and inventory value.
- Screen: `/products`.
- API: `GET/POST /products`, `PATCH/DELETE /products/:id`, image upload/delete routes.
- Database table: `products`; `product_variations` exists but is not active.
- Main components: `ProductsTable`, `ProductCard`, `ProductForm`, `BarcodeScannerDialog`, shadcn Sheet.
- Fields: title, description, category, SKU, barcode, supplier, price, stock, profit amount, profit percentage in frontend, image metadata.
- Catalog interactions: search, category filter, 8-card pagination, view/edit/delete menu.
- Product metrics: total products, units in stock, low stock at 10 or fewer, inventory value.
- Image modes: current image, uploaded PNG/JPG/JPEG, or HTTP/HTTPS image URL.
- Barcode: text entry, live device camera scan, or image decode.

### Inventory

- Purpose: current stock status projected from Products.
- Benefit: shows what is available, low, or unavailable and the value tied up in stock.
- Screen: `/inventory`.
- API: Product reads plus `PATCH /products/:id/stock`.
- Database table: `products`.
- Main components: `InventoryOverview`, `InventoryTable`, `StockAdjustmentDialog`.
- Metrics: stock value, out-of-stock count, low-stock count below 10, units on hand.
- Table columns: Product, Supplier, Stock, Stock value, Update.
- Stock badges: Out of stock at 0, Low stock at 1 to 9, In stock at 10 or more.
- Update behavior: replaces current stock with a nonnegative integer after confirmation.

### Orders

- Purpose: assemble product lines, attach a customer, and manage fulfillment state.
- Benefit: connects catalog, stock, Customer, Sales recognition, and Dashboard reporting.
- Screen: `/orders` plus an in-page create mode.
- API: `GET/POST /orders`, `PATCH /orders/:id/status`, general Order update and delete.
- Database tables: `orders`, `order_items`; reads `customers` and `products`; status completion writes `sales`.
- Main components: `Order`, `OrderForm`, `OrderProductCard`, `OrderCartList`, `OrderCard`, `OrderReversalDialog`.
- List interactions: search, status filter, newest/oldest sort, All dates/Today/Yesterday/This week, six cards per page.
- Create interactions: registered or guest Customer, product search/category filter, add product, quantity stepper/direct entry, summary and total, confirmation, toast.
- Statuses: pending, in progress, completed, cancelled, failed.
- Core lifecycle: pending to in progress deducts stock; in progress to completed activates Sale; leaving completed reverses Sale and needs a reason; cancellation/failure from in progress or completed restores stock.
- Safety rules: completed Orders cannot be edited; Orders that have ever produced a Sale cannot be deleted.

### Sales

- Purpose: report Sales recognized from completed Orders.
- Benefit: separates operational Orders from financially recognized Sales.
- Screen: `/sales`.
- API: `GET /sales`, `GET /sales/:id`. There are no direct Sales write routes.
- Database table: `sales`; item detail comes from `order_items` and current product relation.
- Main components: `SalesOverview`, `SalesTable`, `SalesCard`.
- Metrics: total Sales, average Sale, units sold, best Customer.
- Table columns: Sale, Sale date, Customer, Product items, Profit, Sale total.
- Interactions: Today/Yesterday/This week/This month, latest/oldest, local search, local pagination, row opens detail.
- Warning: profit may be inaccurate when a completed Order contains a Product without recorded profit.

### Expenses

- Purpose: record and analyze business costs.
- Benefit: lets the owner compare costs with completed-order Sales.
- Screen: `/expenses`.
- API: `GET /expenses/paginated`, `POST /expenses`, `PATCH/DELETE /expenses/:id`.
- Database table: `expenses`.
- Main components: `ExpenseOverview`, `ExpenseMetricCard`, `ExpensesTable`, `ExpenseForm`, shadcn Sheet.
- Fields: title, description, date incurred, amount, reference number, category, optional other-category text, payment method, optional other-method text.
- Filters: search, category, payment method, time period.
- Table columns: Name, Date, Category, Amount, Method, Description, Actions.
- Metrics on current filtered page: total expenses, biggest category, cash out, digital wallets, category mix.
- Payment methods shown in frontend: cash, GCash, Maya, bank transfer, credit card, loan. The backend enum does not contain `loan`, so the mock data must avoid `loan`.

### Global application feedback

- One global confirmation dialog. Normal actions use teal, destructive actions use red.
- Top-right global toasts show loading, success, error, and information states.
- API cold starts show "Server waking up..." with a 10 to 30 second note.
- Loading, empty, and failure states exist across core modules.

### Account settings and deletion

- Clerk's UserProfile owns profile, sign-in security, and account deletion.
- The backend receives Clerk's signed `user.deleted` webhook.
- A durable worker deletes database rows, product images, and caches with retries and a tombstone.
- This is operationally important but not a strong 45-second marketing scene.

## UI component inventory

### Navigation and shell

- Gradient teal collapsible sidebar with grouped links: Overview, Operations, Money.
- Sticky white/translucent header with route title, description, theme toggle, Clerk avatar, display name, and "Business owner" label.
- App content uses a pale gray-green canvas.
- Sidebar is icon-only when collapsed and becomes a Sheet-like mobile navigation through shadcn's sidebar primitive.

### Cards and summaries

- `ModuleMetricCard` supplies compact summary cards with a colored top accent, icon tile, value, hint, and small sparkline.
- Dashboard metric cards are clickable and include a route-specific hint and delta pill.
- Product and Order records use rounded cards.
- Sales, Expenses, Customers, and Inventory use bordered table panels.

### Forms and overlays

- Right-side Sheets for Customer, Product, Expense, and Order edit forms.
- Center Dialog for stock adjustment, confirmations, Sale detail, barcode scan, and reversal reason.
- Product creation is the densest form and includes upload, URL, pricing/profit, inventory, and barcode inputs.
- Order creation is a two-step page with details, product picker, and sticky summary rather than a drawer.

### Tables and filters

- Customer table uses TanStack Table with client sorting, filtering, and pagination.
- Inventory uses a semantic table with stock badges.
- Expenses and Sales use semantic tables with pagination and row actions.
- Filter UI mixes pill Select controls, dropdown menus, native selects, and search inputs.

### Charts

- Dashboard cashflow uses a grouped Recharts bar chart for Sales and Expenses with net amounts below each bucket.
- Expense breakdowns use progress bars or a horizontal category mix strip.
- Metric cards use small inline SVG sparklines.

## Design system

### Brand name and personality

The public and authenticated product name is NegosyoTracker. The product tone is practical, calm, local, and owner-focused. It avoids enterprise jargon. Phrases such as "money in, money out," "whole shop," and "what needs doing" define the voice.

The supplied app icon is a round cyan-to-blue gradient with a white chart and upward arrow. The authenticated sidebar uses a simpler white "N" tile, so the video can use the full icon for opening/closing brand frames and the "N" tile inside the app shell.

### Core colors

| Role | Value | Usage |
| --- | --- | --- |
| Teal highlight | `#12CDBE` | Sales, focus, positive accents, charts |
| Brand teal | `#00BEAA` | Sidebar/landing accents |
| Mid teal | `#00A899` | Sidebar gradient, buttons |
| Deep teal | `#007F78` | Text accents and hover states |
| Ink teal | `#0C4B47` | Primary buttons |
| Text ink | `#16292B` | Main light-theme text |
| Canvas | `#F2F5F4` | Authenticated page background |
| Border | `#E3E9E8` | Cards, tables, separators |
| Muted text | `#5F7273`, `#93A5A5` | Supporting copy |
| Lime | `#A8D97C` | Secondary positive accents |
| Amber | `#FFB018` | Expenses, warning, pending |
| Yellow | `#FFDE68` | Landing CTA |
| Blue | `#1D4ED8` / `#3B82F6` | Orders and wallet metric |
| Violet | `#5B34C7` | Customer/expense secondary data |
| Red | `#B01C1C` / `#DC2626` | Destructive, out-of-stock, error |
| Dark canvas | `#0B1615` | Dark theme page background |
| Dark card | `#12201F` | Dark theme surfaces |

The landing page uses several static gradients. The authenticated app uses the sidebar gradient and thin card accent gradients, but most UI surfaces stay flat.

### Typography

- Root application font: Inter, exposed through the existing `--font-roboto` token.
- UI weights: 400, 500, 600, 700, 800.
- Data, IDs, dates, and currency frequently use a monospace face through `font-mono`.
- Authenticated page titles are about 19 px. Section titles are 14.5 to 17 px. Table labels are 10.5 px uppercase. Body copy is 11.5 to 13.5 px.
- Video text must be larger than the app's native sizes when it is outside the browser mockup. The app mockup can keep its compact density.

### Shape, spacing, and shadows

- Global radius token: 10 px.
- Main cards and panels: 18 to 20 px radius.
- Sheets and dialogs: about 20 px.
- Buttons and inputs: 9 to 12 px, with pill controls for filters and tier/status badges.
- Primary page width: up to 1480 px.
- Content gap: usually 14 to 20 px.
- Shadows are soft and sparse. Sheets and dialogs use larger teal-tinted or dark translucent shadows. Cards mostly depend on borders and a small hover lift.

### Motion already implied by the UI

- Card hover lift of roughly 2 px.
- Soft border and shadow transitions.
- Sidebar collapse/expand.
- Sheet and Dialog entrance/exit from Radix.
- Loading spinners and toast replacement.
- No custom application animation system exists. The film may add camera motion and staged data animation while keeping the visual language restrained.

## Database model

### Active business tables

#### `customers`

Fields: `id`, `name`, `gender`, `email`, `customerType`, `phone`, `status`, `notes`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`, `deletedAt`.

The frontend does not expose `gender`. Customer ownership is stored in `createdBy` as the Clerk subject. Email and phone are not unique.

#### `products`

Fields: `id`, `title`, `description`, `category`, `sku`, `supplier`, `barcode`, `price`, `profit`, `stock`, `image`, `imageUrl`, `imageSource`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`.

`price` and `profit` are decimal values in number mode. `stock` is an integer. SKU and barcode are not unique.

#### `orders`

Fields: `id`, `customerId`, `orderName`, `totalAmount`, `totalProfit`, `profitInaccurate`, `notes`, `status`, `cancelledNotes`, `cancelledAt`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`, `statusUpdatedAt`, `deletedAt`.

`customerId` is nullable for guest Orders. `status` is one of pending, in progress, completed, cancelled, failed.

#### `order_items`

Fields: `id`, `orderId`, `productId`, `quantity`, `priceAtPurchase`, `subtotal`.

Each row snapshots purchase price and subtotal. Deleting a Product sets `productId` to null. Deleting the Order cascades to its items.

#### `sales`

Fields: `id`, `orderId`, `customerId`, `customerName`, `orderName`, `totalAmount`, `totalProfit`, `profitInaccurate`, `notes`, `state`, `recognizedAt`, `recognizedBy`, `revertedAt`, `revertedBy`, `reversalReason`, `createdBy`, `createdAt`, `updatedAt`.

There is one Sale at most per Order. State is `active` or `reverted`. Customer, Order, and financial values are snapshots. Sale item detail still reads the source Order's items.

#### `expenses`

Fields: `id`, `title`, `description`, `amount`, `dateIncurred`, `referenceNumber`, `category`, `categoryOther`, `paymentMethod`, `paymentMethodOther`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`, `deletedAt`.

Expense category values: rent, utilities, supplies, inventory, shipping, marketing, fees, software, salary, maintenance, equipment, taxes, professional_services, transportation, meals, other.

Backend payment values: cash, gcash, maya, other_e_wallet, bank_transfer, credit_card, other.

### Supporting or inactive tables

- `product_variations`: Product variants; schema only, no current UI/API management.
- `transactions`: payment transactions; active module is a placeholder and does not write the table.
- `schedules`: schedule/service records; no current UI persistence flow.
- `account_erasure_requests`: durable deletion jobs and retry checkpoints.
- `ping`: operational keep-alive row.

### Relationship map

```text
customers 1 ---- * orders 1 ---- * order_items * ---- 1 products
    |                  |
    |                  `---- 0..1 sales
    `----------------------- * sales

customers 1 ---- * schedules        inactive workflow
products  1 ---- * product_variations

expenses are standalone owner-scoped records
```

## API contract summary

| Method | Route | Film relevance |
| --- | --- | --- |
| `GET` | `/dashboard` | Final overview and metrics |
| `GET`, `POST` | `/customers` | Customer picker and optional setup |
| `PATCH`, `DELETE` | `/customers/:id` | Existing customer management |
| `GET`, `POST` | `/products` | Product picker/catalog |
| `PATCH`, `DELETE` | `/products/:id` | Product management |
| `PATCH` | `/products/:id/stock` | Manual stock correction |
| `POST` | `/files/upload/product-image` | Product image upload |
| `DELETE` | `/files/delete/product-image/:filename` | Product image cleanup |
| `GET`, `POST` | `/orders` | Order list and create |
| `GET` | `/orders/:id` | Order detail |
| `PATCH` | `/orders/:id/status` | Stock and Sale lifecycle trigger |
| `PATCH` | `/orders/:id` | Intended general Order update |
| `DELETE` | `/orders/:id` | Delete eligible Order |
| `GET` | `/sales` | Sale report |
| `GET` | `/sales/:id` | Sale detail |
| `GET` | `/expenses/paginated` | Expense list |
| `POST` | `/expenses` | Expense create |
| `PATCH`, `DELETE` | `/expenses/:id` | Expense edit/delete |

Known integration issue for future agents: the frontend general Order update adapter currently sends `PUT /orders/:id`, while the backend defines `PATCH /orders/:id`. The demo should not animate editing an existing Order.

## Canonical Filipino demo scenario

### Demo business

- Workspace/business name: **Habi Home & Pantry**
- Owner shown in header: **Maria Santos**
- Business type: small Quezon City retailer selling Filipino pantry goods and home-made gift packs
- Locale: `en-PH`
- Currency: PHP, rendered with `₱`
- Time zone: Asia/Manila
- Film date: 29 September 2026

The business name is display-only in the video shell because the current app has no Business table or workspace-name field.

### Customers

These records match `Customer` and `customerResponseSchema`.

| id | name | customerType | phone | email | notes | createdAt |
| ---: | --- | --- | --- | --- | --- | --- |
| 201 | Angela Garcia | VIP | 09171234567 | angela.garcia@example.ph | Weekly office pantry delivery, call lobby on arrival. | 2026-09-03T02:20:00.000Z |
| 202 | Carlo Reyes | loyal | 09184561234 | carlo.reyes@example.ph | Prefers GCash and afternoon pickup. | 2026-08-16T05:40:00.000Z |
| 203 | Juan Dela Cruz | normal | 09951239876 | juan.delacruz@example.ph | Walk-in customer from Project 4, Quezon City. | 2026-09-21T08:15:00.000Z |
| 204 | Liza Mendoza | premium | 09207893456 | liza.mendoza@example.ph | Ships gift packs to Cebu branch. | 2026-07-09T01:45:00.000Z |
| 205 | Paolo Bautista | deluxe | 09193334455 | paolo.bautista@example.ph | Batangas reseller, usually orders by case. | 2026-06-12T03:10:00.000Z |
| 206 | Nina Villanueva | loyal | 09668887766 | nina.villanueva@example.ph | Davao client, consolidate monthly orders. | 2026-05-27T06:00:00.000Z |

Do not add address fields to Customer cards or forms. The schema has no address property. Location details may appear only in Notes.

### Products

These records match `Product`. `profitPercentage` is a frontend convenience; the database persists the `profit` amount.

| id | title | category | sku | barcode | supplier | price | profit | margin shown | stock before film |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: |
| 101 | Kapeng Barako 250g | beverages | BEV-KB250 | 4809010101012 | Batangas Brew Co. | 320.00 | 96.00 | 30% | 24 |
| 102 | Ube Pandesal Box | baking-supplies | BAK-UPB06 | 4809010101029 | Tita Nena's Bakery | 280.00 | 84.00 | 30% | 18 |
| 103 | Cebu Dried Mango 200g | snacks | SNK-CDM200 | 4809010101036 | Sugbo Harvest | 245.00 | 61.25 | 25% | 9 |
| 104 | Laguna Buko Pie | packaged-food | PFD-LBP01 | 4809010101043 | Bay Pie House | 390.00 | 117.00 | 30% | 7 |
| 105 | Tablea Chocolate 10s | beverages | BEV-TAB10 | 4809010101050 | Davao Cacao Works | 210.00 | 63.00 | 30% | 32 |
| 106 | Banana Chips 250g | snacks | SNK-BC250 | 4809010101067 | Davao Gold Foods | 180.00 | 45.00 | 25% | 4 |
| 107 | Calamansi Concentrate | beverages | BEV-CAL500 | 4809010101074 | Laguna Citrus Farm | 260.00 | 78.00 | 30% | 16 |
| 108 | Abaca Market Tote | home-living | HOM-AMT01 | 4809010101081 | Bicol Habi Collective | 450.00 | 135.00 | 30% | 0 |
| 109 | Native Snack Gift Box | packaged-food | PFD-NSG12 | 4809010101098 | Habi Home & Pantry | 680.00 | 204.00 | 30% | 12 |
| 110 | Kalinga Brew Drip Bags | beverages | BEV-KDB08 | 4809010101104 | Cordillera Coffee Lab | 360.00 | 108.00 | 30% | 15 |

Suggested mock thumbnails use restrained two-color backgrounds and a short label or simple food/home symbol. The video does not need remote product images.

### Existing active Sales before the hero order

| saleId | orderId | orderName | customer | recognizedAt | items | totalAmount | totalProfit |
| ---: | ---: | --- | --- | --- | --- | ---: | ---: |
| 7001 | 5001 | QC Office Pantry Restock | Angela Garcia | 2026-09-29T01:12:00.000Z | 3× Kapeng Barako, 2× Tablea Chocolate | 1380.00 | 414.00 |
| 7002 | 5002 | Cebu Gift Pack Batch | Liza Mendoza | 2026-09-27T06:40:00.000Z | 4× Native Snack Gift Box | 2720.00 | 816.00 |
| 7003 | 5003 | Afternoon Pickup | Carlo Reyes | 2026-09-24T08:05:00.000Z | 2× Ube Pandesal Box, 2× Calamansi Concentrate | 1080.00 | 324.00 |
| 7004 | 5004 | Batangas Reseller Pack | Paolo Bautista | 2026-09-18T03:30:00.000Z | 6× Tablea Chocolate, 4× Banana Chips | 1980.00 | 558.00 |
| 7005 | 5005 | Davao Monthly Box | Nina Villanueva | 2026-09-10T02:20:00.000Z | 3× Native Snack Gift Box, 3× Kalinga Brew | 3120.00 | 936.00 |

### Hero Order created during the film

Use this exact record and mutation sequence.

```ts
const heroOrder = {
  id: 5026,
  customerId: 203,
  orderName: 'Juan\'s Merienda Pack',
  status: 'pending',
  notes: 'Pickup at 4:30 PM, Quezon City.',
  orderItems: [
    { id: 9101, productId: 102, quantity: 2, priceAtPurchase: '280.00', subtotal: '560.00' },
    { id: 9102, productId: 103, quantity: 2, priceAtPurchase: '245.00', subtotal: '490.00' },
    { id: 9103, productId: 107, quantity: 1, priceAtPurchase: '260.00', subtotal: '260.00' },
  ],
  totalAmount: '1310.00',
  totalProfit: '368.50',
  profitInaccurate: false,
  createdAt: '2026-09-29T06:14:00.000Z',
  statusUpdatedAt: '2026-09-29T06:14:00.000Z',
};
```

Status sequence:

1. Created as `pending` at 2:14 PM Philippine time.
2. Changed to `in_progress` at 2:16 PM. Stock becomes Ube Pandesal 16, Dried Mango 7, Calamansi 15.
3. Changed to `completed` at 2:24 PM. No additional stock change. One active Sale is recognized.

Recognized Sale:

```ts
const heroSale = {
  id: 7026,
  orderId: 5026,
  customerId: 203,
  customerName: 'Juan Dela Cruz',
  orderName: 'Juan\'s Merienda Pack',
  totalAmount: '1310.00',
  totalProfit: '368.50',
  profitInaccurate: false,
  notes: 'Pickup at 4:30 PM, Quezon City.',
  state: 'active',
  recognizedAt: '2026-09-29T06:24:00.000Z',
};
```

### Expenses for the selected month

| id | title | dateIncurred | amount | category | paymentMethod | referenceNumber | description |
| ---: | --- | --- | ---: | --- | --- | --- | --- |
| 301 | September shop rent | 2026-09-01T01:00:00.000Z | 18000.00 | rent | bank_transfer | BDO-SEP-0926 | Quezon City storefront rent. |
| 302 | Pantry packaging restock | 2026-09-05T03:25:00.000Z | 4250.00 | supplies | gcash | GC-882041 | Boxes, labels, and paper fillers. |
| 303 | MERALCO bill | 2026-09-08T02:40:00.000Z | 3680.00 | utilities | maya | MY-149203 | September electricity bill. |
| 304 | Batangas supplier delivery | 2026-09-12T04:10:00.000Z | 2150.00 | shipping | cash | DR-0912 | Barako stock delivery. |
| 305 | Weekend social ads | 2026-09-18T07:30:00.000Z | 1800.00 | marketing | credit_card | META-918 | Quezon City gift box campaign. |
| 306 | September staff wages | 2026-09-25T01:15:00.000Z | 12000.00 | salary | bank_transfer | PAY-0925 | Part-time packing support. |
| 307 | Receipt printer repair | 2026-09-27T05:35:00.000Z | 950.00 | maintenance | cash | OR-4418 | Replaced paper feed roller. |

Total Expenses: `₱42,830.00`.

### Dashboard state before and after the hero Sale

The final dashboard should feel internally consistent but does not need to reconstruct every hidden record. Use these displayed values.

Before completion:

- Sales on record: `₱52,470.00`
- Expenses on record: `₱42,830.00`
- Estimated profit: `₱15,741.00`
- Completed orders: `24`
- Queued orders: `6`
- Total orders on file: `38`

After completion:

- Sales on record: `₱53,780.00`
- Expenses on record: `₱42,830.00`
- Estimated profit: `₱16,109.50`
- Completed orders: `25`
- Queued orders: `5`
- Total orders on file: `38`

Final expense breakdown:

- Rent: `₱18,000.00`, 42%
- Salary: `₱12,000.00`, 28%
- Supplies: `₱4,250.00`, 10%
- Utilities: `₱3,680.00`, 9%
- Shipping: `₱2,150.00`, 5%
- Marketing: `₱1,800.00`, 4%
- Maintenance: `₱950.00`, 2%

Final attention list:

- `Abaca Market Tote is out of stock` / `0 units available`
- `Banana Chips 250g is running low` / `4 units remaining`
- `5 orders are still in the queue` / `Pending and in-progress orders`
- `Angela Garcia has not ordered recently` / `Last completed order was 31 days ago`

Final top Products:

| rank | Product | Revenue | quantitySold | percentageOfLeader |
| ---: | --- | ---: | ---: | ---: |
| 1 | Native Snack Gift Box | 10880.00 | 16 | 100 |
| 2 | Kapeng Barako 250g | 8320.00 | 26 | 76 |
| 3 | Ube Pandesal Box | 7560.00 | 27 | 69 |
| 4 | Cebu Dried Mango 200g | 6860.00 | 28 | 63 |
| 5 | Tablea Chocolate 10s | 5880.00 | 28 | 54 |

Final top Customers:

| rank | Customer | completedOrderCount | salesAmount | percentageOfSales |
| ---: | --- | ---: | ---: | ---: |
| 1 | Angela Garcia | 7 | 11460.00 | 21 |
| 2 | Liza Mendoza | 5 | 9860.00 | 18 |
| 3 | Paolo Bautista | 4 | 7710.00 | 14 |
| 4 | Juan Dela Cruz | 3 | 5420.00 | 10 |
| 5 | Guest customer | 4 | 4680.00 | 9 |

## Technology decision

### Options considered

| Option | Strength | Limitation for this project |
| --- | --- | --- |
| Remotion | Deterministic frame-based React video, reusable app-like components, direct MP4/WebM export, multiple compositions | Adds a small isolated project and requires Chromium/FFmpeg for rendering |
| React + Framer Motion | Fast interactive prototype | Browser timing is less deterministic for high-quality video export |
| Motion Canvas | Strong timeline and canvas tools | Rebuilds the UI outside the existing React mental model |
| GSAP | Excellent timeline control | Needs a capture/export pipeline and more manual DOM orchestration |
| Three.js | Useful for 3D | Unnecessary for a flat product UI and can distract from legibility |
| Lottie | Good for small illustration loops | Poor fit for a full interactive SaaS workflow |

### Selected approach: Remotion

Use a standalone Remotion project under `demo-video/`. Recreate only the visible application screens needed for the film using lightweight, typed React presentation components. Do not import live Next.js pages because they depend on Clerk, TanStack Query, routing, API responses, and browser state. The animation should use the same screen structure, labels, colors, spacing, and component hierarchy.

All motion must derive from `useCurrentFrame`, `interpolate`, and spring/easing functions. Do not use CSS transitions or CSS keyframe animation in rendered compositions.

Provide two compositions from the same scene system:

- `NegosyoTrackerLaunch16x9`: 1920×1080, 60 fps, primary master.
- `NegosyoTrackerLaunch9x16`: 1080×1920, 60 fps, vertical cut with reframed browser panels and shorter on-screen copy.

The 16:9 master should run about 48 seconds. The vertical cut may use the same duration and timing unless a later edit requires a tighter social version.

## Storyboard

### Scene 1, scattered work to one view

- Time: 0:00 to 0:04, frames 0 to 239 at 60 fps.
- Purpose: name the pain and position the product.
- Screen: abstract receipt, order note, stock row, and expense slip fragments on the brand canvas.
- Data: `Order #5026`, `Cebu Dried Mango: 9 left`, `Meralco ₱3,680`, `Juan Dela Cruz`.
- Interaction: fragments drift apart, then align behind the NegosyoTracker mark.
- Motion: slow parallax, shallow 3D tilt, fragments pulled toward the center.
- Camera: starts close on fragments, pulls back to reveal one browser frame.
- Copy: `Your negosyo moves fast.` then `Your records should move together.`

### Scene 2, the operating dashboard

- Time: 0:04 to 0:10, frames 240 to 599.
- Purpose: establish the real app and its business-wide view.
- Screen: Dashboard with sidebar, header, four metrics, cashflow, expense breakdown, attention list, top Products, top Customers.
- Data: pre-completion dashboard totals.
- Interaction: period pill reads `This month`; metrics count into place; bars grow.
- Motion: browser enters at a slight angle and settles. Cards reveal in a restrained stagger. The cursor glides toward Orders.
- Camera: 92% to 108% push-in, centered on the metric row, then pans left to sidebar.
- Copy: `Sales, stock, customers and costs. One workspace.`

### Scene 3, create a real Order

- Time: 0:10 to 0:22, frames 600 to 1319.
- Purpose: show the most valuable connected workflow.
- Screen: real two-column Create Order layout.
- Data: Customer `Juan Dela Cruz`; Order name `Juan's Merienda Pack`; note `Pickup at 4:30 PM, Quezon City.`; Products and quantities from the hero Order.
- Interaction: cursor selects Customer, types the Order name, adds Ube Pandesal Box, Cebu Dried Mango, and Calamansi Concentrate, changes quantities, then places the Order.
- Motion: typed text uses deterministic character reveal; product cards press down; selected cards get `In order`; summary lines slide in; total rolls to `₱1,310.00`.
- Camera: begins wide, then crops between details, product grid, and sticky summary.
- Feedback: confirmation dialog appears, cursor clicks `Place order`, top-right toast changes from `Placing order...` to `Order created`.
- Copy: `Build an order from the records you already trust.`

### Scene 4, fulfillment changes the system

- Time: 0:22 to 0:30, frames 1320 to 1799.
- Purpose: show that Order status drives stock and Sale recognition.
- Screen: Order card for #5026, then a compact split view with Inventory.
- Data: status `Pending` to `In Progress` to `Completed`; affected stock values 18→16, 9→7, 16→15.
- Interaction: cursor opens Update Status and chooses `In Progress`, confirms, then chooses `Completed` and confirms.
- Motion: status badge morphs from amber to blue to teal; inventory numbers tick down on the first transition; completion triggers a clean check pulse and a Sale chip.
- Camera: tight crop on the Order card, then lateral pan to Inventory values.
- Copy: `Move the order. Stock follows. Complete it. A Sale is recognized.`

### Scene 5, Sales updates without double entry

- Time: 0:30 to 0:36, frames 1800 to 2159.
- Purpose: prove the backend-created financial record.
- Screen: Sales page with summary and table.
- Data: new first row `Juan's Merienda Pack`, Juan Dela Cruz, 5 product units, profit `₱368.50`, Sale total `₱1,310.00`.
- Interaction: the new row inserts at the top, then opens the Sale detail dialog.
- Motion: summary total increments, row arrives with a teal edge glow, dialog expands from the row.
- Camera: track the row insertion, then ease into the detail dialog.
- Copy: `No second entry. The completed order becomes a Sale.`

### Scene 6, Dashboard closes the loop

- Time: 0:36 to 0:44, frames 2160 to 2639.
- Purpose: show the owner-level result.
- Screen: Dashboard returns.
- Data: after-completion metrics and final rankings.
- Interaction: Sales, profit, completed Orders, queue, and affected chart bar update. Juan rises into the visible Customer ranking.
- Motion: numeric values roll, one chart bar grows, queue badge drops from 6 to 5, a subtle pulse travels from metric row to top Products/Customers.
- Camera: one continuous diagonal pan from Sales metric through cashflow to Who is buying.
- Copy: `Every update lands where the owner needs it.`

### Scene 7, brand close

- Time: 0:44 to 0:48, frames 2640 to 2879.
- Purpose: leave the product value and name on screen.
- Screen: browser recedes into a teal/ink field with the app icon and wordmark.
- Data: no new data.
- Motion: panels stack behind the mark; soft grid fades; CTA appears.
- Camera: pull back, then hold for at least 1.5 seconds.
- Copy: `Run the whole negosyo from one clear view.` and `NegosyoTracker`.
- CTA: `Track your business. Grow with confidence.`

## Motion and camera rules

- Use one primary focal action at a time. Never animate every card simultaneously.
- Cursor paths should use eased point-to-point motion and pause before clicks.
- Click feedback: 3 to 5 frame scale-down, 6 to 10 frame release, small cursor ring.
- Browser camera scale should stay between about 0.84 and 1.22 to preserve legibility.
- Use 30 to 50 frame transitions between major scenes. Prefer masked pushes, shared browser movement, and subtle wipes built from app surfaces.
- Avoid dramatic spins, liquid distortion, neon bloom, or constant floating.
- Keep the brand canvas dark ink/teal with soft aqua light. Keep the browser UI in the real light theme for clarity.
- Use motion blur only if the chosen Remotion stack supports deterministic output without hurting text.
- Hold key results long enough to read at normal speed.

## Audio direction

Audio is optional for the first implementation. If added later:

- Music: light modern electronic bed at 105 to 115 BPM, no vocals.
- UI sounds: muted click, short confirmation tick, soft data-rise tone, restrained whoosh on browser transitions.
- Do not use loud notification pings or arcade sounds.
- Voiceover should be under 95 words and follow the scene copy, not narrate every click.

Suggested voiceover:

> Your negosyo moves fast. NegosyoTracker keeps customers, products, orders, stock, sales, and expenses moving together. Build an order from the records you already trust. As work moves forward, stock stays current. Complete the order and the Sale is recognized automatically. The Dashboard updates with the numbers and next actions that matter. One workspace. One clear view of the whole business.

## Implementation boundaries for Claude

- Treat this document as the product and data authority for the demo.
- Keep the Remotion project isolated in `demo-video/`. Do not modify the production feature code to make the film work.
- Do not touch the existing user change in `src/features/auth/components/AuthShell.tsx`.
- Copy only required brand assets into `demo-video/public`.
- Keep mock data in one typed module. Scenes must derive displayed totals from that module or use the approved Dashboard display state above.
- Do not use `any` or `unknown`.
- Use single quotes in TypeScript and double quotes in JSX attributes.
- Use Remotion frame functions for every rendered animation. CSS transitions and keyframes will not render reliably.
- Make scene components reusable between 16:9 and 9:16 compositions.
- Respect the current product structure. Do not invent a business settings screen, address field, payment capture flow, AI assistant answer, export action, or working Schedules/Services module.
- The video is a staged mock interface. It must not call the live API, Clerk, Supabase, Redis, or PostgreSQL.
- Keep visible dates and times in the formats already used by the product, for example `Sep 29, 2026 · 2:24 PM` and `Sep. 29, 2026 · 02:24 PM`.
- Use PHP formatting through `Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' })` where practical.
- The 16:9 master is the approval composition. The 9:16 cut may crop/reflow but must preserve the same story and data.

## Acceptance criteria

- Viewer understands within 10 seconds that this is a business operations workspace.
- Viewer sees one connected Order-to-Sale workflow rather than a montage of unrelated screens.
- UI matches the real sidebar, header, cards, forms, status colors, tables, and Dashboard vocabulary.
- Every name, Product, amount, date, and status in the film comes from the approved Filipino demo data.
- The Order total is `₱1,310.00`; recognized profit is `₱368.50`.
- The stock reduction happens on `in_progress`, not on `completed`.
- The Sale appears only after `completed`.
- Final Dashboard Sales rise by `₱1,310.00`, profit by `₱368.50`, completed Orders by 1, and queue count falls by 1.
- NegosyoAI, Services, Schedules, customer order history, variants, and Transactions are not presented as working features.
- Both compositions render at 60 fps and contain no network-dependent assets.
- Documentation under `demo-video/docs` tells a fresh Claude agent exactly how to run, edit, and export the film.
