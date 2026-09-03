import { SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function LandingCallToAction() {
  return (
    <section className="bg-[#007F78] px-5 py-[52px] text-white sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1160px] flex-col items-start gap-8 md:flex-row md:items-center md:gap-10">
        <div className="flex-1">
          <h2 className="text-balance text-[clamp(1.8rem,4vw,2rem)] font-semibold leading-[1.12] tracking-[-0.03em]">
            Start tracking today
          </h2>
          <p className="mt-2.5 max-w-[52ch] text-[15.5px] leading-6 text-[#BFE7E4]">
            Free forever on the Starter plan. Your first order takes under a
            minute to record.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3.5">
          <SignedOut>
            <SignUpButton mode="redirect">
              <Button
                type="button"
                size="lg"
                className="h-12 rounded-full bg-[#FFDE68] px-7 text-[15px] text-[#203233] shadow-none hover:bg-[#FFB018]"
              >
                Create your free account
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-[#FFDE68] px-7 text-[15px] text-[#203233] shadow-none hover:bg-[#FFB018]"
            >
              <Link href="/dashboard">Return to your workspace</Link>
            </Button>
          </SignedIn>
          <span className="text-[12.5px] text-[#9FD8D3]">No card required</span>
        </div>
      </div>
    </section>
  )
}
