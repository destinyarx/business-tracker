'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ArrowUpRight,
  BadgeDollarSign,
  Box,
  CreditCard,
  Receipt,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type TopProduct = {
  id: string
  name: string
  imageUrl: string
  sold: number
  revenue: number
  profit: number
  category: string
}

type RecentSale = {
  id: string
  orderName: string
  customer: string
  date: string
  amount: number
  method: 'cash' | 'gcash' | 'card'
  status: 'paid' | 'pending' | 'refunded'
}

const peso = (n: number) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n)

const k = (n: number) => {
  if (n >= 1_000_000) return `${Math.round((n / 1_000_000) * 10) / 10}M`
  if (n >= 1_000) return `${Math.round((n / 1_000) * 10) / 10}K`
  return `${n}`
}

const stats = [
  {
    title: 'Total Sales (30d)',
    value: peso(248_430),
    sub: '+12.4% vs last 30d',
    icon: ShoppingCart,
  },
  {
    title: 'Total Profit (30d)',
    value: peso(73_980),
    sub: '+9.1% vs last 30d',
    icon: TrendingUp,
  },
  {
    title: 'Orders (30d)',
    value: '428',
    sub: '+38 new this week',
    icon: BadgeDollarSign,
  },
  {
    title: 'Active Customers',
    value: '156',
    sub: '+14 this month',
    icon: Users,
  },
]

const salesTrendData = [
  { day: 'Mon', sales: 7200, profit: 2100 },
  { day: 'Tue', sales: 8800, profit: 2400 },
  { day: 'Wed', sales: 6400, profit: 1800 },
  { day: 'Thu', sales: 10200, profit: 3100 },
  { day: 'Fri', sales: 11800, profit: 3600 },
  { day: 'Sat', sales: 13500, profit: 3900 },
  { day: 'Sun', sales: 9800, profit: 2800 },
]

const categorySalesData = [
  { name: 'Skincare', value: 78_200 },
  { name: 'Supplements', value: 64_900 },
  { name: 'Haircare', value: 41_300 },
  { name: 'Accessories', value: 26_800 },
]

const topProducts: TopProduct[] = [
  {
    id: 'p1',
    name: 'Clarify™ Air Purifier',
    imageUrl: 'https://picsum.photos/seed/clarify/160/160',
    sold: 92,
    revenue: 92 * 2799,
    profit: 92 * 820,
    category: 'Home',
  },
  {
    id: 'p2',
    name: 'Nusava™ B12 Complex',
    imageUrl: 'https://picsum.photos/seed/nusava/160/160',
    sold: 81,
    revenue: 81 * 1499,
    profit: 81 * 540,
    category: 'Supplements',
  },
  {
    id: 'p3',
    name: 'HydraGlow Serum 30ml',
    imageUrl: 'https://picsum.photos/seed/hydraglow/160/160',
    sold: 74,
    revenue: 74 * 999,
    profit: 74 * 360,
    category: 'Skincare',
  },
]

const recentSales: RecentSale[] = [
  {
    id: 'o1',
    orderName: 'Order #1042',
    customer: 'A. Santos',
    date: 'Feb 20, 2026',
    amount: 2799,
    method: 'gcash',
    status: 'paid',
  },
  {
    id: 'o2',
    orderName: 'Order #1041',
    customer: 'J. Reyes',
    date: 'Feb 20, 2026',
    amount: 1499,
    method: 'cash',
    status: 'paid',
  },
  {
    id: 'o3',
    orderName: 'Order #1040',
    customer: 'M. Dela Cruz',
    date: 'Feb 19, 2026',
    amount: 2997,
    method: 'card',
    status: 'pending',
  },
  {
    id: 'o4',
    orderName: 'Order #1039',
    customer: 'K. Lim',
    date: 'Feb 19, 2026',
    amount: 999,
    method: 'gcash',
    status: 'paid',
  },
  {
    id: 'o5',
    orderName: 'Order #1038',
    customer: 'P. Garcia',
    date: 'Feb 18, 2026',
    amount: 1499,
    method: 'cash',
    status: 'refunded',
  },
]

const expenseOverview = [
  { label: 'Ads', value: 18_500, cap: 30_000 },
  { label: 'Shipping', value: 9_600, cap: 15_000 },
  { label: 'Supplies', value: 6_250, cap: 10_000 },
  { label: 'Tools', value: 2_990, cap: 5_000 },
]

