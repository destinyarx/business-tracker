'use client'

import type { SVGProps } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bot,
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
  Package,
  Tags,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'

function SalesIcon(iconProps: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19V9" />
      <path d="M10 19V5" />
      <path d="M16 19v-7" />
      <path d="M22 19H2" />
    </svg>
  )
}

function OrdersIcon(iconProps: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3h12l2 4-2 14H6L4 7l2-4Z" />
      <path d="M4.5 7h15" />
      <path d="M9 11a3 3 0 0 0 6 0" />
    </svg>
  )
}

function CustomersIcon(iconProps: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="9" r="3" />
      <path d="M3 20c.4-4 2.4-6 6-6s5.6 2 6 6" />
      <circle cx="17" cy="8" r="2.5" />
      <path d="M15.5 14c3.2 0 5 1.8 5.5 5" />
    </svg>
  )
}

function InventoryIcon(iconProps: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8.5 12 4l9 4.5v7L12 20l-9-4.5v-7Z" />
      <path d="M3 8.5 12 13l9-4.5" />
      <path d="M12 13v7" />
    </svg>
  )
}

function ExpensesIcon(iconProps: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5c-.8-.7-1.8-1-3-1-1.7 0-3 .8-3 2s1.1 1.8 3 2 3 1 3 2.4-1.3 2.3-3 2.3c-1.3 0-2.5-.4-3.3-1.1" />
      <path d="M12 5.5v13" />
    </svg>
  )
}

const navigationGroups = [
  {
    label: 'Overview',
    items: [
      { title: 'Dashboard', url: '/dashboard', icon: ChartNoAxesCombined },
      { title: 'Sales', url: '/sales', icon: SalesIcon },
    ],
  },
  {
    label: 'Operations',
    items: [
      { title: 'Orders', url: '/orders', icon: OrdersIcon },
      { title: 'Customers', url: '/customers', icon: CustomersIcon },
      { title: 'Products', url: '/products', icon: Tags },
      { title: 'Inventory', url: '/inventory', icon: Package },
    ],
  },
  {
    label: 'Money',
    items: [
      { title: 'Expenses', url: '/expenses', icon: ExpensesIcon },
      { title: 'NegosyoAI', url: '/negosyo-ai', icon: Bot },
    ],
  },
] as const

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'
  const isActive = (url: string): boolean =>
    pathname === url || pathname.startsWith(`${url}/`)

  return (
    <Sidebar
      collapsible="icon"
      className="border-0 text-white [--sidebar:transparent] [--sidebar-accent:rgba(255,255,255,0.16)] [--sidebar-accent-foreground:#fff] [--sidebar-foreground:#fff]"
    >
      <div className="flex h-full flex-col bg-gradient-to-b from-[#00beaa] via-[#00a899] to-[#008e85]">
        <SidebarHeader className={cn('px-4 pb-4 pt-[18px]', isCollapsed && 'items-center px-0 pb-2 pt-4')}>
          <div className={cn('flex items-center gap-2.5', isCollapsed && 'flex-col gap-0')}>
            <div className={cn('grid size-8 shrink-0 place-items-center rounded-[10px] bg-white text-[15px] font-bold text-[#00706a] shadow-sm', isCollapsed && 'size-[38px] rounded-xl')}>
              N
            </div>
            {!isCollapsed && (
              <span className="truncate text-[15px] font-semibold tracking-[-0.01em]">
                NegosyoTracker
              </span>
            )}
            <SidebarTrigger
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className={cn(
                'ml-auto size-7 rounded-[9px] border border-white/30 bg-white/15 text-white hover:bg-white/25 hover:text-white [&>svg]:size-4',
                isCollapsed && 'ml-0 mt-2.5 h-[26px] w-[38px]',
              )}
            >
              {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </SidebarTrigger>
          </div>
          {isCollapsed && <span className="mt-3 h-px w-[26px] bg-white/30" />}
        </SidebarHeader>

        <SidebarContent className={cn('gap-3.5 px-3 pb-4 pt-1', isCollapsed && 'items-center gap-0 px-0 pt-0')}>
          {navigationGroups.map((group) => (
            <SidebarGroup key={group.label} className={cn('p-0', isCollapsed && 'items-center')}>
              <SidebarGroupLabel className="h-auto px-2 pb-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-white/75 group-data-[collapsible=icon]:mt-0! group-data-[collapsible=icon]:hidden!">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className={cn('gap-0.5', isCollapsed && 'items-center')}>
                  {group.items.map((navItem) => {
                    const active = isActive(navItem.url)

                    return (
                      <SidebarMenuItem key={navItem.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={navItem.title}
                          className={cn(
                            'h-[42px] gap-[11px] rounded-[11px] px-2.5 text-[#eafbf8] hover:bg-white/15 hover:text-white data-[active=true]:bg-white/20 data-[active=true]:font-semibold data-[active=true]:text-white data-[active=true]:shadow-[inset_2.5px_0_0_#fff] [&>svg]:size-[25px]!',
                            'group-data-[collapsible=icon]:h-12! group-data-[collapsible=icon]:w-[50px]! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-[13px] group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:data-[active=true]:bg-white/25 group-data-[collapsible=icon]:data-[active=true]:shadow-none',
                          )}
                        >
                          <Link href={navItem.url}>
                            <navItem.icon className="shrink-0" strokeWidth={1.8} />
                            {!isCollapsed && <span className="text-[14.5px] font-medium">{navItem.title}</span>}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </div>
    </Sidebar>
  )
}
