'use client'

import { UserButton, useUser } from '@clerk/nextjs'
import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/molecules/ThemeToggle'
import { SidebarTrigger } from '@/components/ui/sidebar'

const routeCopy: Record<string, { title: string; description: string }> = {
  dashboard: {
    title: 'Dashboard',
    description:
      'One screen for the whole shop — money in, money out, and what needs doing.',
  },
  sales: { title: 'Sales', description: 'Track revenue and understand what is selling.' },
  orders: { title: 'Orders', description: 'Manage every order from pending to completed.' },
  customers: { title: 'Customers', description: 'Manage relationships and keep customer details close.' },
  products: { title: 'Products', description: 'Manage your catalog, pricing and stock.' },
  inventory: { title: 'Inventory', description: 'See stock levels and inventory movement.' },
  expenses: { title: 'Expenses', description: 'Record business costs and monitor spending.' },
  'negosyo-ai': { title: 'NegosyoAI', description: 'Ask questions about your business data.' },
}

export function AppHeader() {
  const pathname = usePathname()
  const { user } = useUser()
  const routeKey = pathname.split('/').filter(Boolean)[0] ?? 'dashboard'
  const copy = routeCopy[routeKey] ?? routeCopy.dashboard
  const displayName = user?.fullName ?? user?.firstName ?? 'Business owner'

  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center gap-3 border-b border-[#e3e9e8] bg-white/94 px-4 py-2.5 backdrop-blur-md dark:border-[#243936] dark:bg-[#0b1615]/90 md:px-6">
      <SidebarTrigger className="size-9 rounded-[10px] border border-[#dce3e2] md:hidden">
        <Menu className="size-4" />
      </SidebarTrigger>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[19px] font-semibold leading-tight tracking-[-0.025em] text-[#16292b] dark:text-[#eaf3f1]">{copy.title}</h1>
        <p className="mt-0.5 hidden truncate text-[12.5px] text-[#5f7273] dark:text-[#9fb3b0] sm:block">{copy.description}</p>
      </div>
      <ThemeToggle className="size-[38px] rounded-full border-[#e3e9e8] dark:border-[#12cdbe]/40 dark:bg-[#16292b]" />
      <div className="flex items-center gap-2.5 rounded-full border border-[#e3e9e8] bg-white py-1 pl-1 pr-3 dark:border-[#243936] dark:bg-[#12201f]">
        <UserButton />
        <div className="hidden leading-tight sm:block">
          <span className="block max-w-36 truncate text-[12.5px] font-semibold text-[#16292b] dark:text-[#eaf3f1]">{displayName}</span>
          <span className="block text-[10.5px] text-[#93a5a5]">Business owner</span>
        </div>
      </div>
    </header>
  )
}
