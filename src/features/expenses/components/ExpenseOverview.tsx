'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { ExpensePageSummary } from '../expense-summary'
import { formatExpenseAmount } from '../expense-summary'
import { ExpenseMetricCard } from './ExpenseMetricCard'

type ExpenseOverviewProps = {
  summary: ExpensePageSummary
}

export function ExpenseOverview({ summary }: ExpenseOverviewProps) {
  const [showDetails, setShowDetails] = useState(false)
  const biggestCategory = summary.biggestCategory

  return (
    <>
      <section
        className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Current expense page summary"
      >
        <ExpenseMetricCard
          label="This page"
          value={formatExpenseAmount(summary.totalAmount)}
          hint={`${summary.recordCount} ${summary.recordCount === 1 ? 'record' : 'records'}`}
          accent="linear-gradient(90deg,#a8d97c,#12cdbe)"
          chartColor="#12cdbe"
          chartValues={[4, 6, 5, 9, 7, 8]}
        />
        <ExpenseMetricCard
          label="Biggest category"
          value={biggestCategory?.label ?? 'No expenses'}
          hint={biggestCategory ? formatExpenseAmount(biggestCategory.amount) : 'No category totals'}
          accent="#5b34c7"
          chartValues={[12, 12, 12, 12, 12, 12]}
        />
        <ExpenseMetricCard
          label="Cash out"
          value={formatExpenseAmount(summary.cashAmount)}
          hint={`${summary.cashCount} cash ${summary.cashCount === 1 ? 'payment' : 'payments'}`}
          accent="#ffb018"
          chartValues={[2, 5, 4, 6, 5, 7]}
        />
        <ExpenseMetricCard
          label="Digital wallets"
          value={formatExpenseAmount(summary.digitalWalletAmount)}
          hint="GCash + Maya"
          accent="#3b82f6"
          chartValues={[1, 2, 2, 3, 4, 5]}
        />
      </section>

      <section
        className="mb-3.5 rounded-[18px] border border-[#e3e9e8] bg-white px-[18px] py-[15px] dark:border-[#243936] dark:bg-[#12201f]"
        aria-labelledby="expense-category-mix-title"
      >
        <div className="mb-3 flex flex-wrap items-center gap-2.5">
          <h2
            id="expense-category-mix-title"
            className="text-[11.5px] font-semibold uppercase tracking-[0.04em] text-[#5f7273] dark:text-[#9fb3b0]"
          >
            Where the money went
          </h2>
          <span className="ml-auto text-[11.5px] text-[#93a5a5]">Current filtered page</span>
          <button
            type="button"
            onClick={() => setShowDetails((isVisible) => !isVisible)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#dce3e2] bg-white px-2.5 py-1 text-[11px] font-medium text-[#5f7273] transition-colors hover:border-[#00beaa] hover:bg-[#f3fbf8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12cdbe] dark:border-[#2b4340] dark:bg-[#12201f] dark:text-[#c3d4d1] dark:hover:bg-[#18302e]"
            aria-expanded={showDetails}
          >
            {showDetails ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
            {showDetails ? 'Hide details' : 'Show details'}
          </button>
        </div>

        {summary.categories.length > 0 ? (
          <>
            <div className="mb-3.5 flex h-2.5 overflow-hidden rounded-full bg-[#f2f5f4] dark:bg-[#1b2e2c]">
              {summary.categories.map((category) => (
                <span
                  key={category.key}
                  style={{ width: `${category.percentage}%`, backgroundColor: category.color }}
                  title={`${category.label}: ${category.percentage.toFixed(0)}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {summary.categories.map((category) => (
                <span
                  key={category.key}
                  className="inline-flex items-center gap-2 rounded-full border border-[#edf1f0] bg-[#fbfcfc] py-1 pl-2 pr-2.5 text-xs text-[#16292b] transition-colors hover:border-[#c2e7e2] hover:bg-[#f3fbf8] dark:border-[#243936] dark:bg-[#16292b] dark:text-[#eaf3f1] dark:hover:border-[#2f625d]"
                >
                  <span className="size-2 rounded-[3px]" style={{ backgroundColor: category.color }} />
                  <span className="font-medium">{category.label}</span>
                  {showDetails && (
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#5f7273] dark:text-[#9fb3b0]">
                      {formatExpenseAmount(category.amount)}
                      <span className="text-[#93a5a5]">{category.percentage.toFixed(0)}%</span>
                    </span>
                  )}
                </span>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-[#dce3e2] bg-[#fbfcfc] px-4 py-6 text-center text-xs text-[#7c8e8e] dark:border-[#2b4340] dark:bg-[#16292b]">
            No expense categories to summarize on this page.
          </div>
        )}
      </section>
    </>
  )
}
