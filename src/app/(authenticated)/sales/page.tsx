'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  CalendarSearch,
  ChevronDown,
  RefreshCw,
  Search,
  SlidersHorizontal,
  TriangleAlert,
} from 'lucide-react'
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
import { useInvalidateQuery } from '@/hooks/useInvalidateQuery'
import SalesCard from '@/features/sales/components/SalesCard'
import { SalesOverview } from '@/features/sales/components/SalesOverview'
import { SalesTable } from '@/features/sales/components/SalesTable'
import { useSalesQuery } from '@/features/sales/hooks/useSalesQuery'
import type {
  SaleRecord,
  SalesRange,
  SalesSortDirection,
} from '@/features/sales/sales.type'
import {
  getFilteredSales,
  getSalesSummary,
} from '@/features/sales/sales.utils'

const salesPerPage = 5

const salesPeriods: { name: string; value: SalesRange }[] = [
  { name: 'Today', value: 'today' },
  { name: 'Yesterday', value: 'yesterday' },
  { name: 'This week', value: 'this_week' },
  { name: 'This month', value: 'this_month' },
]

export default function SalesPage() {
  const { invalidateKey } = useInvalidateQuery()
  const [selectedSale, setSelectedSale] = useState<SaleRecord>()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [range, setRange] = useState<SalesRange>('today')
  const [sort, setSort] = useState<SalesSortDirection>('desc')

  useEffect(() => {
    const debounceTimer = window.setTimeout(() => {
      setCurrentPage(1)
      setDebouncedSearch(searchQuery.trim())
    }, 350)

    return () => window.clearTimeout(debounceTimer)
  }, [searchQuery])

  const { salesQuery } = useSalesQuery({ range, sort })
  const sales = salesQuery.data ?? []
  const periodLabel =
    salesPeriods.find((period) => period.value === range)?.name ??
    'Selected period'
  const summary = getSalesSummary(sales)
  const filteredSales = useMemo(
    () => getFilteredSales(sales, debouncedSearch, sort),
    [debouncedSearch, sales, sort],
  )
  const totalPages = Math.max(1, Math.ceil(filteredSales.length / salesPerPage))
  const visibleSales = filteredSales.slice(
    (currentPage - 1) * salesPerPage,
    currentPage * salesPerPage,
  )

  const changePeriod = (nextRange: SalesRange): void => {
    setCurrentPage(1)
    setRange(nextRange)
  }

  const changeSort = (direction: SalesSortDirection): void => {
    setCurrentPage(1)
    setSort(direction)
  }

  return (
    <div className="space-y-4 p-4 sm:p-5 lg:p-6">
      <SalesOverview
        summary={summary}
        periodLabel={periodLabel}
        saleCount={sales.length}
      />

      {summary.profitInaccurate && (
        <div className="flex items-center gap-2 rounded-xl border border-[#f2dda0] bg-[#fff7e0] px-3.5 py-2.5 text-xs text-[#8a6100] dark:border-[#5c4920] dark:bg-[#493816] dark:text-[#ffd66b]">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          Some sales contain products without recorded profit, so their profit values may be inaccurate.
        </div>
      )}

      <section className="overflow-hidden rounded-[20px] border border-[#e3e9e8] bg-white dark:border-[#243936] dark:bg-[#12201f]" aria-labelledby="sales-records-title">
        <header className="flex flex-wrap items-center gap-2 border-b border-[#edf1f0] px-[18px] py-3.5 dark:border-[#1e322f]">
          <h2 id="sales-records-title" className="mr-auto text-[14.5px] font-semibold text-[#16292b] dark:text-[#eaf3f1]">Sales records</h2>

          <div className="relative min-w-[200px] flex-1 sm:max-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#93a5a5]" />
            <Input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search sales" aria-label="Search sales by order, customer, or notes" className="h-[38px] rounded-[10px] border-[#dce3e2] bg-[#f8fafa] pl-9 text-[13px] shadow-none focus-visible:border-[#00beaa] focus-visible:ring-[#12cdbe]/20 dark:border-[#2b4340] dark:bg-[#16292b]" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button type="button" variant="outline" className="h-[38px] rounded-[10px] border-[#dce3e2] bg-white px-3 text-[12.5px] font-medium shadow-none hover:border-[#00beaa] hover:bg-[#f3fbf8] dark:border-[#2b4340] dark:bg-[#12201f] dark:hover:bg-[#18302e]"><CalendarSearch className="size-4 text-[#007f78]" />{periodLabel}<ChevronDown className="size-3.5 text-[#93a5a5]" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl border-[#dce3e2] p-1.5 dark:border-[#2b4340]">
              {salesPeriods.map((period) => <DropdownMenuCheckboxItem key={period.value} checked={range === period.value} onCheckedChange={() => changePeriod(period.value)} className="rounded-lg text-[13px]">{period.name}</DropdownMenuCheckboxItem>)}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => changePeriod('today')} className="justify-center rounded-lg text-xs text-[#7c8e8e]">Reset to today</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button type="button" variant="outline" className="h-[38px] rounded-[10px] border-[#dce3e2] bg-white px-3 text-[12.5px] font-medium shadow-none hover:border-[#00beaa] hover:bg-[#f3fbf8] dark:border-[#2b4340] dark:bg-[#12201f] dark:hover:bg-[#18302e]"><SlidersHorizontal className="size-4 text-[#b77a00]" />Sale date ({sort === 'asc' ? 'oldest' : 'latest'})<ChevronDown className="size-3.5 text-[#93a5a5]" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 rounded-xl border-[#dce3e2] p-1.5 dark:border-[#2b4340]">
              <DropdownMenuCheckboxItem checked={sort === 'desc'} onCheckedChange={() => changeSort('desc')} className="rounded-lg text-[13px]">Sale date (latest)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={sort === 'asc'} onCheckedChange={() => changeSort('asc')} className="rounded-lg text-[13px]">Sale date (oldest)</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button type="button" variant="outline" size="icon-sm" disabled={salesQuery.isFetching} onClick={() => invalidateKey('sales')} aria-label="Refresh sales" className="size-[38px] rounded-[10px] border-[#dce3e2] bg-white shadow-none hover:border-[#00beaa] hover:bg-[#f3fbf8] dark:border-[#2b4340] dark:bg-[#12201f] dark:hover:bg-[#18302e]"><RefreshCw className={`size-4 text-[#007f78] ${salesQuery.isFetching ? 'animate-spin' : ''}`} /></Button>
        </header>

        <SalesTable
          sales={visibleSales}
          currentPage={currentPage}
          totalRecords={filteredSales.length}
          totalPages={totalPages}
          hasNext={currentPage < totalPages}
          isLoading={salesQuery.isLoading}
          isError={salesQuery.isError}
          errorMessage={salesQuery.error?.message}
          periodLabel={periodLabel}
          onPageChange={setCurrentPage}
          onViewSale={setSelectedSale}
        />
      </section>

      <SalesCard open={Boolean(selectedSale)} onOpenChange={(open) => !open && setSelectedSale(undefined)} sale={selectedSale} />
    </div>
  )
}
