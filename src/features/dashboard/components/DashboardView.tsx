import {
  PackageCheck,
  ReceiptText,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react'
import type {
  DashboardOverview,
  DashboardRange,
} from '../dashboard.types'
import { formatDashboardCurrency } from '../dashboard.utils'
import { DashboardAttentionList } from './DashboardAttentionList'
import { DashboardCashflowChart } from './DashboardCashflowChart'
import { DashboardExpenseBreakdown } from './DashboardExpenseBreakdown'
import { DashboardMetricCard } from './DashboardMetricCard'
import { DashboardPeriodSelect } from './DashboardPeriodSelect'
import { DashboardTopCustomers } from './DashboardTopCustomers'
import { DashboardTopProducts } from './DashboardTopProducts'

type DashboardViewProps = {
  overview: DashboardOverview
  selectedRange: DashboardRange
  onRangeChange: (range: DashboardRange) => void
  isRefreshing?: boolean
}

export function DashboardView({
  overview,
  selectedRange,
  onRangeChange,
  isRefreshing = false,
}: DashboardViewProps) {
  const { basis, metrics, range } = overview
  const completedLabel = `${basis.completedOrderCount} completed ${basis.completedOrderCount === 1 ? 'order' : 'orders'}`
  const expenseLabel = `${basis.expenseRecordCount} expense ${basis.expenseRecordCount === 1 ? 'record' : 'records'}`
  const profitDelta = metrics.inaccurateSaleCount
    ? `${metrics.inaccurateSaleCount} ${metrics.inaccurateSaleCount === 1 ? 'sale' : 'sales'} missing data`
    : 'Estimate only'

  return (
    <div
      className={`w-full max-w-[1480px] transition-opacity ${isRefreshing ? 'opacity-70' : 'opacity-100'}`}
      aria-busy={isRefreshing}
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <p className="text-xs text-[#93a5a5]">
          Every figure below comes from {completedLabel} and {expenseLabel} in{' '}
          {range.label.toLowerCase()}.
        </p>
        <div className="ml-auto">
          <DashboardPeriodSelect
            value={selectedRange}
            onChange={onRangeChange}
            disabled={isRefreshing}
          />
        </div>
      </div>

      <div className="mb-3.5 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardMetricCard
          label="Sales on record"
          value={formatDashboardCurrency(metrics.salesAmount)}
          delta={`${metrics.completedOrderCount} completed`}
          hint={`${range.label} · completed orders only`}
          href="/sales"
          linkLabel="Open Sales"
          icon={ShoppingCart}
          accent="linear-gradient(90deg, #12cdbe 0%, #a8d97c 100%)"
          iconClassName="bg-[#e4f7f4] text-[#00706a] dark:bg-[#173b37] dark:text-[#7fe0da]"
        />
        <DashboardMetricCard
          label="Expenses on record"
          value={formatDashboardCurrency(metrics.expenseAmount)}
          delta={`${basis.expenseRecordCount} records`}
          hint={`${range.label} · recorded business costs`}
          href="/expenses"
          linkLabel="Open Expenses"
          icon={ReceiptText}
          accent="linear-gradient(90deg, #ffb018 0%, #ffd98a 100%)"
          iconClassName="bg-[#fff7e0] text-[#8a6100] dark:bg-[#43371b] dark:text-[#ffd36b]"
        />
        <DashboardMetricCard
          label="Estimated profit"
          value={formatDashboardCurrency(metrics.estimatedProfitAmount)}
          delta={profitDelta}
          hint="Uses profit captured when each sale was recognized"
          href="/products"
          linkLabel="Open Products"
          icon={TrendingUp}
          accent="linear-gradient(90deg, #b01c1c 0%, #ff8a8a 100%)"
          iconClassName="bg-[#fdecec] text-[#b01c1c] dark:bg-[#482321] dark:text-[#ff9999]"
          deltaClassName={
            metrics.inaccurateSaleCount
              ? 'bg-[#fdecec] text-[#b01c1c] dark:bg-[#482321] dark:text-[#ff9999]'
              : undefined
          }
        />
        <DashboardMetricCard
          label="Completed orders"
          value={String(metrics.completedOrderCount)}
          delta={`${metrics.queuedOrderCount} still in queue`}
          hint={`${range.label} · out of ${metrics.totalOrderCount} orders on file`}
          href="/orders"
          linkLabel="Open Orders"
          icon={PackageCheck}
          accent="linear-gradient(90deg, #1d4ed8 0%, #7fa6ff 100%)"
          iconClassName="bg-[#e6f0fe] text-[#1d4ed8] dark:bg-[#1f3155] dark:text-[#90b3ff]"
        />
      </div>

      <div className="mb-3.5 grid items-stretch gap-3.5 xl:grid-cols-2">
        <DashboardCashflowChart buckets={overview.cashflow} />
        <DashboardExpenseBreakdown
          categories={overview.expenseBreakdown}
          totalAmount={metrics.expenseAmount}
        />
      </div>

      <div className="grid items-start gap-3.5 lg:grid-cols-2 xl:grid-cols-3">
        <DashboardAttentionList attention={overview.attention} />
        <DashboardTopProducts products={overview.topProducts} />
        <DashboardTopCustomers customers={overview.topCustomers} />
      </div>
    </div>
  )
}
