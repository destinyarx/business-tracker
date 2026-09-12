'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from 'recharts'
import type { DashboardCashflowBucket } from '../dashboard.types'
import {
  formatDashboardCompactCurrency,
  formatDashboardCurrency,
  formatSignedDashboardCurrency,
} from '../dashboard.utils'

type DashboardCashflowChartProps = {
  buckets: DashboardCashflowBucket[]
}

type ChartBucket = {
  key: string
  label: string
  sales: number
  expenses: number
  net: number
}

function CashflowTooltip({
  active,
  label,
  payload,
}: TooltipContentProps<number, string>) {
  if (!active || !payload.length) return null

  return (
    <div className="min-w-40 rounded-xl border border-[#dce3e2] bg-white p-3 shadow-[0_18px_34px_-22px_rgba(12,75,71,0.5)] dark:border-[#2b4340] dark:bg-[#162725]">
      <p className="mb-2 text-xs font-semibold text-[#16292b] dark:text-[#eaf3f1]">{label}</p>
      {payload.map((entry) => (
        <div key={String(entry.dataKey)} className="flex items-center justify-between gap-4 py-0.5 text-[11.5px]">
          <span className="capitalize text-[#5f7273] dark:text-[#9fb3b0]">{entry.name}</span>
          <span className="font-mono font-medium text-[#16292b] dark:text-[#eaf3f1]">{formatDashboardCurrency(Number(entry.value) || 0)}</span>
        </div>
      ))}
    </div>
  )
}

export function DashboardCashflowChart({
  buckets,
}: DashboardCashflowChartProps) {
  const chartBuckets: ChartBucket[] = buckets.map((bucket) => ({
    key: bucket.key,
    label: bucket.label,
    sales: Number(bucket.salesAmount) || 0,
    expenses: Number(bucket.expenseAmount) || 0,
    net: Number(bucket.netAmount) || 0,
  }))
  const salesTotal = chartBuckets.reduce(
    (total, bucket) => total + bucket.sales,
    0,
  )
  const expenseTotal = chartBuckets.reduce(
    (total, bucket) => total + bucket.expenses,
    0,
  )

  return (
    <section className="flex min-h-[296px] flex-col overflow-hidden rounded-[20px] border border-[#e3e9e8] bg-white dark:border-[#243936] dark:bg-[#12201f]" aria-labelledby="cashflow-heading">
      <header className="flex flex-wrap items-center gap-3 border-b border-[#edf1f0] px-[18px] py-3.5 dark:border-[#243936]">
        <div className="min-w-0">
          <h2 id="cashflow-heading" className="text-[14.5px] font-semibold text-[#16292b] dark:text-[#eaf3f1]">Money in vs money out</h2>
          <p className="mt-0.5 text-[11.5px] text-[#93a5a5]">From completed orders and expense records.</p>
        </div>
        <div className="ml-auto flex items-center gap-3.5 text-[11.5px] text-[#5f7273] dark:text-[#9fb3b0]">
          <span className="inline-flex items-center gap-1.5"><span className="size-[9px] rounded-[3px] bg-[#12cdbe]" />Sales</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-[9px] rounded-[3px] bg-[#ffb018]" />Expenses</span>
        </div>
      </header>

      {chartBuckets.length ? (
        <div className="flex flex-1 flex-col px-3 pb-3 pt-4 sm:px-[18px]">
          <p className="sr-only">Sales total {formatDashboardCurrency(salesTotal)}. Expenses total {formatDashboardCurrency(expenseTotal)}.</p>
          <div className="h-[190px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartBuckets} margin={{ top: 4, right: 2, bottom: 0, left: -14 }} barGap={5}>
                <CartesianGrid vertical={false} strokeDasharray="3 4" stroke="#dfe8e6" />
                <XAxis dataKey="label" axisLine={{ stroke: '#dce3e2' }} tickLine={false} tick={{ fill: '#708283', fontSize: 10.5 }} dy={7} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#93a5a5', fontSize: 10 }} width={54} tickFormatter={(amount: number) => formatDashboardCompactCurrency(amount)} />
                <Tooltip<number, string> cursor={{ fill: 'rgba(18,205,190,0.05)' }} content={CashflowTooltip} isAnimationActive={false} />
                <Bar dataKey="sales" name="Sales" fill="#12cdbe" radius={[5, 5, 0, 0]} maxBarSize={18} isAnimationActive={false} />
                <Bar dataKey="expenses" name="Expenses" fill="#ffb018" radius={[5, 5, 0, 0]} maxBarSize={18} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="ml-[54px] mt-1 grid gap-1" style={{ gridTemplateColumns: `repeat(${chartBuckets.length}, minmax(0, 1fr))` }}>
            {chartBuckets.map((bucket) => (
              <span key={bucket.key} className={`truncate text-center font-mono text-[9.5px] ${bucket.net >= 0 ? 'text-[#166534] dark:text-[#7bd89a]' : 'text-[#b01c1c] dark:text-[#ff9999]'}`} title={`${bucket.label} net ${formatSignedDashboardCurrency(bucket.net)}`}>
                {formatSignedDashboardCurrency(bucket.net)}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid flex-1 place-items-center px-6 py-16 text-center text-xs text-[#93a5a5]">No cashflow activity was recorded for this period.</div>
      )}
    </section>
  )
}
