import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  CircleDollarSign,
  PackageCheck,
  ShoppingBag,
} from 'lucide-react'
import { ThemeSync } from '@/components/molecules/ThemeSync'
import { ThemeToggle } from '@/components/molecules/ThemeToggle'
import { landingSans } from '@/features/landing/landing.fonts'

interface AuthShellProps {
  children: ReactNode
  heading: string
  description: string
  asideHeading: string
  asideDescription: string
}

const workspaceUpdates = [
  {
    value: '3',
    headline: 'Orders still pending',
    label: 'Oldest opened Aug 30, Kim Dela Peña',
    icon: ShoppingBag,
  },
  {
    value: '3',
    headline: 'Products need restocking',
    label: 'Safeguard out, vinegar and Sky Flakes low',
    icon: PackageCheck,
  },
  {
    value: '₱33.6k',
    headline: 'Expenses logged in August',
    label: 'Rent and inventory took 62% of it',
    icon: CircleDollarSign,
  },
]

export function AuthShell({
  children,
  heading,
  description,
  asideHeading,
  asideDescription,
}: AuthShellProps) {
  return (
    <main
      className={`${landingSans.className} relative grid min-h-dvh bg-[#F2F5F4] text-[#16292B] transition-colors dark:bg-[#0B1615] dark:text-[#EAF3F1] lg:grid-cols-[1.02fr_0.98fr]`}
    >
      <ThemeSync />
      <ThemeToggle className="absolute right-5 top-5 z-20 sm:right-7 sm:top-6" />

      <section className="flex items-center justify-center bg-[radial-gradient(120%_85%_at_12%_0%,#F8FAFA_0%,#FFFFFF_58%)] px-5 py-12 transition-colors dark:bg-[radial-gradient(120%_85%_at_12%_0%,#16292B_0%,#0B1615_58%)] sm:px-10 lg:px-12 lg:py-14">
        <div className="w-full max-w-[24.75rem]">
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BEAA] focus-visible:ring-offset-4"
          >
            <span className="grid size-11 place-items-center rounded-[14px] bg-[linear-gradient(160deg,#A8D97C,#12CDBE_55%,#7FE0DA)] text-xl font-bold text-[#0C4B47] shadow-[0_10px_22px_-12px_rgba(0,190,170,0.8)]">
              N
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-[22px] font-semibold leading-none tracking-[-0.03em] dark:text-[#EAF3F1]">
                NegosyoTracker
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#7C8E8E]">
                Manage business with ease
              </span>
            </span>
          </Link>

          <div className="mt-9">
            <h1 className="text-[31px] font-semibold tracking-[-0.035em]">
              {heading}
            </h1>
            <p className="mt-2 text-sm leading-[1.55] text-[#5F7273] dark:text-[#9FB3B0]">
              {description}
            </p>
          </div>
          <div className="mt-6">{children}</div>
        </div>
      </section>

      <aside className="relative hidden overflow-hidden bg-[linear-gradient(185deg,#A8D97C_0%,#12CDBE_52%,#7FE0DA_100%)] px-12 py-14 text-white lg:flex lg:flex-col lg:justify-end">
        <div className="absolute inset-0 bg-[linear-gradient(200deg,rgba(12,75,71,0)_30%,rgba(12,75,71,0.55)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.9)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.9)_1px,transparent_1px)] bg-[size:56px_56px] opacity-[0.16]" />
        <div className="absolute -right-16 -top-20 size-80 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.45),rgba(255,255,255,0)_68%)]" />

        <div className="relative">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">
            Waiting in your workspace
          </p>
          <div className="mb-9 space-y-2.5">
            {workspaceUpdates.map((update) => {
              const UpdateIcon = update.icon

              return (
                <div
                  key={update.headline}
                  className="flex items-center gap-3 rounded-[14px] border border-white/25 bg-white/15 px-4 py-3 backdrop-blur-sm"
                >
                  <span className="grid size-[30px] shrink-0 place-items-center rounded-[9px] bg-white/20">
                    <UpdateIcon className="size-4" strokeWidth={1.7} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold">
                      {update.headline}
                    </span>
                    <span className="block truncate text-[11px] text-white/80">
                      {update.label}
                    </span>
                  </span>
                  <strong className="text-base">{update.value}</strong>
                </div>
              )
            })}
          </div>

          <div className="mb-[18px] h-[3px] w-[42px] rounded-full bg-white/75" />
          <h2 className="max-w-[22ch] text-3xl font-semibold leading-[1.2] tracking-[-0.03em]">
            {asideHeading}
          </h2>
          <p className="mt-4 max-w-[40ch] text-[14.5px] leading-6 text-white/85">
            {asideDescription}
          </p>
        </div>
      </aside>
    </main>
  )
}
