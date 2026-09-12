import Link from 'next/link'
import type { DashboardExpenseCategory } from '../dashboard.types'
import { formatDashboardCurrency } from '../dashboard.utils'

const expenseCategoryColors: Record<string, string> = {
  rent: '#5b34c7',
  inventory: '#12cdbe',
  salary: '#1d4ed8',
  utilities: '#ffb018',
  shipping: '#007f78',
  supplies: '#a8d97c',
  marketing: '#e05e38',
  fees: '#8a6100',
  software: '#3b82f6',
  maintenance: '#7c3aed',
  equipment: '#0f766e',
  taxes: '#b01c1c',
  professional_services: '#6366f1',
  transportation: '#f97316',
  meals: '#84a52e',
  other: '#6b7a7a',
}

type DashboardExpenseBreakdownProps = {
  categories: DashboardExpenseCategory[]
  totalAmount: string
}

export function DashboardExpenseBreakdown({
  categories,
  totalAmount,
}: DashboardExpenseBreakdownProps) {
  const largestCategory = categories[0]

  return (
    <section className="flex min-h-[296px] flex-col overflow-hidden rounded-[20px] border border-[#e3e9e8] bg-white dark:border-[#243936] dark:bg-[#12201f]" aria-labelledby="expense-breakdown-heading">
      <header className="flex items-center gap-3 border-b border-[#edf1f0] px-[18px] py-3.5 dark:border-[#243936]">
        <div className="min-w-0">
          <h2 id="expense-breakdown-heading" className="text-[14.5px] font-semibold text-[#16292b] dark:text-[#eaf3f1]">Where the money went</h2>
          <p className="mt-0.5 text-[11.5px] text-[#93a5a5]">Recorded expenses by category.</p>
        </div>
        <span className="ml-auto whitespace-nowrap font-mono text-[13px] font-medium text-[#16292b] dark:text-[#eaf3f1]">{formatDashboardCurrency(totalAmount)}</span>
      </header>

      <div className="flex-1 px-[18px] pb-1 pt-3.5">
        {categories.length ? categories.map((category) => {
          const color = expenseCategoryColors[category.category] ?? '#6b7a7a'
          return (
            <div key={`${category.category}-${category.label}`} className="mb-[13px]">
              <div className="mb-[7px] flex items-center gap-[9px]">
                <span className="size-[9px] shrink-0 rounded-[3px]" style={{ backgroundColor: color }} />
                <span className="min-w-0 truncate text-[12.5px] font-medium capitalize text-[#16292b] dark:text-[#eaf3f1]">{category.label}</span>
                <span className="ml-auto whitespace-nowrap font-mono text-xs text-[#16292b] dark:text-[#eaf3f1]">{formatDashboardCurrency(category.amount)}</span>
                <span className="min-w-[34px] text-right text-[11px] text-[#93a5a5]">{Math.round(category.percentage)}%</span>
              </div>
              <div className="h-[7px] overflow-hidden rounded-full bg-[#f2f5f4] dark:bg-[#1b302e]">
                <span className="block h-full rounded-full" style={{ width: `${category.percentage}%`, backgroundColor: color }} />
              </div>
            </div>
          )
        }) : (
          <div className="grid min-h-40 place-items-center text-center text-xs text-[#93a5a5]">No expenses were recorded for this period.</div>
        )}
      </div>

      <footer className="flex items-center gap-2.5 border-t border-[#edf1f0] bg-[#fafcfb] px-[18px] py-3 dark:border-[#243936] dark:bg-[#10201e]">
        <span className="min-w-0 truncate text-xs text-[#5f7273] dark:text-[#9fb3b0]">
          {largestCategory ? `${largestCategory.label} is your biggest line.` : 'Your expense mix will appear here.'}
        </span>
        <Link href="/expenses" className="ml-auto shrink-0 rounded-[9px] border border-[#dce3e2] bg-white px-3 py-[7px] text-xs font-semibold text-[#0c4b47] transition-colors hover:border-[#00beaa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12cdbe]/25 dark:border-[#2b4340] dark:bg-[#162725] dark:text-[#b7e7df]">Open Expenses</Link>
      </footer>
    </section>
  )
}
