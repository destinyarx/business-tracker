import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

type DashboardMetricCardProps = {
  label: string
  value: string
  delta: string
  hint: string
  href: string
  linkLabel: string
  icon: LucideIcon
  accent: string
  iconClassName: string
  deltaClassName?: string
}

export function DashboardMetricCard({
  label,
  value,
  delta,
  hint,
  href,
  linkLabel,
  icon: Icon,
  accent,
  iconClassName,
  deltaClassName = 'bg-[#f2f5f4] text-[#5f7273] dark:bg-[#1b302e] dark:text-[#a9bcba]',
}: DashboardMetricCardProps) {
  return (
    <Link
      href={href}
      aria-label={linkLabel}
      className="group overflow-hidden rounded-[18px] border border-[#e3e9e8] bg-white outline-none transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-[#c2e7e2] hover:shadow-[0_18px_34px_-30px_rgba(12,75,71,0.5)] focus-visible:border-[#00beaa] focus-visible:ring-2 focus-visible:ring-[#12cdbe]/25 dark:border-[#243936] dark:bg-[#12201f] dark:hover:border-[#2f625d]"
    >
      <div className="h-[3px]" style={{ background: accent }} />
      <div className="px-[17px] pb-4 pt-[15px]">
        <div className="mb-[13px] flex items-center gap-2.5">
          <span className={`grid size-8 shrink-0 place-items-center rounded-[10px] ${iconClassName}`}>
            <Icon className="size-4" strokeWidth={1.8} aria-hidden="true" />
          </span>
          <span className="text-xs font-medium text-[#5f7273] dark:text-[#9fb3b0]">{label}</span>
        </div>
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="min-w-0 whitespace-nowrap text-[23px] font-semibold leading-none tracking-[-0.03em] text-[#16292b] dark:text-[#eaf3f1]">{value}</span>
          <span className={`max-w-full truncate rounded-full px-2 py-1 text-[10.5px] font-medium leading-none ${deltaClassName}`}>
            {delta}
          </span>
        </div>
        <p className="mt-2 truncate text-[11.5px] text-[#93a5a5]" title={hint}>{hint}</p>
      </div>
    </Link>
  )
}
