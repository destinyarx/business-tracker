# SEC-001: Upgrade vulnerable authentication and runtime dependencies

**Priority:** P0  
**Severity:** Critical  
**Status:** Confirmed by the installed dependency tree and `npm audit`

## Impact

The installed application runtime contains known authentication/authorization bypasses and multiple remotely reachable Next.js vulnerabilities. This application protects authenticated pages primarily through Clerk middleware, so framework and authentication middleware bypasses are directly relevant.

## Evidence

- `package.json:11` declares `@clerk/nextjs` `^6.32.0`; the lockfile installs `6.32.0` (`package-lock.json:102-104`).
- `package.json:31` and the lockfile install Next.js `15.5.7`.
- `package.json:25` and the lockfile install Axios `1.13.2`.
- `src/middleware.ts:3-7` uses `createRouteMatcher` and `auth.protect()` as the application-wide route gate.
- `npm ls` confirmed `@clerk/nextjs@6.32.0`, `next@15.5.7`, and `axios@1.13.2`.
- `npm audit --omit=dev` reported **10 production vulnerabilities: 2 critical, 6 high, and 2 moderate**. Direct vulnerable packages are `@clerk/nextjs`, `next`, and `axios`; affected transitive packages include Clerk modules, `follow-redirects`, `form-data`, `js-cookie`, and PostCSS.

Most relevant advisories:

- Next.js 15.5 versions before `15.5.18` have a high-severity App Router middleware/proxy bypass. A crafted transport-specific route can reach protected content without the expected middleware check. The repository is on `15.5.7` and relies on middleware protection. [GHSA-26hh-7cqf-hhc6](https://github.com/vercel/next.js/security/advisories/GHSA-26hh-7cqf-hhc6)
- Clerk versions before `6.39.2` have a critical `createRouteMatcher` bypass. Clerk notes that this repository's denylist-style public-route pattern blocks that specific bypass, but all affected applications are still instructed to upgrade. [CVE-2026-41248 / GHSA-vqx2-fgx2-5wq9](https://github.com/advisories/GHSA-vqx2-fgx2-5wq9)
- Clerk `<=6.39.2` also has an authorization-predicate bypass fixed in `6.39.3`. The current code only calls authentication-only `auth.protect()`, so this second bypass is not currently proven exploitable, but the installed version remains affected. [CVE-2026-42349 / GHSA-w24r-5266-9c3c](https://github.com/advisories/GHSA-w24r-5266-9c3c)
- Axios `1.13.2` is affected by multiple 2026 advisories. `npm audit` currently recommends a patched `1.16.x` line. Several advisories concern Node-only adapters and may not be reachable through the current browser-only client, but keeping the vulnerable package is unnecessary risk. [Axios security advisories](https://github.com/axios/axios/security/advisories)

## Required change

1. Upgrade within the current major/minor lines to at least the versions currently selected by `npm audit`:
   - `next@15.5.20`
   - `@clerk/nextjs@6.39.3`
   - `axios@1.16.0`
2. Regenerate and commit `package-lock.json` using npm. Do not hand-edit it.
3. Run `npm audit --omit=dev` again and review any remaining advisory instead of automatically applying a breaking major upgrade.
4. Keep downstream authorization checks in the backend. Middleware is an optimistic route gate, not a resource-authorization seam.

Suggested command:

```powershell
npm install next@15.5.20 @clerk/nextjs@6.39.3 axios@1.16.0
```

## Acceptance checks

- `npm ls next @clerk/nextjs axios` resolves to patched versions with no invalid peers.
- `npm audit --omit=dev` has no critical or high finding for these direct dependencies.
- An unauthenticated request to every route under `src/app/(authenticated)` is denied, including direct `.rsc`/prefetch-style variants covered by the Next.js advisory.
- Login, logout, token attachment, image loading, and a production `next build` still work.

## Scope guard

Do not combine this upgrade with a Next.js 16 migration. A patched 15.5 release is the smallest safe change for this hobby project.
