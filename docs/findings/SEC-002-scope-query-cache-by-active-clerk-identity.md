# SEC-002: Scope and clear the query cache by active Clerk identity

**Priority:** P1  
**Severity:** High  
**Status:** Confirmed unsafe cache design; reproduce with account switching

## Impact

Customer, product, expense, and order responses are cached under global keys that do not include the active Clerk user, session, or organization. If a browser changes active account/session without a full reload, TanStack Query can render the previous account's business data from memory until a refetch replaces it. A failed refetch can leave that stale sensitive data visible longer.

## Evidence

- `src/app/layout.tsx:15-26` mounts one `Providers` instance above all public, auth, and authenticated routes.
- `src/app/providers.tsx:8-18` creates a long-lived `QueryClient` with 5-minute stale time and 30-minute garbage collection.
- Cache keys omit identity:
  - `src/features/customers/hooks/useCustomers.tsx:11-16` uses `['customers']`.
  - `src/features/products/hooks/useProducts.ts:11-16` uses `['products']`.
  - `src/features/expenses/hooks/usePaginatedExpensesQuery.tsx:16-22` uses `['expenses', ...]`.
  - `src/features/orders/hooks/useOrderQuery.ts:20-23` uses `['orders', params]`.
- Customer and expense queries enable on `isLoaded`, not `isSignedIn` plus a non-null identity (`useCustomers.tsx:9-16`, `usePaginatedExpensesQuery.tsx:14-20`).
- Invalidations also use global feature keys, so a mutation under one active identity can affect another identity's cached view.

TanStack Query documents that variables on which a query depends belong in the query key: [TanStack Query keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys). Clerk exposes `userId`, `sessionId`, and `orgId` and permits the active session/organization to change: [Clerk `useAuth`](https://clerk.com/docs/nextjs/reference/hooks/use-auth).

## Recommended implementation

Create one small query-key module whose interface requires an authenticated scope, for example:

```ts
type BusinessScope = {
  userId: string;
  organizationId?: string;
};

businessQueryKeys.customers(scope)
businessQueryKeys.products(scope)
businessQueryKeys.expenses(scope, filters)
businessQueryKeys.orders(scope, params)
```

Then:

1. Include the verified active `userId` and, if multi-organization data exists, `orgId` in every business-data key and invalidation.
2. Enable a business query only when Clerk is loaded, signed in, and the required scope values exist.
3. On sign-out or active session/account/organization change, cancel in-flight old-scope queries and remove sensitive old-scope queries from memory.
4. Keep server authorization as the primary control. Cache scoping prevents browser-side disclosure; it does not authorize backend access.

This creates a deep cache-identity module: deleting it would redistribute identity, key, and eviction rules across every hook, so it provides locality and leverage.

## Acceptance checks

- Switching from account A to B without reloading never renders A's customers, orders, products, or expenses.
- Signing out removes sensitive business queries from the `QueryClient`.
- A request that fails after an account switch does not fall back to the previous account's cached rows.
- Mutations and invalidations affect only the active identity scope.
- Tests cover account A -> account B, sign-out, organization switch if supported, and an in-flight request resolving after a switch.
