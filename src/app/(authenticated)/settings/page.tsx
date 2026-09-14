import { UserProfile } from '@clerk/nextjs'
import { DatabaseZap, ShieldCheck, Trash2 } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account Settings | NegosyoTracker',
  description: 'Manage your NegosyoTracker profile, security, and account.',
}

const deletionSteps = [
  {
    icon: ShieldCheck,
    title: 'Clerk verifies the request',
    description:
      'You may be asked to verify your identity before deletion can continue.',
  },
  {
    icon: Trash2,
    title: 'Your sign-in account is deleted',
    description:
      'Deletion is permanent. You will be signed out and will lose access to this workspace.',
  },
  {
    icon: DatabaseZap,
    title: 'Business data cleanup begins',
    description:
      'The deletion event starts removal of your records, uploaded product images, and account-scoped cache data.',
  },
] as const

export default function AccountSettingsPage() {
  return (
    <main className="mx-auto w-full max-w-[1120px] space-y-5">
      <section className="overflow-hidden rounded-[20px] border border-[#dfe7e5] bg-white dark:border-[#243936] dark:bg-[#12201f]">
        <div className="h-[3px] bg-gradient-to-r from-[#a8d97c] to-[#12cdbe]" />
        <div className="px-5 py-5 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#007f78] dark:text-[#7fe0da]">
            Account and security
          </p>
          <h2 className="mt-1.5 text-xl font-semibold tracking-[-0.025em] text-[#16292b] dark:text-[#eaf3f1]">
            Manage your NegosyoTracker account
          </h2>
          <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[#5f7273] dark:text-[#9fb3b0]">
            Update your profile and sign-in methods. Account deletion is available
            in Clerk&apos;s Security settings and cannot be undone.
          </p>
        </div>
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_310px]">
        <section
          aria-label="Clerk account settings"
          className="min-w-0 overflow-hidden rounded-[20px] border border-[#dfe7e5] bg-white p-2 dark:border-[#243936] dark:bg-[#12201f] sm:p-3"
        >
          <UserProfile
            routing="hash"
            appearance={{
              elements: {
                rootBox: 'w-full',
                cardBox: 'w-full shadow-none',
                card: 'w-full border-0 shadow-none bg-transparent',
                navbar: 'border-[#e3e9e8] dark:border-[#2b4340]',
                navbarButton:
                  'text-[#5f7273] dark:text-[#9fb3b0] data-[active=true]:text-[#007f78] dark:data-[active=true]:text-[#7fe0da]',
                headerTitle: 'text-[#16292b] dark:text-[#eaf3f1]',
                headerSubtitle: 'text-[#5f7273] dark:text-[#9fb3b0]',
                profileSectionTitleText:
                  'text-[#16292b] dark:text-[#eaf3f1]',
                profileSectionContent:
                  'text-[#3f5254] dark:text-[#c3d4d1]',
              },
            }}
          />
        </section>

        <aside className="overflow-hidden rounded-[20px] border border-[#f1caca] bg-white dark:border-[#5c2a2a] dark:bg-[#12201f]">
          <div className="border-b border-[#f4dddd] bg-[#fff8f7] px-5 py-4 dark:border-[#4c2929] dark:bg-[#211717]">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-[11px] bg-[#fdecec] text-[#b01c1c] dark:bg-[#451b1b] dark:text-[#ffaaa5]">
                <Trash2 className="size-[17px]" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-[14px] font-semibold text-[#7f1d1d] dark:text-[#ffb4af]">
                  Before you delete
                </h3>
                <p className="mt-0.5 text-[11.5px] text-[#9f4545] dark:text-[#dc8d88]">
                  Export anything you need to keep.
                </p>
              </div>
            </div>
          </div>

          <ol className="space-y-4 px-5 py-5">
            {deletionSteps.map((step, index) => {
              const Icon = step.icon

              return (
                <li key={step.title} className="flex gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-[9px] bg-[#f2f5f4] text-[#007f78] dark:bg-[#1b2e2c] dark:text-[#7fe0da]">
                    <Icon className="size-3.5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-[#16292b] dark:text-[#eaf3f1]">
                      {index + 1}. {step.title}
                    </p>
                    <p className="mt-1 text-[11.5px] leading-[1.55] text-[#687a7b] dark:text-[#9fb3b0]">
                      {step.description}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </aside>
      </div>
    </main>
  )
}
