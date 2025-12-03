import { Roboto } from 'next/font/google'
import './globals.css';
import type { ReactNode } from 'react';
import { Providers } from './providers'
import { Toaster } from '@/components/ui/sonner'

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"], 
  variable: "--font-roboto",
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={roboto.variable}>
      <body  className="font-sans">
        <Providers>
          {children}
          <Toaster 
            position="top-right"
            richColors
            closeButton
          />
        </Providers>
      </body>
    </html>
  );
}
