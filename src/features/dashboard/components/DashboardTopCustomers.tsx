import Link from 'next/link'
import type { DashboardTopCustomer } from '../dashboard.types'
import {
  formatDashboardCurrency,
  getDashboardInitials,
} from '../dashboard.utils'

type DashboardTopCustomersProps = {
  customers: DashboardTopCustomer[]
}

export function DashboardTopCustomers({
  customers,
}: DashboardTopCustomersProps) {
  return (
    <section className="overflow-hidden rounded-[20px] border border-[#e3e9e8] bg-white dark:border-[#243936] dark:bg-[#12201f]" aria-labelledby="top-customers-heading">
      <header className="flex items-center gap-2.5 border-b border-[#edf1f0] px-[18px] py-3.5 dark:border-[#243936]">
        <div className="min-w-0">
          <h2 id="top-customers-heading" className="text-[14.5px] font-semibold text-[#16292b] dark:text-[#eaf3f1]">Who is buying</h2>
          <p className="mt-0.5 truncate text-[11.5px] text-[#93a5a5]">Completed order value per customer.</p>
        </div>
        <Link href="/customers" className="ml-auto shrink-0 rounded-[9px] border border-[#dce3e2] bg-white px-3 py-[7px] text-xs font-semibold text-[#0c4b47] transition-colors hover:border-[#00beaa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12cdbe]/25 dark:border-[#2b4340] dark:bg-[#162725] dark:text-[#b7e7df]">Customers</Link>
      </header>
      {customers.length ? (
        <div>
          {customers.map((customer) => (
            <div key={`${customer.rank}-${customer.customerId ?? 'guest'}`} className="flex items-center gap-[11px] border-b border-[#f0f3f2] px-[18px] py-[11px] last:border-b-0 dark:border-[#1c312f]">
              <span className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-[#f2f5f4] text-[11.5px] font-bold text-[#3f5254] dark:bg-[#1b302e] dark:text-[#b7c8c5]">{getDashboardInitials(customer.name)}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] font-medium text-[#16292b] dark:text-[#eaf3f1]" title={customer.name}>{customer.name}</span>
                <span className="mt-0.5 block text-[11px] text-[#93a5a5]">{customer.completedOrderCount} completed {customer.completedOrderCount === 1 ? 'order' : 'orders'}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block whitespace-nowrap font-mono text-[12.5px] font-medium text-[#16292b] dark:text-[#eaf3f1]">{formatDashboardCurrency(customer.salesAmount)}</span>
                <span className="mt-0.5 block text-[10.5px] text-[#93a5a5]">{Math.round(customer.percentageOfSales)}% of sales</span>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid min-h-48 place-items-center px-6 text-center text-xs text-[#93a5a5]">Customer rankings will appear after the first completed order.</div>
      )}
      <footer className="flex items-center gap-2.5 border-t border-[#edf1f0] bg-[#fafcfb] px-[18px] py-3 dark:border-[#243936] dark:bg-[#10201e]">
        <span className="min-w-0 truncate text-xs text-[#5f7273] dark:text-[#9fb3b0]">Ask NegosyoAI who to win back.</span>
        <Link href="/negosyo-ai" className="ml-auto shrink-0 rounded-[9px] bg-[#e4f7f4] px-3 py-[7px] text-xs font-semibold text-[#00706a] transition-colors hover:bg-[#12cdbe] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12cdbe]/30 dark:bg-[#173b37] dark:text-[#7fe0da] dark:hover:bg-[#007f78] dark:hover:text-white">NegosyoAI</Link>
      </footer>
    </section>
  )
}
