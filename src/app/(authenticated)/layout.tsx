import { cookies } from 'next/headers'
import type { Metadata } from 'next'
import type { CSSProperties, ReactNode } from 'react'
import { ClerkLoaded, ClerkLoading } from '@clerk/nextjs'
import { AppHeader } from '@/components/organisms/AppHeader'
import { AppSidebar } from '@/components/organisms/AppSidebar'
import { CacheScopeGuard } from '@/components/organisms/CacheScopeGuard'
import { ThemeSync } from '@/components/molecules/ThemeSync'
import Loading from '@/components/organisms/Loading'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export const metadata: Metadata = {
  title: 'NegosyoTracker',
  description: 'Manage your business from one workspace.',
}

export default async function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false'
  const sidebarStyle = {
    '--sidebar-width': '15.5rem',
    '--sidebar-width-icon': '4.75rem',
  } as CSSProperties

  return (
    <>
      <CacheScopeGuard />
      <ThemeSync />
      <ClerkLoading>
        <Loading />
      </ClerkLoading>
      <ClerkLoaded>
        <SidebarProvider defaultOpen={defaultOpen} style={sidebarStyle}>
          <AppSidebar />
          <SidebarInset className="min-w-0 bg-[#f2f5f4] dark:bg-[#0b1615]">
            <AppHeader />
            <div className="flex-1 p-4 md:px-6 md:pb-16 md:pt-6">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </ClerkLoaded>
    </>
  )
}
