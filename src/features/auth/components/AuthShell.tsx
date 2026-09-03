import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { LandingBrand } from '@/features/landing/components/LandingBrand'
import { landingSans } from '@/features/landing/landing.fonts'

interface AuthShellProps {
  children: ReactNode
  heading: string
  description: string
  asideHeading: string
  asideDescription: string
}

export function AuthShell({
  children,
  heading,
  description,
  asideHeading,
  asideDescription,
}: AuthShellProps) {
  return (
    <main
      className={`${landingSans.className} grid min-h-dvh bg-white text-[#203233] lg:grid-cols-[1.05fr_0.95fr]`}
    >
      <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12 lg:py-14">
        <div className="w-full max-w-[25rem]">
          <LandingBrand />
          <div className="mt-10">
            <h1 className="text-3xl font-semibold tracking-[-0.035em]">{heading}</h1>
            <p className="mt-2 text-sm text-[#6B7A7A]">{description}</p>
          </div>
          <div className="mt-7">{children}</div>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-sm text-[13px] font-medium text-[#007F78] outline-none transition-colors hover:text-[#00BEAA] focus-visible:ring-2 focus-visible:ring-[#00BEAA] focus-visible:ring-offset-4"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to home
          </Link>
        </div>
      </section>

      <aside className="hidden bg-gradient-to-br from-[#007F78] via-[#00BEAA] to-[#E8C54F] px-12 py-14 text-white lg:flex lg:flex-col lg:justify-end">
        <div>
          <h2 className="max-w-[22ch] text-3xl font-semibold leading-[1.2] tracking-[-0.03em]">
            {asideHeading}
          </h2>
          <p className="mt-4 max-w-[40ch] text-[14.5px] leading-6 text-white/80">
            {asideDescription}
          </p>
        </div>
      </aside>
    </main>
  )
}
