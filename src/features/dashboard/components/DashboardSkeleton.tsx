import { Skeleton } from '@/components/ui/skeleton'

export function DashboardSkeleton() {
  return (
    <div className="w-full max-w-[1480px]" aria-label="Loading dashboard">
      <div className="mb-4 flex items-center justify-between gap-4">
        <Skeleton className="h-4 w-72 bg-[#e3e9e8] dark:bg-[#243936]" />
        <Skeleton className="h-[34px] w-[148px] rounded-full bg-[#e3e9e8] dark:bg-[#243936]" />
      </div>
      <div className="mb-3.5 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-[142px] rounded-[18px] bg-[#e3e9e8] dark:bg-[#243936]" />
        ))}
      </div>
      <div className="mb-3.5 grid gap-3.5 xl:grid-cols-2">
        <Skeleton className="h-[296px] rounded-[20px] bg-[#e3e9e8] dark:bg-[#243936]" />
        <Skeleton className="h-[296px] rounded-[20px] bg-[#e3e9e8] dark:bg-[#243936]" />
      </div>
      <div className="grid gap-3.5 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-[326px] rounded-[20px] bg-[#e3e9e8] dark:bg-[#243936]" />
        ))}
      </div>
    </div>
  )
}
