# SEC-003: Make order totals, stock, profit, and transitions server-authoritative

**Priority:** P1  
**Severity:** High if the backend accepts the current payload as authoritative  
**Status:** Frontend trust flaw confirmed; backend enforcement is outside this repository and must be verified

## Impact

An authenticated user can modify browser state or the outgoing request and submit arbitrary prices, profit, totals, quantities, initial status, or status-transition item data. If the separate backend trusts any of those fields, an attacker can underprice orders, corrupt profit reports, oversell inventory, or trigger incorrect inventory adjustments.

## Evidence

- `src/app/(authenticated)/orders/page.tsx:83-87` derives stock availability and totals from mutable client cache/state.
- `src/app/(authenticated)/orders/page.tsx:134-150` sends product `id`, client price, quantity, profit, client-calculated `totalAmount`, and initial status.
- `src/features/orders/components/OrderCartList.tsx:39-44` enforces stock only by disabling a browser button. This is trivially bypassed.
- `src/features/orders/orderService.service.ts:139-153` sends the full response-derived item collection back during a status transition instead of sending only the requested transition.
- `src/features/orders/order.type.ts:4-10` makes `CartItem` inherit the full mutable `Product` shape, widening the order command interface.
- `src/app/(authenticated)/orders/page.tsx:161-167` does not await `addOrder.mutateAsync(form)` before clearing the cart and reporting success, making retry/reconciliation harder when the server rejects a race or invalid payload.

## Required backend interface

Deepen the Order lifecycle module behind two narrow commands:

```ts
createOrder({
  customerId,
  orderName,
  notes,
  items: [{ productId, quantity }],
});

transitionOrder({ orderId, toStatus });
```

The backend implementation must:

1. Derive the owner/tenant from the verified Clerk token. Never trust `createdBy`, user ID, or organization ID supplied by the browser.
2. Load every customer, product, and order through an owner-scoped query and reject cross-tenant IDs.
3. Load current product price, cost/profit inputs, and stock from the database.
4. Validate positive bounded quantities and calculate price snapshots, profit, and total on the server.
5. Enforce allowed status transitions server-side.
6. Update order and inventory atomically. Protect concurrent checkout with a transaction/row lock or an equivalent conditional stock update.
7. Make inventory-affecting transitions idempotent so retries cannot decrement or restore stock twice.

The browser may calculate and display previews, but those values are not authoritative.

## Acceptance checks

- Tampered `price`, `profit`, `totalAmount`, `status`, or extra item fields are ignored or rejected.
- A product/customer/order belonging to another Clerk identity returns 404 or 403 without leaking existence.
- Negative, zero, excessive, and over-stock quantities fail.
- Two simultaneous checkouts cannot drive stock below zero.
- Replaying a status transition does not adjust inventory twice.
- A failed inventory update rolls back the order change.
- The client awaits order creation and keeps recoverable form/cart state on failure.

## Handoff note

The backend source is not present in this repository. Do not mark this finding fixed from frontend validation alone; verify and test the actual backend endpoints used by `NEXT_PUBLIC_API_BASE_URL`.
