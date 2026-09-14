import { SignedIn, SignedOut } from '@clerk/nextjs'
import { Check, Circle, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { landingMono } from '../landing.fonts'

const highlights = [
  'Customers management',
  'Orders and queue flow',
  'Expense reports',
  'Stock visibility',
]

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(120%_90%_at_84%_-18%,#C9F2E4_0%,#EAF6EF_42%,#F4F8F6_72%,#F4F8F6_100%)] px-5 py-16 transition-colors dark:bg-[radial-gradient(120%_90%_at_84%_-18%,#123F3A_0%,#102723_42%,#0B1615_75%,#0B1615_100%)] sm:px-8 lg:px-11 lg:py-[76px]">
      <div className="absolute inset-0 bg-[linear-gradient(#0C4B47_1px,transparent_1px),linear-gradient(90deg,#0C4B47_1px,transparent_1px)] bg-[size:68px_68px] opacity-[0.05]" />
      <div className="absolute -right-28 -top-56 size-[660px] rounded-full bg-[conic-gradient(from_210deg,#A8D97C,#12CDBE_38%,#7FE0DA_62%,#A8D97C)] opacity-50 blur-[96px]" />
      <div className="absolute -bottom-64 -left-44 size-[520px] rounded-full bg-[linear-gradient(150deg,#FFDE68,#A8D97C_70%)] opacity-30 blur-[110px]" />

      <div className="relative mx-auto grid max-w-[1340px] grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(20rem,1fr)_minmax(23rem,1.05fr)]">
      <div className="min-w-0">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E3E9E8] bg-white px-3.5 py-1.5 text-xs font-medium text-[#007F78] dark:border-[#243936] dark:bg-[#12201F] dark:text-[#5EEBDD]">
          <span className="size-1.5 rounded-full bg-[#12CDBE]" />
          Free tier, no credit card
        </div>

        <h1 className="max-w-[650px] text-balance text-[clamp(3rem,5vw,3.875rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-[#16292B] dark:text-[#EAF3F1]">
          Your all-in-one business companion
        </h1>
        <p className="mt-5 max-w-[46ch] text-pretty text-base leading-7 text-[#5A6B6B] dark:text-[#9FB3B0] sm:text-lg">
          Track customers, orders, products, inventory and expenses in one
          place, built for small and medium businesses that outgrew the notebook.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <SignedOut>
            <Button
              asChild
              size="lg"
              className="h-14 rounded-full bg-[#0C4B47] px-8 text-[15px] text-white shadow-none hover:bg-[#007F78]"
            >
              <Link href="/register">Get started free</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button
              asChild
              size="lg"
              className="h-14 rounded-full bg-[#0C4B47] px-8 text-[15px] text-white shadow-none hover:bg-[#007F78]"
            >
              <Link href="/dashboard">Open your workspace</Link>
            </Button>
          </SignedIn>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-14 rounded-full border-[#DCE3E2] bg-white px-8 text-[15px] text-[#16292B] shadow-none hover:border-[#16292B] hover:bg-white dark:border-[#2B4340] dark:bg-[#12201F] dark:text-[#EAF3F1] dark:hover:border-[#5EEBDD] dark:hover:bg-[#16292B]"
          >
            <Link href="/dashboard">See the app</Link>
          </Button>
        </div>

        <ul className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-[13px] text-[#6B7A7A] dark:text-[#9FB3B0]">
          {highlights.map((highlight) => (
            <li key={highlight} className="flex items-center gap-2">
              <Check className="size-3.5 text-[#00BEAA]" aria-hidden="true" />
              {highlight}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mx-auto min-w-0 w-full max-w-2xl overflow-hidden rounded-[28px] bg-[linear-gradient(150deg,#A8D97C,#12CDBE_52%,#7FE0DA)] p-3 shadow-[0_34px_70px_-34px_rgba(12,75,71,0.55)] lg:mx-0">
        <figure className="overflow-hidden rounded-[20px] bg-white">
          <div className="flex items-center gap-1.5 border-b border-[#E3E9E8] bg-[#FBFCFC] px-3.5 py-2.5">
            <Circle className="size-2.5 fill-red-600 text-red-600" aria-hidden="true" />
            <Circle className="size-2.5 fill-[#FFB018] text-[#FFB018]" aria-hidden="true" />
            <Circle className="size-2.5 fill-green-600 text-green-600" aria-hidden="true" />
            <span
              className={`${landingMono.className} ml-2 truncate text-[10px] text-[#6B7A7A]`}
            >
              app.negosyotracker.ph/dashboard
            </span>
          </div>
          <div className="grid min-h-[250px] min-w-0 grid-cols-[46px_minmax(0,1fr)] bg-[#F2F5F4] sm:min-h-[276px]">
            <div className="flex flex-col items-center gap-3 bg-[#00A899] py-4">
              <span className="grid size-5 place-items-center rounded-md bg-white text-[#007F78]"><LayoutDashboard className="size-3" /></span>
              {[1, 2, 3, 4].map((marker) => <span key={marker} className="size-5 rounded-md bg-white/20" />)}
            </div>
            <div className="min-w-0 p-3 sm:p-4">
              <p className="text-xs font-semibold text-[#16292B]">Dashboard</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  ['#12CDBE', '₱ 5,632', 'Sales'],
                  ['#FFB018', '₱ 33,671', 'Expenses'],
                  ['#DC2626', '₱ 980', 'Profit'],
                  ['#315BDB', '7', 'Orders'],
                ].map(([color, amount, label]) => (
                  <div key={label} className="rounded-lg border border-[#E3E9E8] bg-white p-2.5">
                    <span className="mb-2 block h-0.5 w-8" style={{ backgroundColor: color }} />
                    <strong className={`${landingMono.className} block text-[11px] text-[#16292B]`}>{amount}</strong>
                    <span className="text-[8px] text-[#93A5A5]">{label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-lg border border-[#E3E9E8] bg-white p-3">
                  <span className="text-[9px] font-semibold">Money in vs money out</span>
                  <div className="mt-4 flex h-12 items-end justify-around">
                    {[22, 41, 30].map((height) => <div key={height} className="flex items-end gap-1"><span className="w-2 bg-[#12CDBE]" style={{ height }} /><span className="w-2 bg-[#FFB018]" style={{ height: height + 10 }} /></div>)}
                  </div>
                </div>
                <div className="rounded-lg border border-[#E3E9E8] bg-white p-3">
                  <span className="text-[9px] font-semibold">Needs attention</span>
                  <div className="mt-3 space-y-2">{['#DC2626', '#FFB018', '#315BDB'].map((color) => <div key={color} className="flex items-center gap-2"><span className="size-1.5 rounded-full" style={{ backgroundColor: color }} /><span className="h-1.5 flex-1 rounded-full bg-[#EDF1F0]" /></div>)}</div>
                </div>
              </div>
            </div>
          </div>
        </figure>
      </div>
      </div>
    </section>
  )
}
