import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

type DashboardErrorStateProps = {
  message?: string
  onRetry: () => void
}

export function DashboardErrorState({
  message = 'Dashboard data could not be loaded.',
  onRetry,
}: DashboardErrorStateProps) {
  return (
    <section className="grid min-h-[360px] w-full max-w-[1480px] place-items-center rounded-[20px] border border-[#e3e9e8] bg-white px-6 text-center dark:border-[#243936] dark:bg-[#12201f]">
      <div className="max-w-sm">
        <span className="mx-auto grid size-11 place-items-center rounded-[13px] bg-[#fdecec] text-[#b01c1c] dark:bg-[#482321] dark:text-[#ff9999]">
          <RefreshCw className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-base font-semibold text-[#16292b] dark:text-[#eaf3f1]">Dashboard unavailable</h2>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#5f7273] dark:text-[#9fb3b0]">{message}</p>
        <Button type="button" onClick={onRetry} className="mt-5 rounded-[10px] bg-[#0c4b47] text-white hover:bg-[#007f78]">Try again</Button>
      </div>
    </section>
  )
}
