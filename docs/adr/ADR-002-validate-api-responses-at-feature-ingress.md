# ADR-002: Validate API responses at feature ingress

- **Status:** Accepted
- **Date:** 2026-07-12
- **Task:** IMP-001

## Context

The application previously trusted successful backend payloads through TypeScript types. Missing or malformed fields could reach tables, calculations, and order workflows as if they were valid domain data.

## Decision

Feature services parse every consumed response body with a feature-owned Zod response schema before returning it. Schemas require the fields used by the application, normalize nullable optional fields, and coerce backend date or numeric representations only where the domain already expects those values. Mutation responses that are not consumed are treated as command acknowledgements and return `void` after a successful HTTP status.

## Consequences

- Malformed successful responses become query or mutation failures instead of false empty/success states.
- UI code receives predictable domain-shaped data.
- New consumed response fields must be added to the owning feature schema.
- Backend contract drift becomes visible immediately and may surface as a user-safe loading error.
