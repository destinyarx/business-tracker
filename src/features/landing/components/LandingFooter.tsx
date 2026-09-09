import Link from 'next/link'
import { LandingBrand } from './LandingBrand'

const footerLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

export function LandingFooter() {
  return (
    <footer className="bg-[#16292B] px-5 pb-7 pt-8 text-[#8FA3A3] sm:px-8 lg:px-11">
      <div className="mx-auto max-w-[1160px]">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-5 sm:flex-row sm:items-center">
          <LandingBrand compact inverse />
          <nav
            className="flex flex-wrap gap-x-5 gap-y-3 text-[13px] sm:ml-auto"
            aria-label="Footer"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BEAA] focus-visible:ring-offset-4 focus-visible:ring-offset-[#203233]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="pt-4 text-xs">
          © {new Date().getFullYear()} NegosyoTracker. Built for Philippine small
          business.
        </p>
      </div>
    </footer>
  )
}
