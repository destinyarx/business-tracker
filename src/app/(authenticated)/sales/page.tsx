'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarSearch, ChevronDown, RefreshCw, Search, SlidersHorizontal, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { TIME_PERIOD } from '@/constants'
import { useInvalidateQuery } from '@/hooks/useInvalidateQuery'
import { useOrderQuery } from '@/features/orders/hooks/useOrderQuery'
import type { OrderData, Period } from '@/features/orders/order.type'
import SalesCard from '@/features/sales/components/SalesCard'
import { SalesOverview } from '@/features/sales/components/SalesOverview'
import { SalesTable } from '@/features/sales/components/SalesTable'
import { getFilteredSales, getSalesSummary } from '@/features/sales/sales.utils'

const salesPerPage = 5

export default function SalesPage() {
  const [selectedOrder, setSelectedOrder] = useState<OrderData>()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [timePeriod, setTimePeriod] = useState<Period>('today')
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const debounceTimer = window.setTimeout(() => {
      setCurrentPage(1)
      setDebouncedSearch(searchQuery.trim())
    }, 350)

    return () => window.clearTimeout(debounceTimer)
  }, [searchQuery])

  const { ordersQuery } = useOrderQuery({
    filter: 'completed',
    timePeriod,
    sortByStatus: sort,
  })
  const { invalidateKey } = useInvalidateQuery()
  const orders = ordersQuery.data?.orders ?? []
  const periodLabel = TIME_PERIOD.find((period) => period.value === timePeriod)?.name ?? 'Selected period'
  const summary = getSalesSummary(orders)
  const filteredOrders = useMemo(
    () => getFilteredSales(orders, debouncedSearch, sort),
    [debouncedSearch, orders, sort],
  )
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / salesPerPage))
  const visibleOrders = filteredOrders.slice(
    (currentPage - 1) * salesPerPage,
    currentPage * salesPerPage,
  )

  const changePeriod = (period: Period) => {
    setCurrentPage(1)
    setTimePeriod(period)
  }

  const changeSort = (direction: 'asc' | 'desc') => {
    setCurrentPage(1)
    setSort(direction)
  }

  return (
    <div className="space-y-4 p-4 sm:p-5 lg:p-6">
      <SalesOverview summary={summary} periodLabel={periodLabel} orderCount={orders.length} />

      {summary.profitInaccurate && (
        <div className="flex items-start gap-2 rounded-xl border border-[#f2dda0] bg-[#fff7e0] px-3.5 py-2.5 text-xs text-[#8a6100] dark:border-[#5c4920] dark:bg-[#493816] dark:text-[#ffd66b]">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          Some completed orders contain products without recorded profit, so their profit values may be inaccurate.
        </div>
      )}

      <section className="overflow-hidden rounded-[20px] border border-[#e3e9e8] bg-white dark:border-[#243936] dark:bg-[#12201f]" aria-labelledby="sales-records-title">
        <header className="flex flex-wrap items-center gap-2 border-b border-[#edf1f0] px-[18px] py-3.5 dark:border-[#1e322f]">
          <h2 id="sales-records-title" className="mr-auto text-[14.5px] font-semibold text-[#16292b] dark:text-[#eaf3f1]">Sales records</h2>

          <div className="relative min-w-[200px] flex-1 sm:max-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#93a5a5]" />
            <Input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search sales" aria-label="Search sales" className="h-[38px] rounded-[10px] border-[#dce3e2] bg-[#f8fafa] pl-9 text-[13px] shadow-none focus-visible:border-[#00beaa] focus-visible:ring-[#12cdbe]/20 dark:border-[#2b4340] dark:bg-[#16292b]" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button type="button" variant="outline" className="h-[38px] rounded-[10px] border-[#dce3e2] bg-white px-3 text-[12.5px] font-medium shadow-none hover:border-[#00beaa] hover:bg-[#f3fbf8] dark:border-[#2b4340] dark:bg-[#12201f] dark:hover:bg-[#18302e]"><CalendarSearch className="size-4 text-[#007f78]" />{periodLabel}<ChevronDown className="size-3.5 text-[#93a5a5]" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl border-[#dce3e2] p-1.5 dark:border-[#2b4340]">
              {TIME_PERIOD.map((period) => <DropdownMenuCheckboxItem key={period.value} checked={timePeriod === period.value} onCheckedChange={() => changePeriod(period.value)} className="rounded-lg text-[13px]">{period.name}</DropdownMenuCheckboxItem>)}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => changePeriod('today')} className="justify-center rounded-lg text-xs text-[#7c8e8e]">Reset to today</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button type="button" variant="outline" className="h-[38px] rounded-[10px] border-[#dce3e2] bg-white px-3 text-[12.5px] font-medium shadow-none hover:border-[#00beaa] hover:bg-[#f3fbf8] dark:border-[#2b4340] dark:bg-[#12201f] dark:hover:bg-[#18302e]"><SlidersHorizontal className="size-4 text-[#b77a00]" />Order date ({sort === 'asc' ? 'oldest' : 'latest'})<ChevronDown className="size-3.5 text-[#93a5a5]" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 rounded-xl border-[#dce3e2] p-1.5 dark:border-[#2b4340]">
              <DropdownMenuCheckboxItem checked={sort === 'desc'} onCheckedChange={() => changeSort('desc')} className="rounded-lg text-[13px]">Order date (latest)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={sort === 'asc'} onCheckedChange={() => changeSort('asc')} className="rounded-lg text-[13px]">Order date (oldest)</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button type="button" variant="outline" size="icon-sm" disabled={ordersQuery.isFetching} onClick={() => invalidateKey('orders')} aria-label="Refresh sales" className="size-[38px] rounded-[10px] border-[#dce3e2] bg-white shadow-none hover:border-[#00beaa] hover:bg-[#f3fbf8] dark:border-[#2b4340] dark:bg-[#12201f] dark:hover:bg-[#18302e]"><RefreshCw className={`size-4 text-[#007f78] ${ordersQuery.isFetching ? 'animate-spin' : ''}`} /></Button>
        </header>

        <SalesTable orders={visibleOrders} currentPage={currentPage} totalRecords={filteredOrders.length} totalPages={totalPages} hasNext={currentPage < totalPages} isLoading={ordersQuery.isLoading} isError={ordersQuery.isError} periodLabel={periodLabel} onPageChange={setCurrentPage} onViewSale={setSelectedOrder} />
      </section>

      <SalesCard open={Boolean(selectedOrder)} onOpenChange={(open) => !open && setSelectedOrder(undefined)} order={selectedOrder} />
    </div>
  )
}
