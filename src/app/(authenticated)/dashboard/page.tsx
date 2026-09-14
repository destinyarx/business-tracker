'use client'

import { useState } from 'react'
import { DashboardErrorState } from '@/features/dashboard/components/DashboardErrorState'
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton'
import { DashboardView } from '@/features/dashboard/components/DashboardView'
import { useDashboardQuery } from '@/features/dashboard/hooks/useDashboardQuery'
import type { DashboardRange } from '@/features/dashboard/dashboard.types'

export default function DashboardPage() {
  const [selectedRange, setSelectedRange] = useState<DashboardRange>('this_month')
  const { dashboardQuery } = useDashboardQuery(selectedRange)

  if (dashboardQuery.isPending && !dashboardQuery.data) {
    return <DashboardSkeleton />
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return (
      <DashboardErrorState
        message={dashboardQuery.error?.message}
        onRetry={() => dashboardQuery.refetch()}
      />
    )
  }

  return (
    <DashboardView
      overview={dashboardQuery.data}
      selectedRange={selectedRange}
      onRangeChange={setSelectedRange}
      isRefreshing={dashboardQuery.isFetching}
    />
  )
}
