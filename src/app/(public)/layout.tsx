import type { ReactNode } from 'react';
import Image from 'next/image'
import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
        <html lang="en">
        <body>
            <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50 h-16 flex items-center px-4">
                <SignedOut>
                <div className="flex justify-between w-full">
                    <div className="text-2xl font-semibold">Business Tracker</div>
                    <div className="flex items-center gap-2">
                    <SignInButton />
                    <SignUpButton>
                        <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                        Sign Up
                        </button>
                    </SignUpButton>
                    </div>
                </div>
                </SignedOut>

                <SignedIn>
                <div className="flex justify-between w-full">
                    <div className="bg-zinc-100 border-1 border-cyan-400 rounded-lg py-1">
                        <Image
                            src="/logo-with-title.png"
                            alt="logo"
                            width={200}
                            height={200}
                        />
                    </div>

                    <UserButton />
                </div>
                </SignedIn>
            </header>

            <div className="flex flex-row w-screen pt-14">
              <div className="w-full bg-gray-50 min-h-[calc(100vh-3rem)] p-4 border-3 border-red">
                {children}
              </div>
            </div>

        </body>
        </html>
    </ClerkProvider>
  );
}