'use client'

import { CalendarDays } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { DashboardRange } from '../dashboard.types'

const dashboardRanges: { value: DashboardRange; label: string }[] = [
  { value: 'this_month', label: 'This month' },
  { value: 'this_week', label: 'This week' },
  { value: 'last_week', label: 'Last week' },
]

type DashboardPeriodSelectProps = {
  value: DashboardRange
  onChange: (range: DashboardRange) => void
  disabled?: boolean
}

const isDashboardRange = (range: string): range is DashboardRange =>
  dashboardRanges.some((dashboardRange) => dashboardRange.value === range)

export function DashboardPeriodSelect({
  value,
  onChange,
  disabled = false,
}: DashboardPeriodSelectProps) {
  const changeRange = (range: string): void => {
    if (isDashboardRange(range)) onChange(range)
  }

  return (
    <Select value={value} onValueChange={changeRange} disabled={disabled}>
      <SelectTrigger
        aria-label="Dashboard reporting period"
        className="h-[34px] w-[148px] rounded-full border-[#dce3e2] bg-white px-3 text-xs font-semibold text-[#0c4b47] shadow-none hover:border-[#00beaa] focus-visible:border-[#00beaa] focus-visible:ring-[#12cdbe]/20 dark:border-[#2b4340] dark:bg-[#12201f] dark:text-[#b7e7df]"
      >
        <CalendarDays className="size-[15px] text-[#0c4b47] dark:text-[#7fe0da]" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="rounded-xl border-[#dce3e2] dark:border-[#2b4340] dark:bg-[#12201f]">
        {dashboardRanges.map((range) => (
          <SelectItem key={range.value} value={range.value} className="rounded-lg text-xs">
            {range.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
