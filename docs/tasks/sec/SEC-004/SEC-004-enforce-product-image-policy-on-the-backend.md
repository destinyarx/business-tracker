# SEC-004: Enforce the product-image upload policy on the backend

**Priority:** P2  
**Severity:** Medium if backend checks are absent  
**Status:** Client-only checks confirmed; backend implementation is outside this repository

## Impact

The browser sends a caller-controlled MIME type and filename directly to the upload endpoint. Client-side extension, MIME, count, and size checks are UX controls and can be bypassed with a custom HTTP request. If the backend trusts these headers, an authenticated attacker may upload oversized or active content, overwrite/collide with paths, or inject unsafe filenames.

## Evidence

- `src/features/products/components/productForm.tsx:123-139` allows PNG/JPEG and sets a 10 MB client limit.
- The visible text at `productForm.tsx:434` says 2 MB, so the documented UI policy already disagrees with the actual client limit.
- `src/features/products/productService.service.ts:21-29` reads the entire file into memory and sends raw browser-controlled `file.type` and `file.name` as `Content-Type` and `X-Filename`.
- `src/features/products/productService.service.ts:124-126` places an image identifier directly in a delete path; backend authorization and safe identifier handling must be verified.
- The upload/download/storage implementation is not in this repository.

OWASP recommends server-side extension/type/signature validation, generated filenames, size limits, authorization, and storage outside the web root: [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html).

## Required backend controls

1. Authenticate the request and derive the owner from the verified Clerk token.
2. Enforce a simple hobby-project limit (for example 2 MB or 5 MB) at the edge and application layer; make the UI text and client limit match it.
3. Allowlist only the formats actually needed, preferably JPEG/PNG/WebP.
4. Inspect file signatures/magic bytes and decode/re-encode the image; do not trust extension or `Content-Type`.
5. Generate a random storage key. Store the original filename only as sanitized metadata, never as a path.
6. Store outside a directly executable web root and serve with a fixed image content type plus `X-Content-Type-Options: nosniff`.
7. Authorize deletion by an opaque image ID and owner association; reject `..`, separators, encoded separators, and arbitrary object keys.

## Acceptance checks

- Renamed HTML/SVG/script content with `.jpg` is rejected.
- A file larger than the server limit is rejected before full buffering/storage.
- Filenames containing traversal segments, control characters, or header delimiters do not influence storage paths or response headers.
- User A cannot delete or replace user B's image.
- A valid image upload, display, replacement, and deletion still work.

## Handoff note

Do not claim this fixed by strengthening React Dropzone. The security control must exist in the backend/storage adapter.
