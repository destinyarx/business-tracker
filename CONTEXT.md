# Business Tracker

Business Tracker records the operational information a small or medium-sized business uses to manage customers, products, orders, inventory, sales, and costs.

## Customers module

Customer phone and email are optional. When supplied, a phone must contain exactly 11 digits and an email must have a valid email format. The customer form blocks submission and shows a field error when either value is invalid. Blank phone and email fields are sent to the API as `null`.

## Language

**Expense**:
A recorded business cost with an incurred date, amount, category, and payment method.
_Avoid_: Expenses when referring to one record, outgoing transaction

**Expenses**:
The collection and module containing the business's expense records.
_Avoid_: Expense when referring to the collection

## Inventory module

Inventory is a read-only projection of Product records. Each inventory row uses the product title, SKU, supplier, price, and current stock quantity. The stock-on-hand table shows Product, Supplier, Stock, Stock value, and Update columns. Stock value is the product price multiplied by its current stock.

The Inventory overview shows total stock value, out-of-stock products, low-stock products with fewer than 10 units, and total units on hand. Products with zero units are counted only as out of stock.

The Update stock flow is temporarily a client-side preview because the backend does not yet expose a dedicated stock-update endpoint. A preview changes the Inventory cards and table for the current page session, but it is not persisted and resets when the page is refreshed or left. Product data from the Products query remains the server source of truth.

## Sales module

Sale is a separate record recognized from an Order when that Order moves to `completed`. A Sale keeps the recognized order name, customer name, notes, totals, profit quality, and recognition time. Moving a completed Order to another allowed status changes its Sale state from `active` to `reverted` and requires a reversal reason. Completing the Order again reactivates its existing Sale.

The Sales module reads active Sales from the dedicated Sales API. Its ranges are Today, Yesterday, This week, and This month. The backend calculates date boundaries in Asia/Manila, and `this_week` starts on Monday. Search runs locally over order name, customer name, and notes, so it does not change the overview values. The Sales table paginates locally and shows Sale, Sale date, Customer, Product items, Profit, and Sale total. Selecting a row loads the Sale detail with its product lines, quantities, captured unit prices and subtotals, notes, profit warning, and total.

The Sales overview derives total sales, average sale, units sold, and best customer from every active Sale returned for the selected range. Profit warnings indicate that at least one returned Sale contains a product without recorded profit. Money crosses the HTTP boundary as decimal strings and is converted only for calculations and display.

## Orders module

Order statuses are `pending`, `in_progress`, `completed`, `cancelled`, and `failed`. Allowed transitions are pending to in progress, cancelled, or failed; in progress to completed, cancelled, or failed; completed to in progress, cancelled, or failed; and cancelled or failed to in progress. Completing an Order recognizes its Sale. Leaving completed requires a reversal reason of at most 500 characters and reverses that Sale.

The backend owns stock and Sale changes during status transitions and reads stored Order items for those operations. The frontend status request sends only the target status and an optional reversal reason. Completed Orders cannot be edited. An Order that has ever produced a Sale cannot be deleted, even while its Sale is reverted.
