# ADR-003: Propagate feature failures and limit UI effects to success

- **Status:** Accepted
- **Date:** 2026-07-12
- **Task:** IMP-001

## Context

Feature services caught errors and resolved with `[]`, `undefined`, or no value. TanStack Query therefore marked rejected HTTP operations as successful, invalidated caches, and allowed forms, dialogs, or carts to reset despite failed writes.

## Decision

Services translate transport and response-validation failures into `FeatureError` and always throw them. The shared error type classifies authentication, authorization, conflict, validation, server, network, malformed-response, and unexpected failures without exposing raw server details. TanStack hooks invalidate caches only in `onSuccess`. UI consumers own loading, success, and error messages and perform closing/resetting only after awaited mutation success.

## Consequences

- HTTP 401, 403, 409, 422, and 5xx responses remain TanStack mutation errors.
- Read failures render error states instead of empty states.
- Failed writes preserve the user's form, dialog, selection, or cart for retry.
- UI messages stay user-friendly while the original error remains available as `cause` for diagnostics.
