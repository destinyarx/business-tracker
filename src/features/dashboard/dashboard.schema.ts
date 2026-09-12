import { z } from 'zod'

const moneySchema = z.string().regex(/^-?\d+\.\d{2}$/)
const isoDateSchema = z.string().datetime({ offset: true })

const dashboardRangeSchema = z.enum([
  'this_month',
  'this_week',
  'last_week',
])

const dashboardCashflowBucketSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  start: isoDateSchema,
  end: isoDateSchema,
  salesAmount: moneySchema,
  expenseAmount: moneySchema,
  netAmount: moneySchema,
})

const dashboardExpenseCategorySchema = z.object({
  category: z.string().min(1),
  label: z.string().min(1),
  amount: moneySchema,
  percentage: z.number().min(0).max(100),
})

const dashboardAttentionSchema = z.object({
  kind: z.enum([
    'out_of_stock',
    'low_stock',
    'queued_orders',
    'lapsed_customer',
    'expense_anomaly',
  ]),
  severity: z.enum(['critical', 'warning', 'info', 'insight']),
  title: z.string().min(1),
  detail: z.string().min(1),
  targetModule: z.enum(['inventory', 'orders', 'customers', 'expenses']),
  entityId: z.number().int().positive().nullable(),
})

const dashboardTopProductSchema = z.object({
  rank: z.number().int().positive(),
  productId: z.number().int().positive().nullable(),
  title: z.string().min(1),
  revenueAmount: moneySchema,
  quantitySold: z.number().int().nonnegative(),
  percentageOfLeader: z.number().min(0).max(100),
})

const dashboardTopCustomerSchema = z.object({
  rank: z.number().int().positive(),
  customerId: z.number().int().positive().nullable(),
  name: z.string().min(1),
  completedOrderCount: z.number().int().nonnegative(),
  salesAmount: moneySchema,
  percentageOfSales: z.number().min(0).max(100),
})

export const dashboardOverviewSchema = z.object({
  asOf: isoDateSchema,
  range: z.object({
    key: dashboardRangeSchema,
    label: z.string().min(1),
    timeZone: z.literal('Asia/Manila'),
    start: isoDateSchema,
    end: isoDateSchema,
  }),
  basis: z.object({
    completedOrderCount: z.number().int().nonnegative(),
    expenseRecordCount: z.number().int().nonnegative(),
  }),
  metrics: z.object({
    salesAmount: moneySchema,
    expenseAmount: moneySchema,
    estimatedProfitAmount: moneySchema,
    inaccurateSaleCount: z.number().int().nonnegative(),
    completedOrderCount: z.number().int().nonnegative(),
    queuedOrderCount: z.number().int().nonnegative(),
    totalOrderCount: z.number().int().nonnegative(),
  }),
  cashflow: z.array(dashboardCashflowBucketSchema),
  expenseBreakdown: z.array(dashboardExpenseCategorySchema),
  attention: z.array(dashboardAttentionSchema).max(5),
  topProducts: z.array(dashboardTopProductSchema).max(5),
  topCustomers: z.array(dashboardTopCustomerSchema).max(5),
})

export const dashboardResponseSchema = z.object({
  data: dashboardOverviewSchema,
})
