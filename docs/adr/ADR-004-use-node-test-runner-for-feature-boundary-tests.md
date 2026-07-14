# ADR-004: Use Node's test runner for feature boundary tests

- **Status:** Accepted
- **Date:** 2026-07-12
- **Task:** IMP-001

## Context

IMP-001 requires automated coverage for malformed responses and expected backend error categories, but the project had no test runner or test script.

## Decision

Use Node 22's built-in test runner and TypeScript type stripping for small boundary tests. Keep tests in `tests/*.test.mjs` and import the production schemas and error translator directly. Do not add a third-party testing dependency for the current test scope.

## Consequences

- `npm test` runs without new packages or lockfile changes.
- The test command requires Node 22 or newer, matching the runtime used to implement and verify this decision.
- A broader UI or browser test suite may justify adopting a dedicated framework in a later ADR.
