'use client'

import { useEffect } from 'react'
import { Calendar, Home, Inbox, CircleUserRound, CircleDollarSign, SquareChartGantt, ShoppingBasket, BadgeDollarSign, Wrench, Settings } from "lucide-react"
import { useSidebar, SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useSidebarStore } from "@/stores/sidebarStore"

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
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Sales", url: "/sales", icon: BadgeDollarSign },
  { title: "Products", url: "/products", icon: ShoppingBasket },
  { title: "Services", url: "/products", icon: Wrench },
  { title: "Inventory", url: "/inventory", icon: SquareChartGantt },
  { title: "Expenses", url: "/expenses", icon: CircleDollarSign },
  { title: "Schedule", url: "/schedules", icon: Calendar },
  { title: "Customers", url: "/customers", icon: CircleUserRound },
  { title: "Settings", url: "/settings", icon: Settings },
  // { title: "Customer Service", url: "#", icon: Settings },
]

export function AppSidebar() {
  const { open, setOpen } = useSidebar()
  const { isCollapsed, toggleCollapse } = useSidebarStore()

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
                    <a href={item.url} className={cn('flex gap-3 items-center text-white overflow-visible mb-2', item.title === 'Dashboard' && 'border border-zinc-50 bg-zinc-50 font-semibold text-teal-800')}>
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