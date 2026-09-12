'use client'

import { useApi } from '@/hooks/useApi'
import { ensureFeatureError } from '@/lib/feature-error'
import { createDashboardApi } from './dashboard.api'
import { dashboardResponseSchema } from './dashboard.schema'
import type { DashboardOverview, DashboardRange } from './dashboard.types'

export function useDashboardService() {
  const api = useApi()
  const dashboardApi = createDashboardApi(api)

  return {
    async getOverview(range: DashboardRange): Promise<DashboardOverview> {
      try {
        const response = await dashboardApi.getOverview(range)
        return dashboardResponseSchema.parse(response).data
      } catch (error) {
        throw ensureFeatureError(
          'dashboard',
          error instanceof Error ? error : null,
        )
      }
    },
  }
}