const statusBadge = (status: RecentSale['status']) => {
  if (status === 'paid') return <Badge className="bg-teal-600 text-white hover:bg-teal-600">Paid</Badge>
  if (status === 'pending') return <Badge variant="secondary">Pending</Badge>
  return <Badge variant="destructive">Refunded</Badge>
}

const methodIcon = (m: RecentSale['method']) => {
  if (m === 'cash') return <Receipt className="h-4 w-4 text-muted-foreground" />
  if (m === 'gcash') return <CreditCard className="h-4 w-4 text-muted-foreground" />
  return <CreditCard className="h-4 w-4 text-muted-foreground" />
}

export default function DashboardCMS() {
  const totalRevenueTop3 = topProducts.reduce((a, p) => a + p.revenue, 0)
  const totalProfitTop3 = topProducts.reduce((a, p) => a + p.profit, 0)
  const totalSoldTop3 = topProducts.reduce((a, p) => a + p.sold, 0)

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

            <div className="inline-flex items-center justify-start w-auto bg-amber-100 text-gray-600 text-xs italic rounded-xl px-2">
                <p className="text-lg">⚠️</p>
                <p className="-mb-1">Dashboard is currently under development. The data shown is sample (hardcoded) data for preview purposes only.</p>
            </div>
          </div>
        </div>

        <Separator className="mb-6 mt-2" />

        {/* Quick Modules */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-teal-100">
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Sales</p>
                <p className="text-xs text-muted-foreground">Orders & profit</p>
              </div>
              <Button asChild variant="ghost" className="h-9 px-3 hover:bg-teal-50">
                <Link href="/sales" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-teal-700" />
                  <span className="text-sm">Open</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-teal-100">
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Products</p>
                <p className="text-xs text-muted-foreground">Catalog & stock</p>
              </div>
              <Button asChild variant="ghost" className="h-9 px-3 hover:bg-teal-50">
                <Link href="/products" className="flex items-center gap-2">
                  <Box className="h-4 w-4 text-teal-700" />
                  <span className="text-sm">Open</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-teal-100">
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Customers</p>
                <p className="text-xs text-muted-foreground">People & notes</p>
              </div>
              <Button asChild variant="ghost" className="h-9 px-3 hover:bg-teal-50">
                <Link href="/customers" className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-teal-700" />
                  <span className="text-sm">Open</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-teal-100">
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Expenses</p>
                <p className="text-xs text-muted-foreground">Costs & budget</p>
              </div>
              <Button asChild variant="ghost" className="h-9 px-3 hover:bg-teal-50">
                <Link href="/expenses" className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-teal-700" />
                  <span className="text-sm">Open</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.title} className="border-teal-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {s.title}
                </CardTitle>
                <s.icon className="h-4 w-4 text-teal-700" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{s.value}</div>
                <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Charts */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-teal-100">
              <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base">Sales & Profit Trend</CardTitle>
                  <p className="text-xs text-muted-foreground">Last 7 days (hardcoded)</p>
                </div>
                <Badge variant="secondary" className="w-fit">
                  Weekly view
                </Badge>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => k(Number(v))} />
                    <ReTooltip
                      formatter={(value: any, name: any) => [
                        name === 'sales' ? peso(Number(value)) : peso(Number(value)),
                        name === 'sales' ? 'Sales' : 'Profit',
                      ]}
                      labelFormatter={(l) => `Day: ${l}`}
                    />
                    <Line type="monotone" dataKey="sales" strokeWidth={2} />
                    <Line type="monotone" dataKey="profit" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-teal-100">
              <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base">Sales by Category</CardTitle>
                  <p className="text-xs text-muted-foreground">Where revenue is coming from</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-teal-200">30 days</Badge>
                </div>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categorySalesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => k(Number(v))} />
                    <ReTooltip
                      formatter={(value: any) => [peso(Number(value)), 'Sales']}
                      labelFormatter={(l) => `Category: ${l}`}
                    />
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Top products */}
            <Card className="border-teal-100">
              <CardHeader className="space-y-1">
                <CardTitle className="text-base">Top 3 Performing Products</CardTitle>
                <p className="text-xs text-muted-foreground">
                  By units sold (hardcoded)
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-teal-100 bg-teal-50/40 p-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Units Sold</p>
                      <p className="text-lg font-semibold">{totalSoldTop3}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="text-lg font-semibold">{peso(totalRevenueTop3)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Profit</p>
                      <p className="text-lg font-semibold">{peso(totalProfitTop3)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {topProducts.map((p, idx) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg border">
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{p.name}</span>
                          <Badge variant="secondary" className="shrink-0">
                            #{idx + 1}
                          </Badge>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Box className="h-3.5 w-3.5" />
                            {p.category}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <ShoppingCart className="h-3.5 w-3.5" />
                            {p.sold} sold
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold">{peso(p.revenue)}</p>
                        <p className="text-xs text-muted-foreground">rev</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button asChild variant="outline" className="w-full border-teal-200 hover:bg-teal-50">
                  <Link href="/products">View all products</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Expense snapshot */}
            <Card className="border-teal-100">
              <CardHeader className="space-y-1">
                <CardTitle className="text-base">Expense Snapshot</CardTitle>
                <p className="text-xs text-muted-foreground">Monthly budget progress</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {expenseOverview.map((e) => {
                  const pct = Math.min(100, Math.round((e.value / e.cap) * 100))
                  return (
                    <div key={e.label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-teal-200">
                            {e.label}
                          </Badge>
                          <span className="text-muted-foreground">{pct}%</span>
                        </div>
                        <span className="font-medium">{peso(e.value)}</span>
                      </div>
                      <Progress value={pct} className="[&>div]:bg-teal-600" />
                      <p className="text-xs text-muted-foreground">
                        Cap: {peso(e.cap)}
                      </p>
                    </div>
                  )
                })}

                <Button asChild className="w-full bg-teal-600 text-white hover:bg-teal-700">
                  <Link href="/expenses">Manage expenses</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Sales Table */}
        <div className="mt-6">
          <Card className="border-teal-100">
            <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base">Recent Sales</CardTitle>
                <p className="text-xs text-muted-foreground">Quick glance at latest transactions</p>
              </div>

              <div className="flex items-center gap-2">
                <Button asChild variant="outline" className="border-teal-200 hover:bg-teal-50">
                  <Link href="/sales">View sales</Link>
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="w-full overflow-x-auto">
                <Table className="min-w-[820px] w-full table-auto">
                  <TableHeader>
                    <TableRow className="[&_th]:h-11 [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-muted-foreground">
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-center w-[1%] whitespace-nowrap">Method</TableHead>
                      <TableHead className="text-center w-[1%] whitespace-nowrap">Status</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {recentSales.map((o) => (
                      <TableRow
                        key={o.id}
                        className="cursor-pointer hover:bg-teal-50/40"
                        onClick={() => {
                          // hook this to your sales details modal later
                          // eslint-disable-next-line no-console
                          console.log('clicked', o)
                        }}
                      >
                        <TableCell className="font-medium">{o.orderName}</TableCell>
                        <TableCell>{o.customer}</TableCell>
                        <TableCell className="text-muted-foreground">{o.date}</TableCell>
                        <TableCell className="text-right font-semibold">{peso(o.amount)}</TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center gap-2">
                            {methodIcon(o.method)}
                            <span className="text-xs text-muted-foreground">{o.method}</span>
                          </span>
                        </TableCell>
                        <TableCell className="text-center">{statusBadge(o.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                Tip: on mobile, the table scrolls horizontally instead of squishing columns.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Small footer helpers */}
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <Card className="border-teal-100">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-xl bg-teal-50 p-2">
                <Box className="h-5 w-5 text-teal-700" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">Data Health</p>
                <p className="text-xs text-muted-foreground truncate">
                  Track missing profit values per order for accurate totals.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-teal-100">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-xl bg-teal-50 p-2">
                <BadgeDollarSign className="h-5 w-5 text-teal-700" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">Suggested Action</p>
                <p className="text-xs text-muted-foreground truncate">
                  Restock top sellers and review ad spend efficiency.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-teal-100">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-xl bg-teal-50 p-2">
                <CreditCard className="h-5 w-5 text-teal-700" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">Payments</p>
                <p className="text-xs text-muted-foreground truncate">
                  Watch pending payments to keep cashflow stable.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}