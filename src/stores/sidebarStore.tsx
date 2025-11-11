import { create } from 'zustand';

interface SidebarBadges {
  customers: number;
  pendingOrders: number;
}

interface Sidebar {
  currentNav: string,
  isCollapsed: boolean;
  badge: SidebarBadges;
  setCurrentNav: (title: string) => void;
  toggleCollapse: (collapsed: boolean) => void;
}

export const useSidebarStore = create<Sidebar>((set) => ({
  currentNav: 'Dashboard',
  isCollapsed: false,
  badge: {
    customers: 0,
    pendingOrders: 0,
  },
  setCurrentNav: (title: string) => set({ currentNav: title}),
  toggleCollapse: (collapsed: boolean) => set({ isCollapsed: collapsed }),
}));
