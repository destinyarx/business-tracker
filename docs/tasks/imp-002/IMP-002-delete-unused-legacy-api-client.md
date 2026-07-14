# IMP-002: Delete the unused legacy API client

**Priority:** P3  
**Recommendation strength:** Strong  
**Type:** Small architecture and security cleanup

## Problem

`src/lib/api.ts` is an unused second authenticated Axios-client module. It contains weaker authentication logic and automatically injects a client-derived owner identifier into every request. Keeping it creates an attractive but unsafe path for future feature work.

## Evidence

- Repository imports use `@/hooks/useApi`; no file imports `@/lib/api`.
- `src/lib/api.ts:16` rejects only when both token and user ID are missing (`!token && !userId`), so it can proceed when either required value is absent.
- `src/lib/api.ts:25-55` adds a bearer token and injects browser-derived `createdBy` into GET, POST, PATCH, and DELETE requests.
- Resource ownership must be derived from the verified Clerk token by the backend, never from a caller-controlled query/body field.
- The active `src/hooks/useApi.ts:8-39` has interceptor lifecycle cleanup and requires both token and user ID.

## Recommended change

1. Delete `src/lib/api.ts`.
2. Keep a single authenticated transport module at `src/hooks/useApi.ts` for the current client-side architecture.
3. Add a brief comment or backend contract note that ownership fields are not attached by browser code; the backend derives identity from the verified token.
4. If a non-hook Axios adapter is later needed, design it deliberately rather than reviving this module.

## Why this is safe

The deletion test is decisive: deleting this module removes no capability because it has zero callers. It reduces ambiguity and prevents accidental reintroduction of client-controlled ownership.

## Acceptance checks

- `rg "@/lib/api|src/lib/api" src` has no matches.
- TypeScript/build checks pass after deletion.
- All feature requests still use `src/hooks/useApi.ts` and include a Clerk bearer token.
- No frontend transport module adds `createdBy`, `userId`, or `orgId` as an authorization input.

## Validation result

Validated on 2026-07-14:

- No source file imports `src/lib/api.ts`; deletion remains safe and recommended.
- The weaker authentication condition and client-controlled `createdBy` injection are present exactly as described.
- Keep the `useMemo` inside `src/hooks/useApi.ts`: the Axios instance is an Effect dependency and must retain stable identity so interceptors are not repeatedly detached and attached.
- Feature API adapter factories do not need `useMemo` when their returned object is used only inside the same service render.

## Implementation result

Implemented on 2026-07-14:

- Deleted the unused `src/lib/api.ts` transport.
- Kept `src/hooks/useApi.ts` as the single authenticated client transport.
- Documented that the backend derives ownership from the verified Clerk token and that browser code must not attach ownership identifiers.
