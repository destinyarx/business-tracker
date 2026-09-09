import { Separator } from '@/components/ui/separator'
import { landingModules } from '../landing.constants'

export function LandingModules() {
  return (
    <section
      id="features"
      className="scroll-mt-[72px] bg-[#F2F5F4] px-5 py-[70px] transition-colors dark:bg-[#0B1615] sm:px-8 lg:px-11"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mx-auto max-w-[1160px] text-center">
          <h2 className="text-balance text-[clamp(2rem,4vw,2.125rem)] font-semibold tracking-[-0.035em] text-[#203233] dark:text-[#EAF3F1]">
            Six modules, one workspace
          </h2>
          <p className="mt-2.5 text-base text-[#5A6B6B] dark:text-[#9FB3B0]">
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
                className="group rounded-[20px] border border-[#E3E9E8] bg-white px-6 py-6 transition duration-200 hover:-translate-y-0.5 hover:border-[#C9E8E4] hover:shadow-[0_22px_40px_-28px_rgba(32,50,51,0.55)] dark:border-[#243936] dark:bg-[#12201F] dark:hover:border-[#2F716A]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-[14px] ${module.tileClassName}`}
                  >
                    <ModuleIcon
                      className={`size-5 ${module.iconClassName}`}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#203233] dark:text-[#EAF3F1]">
                    {module.title}
                  </h3>
                </div>
                <p className="mt-4 min-h-[4.2rem] text-pretty text-[13.5px] leading-[1.62] text-[#5F7273] dark:text-[#9FB3B0]">
                  {module.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-[12.5px] font-medium text-[#007F78]">
                  <span>{module.detail}</span>
                  <Separator className="flex-1 bg-[#EFF2F2] dark:bg-[#243936]" />
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
