import { landingSteps } from '../landing.constants'
import { landingMono } from '../landing.fonts'

export function LandingHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-16 bg-[#203233] px-5 py-[76px] text-white sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-[1400px]">
        <h2 className="text-balance text-[clamp(2rem,4vw,2.125rem)] font-semibold tracking-[-0.035em]">
          Up and running in three steps
        </h2>
        <div className="mt-11 grid gap-8 md:grid-cols-3 md:gap-6">
          {landingSteps.map((step) => (
            <article key={step.number} className="border-t-2 border-[#00BEAA] pt-5">
              <div className={`${landingMono.className} text-xs text-[#00BEAA]`}>
                {step.number}
              </div>
              <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2.5 max-w-[40ch] text-sm leading-[1.65] text-[#A9BABA]">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
