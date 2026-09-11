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

Sales is a read-only view of completed Order records. The selected time period and sort direction use the existing Orders query. Search and table pagination run over the returned completed orders in the client so users can search order names, customer names, references, and product names without changing the backend contract. The Sales module does not create a separate sales record or call a separate sales endpoint. The sale date shown in the table and detail view is the order status update date when available, because that represents when the order became completed, with the order creation date as a fallback.

The Sales table shows Sale, Order date, Customer, Product items, Profit, and Sale total. Payment is not shown because the current Order API has no payment field. Selecting a row opens the sale detail dialog with all product lines, quantities, unit prices, totals, notes, profit quality warning, and the order total.

The Sales overview derives sales total, average sale, units sold, and best customer from all completed orders returned for the selected time period. Profit warnings indicate that at least one returned order contains a product without recorded profit.
