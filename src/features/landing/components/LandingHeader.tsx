import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LandingBrand } from './LandingBrand'

const navigation = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#E6E9E9] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-16 max-w-[1400px] items-center gap-6 px-5 sm:px-8 lg:px-12">
        <LandingBrand />

        <nav
          className="hidden items-center gap-7 text-sm font-medium text-[#5A6B6B] md:flex"
          aria-label="Landing page"
        >
          {navigation.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-sm transition-colors hover:text-[#007F78] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BEAA] focus-visible:ring-offset-4"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <SignedOut>
            <SignInButton mode="redirect">
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-[#D3DADA] bg-white px-4 text-[#203233] shadow-none hover:border-[#00BEAA] hover:bg-white hover:text-[#007F78]"
              >
                Log in
              </Button>
            </SignInButton>
            <SignUpButton mode="redirect">
              <Button
                type="button"
                className="rounded-full bg-[#00BEAA] px-5 text-white shadow-none hover:bg-[#007F78]"
              >
                Start free
              </Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Button
              asChild
              className="hidden rounded-full bg-[#00BEAA] px-5 text-white shadow-none hover:bg-[#007F78] sm:inline-flex"
            >
              <Link href="/dashboard">Open app</Link>
            </Button>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
