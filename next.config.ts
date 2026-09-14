import type { NextConfig } from 'next'

// ponytail: static defense-in-depth headers only. Full script-src CSP is
// deferred — it needs report-only observation + Clerk/hydration nonce work
// (SEC-005), not a blind blanket policy. frame-ancestors is the clickjacking
// control and is safe to set now since it can't be delivered via <meta>.
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
]

const nextConfig: NextConfig = {
  images: {
    domains: [
      'foodish-api.com',
      'jsrifeeyjadnwyuiuzno.supabase.co',
      'picsum.photos',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 'hlvojoftpfflptpwlfih.supabase.co',
        pathname: '/storage/v1/object/public/product-images/**',
      },
    ],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}

export default nextConfig
