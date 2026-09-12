'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useDashboardService } from '@/features/dashboard/dashboard.service'
import type { DashboardRange } from '@/features/dashboard/dashboard.types'
import { businessKeys, useBusinessScope } from '@/lib/business-scope'

export function useDashboardQuery(range: DashboardRange) {
  const dashboardService = useDashboardService()
  const { ready, userId } = useBusinessScope()

  const dashboardQuery = useQuery({
    queryKey: businessKeys.dashboard(userId, range),
    queryFn: () => dashboardService.getOverview(range),
    enabled: ready,
    placeholderData: keepPreviousData,
  })

  return { dashboardQuery }
}
