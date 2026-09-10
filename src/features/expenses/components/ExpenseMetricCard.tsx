'use client'

import { Line, LineChart, ResponsiveContainer } from 'recharts'

type ExpenseMetricCardProps = {
  label: string
  value: string
  hint: string
  accent: string
  chartColor?: string
  chartValues: number[]
}

export function ExpenseMetricCard({
  label,
  value,
  hint,
  accent,
  chartColor,
  chartValues,
}: ExpenseMetricCardProps) {
  const chartData = chartValues.map((chartValue, index) => ({ index, chartValue }))

  return (
    <article className="overflow-hidden rounded-[18px] border border-[#e3e9e8] bg-white transition-colors hover:border-[#c2e7e2] dark:border-[#243936] dark:bg-[#12201f] dark:hover:border-[#2f625d]">
      <div className="h-[3px]" style={{ background: accent }} />
      <div className="px-[17px] pb-4 pt-[15px]">
        <p className="mb-3 text-xs font-medium text-[#5f7273] dark:text-[#9fb3b0]">{label}</p>
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[22px] font-semibold leading-none tracking-[-0.03em] text-[#16292b] dark:text-[#eaf3f1]" title={value}>{value}</p>
            <p className="mt-1.5 truncate text-[11.5px] text-[#93a5a5]">{hint}</p>
          </div>
          <div className="h-8 w-[84px] shrink-0" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line type="monotone" dataKey="chartValue" stroke={chartColor ?? accent} strokeWidth={1.8} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </article>
  )
}
