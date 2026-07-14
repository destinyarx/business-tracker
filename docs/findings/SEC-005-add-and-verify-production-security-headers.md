# SEC-005: Add and verify production security headers

**Priority:** P2  
**Severity:** Medium defense-in-depth gap  
**Status:** Not visible in repository; verify deployed responses before implementation

## Impact

The repository does not configure a Content Security Policy, clickjacking protection, MIME-sniffing protection, a referrer policy, or a permissions policy. If the hosting edge does not add them, successful injection has a larger blast radius, authenticated pages may be framed for clickjacking, and external requests can receive more referrer information than intended.

## Evidence

- `next.config.ts:3-11` configures images only.
- `src/middleware.ts:6-8` performs Clerk protection but does not set response headers.
- A repository-wide search found no `Content-Security-Policy`, `frame-ancestors`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, or `Permissions-Policy` configuration.
- No dangerous raw-HTML sink was found in application code, so CSP is defense in depth rather than evidence of an existing XSS exploit.

The controls may be configured by Vercel, a reverse proxy, or another edge not represented here. Verify runtime headers first. See [Next.js CSP guidance](https://nextjs.org/docs/app/guides/content-security-policy) and the [OWASP HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html).

## Recommended implementation

1. Inspect production HTML and authenticated route responses with browser devtools or `curl -I`.
2. Centrally add at least:
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - a conservative `Permissions-Policy` for unused browser capabilities
   - clickjacking protection using CSP `frame-ancestors 'none'` (or `'self'` if embedding is required)
3. Introduce CSP in report-only mode first, observe violations, then enforce it. Avoid `unsafe-eval`; do not add broad wildcards. Follow the current Next.js nonce guidance if dynamic nonces are required.
4. Apply the policy consistently to public and authenticated HTML responses. Keep API/file response headers appropriate to their content.

## Acceptance checks

- Production response inspection confirms the intended headers on `/`, `/login`, and at least one authenticated page.
- Authenticated pages cannot be embedded by an untrusted origin.
- Clerk sign-in, Next.js hydration, fonts, remote product images, and development tooling still work under the tested policy.
- CSP reports contain no unexplained violation before switching from report-only to enforcement.

## Scope guard

Do not add HSTS as part of this hobby-project task unless deployment ownership, HTTPS coverage, and rollback implications are understood.
