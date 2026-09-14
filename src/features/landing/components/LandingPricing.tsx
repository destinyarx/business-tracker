import { Check, LockKeyhole } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const freeFeatures = [
  'Manage sales with daily, weekly and monthly performance.',
  'Store customer details and purchase history in one place.',
  'Keep track of product availability and prevent stock shortages.',
  'Record expenses with detailed cash flow reports.',
  'Track orders through the pending queue.',
]

const premiumFeatures = [
  'Everything in the Free Tier.',
  'AI-powered forecasts and business trends.',
  'Automated reminders, PDF and CSV exports, and customer emails.',
  'Queue management features.',
]

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="mt-5 space-y-3">
      {features.map((feature) => (
        <li key={feature} className="flex gap-2.5 text-[12px] leading-5 text-[#5F7273] dark:text-[#9FB3B0]">
          <Check className="mt-0.5 size-4 shrink-0 text-[#00A899]" strokeWidth={1.8} />
          {feature}
        </li>
      ))}
    </ul>
  )
}

export function LandingPricing() {
  return (
    <section id="pricing" className="scroll-mt-[72px] overflow-hidden bg-white px-5 py-[74px] transition-colors dark:bg-[#12201F] sm:px-8 lg:px-11">
      <div className="mx-auto max-w-[1160px]">
        <h2 className="text-[34px] font-semibold tracking-[-0.03em] text-[#16292B] dark:text-[#EAF3F1]">Pricing</h2>
        <p className="mt-2.5 text-[15.5px] text-[#5F7273] dark:text-[#9FB3B0]">Get started for free. Upgrade as your business grows</p>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <article className="grid overflow-hidden rounded-[20px] border border-[#E3E9E8] bg-white dark:border-[#243936] dark:bg-[#16292B] sm:grid-cols-[0.75fr_1.25fr]">
            <div className="flex flex-col justify-between p-6">
              <div>
                <h3 className="text-xl font-semibold text-[#16292B] dark:text-[#EAF3F1]">Free Tier</h3>
                <p className="mt-3 text-[11.5px] leading-[1.55] text-[#93A5A5] dark:text-[#9FB3B0]">Ideal for small to medium businesses looking for a capable, cost-effective tool.</p>
              </div>
              <div className="mt-8">
                <p className="font-semibold text-[#16292B] dark:text-[#EAF3F1]">₱ FREE <span className="text-[11px] font-normal text-[#93A5A5]">/month</span></p>
                <Button asChild size="sm" className="mt-3 rounded-full bg-[#16292B] px-4 text-xs text-white hover:bg-[#0C4B47]"><Link href="/register">Register now</Link></Button>
              </div>
            </div>
            <div className="m-2 rounded-[16px] bg-[#F2F5F4] p-5 dark:bg-[#1B2E2C] sm:ml-0">
              <h4 className="text-xs font-semibold text-[#16292B] dark:text-[#EAF3F1]">Features</h4>
              <FeatureList features={freeFeatures} />
            </div>
          </article>

          <article className="grid overflow-hidden rounded-[20px] bg-[#00B8A8] sm:grid-cols-[0.75fr_1.25fr]">
            <div className="flex flex-col justify-between p-6 text-white">
              <div>
                <h3 className="text-xl font-semibold">Premium</h3>
                <p className="mt-3 text-[11.5px] leading-[1.55] text-white/80">For businesses that want AI insights and higher record limits.</p>
              </div>
              <div className="mt-8">
                <p className="font-semibold">₱ ??? <span className="text-[11px] font-normal text-white/70">/month</span></p>
                <Button asChild size="sm" className="mt-3 rounded-full bg-white px-4 text-xs text-[#0C4B47] hover:bg-[#EAF6EF]"><Link href="/register">Register now</Link></Button>
              </div>
            </div>
            <div className="m-2 rounded-[16px] bg-[#F2F5F4] p-5 dark:bg-[#1B2E2C] sm:ml-0">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-xs font-semibold text-[#16292B] dark:text-[#EAF3F1]">Features</h4>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#16292B] px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-white"><LockKeyhole className="size-2.5" />Coming soon</span>
              </div>
              <FeatureList features={premiumFeatures} />
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
