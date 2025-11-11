import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const PUBLIC_URL: string[] = ['/', '/dev(.*)', '/login', '/signup', '/about-us', '/playground(.*)']
const isPublicRoute = createRouteMatcher(PUBLIC_URL)

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) await auth.protect()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}