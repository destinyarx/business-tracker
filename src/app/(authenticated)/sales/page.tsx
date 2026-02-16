'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { RefreshCw, ArrowUp, ArrowDown, Users, ShoppingCart, CalendarSearch, ArrowRight, ArrowLeft, Search, PhilippinePeso } from 'lucide-react'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import Loading from '@/components/organisms/Loading'
import NoItemFound from '@/components/organisms/NoItemFound'

import { useState, useEffect, useMemo } from 'react'
import { TIME_PERIOD } from '@/constants'
import { useOrderQuery } from '@/features/orders/hooks/useOrderQuery'
import { useInvalidateQuery } from '@/hooks/useInvalidateQuery'
import type { OrderParams, Period, OrderData } from '@/features/orders/order.type'
import { format } from 'date-fns'

type TimePeriodValue = typeof TIME_PERIOD[number]['value'];

export default function SalesPage() {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [timePeriod, setTimePeriod] = useState<Period>('today')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [params, setParams] = useState<OrderParams>({
    filter: 'completed',
    searchKey: undefined,
    timePeriod: 'today'
  })

  const timePeriodName = TIME_PERIOD.find((item) => item.value === timePeriod)?.name ?? ''

  const { invalidateKey } = useInvalidateQuery()
  const { ordersQuery } = useOrderQuery(params)
  const hasNext = ordersQuery.data?.hasNext ?? false
  const orders = ordersQuery.data?.orders ?? []

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return orders

    const query = searchQuery.toLowerCase()

    return orders.filter((item: any) => {
      return (
        item.orderName?.toLowerCase().includes(query) ||
        item.customer?.name?.toLowerCase().includes(query)
      )
    })
  }, [orders, searchQuery])

  const orderStats = useMemo(() => {
    let totalSales = 0
    let totalProfit = 0
    let totalOrders = 0
    let totalCustomer = 0

    for (const order of orders) {
      totalSales += Number(order.totalAmount)
      
      totalProfit += Number(order.totalProfit) ?? 0
      totalOrders++
      totalCustomer += order?.customer?.name ? 1 : 0
    }

    return { totalSales, totalProfit, totalOrders, totalCustomer }
  }, [orders])

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
                <p className="text-lg font-semibold">₱ {orderStats.totalProfit}</p>
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

      {/* Sales Table */}
      <Card>
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
                filteredData.map((item: OrderData) => (
                  <TableRow>
                    <TableCell className="font-semibold">{item.orderName ?? 'N/A'}</TableCell>
                    <TableCell className="font-light">{item?.customer?.name ?? 'N/A'}</TableCell>
                    <TableCell className={item?.totalAmount ? 'text-green-600' : 'text-gray-700'}>{item.totalAmount ? `₱ ${item.totalAmount}` : ''}</TableCell>
                    <TableCell className={item?.totalProfit ? 'text-green-600' : 'text-gray-700'}>{item?.totalProfit ?? 'N/A'}</TableCell>
                    <TableCell className="text-xs italic">{item?.createdAt ? format(item.createdAt, 'MMM. dd, yyyy · hh:mm a') : 'N/A'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="flex flex-row justify-center items-center">
                      <NoItemFound title="No sales recorded" description="Sales will appear here once orders are completed."/>
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
    </div>
  )
}
