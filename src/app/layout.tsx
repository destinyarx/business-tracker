import { Roboto } from "next/font/google"
import './globals.css';
import type { ReactNode } from 'react';
import ClientToastProvider  from './ClientToastProvider';
import { Providers } from './providers'

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
          <ClientToastProvider/>
        </Providers>
      </body>
    </html>
  );
}
