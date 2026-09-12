import type { AxiosInstance } from 'axios'
import type { DashboardRange } from './dashboard.types'

export function createDashboardApi(api: AxiosInstance) {
  return {
    async getOverview(range: DashboardRange): Promise<object> {
      const response = await api.get<object>('/dashboard', {
        params: new URLSearchParams({ range }),
      })

      return response.data
    },
  }
}
