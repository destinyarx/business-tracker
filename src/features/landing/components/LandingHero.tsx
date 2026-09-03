import { SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { Check, Circle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { landingMono } from '../landing.fonts'

const highlights = [
  'Orders and queue flow',
  'Expense reports',
  'Stock visibility',
]

export function LandingHero() {
  return (
    <section className="mx-auto grid max-w-[1400px] items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(20rem,1fr)_minmax(21rem,1.05fr)] lg:px-12 lg:py-[84px]">
      <div>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#F4F4F4] px-3.5 py-1.5 text-xs font-medium text-[#007F78]">
          <Check className="size-3.5" aria-hidden="true" />
          Free tier, no credit card
        </div>

        <h1 className="max-w-[14ch] text-balance text-[clamp(2.8rem,6vw,3.75rem)] font-semibold leading-[1.03] tracking-[-0.04em] text-[#203233]">
          Your all-in-one business companion
        </h1>
        <p className="mt-5 max-w-[46ch] text-pretty text-base leading-7 text-[#5A6B6B] sm:text-lg">
          Track customers, orders, products, inventory and expenses in one
          place. Built for small and medium businesses that outgrew the
          notebook.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <SignedOut>
            <SignUpButton mode="redirect">
              <Button
                type="button"
                size="lg"
                className="h-12 rounded-full bg-[#00BEAA] px-7 text-[15px] text-white shadow-none hover:bg-[#007F78]"
              >
                Get started free
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-[#00BEAA] px-7 text-[15px] text-white shadow-none hover:bg-[#007F78]"
            >
              <Link href="/dashboard">Open your workspace</Link>
            </Button>
          </SignedIn>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 rounded-full border-[#D3DADA] bg-white px-7 text-[15px] text-[#203233] shadow-none hover:border-[#203233] hover:bg-white"
          >
            <Link href="#features">See the modules</Link>
          </Button>
        </div>

        <ul className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-[13px] text-[#6B7A7A]">
          {highlights.map((highlight) => (
            <li key={highlight} className="flex items-center gap-2">
              <Check className="size-3.5 text-[#00BEAA]" aria-hidden="true" />
              {highlight}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
        <div className="absolute -inset-x-4 -top-5 bottom-10 rounded-[2rem] bg-gradient-to-br from-[#FFDE68] via-[#00BEAA] to-[#007F78] opacity-50 sm:-inset-x-6 sm:-top-6" />
        <figure className="relative overflow-hidden rounded-[1.25rem] border border-[#E6E9E9] bg-white shadow-[0_30px_70px_-30px_rgba(32,50,51,0.45)]">
          <div className="flex items-center gap-1.5 border-b border-[#E6E9E9] bg-[#F4F4F4] px-3.5 py-2.5">
            <Circle className="size-2.5 fill-red-600 text-red-600" aria-hidden="true" />
            <Circle className="size-2.5 fill-[#FFB018] text-[#FFB018]" aria-hidden="true" />
            <Circle className="size-2.5 fill-green-600 text-green-600" aria-hidden="true" />
            <span
              className={`${landingMono.className} ml-2 truncate text-[10px] text-[#6B7A7A]`}
            >
              app.negosyotracker.ph/sales
            </span>
          </div>
          <div className="relative aspect-[5/3] bg-[#EFF2F2]">
            <Image
              src="/landing.jpg"
              alt="Printed sales reports and charts used to review business performance"
              fill
              sizes="(min-width: 1024px) 48vw, 90vw"
              className="object-cover"
              priority
            />
            <figcaption className="absolute bottom-4 left-4 rounded-xl bg-[#203233]/90 px-4 py-3 text-white shadow-lg backdrop-blur-sm">
              <span
                className={`${landingMono.className} block text-[10px] uppercase tracking-[0.14em] text-[#9FD8D3]`}
              >
                Sales overview
              </span>
              <span className="mt-1 block text-sm font-medium">
                See the numbers behind every sale
              </span>
            </figcaption>
          </div>
        </figure>
      </div>
    </section>
  )
}
