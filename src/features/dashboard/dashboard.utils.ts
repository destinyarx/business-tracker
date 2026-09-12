import type {
  DashboardAttentionKind,
  DashboardTargetModule,
} from './dashboard.types'

const dashboardCurrencyFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
})

const dashboardCompactCurrencyFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const attentionColors: Record<DashboardAttentionKind, string> = {
  out_of_stock: '#b01c1c',
  low_stock: '#ffb018',
  queued_orders: '#1d4ed8',
  lapsed_customer: '#5b34c7',
  expense_anomaly: '#8a6100',
}

const dashboardRoutes: Record<DashboardTargetModule, string> = {
  inventory: '/inventory',
  orders: '/orders',
  customers: '/customers',
  expenses: '/expenses',
}

export const formatDashboardCurrency = (amount: string | number): string =>
  dashboardCurrencyFormatter.format(Number(amount) || 0)

export const formatDashboardCompactCurrency = (
  amount: string | number,
): string => dashboardCompactCurrencyFormatter.format(Number(amount) || 0)

export const formatSignedDashboardCurrency = (amount: string | number): string => {
  const numericAmount = Number(amount) || 0
  const sign = numericAmount >= 0 ? '+' : '−'
  return `${sign}${formatDashboardCurrency(Math.abs(numericAmount))}`
}

export const getDashboardInitials = (name: string): string => {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((namePart) => namePart.charAt(0).toUpperCase())
    .join('')

  return initials || 'GC'
}

export const getAttentionColor = (kind: DashboardAttentionKind): string =>
  attentionColors[kind]

export const getDashboardRoute = (module: DashboardTargetModule): string =>
  dashboardRoutes[module]
