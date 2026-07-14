# SEC-006: Remove production debug data exposure

**Priority:** P3  
**Severity:** Low  
**Status:** Confirmed

## Impact

Business records and complete product form values are written to browser developer tools, and the query client is deliberately exposed on `globalThis` in every environment. Anyone with access to a shared browser profile, support recording, injected script, or developer console can inspect more customer/business data than the UI intentionally presents. These do not create an authentication bypass, but they increase data exposure and the impact of another browser-side compromise.

## Evidence

- `src/features/customers/customers.service.ts:15-20` logs the full customer response and caught errors.
- `src/features/products/productService.service.ts:35-40` logs the full product response and caught errors.
- `src/features/products/components/productForm.tsx:173-176` logs all current form values whenever validation errors change.
- `src/app/providers.tsx:20-22` assigns the full `QueryClient` to `(globalThis as any).__QUERY_CLIENT__` without a development guard.
- `src/app/playground/page.tsx:1-40` is a public test page that displays a raw API response/error, and `src/middleware.ts:3` explicitly makes `/playground(.*)` public.

## Recommended change

1. Remove record/form `console.log` calls. If diagnostics are still needed, log only non-sensitive identifiers behind a development-only guard.
2. Remove the `globalThis.__QUERY_CLIENT__` assignment, or guard it with `process.env.NODE_ENV === 'development'` and type it without `any`.
3. Delete the playground route if it is obsolete. Otherwise, exclude it from production builds or protect it with Clerk and render a deliberately redacted response.
4. Review remaining `console.log` calls and keep only values that do not contain customer, order, product, token, request, or error-response data.

## Acceptance checks

- Searching production source finds no logs of API response bodies or complete form values.
- `__QUERY_CLIENT__` is absent from `globalThis` in a production build.
- `/playground` is absent or requires authentication in production.
- Normal toast-based user feedback remains unchanged.
