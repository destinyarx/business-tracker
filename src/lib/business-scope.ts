'use client'

import { useAuth } from '@clerk/nextjs'

// Business data is cached per active Clerk user. Including userId in every
// business query key means a different account never reads the previous
// account's rows from memory (SEC-002). Server auth stays the primary control;
// this only prevents browser-side disclosure.
export function useBusinessScope() {
  const { isLoaded, isSignedIn, userId } = useAuth()
  return {
    ready: isLoaded && isSignedIn && !!userId,
    userId: userId ?? null,
  }
}

export const businessKeys = {
  dashboardRoot: (userId: string | null) => ['dashboard', userId] as const,
  dashboard: (userId: string | null, range: string) =>
    ['dashboard', userId, { range }] as const,
  customers: (userId: string | null) => ['customers', userId] as const,
  products: (userId: string | null) => ['products', userId] as const,
  expenses: (userId: string | null, ...parts: unknown[]) =>
    ['expenses', userId, ...parts] as const,
  orders: (userId: string | null, params: unknown) =>
    ['orders', userId, params] as const,
  sales: (
    userId: string | null,
    range: string,
    state: string,
    sort: string,
  ) => ['sales', userId, { range, state, sort }] as const,
  sale: (userId: string | null, saleId: number) =>
    ['sales', userId, 'detail', saleId] as const,
}
