import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'
import { LandingBrand } from '@/features/landing/components/LandingBrand'
import { ThemeSync } from '@/components/molecules/ThemeSync'
import { ThemeToggle } from '@/components/molecules/ThemeToggle'
import {
  LEGAL_LAST_UPDATED,
  legalDocumentLinks,
} from '@/features/legal/legal.constants'

interface LegalDocumentLayoutProps {
  title: string
  summary: string
  version: string
  children: ReactNode
}

interface LegalSectionProps {
  id?: string
  title: string
  children: ReactNode
}

export function LegalDocumentLayout({
  title,
  summary,
  version,
  children,
}: LegalDocumentLayoutProps) {
  const contactEmail = process.env.LEGAL_CONTACT_EMAIL?.trim()
  const operatorName =
    process.env.LEGAL_OPERATOR_NAME?.trim() || 'NegosyoTracker'

  return (
    <main className="min-h-dvh bg-[#f2f5f4] text-[#16292b] transition-colors dark:bg-[#0b1615] dark:text-[#eaf3f1]">
      <ThemeSync />
      <header className="sticky top-0 z-30 border-b border-[#dce3e2]/90 bg-white/90 px-5 py-3 backdrop-blur-xl dark:border-[#243936] dark:bg-[#0b1615]/90 sm:px-8">
        <div className="mx-auto flex max-w-[1160px] items-center gap-4">
          <LandingBrand compact />
          <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Legal documents">
            {legalDocumentLinks.map((documentLink) => (
              <Link
                key={documentLink.href}
                href={documentLink.href}
                className="rounded-lg px-3 py-2 text-xs font-medium text-[#5f7273] transition-colors hover:bg-[#edf8f6] hover:text-[#007f78] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00beaa] dark:text-[#9fb3b0] dark:hover:bg-[#173331] dark:hover:text-[#7fe0da]"
              >
                {documentLink.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <div className="mx-auto grid max-w-[1160px] gap-8 px-5 py-8 sm:px-8 sm:py-12 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#007f78] transition-colors hover:text-[#00a899] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00beaa] dark:text-[#7fe0da]"
          >
            <ArrowLeft className="size-3.5" />
            Back to home
          </Link>
          <div className="mt-5 rounded-2xl border border-[#dce3e2] bg-white p-4 dark:border-[#243936] dark:bg-[#12201f]">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <FileText className="size-4 text-[#007f78] dark:text-[#7fe0da]" />
              Legal document
            </div>
            <dl className="mt-4 space-y-3 text-[11.5px] text-[#5f7273] dark:text-[#9fb3b0]">
              <div>
                <dt className="font-semibold text-[#3f5254] dark:text-[#c3d4d1]">Effective</dt>
                <dd>{LEGAL_LAST_UPDATED}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#3f5254] dark:text-[#c3d4d1]">Version</dt>
                <dd className="font-mono">{version}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#3f5254] dark:text-[#c3d4d1]">Jurisdiction</dt>
                <dd>Republic of the Philippines</dd>
              </div>
            </dl>
          </div>
        </aside>

        <article className="overflow-hidden rounded-[22px] border border-[#dce3e2] bg-white shadow-[0_22px_55px_-40px_rgba(12,75,71,0.45)] dark:border-[#243936] dark:bg-[#12201f]">
          <header className="border-b border-[#edf1f0] px-6 py-8 dark:border-[#243936] sm:px-10 sm:py-10">
            <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.15em] text-[#007f78] dark:text-[#7fe0da]">
              NegosyoTracker legal
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-[38px]">
              {title}
            </h1>
            <p className="mt-4 max-w-[68ch] text-sm leading-7 text-[#5f7273] dark:text-[#9fb3b0]">
              {summary}
            </p>
          </header>

          <div className="space-y-9 px-6 py-8 sm:px-10 sm:py-10">
            {children}

            <section id="contact" className="scroll-mt-28 rounded-2xl border border-[#bfe4df] bg-[#edf8f6] p-5 dark:border-[#28534f] dark:bg-[#173331]">
              <h2 className="text-base font-semibold">Contact and operator details</h2>
              <p className="mt-2 text-[13px] leading-6 text-[#4f6566] dark:text-[#b7cbc8]">
                This service is operated in the Philippines by {operatorName}.
                {contactEmail ? (
                  <>
                    {' '}For legal, privacy, or data-subject requests, email{' '}
                    <a className="font-semibold text-[#007f78] underline underline-offset-4 dark:text-[#7fe0da]" href={`mailto:${contactEmail}`}>
                      {contactEmail}
                    </a>
                    .
                  </>
                ) : (
                  <> A dedicated legal contact address will be published before public release.</>
                )}
              </p>
            </section>
          </div>
        </article>
      </div>

      <footer className="border-t border-[#dce3e2] px-5 py-7 dark:border-[#243936] sm:px-8">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-4 text-xs text-[#6f8282] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} NegosyoTracker</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 sm:ml-auto" aria-label="Legal footer">
            {legalDocumentLinks.map((documentLink) => (
              <Link key={documentLink.href} href={documentLink.href} className="hover:text-[#007f78] dark:hover:text-[#7fe0da]">
                {documentLink.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </main>
  )
}

export function LegalSection({ id, title, children }: LegalSectionProps) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="text-lg font-semibold tracking-[-0.015em]">{title}</h2>
      <div className="mt-3 space-y-3 text-[13.5px] leading-7 text-[#4f6566] dark:text-[#b7cbc8]">
        {children}
      </div>
    </section>
  )
}

export function LegalList({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-2 pl-5 marker:text-[#00a899]">{children}</ul>
}
