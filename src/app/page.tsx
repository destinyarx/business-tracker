import { LandingCallToAction } from '@/features/landing/components/LandingCallToAction'
import { LandingFaq } from '@/features/landing/components/LandingFaq'
import { LandingFooter } from '@/features/landing/components/LandingFooter'
import { LandingHeader } from '@/features/landing/components/LandingHeader'
import { LandingHero } from '@/features/landing/components/LandingHero'
import { LandingHowItWorks } from '@/features/landing/components/LandingHowItWorks'
import { LandingModules } from '@/features/landing/components/LandingModules'
import { LandingPricing } from '@/features/landing/components/LandingPricing'
import { landingSans } from '@/features/landing/landing.fonts'
import { ThemeSync } from '@/components/molecules/ThemeSync'

export default function Home() {
  return (
    <div
      className={`${landingSans.className} min-h-dvh overflow-x-hidden bg-white text-[#203233] antialiased transition-colors dark:bg-[#0B1615] dark:text-[#EAF3F1]`}
    >
      <ThemeSync />
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingModules />
        <LandingHowItWorks />
        <LandingPricing />
        <LandingFaq />
        <LandingCallToAction />
      </main>
      <LandingFooter />
    </div>
  )
}
