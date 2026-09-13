import { ClerkProvider } from '@clerk/nextjs'
import { shadcn } from '@clerk/ui/themes'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: 'NegosyoTracker | Business management for growing shops',
  description:
    'Track customers, orders, products, inventory, sales and expenses from one business workspace.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans" suppressHydrationWarning>
        <ClerkProvider appearance={{ theme: shadcn }}>
          <Providers>
            {children}
            <Toaster
              position="top-right"
              visibleToasts={4}
              gap={10}
              offset={24}
              mobileOffset={16}
            />
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  )
}
