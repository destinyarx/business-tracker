import { Boxes, ChartNoAxesColumnIncreasing, ShoppingCart, Users } from 'lucide-react'
import { ModuleMetricCard } from '@/components/molecules/ModuleMetricCard'
import type { SalesSummary } from '@/features/sales/sales.utils'
import { formatSalesCurrency } from '@/features/sales/sales.utils'

interface SalesOverviewProps {
  summary: SalesSummary
  periodLabel: string
  saleCount: number
}

export function SalesOverview({ summary, periodLabel, saleCount }: SalesOverviewProps) {
  return (
    <section className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4" aria-label="Sales overview">
      <ModuleMetricCard
        label={`Sales ${periodLabel.toLowerCase()}`}
        value={formatSalesCurrency(summary.totalSales)}
        hint={`${saleCount} recognized ${saleCount === 1 ? 'sale' : 'sales'}`}
        icon={ChartNoAxesColumnIncreasing}
        accent="#12cdbe"
        iconClassName="bg-[#e4f7f4] text-[#007f78] dark:bg-[#173d39] dark:text-[#55ddd0]"
        chartValues={[4, 6, 5, 8, 7, 9]}
      />
      <ModuleMetricCard
        label="Average sale"
        value={formatSalesCurrency(summary.averageSale)}
        hint="Per recognized sale"
        icon={ShoppingCart}
        accent="#ffb018"
        iconClassName="bg-[#fff7e0] text-[#8a6100] dark:bg-[#493816] dark:text-[#ffd66b]"
        chartValues={[5, 5, 6, 6, 7, 7]}
      />
      <ModuleMetricCard
        label="Units sold"
        value={String(summary.unitsSold)}
        hint="Across all sales shown"
        icon={Boxes}
        accent="#5b34c7"
        iconClassName="bg-[#f3eeff] text-[#5b34c7] dark:bg-[#30254b] dark:text-[#c2afff]"
        chartValues={[12, 18, 15, 22, 20, 26]}
      />
      <ModuleMetricCard
        label="Best customer"
        value={summary.bestCustomer}
        hint="Highest sales value shown"
        icon={Users}
        accent="#3b82f6"
        iconClassName="bg-[#e6f0fe] text-[#1d4ed8] dark:bg-[#1b3150] dark:text-[#8cbcff]"
        chartValues={[]}
      />
    </section>
  )
}
