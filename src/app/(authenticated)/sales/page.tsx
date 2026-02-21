'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { RefreshCw, ArrowUp, ArrowDown, Users, ShoppingCart, CalendarSearch, ArrowRight, ArrowLeft, Search, PhilippinePeso, ListFilter } from 'lucide-react'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import Loading from '@/components/organisms/Loading'
import NoItemFound from '@/components/organisms/NoItemFound'
import { Modal } from '@/components/molecules/Modal'
import SalesCard from '@/features/sales/components/SalesCard'

import { useState, useEffect, useMemo, useRef } from 'react'
import { TIME_PERIOD } from '@/constants'
import { useOrderQuery } from '@/features/orders/hooks/useOrderQuery'
import { useInvalidateQuery } from '@/hooks/useInvalidateQuery'
import type { OrderParams, Period, OrderData } from '@/features/orders/order.type'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

type TimePeriodValue = typeof TIME_PERIOD[number]['value'];

export default function SalesPage() {
  const [showSalesDetails, setShowSalesDetails] = useState<boolean>(false)
  const [orderDetails, setOrderDetails] = useState<Partial<OrderData>>()

  const [sort, setSort] = useState<'asc'|'desc'>('desc')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [timePeriod, setTimePeriod] = useState<Period>('today')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [params, setParams] = useState<OrderParams>({
    filter: 'completed',
    searchKey: undefined,
    timePeriod: 'today',
    sortByStatus: 'desc'
  })

  const timePeriodName = TIME_PERIOD.find((item) => item.value === timePeriod)?.name ?? ''

  const { invalidateKey } = useInvalidateQuery()
  const { ordersQuery } = useOrderQuery(params)
  const hasNext = ordersQuery.data?.hasNext ?? false
  const orders = ordersQuery.data?.orders ?? []

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase()
    
    const sortedOrders = sort === 'asc'
      ? [...orders].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
      : [...orders].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))

    if (!searchQuery.trim()) return sortedOrders

    return sortedOrders.filter((item: any) => {
      return (
        item.orderName?.toLowerCase().includes(query) ||
        item.customer?.name?.toLowerCase().includes(query)
      )
    })
  }, [orders, searchQuery, sort])

  const orderStats = useMemo(() => {
    let totalSales = 0
    let totalProfit = 0
    let totalOrders = 0
    let totalCustomer = 0
    let profitInaccurate = false

    for (const order of orders) {
      if (order.profitInaccurate) profitInaccurate = true

      totalSales += Number(order.totalAmount)
      totalProfit += Number(order.totalProfit) ?? 0
      totalOrders++
      totalCustomer += 1 // TODO: Add better logic for counting customers
    }

    return { totalSales, totalProfit, totalOrders, totalCustomer, profitInaccurate }
  }, [orders])

  const handleTableRowClick = (item: Partial<OrderData>) => {
    setOrderDetails({
      orderName: item.orderName,
      items: item.items,
      totalAmount: item.totalAmount,
      totalProfit: item.totalProfit,
      profitInaccurate: item.profitInaccurate,
      notes: item.notes,
      customer: item.customer,
      createdAt: item.statusUpdatedAt
    })

    setShowSalesDetails(true)
  }

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      timePeriod: timePeriod,
      searchKey: debouncedSearch || undefined
    }))

  }, [currentPage, debouncedSearch, timePeriod])

  useEffect(() => {
    console.log("params updated:", params);
    console.log()
  }, [params]);

  if (ordersQuery.isLoading) return <Loading />

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-50 dark:bg-slate-300 dark:text-white hover:bg-teal-100 py-2 px-0">
          <CardContent>
            <div className="flex flex-row flex-wrap items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-gray-600 font-light">Sales {timePeriodName}</p>
                <p className="text-lg font-semibold">₱ {orderStats.totalSales}</p>
              </div>

              <div className="border rounded-full p-2 bg-teal-400">
                <PhilippinePeso className="h-5 w-5 text-white" />
              </div>
            </div>

            <div className="flex flex-row gap-1 mt-2">
              <ArrowUp className="h-4 w-4 animate-bounce text-green-700" />
              <p className="text-xs italic dark:text-gray-600 font-light">
                +8.2% from yesterday
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-slate-300 dark:text-white hover:bg-teal-100 py-2 px-0">
          <CardContent>
            <div className="flex flex-row flex-wrap items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-gray-600 font-light">Total Revenue {timePeriodName}</p>

                <div className="flex flex-row gap-2">
                  <p className="text-lg font-semibold">₱ {orderStats.totalProfit}</p>
                  
                  {(orderStats.profitInaccurate && true) && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-xl">⚠️</p>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-amber-100 text-amber-800 border border-amber-200">
                        <p> Inaccurate Profit </p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>

              <div className="border rounded-full p-2 bg-teal-400">
                <PhilippinePeso className="h-5 w-5 text-white" />
              </div>
            </div>

            <div className="flex flex-row gap-1 mt-2">
              <ArrowDown className="h-4 w-4 animate-bounce text-rose-700" />
              <p className="text-xs italic text-gray-600 font-light">
                -4.2% from yesterday
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-slate-300 dark:text-white hover:bg-teal-100 py-2 px-0">
          <CardContent>
            <div className="flex flex-row  flex-wrap items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-gray-600 font-light">Total Orders {timePeriodName}</p>
                <p className="text-lg font-semibold">{orderStats.totalOrders}</p>
              </div>

              <div className="border rounded-full p-2 bg-sky-400">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
            </div>

            <div className="flex flex-row gap-1 mt-2">
              <ArrowUp className="h-4 w-4 animate-bounce text-green-700" />
              <p className="text-xs italic text-gray-600 font-light">
                +2 person/s from yesterday
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-slate-300 dark:text-white hover:bg-teal-100 py-2 px-0 shadow-lg">
          <CardContent>
            <div className="flex flex-row flex-wrap items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-gray-600 font-light">Total Customers {timePeriodName}</p>
                <p className="text-lg font-semibold">{orderStats.totalCustomer}</p>
              </div>

              <div className="border rounded-full p-2 bg-indigo-400">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>

            <div className="flex flex-row gap-1 mt-2">
              <ArrowUp className="h-4 w-4 animate-bounce text-green-700" />
              <p className="text-xs italic text-gray-600 font-light">
                +2 person/s from yesterday
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {orderStats.profitInaccurate && (
        <div className="flex justify-end -mt-3">
          <div className="inline-flex items-center justify-start w-auto bg-amber-100 text-gray-600 text-xs italic rounded-xl px-2 mx-5">
            <p className="text-lg">⚠️</p>
            <p className="-mb-1">Some orders contain items without recorded profit. Total profits may be inaccurate.</p>
          </div>
        </div>
      )}

      {/* Sales Table */}
      <Card className="-mt-3">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sales {timePeriodName}</CardTitle>
          
          <div className="flex flex-row gap-2">
            <div className="relative w-full ">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                  placeholder="Search"
                  value={undefined}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='gap-2'>
                    <CalendarSearch className="h-4 w-4 text-sky-500" />
                    <span className='text-sm'>
                        {timePeriod ? TIME_PERIOD.find((item) => item.value === timePeriod)?.name : 'Time Period'}
                    </span>
                  </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align='end' className='w-52'>
                  {TIME_PERIOD.map((method) => (
                      <DropdownMenuCheckboxItem
                          key={method.value}
                          checked={timePeriod === method.value}
                          onCheckedChange={() => setTimePeriod(method.value)}
                      >
                          {method.name}
                      </DropdownMenuCheckboxItem>
                  ))}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setTimePeriod('today')} className="flex justify-center text-muted-foreground">
                      Reset
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='gap-2'>
                    <ListFilter className="h-4 w-4 text-amber-500" />
                    <span className='text-sm'>
                        {sort === 'asc' ? 'Oldest First' : 'Newest First'}
                    </span>
                  </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align='end' className='w-52'>
                    <DropdownMenuCheckboxItem
                        checked={sort == 'desc'}
                        onCheckedChange={() => setSort('desc')}
                    >
                        Latest to oldest
                    </DropdownMenuCheckboxItem>

                    <DropdownMenuCheckboxItem
                        checked={sort == 'asc'}
                        onCheckedChange={() => setSort('asc')}
                    >
                        Oldest to latest
                    </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              onClick={() => invalidateKey('orders')}
              variant="outline" 
              size="icon-sm" 
              className="bg-sky-800 hover:bg-sky-400"
            >
              <RefreshCw className="h-4 w-4 text-white" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table className="overflow-hidden rounded-xl border border-border">
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent [&_th]:h-11 [&_th]:text-xs [&_th]:font-semibold dark:[&_th]:text-white [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-muted-foreground [&_th:last-child]:pr-6">
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Date & Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length ? (
                filteredData.map((item: OrderData, index) => (
                  <TableRow key={index} onClick={() => handleTableRowClick(item)}>
                    <TableCell className="font-semibold">
                      {item.orderName ?? 'N/A'}
                    </TableCell>

                    <TableCell className="font-light">
                      {item?.customer?.name ?? 'N/A'}
                    </TableCell>

                    <TableCell className={item?.totalAmount ? 'text-green-600' : 'text-gray-700'}>
                      {item.totalAmount ? `₱ ${item.totalAmount}` : ''}
                    </TableCell>

                    <TableCell className={cn('flex flex-row justify-center items-center gap-1', item?.totalProfit ? 'text-green-600' : 'text-gray-700')}>
                      <p>{item?.totalProfit ?? 'N/A'}</p>

                      {(item?.profitInaccurate && true) && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="text-xl">⚠️</p>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-amber-100 text-amber-800 border border-amber-200">
                            <p> Inaccurate Profit </p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </TableCell>

                    <TableCell className="text-xs italic">
                      {item?.statusUpdatedAt ? format(item.statusUpdatedAt, 'MMM. dd, yyyy · hh:mm a') : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="flex flex-row justify-center items-center">
                      <NoItemFound title={`No sales recorded ${timePeriod}`} description="Sales will appear here once orders are completed."/>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TableCell colSpan={7} className="p-0">
                  <div className="flex w-full items-center justify-end gap-2 border px-4 py-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => currentPage - 1}
                        className="bg-teal-600 text-white hover:bg-teal-700"
                    >
                        <ArrowLeft className="h-3 w-3" />
                        Previous
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!hasNext}
                        onClick={() => currentPage + 1}
                        className="bg-teal-600 text-white hover:bg-teal-700"
                    >
                        Next
                        <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      <Modal 
        open={showSalesDetails} 
        onOpenChange={setShowSalesDetails} 
        title="Sales Details"
        className="lg:max-w-3xl max-h-[85vh] overflow-y-auto"
      >
        <div className="-mt-3">
          <SalesCard order={orderDetails}/>
        </div>
      </Modal>
    </div>
  )
}
