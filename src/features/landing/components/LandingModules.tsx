import { Separator } from '@/components/ui/separator'
import { landingModules } from '../landing.constants'

export function LandingModules() {
  return (
    <section
      id="features"
      className="scroll-mt-16 bg-[#F4F4F4] px-5 py-[72px] sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mx-auto max-w-[1160px]">
          <h2 className="text-balance text-[clamp(2rem,4vw,2.125rem)] font-semibold tracking-[-0.035em] text-[#203233]">
            Six modules, one workspace
          </h2>
          <p className="mt-2.5 text-base text-[#5A6B6B]">
            Every module writes to the same records, so nothing gets typed
            twice.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-[1160px] grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {landingModules.map((module) => {
            const ModuleIcon = module.icon

            return (
              <article
                key={module.title}
                className="group rounded-[1.25rem] border border-[#E6E9E9] bg-white px-6 py-7 transition duration-200 hover:-translate-y-0.5 hover:border-[#C9E8E4] hover:shadow-[0_22px_40px_-28px_rgba(32,50,51,0.55)]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-12 shrink-0 items-center justify-center rounded-[0.875rem] ${module.tileClassName}`}
                  >
                    <ModuleIcon
                      className={`size-5 ${module.iconClassName}`}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#203233]">
                    {module.title}
                  </h3>
                </div>
                <p className="mt-4 min-h-[5.25rem] text-pretty text-[13.5px] leading-[1.62] text-[#6B7A7A]">
                  {module.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-[12.5px] font-medium text-[#007F78]">
                  <span>{module.detail}</span>
                  <Separator className="flex-1 bg-[#EFF2F2]" />
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
