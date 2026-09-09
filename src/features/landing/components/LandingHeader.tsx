import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/molecules/ThemeToggle'
import { LandingBrand } from './LandingBrand'

const navigation = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#E3E9E8] bg-white/95 backdrop-blur-md transition-colors dark:border-[#243936] dark:bg-[#0B1615]/95">
      <div className="mx-auto flex min-h-[72px] max-w-[1440px] items-center gap-8 px-5 sm:px-8 lg:px-11">
        <LandingBrand />

        <nav
          className="hidden items-center gap-7 text-sm font-medium text-[#5A6B6B] dark:text-[#9FB3B0] md:flex"
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
          <ThemeToggle />
          <SignedOut>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-[#DCE3E2] bg-white px-5 text-[#16292B] shadow-none hover:border-[#00BEAA] hover:bg-white hover:text-[#007F78] dark:border-[#2B4340] dark:bg-[#12201F] dark:text-[#EAF3F1] dark:hover:bg-[#16292B] dark:hover:text-[#5EEBDD]"
            >
              <Link href="/login">Log in</Link>
            </Button>
            <Button
              asChild
              className="hidden rounded-full bg-[#0C4B47] px-6 text-white shadow-none hover:bg-[#007F78] sm:inline-flex"
            >
              <Link href="/register">Start free</Link>
            </Button>
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
