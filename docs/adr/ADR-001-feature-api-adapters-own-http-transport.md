# ADR-001: Feature API adapters own HTTP transport

- **Status:** Accepted
- **Date:** 2026-07-12
- **Task:** IMP-001

## Context

Customer, product, expense, and order services directly mixed Axios calls with business behavior and UI feedback. This made transport changes difficult to isolate and left service contracts unclear.

## Decision

Each feature exposes a `*.api.ts` adapter that receives the authenticated Axios instance and owns endpoint paths, HTTP methods, query serialization, headers, and raw response extraction. Feature services coordinate these adapters and return domain results; components and TanStack Query hooks do not call Axios directly.

## Consequences

- Endpoint changes remain local to the owning feature API adapter.
- Services can focus on validation and feature-level error semantics.
- API adapters return `object` for untrusted response bodies so TypeScript declarations are not mistaken for runtime validation.
- The existing `useApi` Clerk integration remains the single authenticated Axios source.
