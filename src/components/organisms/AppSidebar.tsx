'use client'

import { useEffect } from 'react'
import { CalendarDays, ChartNoAxesCombined, Receipt, CircleUserRound, SquareChartGantt, ShoppingBasket, BadgeDollarSign, Wrench, Settings, Bot } from "lucide-react"
import { useSidebar, SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useSidebarStore } from "@/stores/sidebarStore"
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  { title: "Dashboard", url: "/dashboard", icon: ChartNoAxesCombined },
  { title: "Products", url: "/products", icon: ShoppingBasket },
  { title: "Orders", url: "/orders", icon: BadgeDollarSign },
  { title: "Sales", url: "/sales", icon: BadgeDollarSign },
  { title: "Services", url: "/services", icon: Wrench },
  { title: "Inventory", url: "/inventory", icon: SquareChartGantt },
  { title: "Expenses", url: "/expenses", icon: Receipt },
  { title: "Schedule", url: "/schedules", icon: CalendarDays },
  { title: "Customers", url: "/customers", icon: CircleUserRound },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "NegosyoAI", url: "/negosyo-ai", icon: Bot },
]

export function AppSidebar() {
  const pathName = usePathname()
  const { open, setOpen } = useSidebar()
  const { isCollapsed, toggleCollapse } = useSidebarStore()

  const isActive = (url: string): boolean => {
    const regex = new RegExp(`^${url}(/|\\?|$)`);
    return regex.test(pathName);
  }

  useEffect(() => {
    toggleCollapse(!open); 
  }, [open, toggleCollapse]);

  return (
    <Sidebar 
      collapsible="icon"
      className="left-0 top-16 h-[calc(100vh-4rem)] border-r border-gray-200 z-40 w-auto min-w-max"
    >
      <SidebarContent className="bg-teal-600">
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              <div className="flex justify-end text-white mb-3">
                <SidebarTrigger/>
              </div>

              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className={cn('flex gap-3 items-center text-white overflow-visible mb-2', isActive(item.url) && 'border border-zinc-50 bg-zinc-50 font-semibold text-teal-800')}>
                      <item.icon className="!w-7 !h-7" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}