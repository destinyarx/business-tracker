'use client'

import type { LucideIcon } from 'lucide-react'
import { Line, LineChart, ResponsiveContainer } from 'recharts'

interface ModuleMetricCardProps {
  label: string
  value: string
  hint: string
  icon: LucideIcon
  accent: string
  iconClassName: string
  chartValues: number[]
}

export function ModuleMetricCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
  iconClassName,
  chartValues,
}: ModuleMetricCardProps) {
  const chartData = chartValues.map((chartValue, index) => ({ index, chartValue }))

  return (
    <article className="overflow-hidden rounded-[18px] border border-[#e3e9e8] bg-white transition-colors hover:border-[#c2e7e2] dark:border-[#243936] dark:bg-[#12201f] dark:hover:border-[#2f625d]">
      <div className="h-[3px]" style={{ backgroundColor: accent }} />
      <div className="px-[17px] pb-4 pt-[15px]">
        <div className="mb-3 flex items-center gap-2.5">
          <span className={`grid size-8 place-items-center rounded-[10px] ${iconClassName}`}>
            <Icon className="size-4" strokeWidth={1.8} />
          </span>
          <span className="text-xs font-medium text-[#5f7273] dark:text-[#9fb3b0]">{label}</span>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="whitespace-nowrap text-[26px] font-semibold leading-none tracking-[-0.03em] text-[#16292b] dark:text-[#eaf3f1]">{value}</div>
            <div className="mt-1.5 truncate text-[11.5px] text-[#93a5a5]">{hint}</div>
          </div>
          <div className="h-8 w-[92px] shrink-0" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line type="monotone" dataKey="chartValue" stroke={accent} strokeWidth={1.8} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </article>
  )
}
