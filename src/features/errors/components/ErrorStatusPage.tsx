import Link from 'next/link'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { ThemeSync } from '@/components/molecules/ThemeSync'
import { ThemeToggle } from '@/components/molecules/ThemeToggle'
import { LandingBrand } from '@/features/landing/components/LandingBrand'
import { landingMono, landingSans } from '@/features/landing/landing.fonts'

export const errorPrimaryActionClassName =
  'h-12 rounded-full bg-[#0C4B47] px-7 text-[15px] text-white shadow-none hover:bg-[#007F78]'

interface ErrorStatusPageProps {
  statusCode: 401 | 403 | 404 | 500
  label: string
  title: string
  description: string
  primaryAction: ReactNode
}

export function ErrorStatusPage({
  statusCode,
  label,
  title,
  description,
  primaryAction,
}: ErrorStatusPageProps) {
  return (
    <div
      className={`${landingSans.className} flex min-h-dvh flex-col overflow-x-hidden bg-white text-[#203233] antialiased transition-colors dark:bg-[#0B1615] dark:text-[#EAF3F1]`}
    >
      <ThemeSync />
      <header className="border-b border-[#E3E9E8] bg-white/95 transition-colors dark:border-[#243936] dark:bg-[#0B1615]/95">
        <div className="mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between gap-8 px-5 sm:px-8 lg:px-11">
          <LandingBrand />
          <ThemeToggle />
        </div>
      </header>

      <main className="relative flex flex-1 items-center overflow-hidden bg-[radial-gradient(120%_90%_at_84%_-18%,#C9F2E4_0%,#EAF6EF_42%,#F4F8F6_72%,#F4F8F6_100%)] px-5 py-16 transition-colors dark:bg-[radial-gradient(120%_90%_at_84%_-18%,#123F3A_0%,#102723_42%,#0B1615_75%,#0B1615_100%)] sm:px-8 lg:px-11">
        <div className="absolute inset-0 bg-[linear-gradient(#0C4B47_1px,transparent_1px),linear-gradient(90deg,#0C4B47_1px,transparent_1px)] bg-[size:68px_68px] opacity-[0.05]" />
        <div className="absolute -right-28 -top-56 size-[560px] rounded-full bg-[conic-gradient(from_210deg,#A8D97C,#12CDBE_38%,#7FE0DA_62%,#A8D97C)] opacity-50 blur-[96px]" />
        <div className="absolute -bottom-64 -left-44 size-[460px] rounded-full bg-[linear-gradient(150deg,#FFDE68,#A8D97C_70%)] opacity-30 blur-[110px]" />

        <section className="relative mx-auto flex w-full max-w-[640px] flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E3E9E8] bg-white px-3.5 py-1.5 text-xs font-medium text-[#007F78] dark:border-[#243936] dark:bg-[#12201F] dark:text-[#5EEBDD]">
            <span className="size-1.5 rounded-full bg-[#12CDBE]" />
            <span className={landingMono.className}>Error {statusCode}</span>
            <span aria-hidden="true">·</span>
            {label}
          </div>

          <p
            aria-hidden="true"
            className="bg-[linear-gradient(150deg,#A8D97C,#12CDBE_52%,#0C4B47)] bg-clip-text text-[clamp(6rem,22vw,10rem)] font-semibold leading-none tracking-[-0.06em] text-transparent"
          >
            {statusCode}
          </p>

          <h1 className="mt-6 text-balance text-[clamp(2rem,5vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-[#16292B] dark:text-[#EAF3F1]">
            {title}
          </h1>
          <p className="mt-4 max-w-[46ch] text-pretty text-base leading-7 text-[#5A6B6B] dark:text-[#9FB3B0]">
            {description}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {primaryAction}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-[#DCE3E2] bg-white px-7 text-[15px] text-[#16292B] shadow-none hover:border-[#16292B] hover:bg-white dark:border-[#2B4340] dark:bg-[#12201F] dark:text-[#EAF3F1] dark:hover:border-[#5EEBDD] dark:hover:bg-[#16292B]"
            >
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
