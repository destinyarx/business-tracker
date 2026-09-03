import type { LucideIcon } from 'lucide-react'

export interface LandingModule {
  title: string
  description: string
  detail: string
  icon: LucideIcon
  tileClassName: string
  iconClassName: string
}

export interface LandingStep {
  number: string
  title: string
  description: string
}
