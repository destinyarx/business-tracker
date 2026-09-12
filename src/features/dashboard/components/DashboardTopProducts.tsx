import Link from 'next/link'
import type { DashboardTopProduct } from '../dashboard.types'
import { formatDashboardCurrency } from '../dashboard.utils'

type DashboardTopProductsProps = {
  products: DashboardTopProduct[]
}

export function DashboardTopProducts({
  products,
}: DashboardTopProductsProps) {
  return (
    <section className="overflow-hidden rounded-[20px] border border-[#e3e9e8] bg-white dark:border-[#243936] dark:bg-[#12201f]" aria-labelledby="top-products-heading">
      <header className="flex items-center gap-2.5 border-b border-[#edf1f0] px-[18px] py-3.5 dark:border-[#243936]">
        <div className="min-w-0">
          <h2 id="top-products-heading" className="text-[14.5px] font-semibold text-[#16292b] dark:text-[#eaf3f1]">Top products</h2>
          <p className="mt-0.5 truncate text-[11.5px] text-[#93a5a5]">By sales value in completed orders.</p>
        </div>
        <Link href="/products" className="ml-auto shrink-0 rounded-[9px] border border-[#dce3e2] bg-white px-3 py-[7px] text-xs font-semibold text-[#0c4b47] transition-colors hover:border-[#00beaa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12cdbe]/25 dark:border-[#2b4340] dark:bg-[#162725] dark:text-[#b7e7df]">Products</Link>
      </header>
      {products.length ? (
        <div className="px-[18px] pb-2 pt-3.5">
          {products.map((product) => (
            <div key={`${product.rank}-${product.productId ?? 'deleted'}`} className="mb-[13px]">
              <div className="mb-[7px] flex items-center gap-2.5">
                <span className="shrink-0 font-mono text-[11px] text-[#93a5a5]">{String(product.rank).padStart(2, '0')}</span>
                <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-[#16292b] dark:text-[#eaf3f1]" title={product.title}>{product.title}</span>
                <span className="shrink-0 whitespace-nowrap font-mono text-xs text-[#16292b] dark:text-[#eaf3f1]">{formatDashboardCurrency(product.revenueAmount)}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[#f2f5f4] dark:bg-[#1b302e]">
                  <span className="block h-full rounded-full bg-[#12cdbe]" style={{ width: `${product.percentageOfLeader}%` }} />
                </div>
                <span className="shrink-0 whitespace-nowrap text-[11px] text-[#93a5a5]">{product.quantitySold} sold</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid min-h-48 place-items-center px-6 text-center text-xs text-[#93a5a5]">Top products will appear after the first completed order.</div>
      )}
    </section>
  )
}
