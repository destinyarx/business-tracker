# IMP-001: Preserve feature failures and validate API responses at ingress

**Priority:** P2  
**Recommendation strength:** Strong  
**Type:** Architecture and reliability improvement with security benefits

## Problem

Feature data modules mix Axios transport, toast presentation, response extraction, and error suppression. Most mutation functions catch an error and resolve successfully. TanStack Query therefore runs `onSuccess`, invalidates caches, closes forms, or clears local state even when the backend rejected the operation. Runtime API responses are also trusted through TypeScript types without Zod validation.

## Evidence

- Customer reads return `[]` on failure and mutations swallow failures: `src/features/customers/customers.service.ts:13-21`, `24-94`.
- Products mirror that pattern: `src/features/products/productService.service.ts:33-41`, `44-121`.
- Expenses return `undefined` or resolve after failures: `src/features/expenses/expenses.service.ts:13-32`, `47-119`.
- Orders swallow read and mutation errors: `src/features/orders/orderService.service.ts:25-59`, `62-163`.
- Hooks attach `onSuccess` behavior to those resolving functions:
  - `src/features/customers/hooks/useCustomers.tsx:18-37`
  - `src/features/products/hooks/useProducts.ts:18-40`
  - `src/features/expenses/hooks/useExpenseMutation.ts:9-28`
  - `src/features/orders/hooks/useOrderMutation.ts:11-38`
- Existing Zod validation is concentrated in UI forms and does not validate backend responses.

## Proposed deepening

Keep the repository's required flow—UI -> TanStack hook -> feature service -> feature API—but make each feature data module's interface meaningful:

1. Feature API modules perform typed Axios requests only.
2. Feature service modules parse response data with feature-owned Zod response schemas, enforce domain invariants, and either return a predictable domain result or throw a typed feature error.
3. TanStack hooks own cache invalidation and expose mutation error state.
4. UI modules own toast wording and form closing/reset behavior.
5. Define separate create, update, response, and filter types instead of reusing broad mutable domain objects.

The deletion test shows the current modules are shallow: deleting them mostly moves one-to-one Axios calls and catches into hooks. A deep module that owns response validation and error semantics provides leverage to every caller and locality for backend-contract changes.

## Suggested order

Implement one vertical slice first, preferably Orders because it carries the strongest business-integrity rules:

1. Add an Order API adapter.
2. Add request/response Zod schemas and narrow command types.
3. Make the Order service throw on transport, authorization, validation, and conflict failures.
4. Move toast/reset behavior to mutation consumers.
5. Repeat the established pattern for Products, Customers, and Expenses.

## Acceptance checks

- HTTP 401, 403, 409, 422, and 5xx responses leave mutations in an error state and never run success-only UI cleanup.
- Malformed successful responses fail schema parsing with a safe feature error.
- Read failures render an error state rather than a false empty-state message.
- Tests target the feature module interface and cover malformed responses plus expected backend error categories.
- UI messages remain user-friendly and do not expose raw server details.
