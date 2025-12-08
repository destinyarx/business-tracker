import { create } from 'zustand';

interface Sidebar {
  isCollapsed: boolean
  pendingOrders: number
  setPendingOrders: () => void
  toggleCollapse: (collapsed: boolean) => void
}

export const useSidebarStore = create<Sidebar>((set) => ({
  isCollapsed: false,
  pendingOrders: 0,
  isCollapse: false,
  setPendingOrders: () => {
    const orders = 0
    set({ pendingOrders: orders })
  },
  toggleCollapse: (collapsed: boolean) => set({ isCollapsed: collapsed }),
}));
