import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button"


import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
  SignUpButton
} from '@clerk/nextjs'

export default function Home() {
  return (
    <div className="w-full max-w-full min-h-screen bg-gradient-to-br from-teal-100 via-teal-50 to-teal-200 px-10 pt-3 pb-5">
      {/* Navbar on top */}
      <div className="flex flex-row justify-between items-center">
        <div className="bg-zinc-50 border-1 border-teal-600 rounded-lg py-1">
          <Image
            src="/logo-with-title.png"
            alt="logo"
            width={200}
            height={200}
          />
        </div>

        <div className="flex flex-row gap-8 text-gray-500 text-[1rem] font-semibold">
          <div className="hover:text-gray-800">Features</div>
          <div className="hover:text-gray-800">Services</div>
          <div className=" hover:text-gray-800">Pricing</div>
          <div className="hover:text-gray-800">FAQ</div>
        </div>

        <div className="flex flex-row gap-2 -mt-3">
          <ClerkProvider>
            <SignedOut>
              <Link href="/login">
                <Button variant="outline" size="sm" className="rounded-lg font-medium bg-teal-400 text-white hover:bg-teal-200">
                  Login
                </Button>
              </Link>

              <Link href="/register">
                <Button variant="outline" size="sm" className="font-medium text-white bg-sky-500 hover:bg-sky-200">
                  Register
                </Button>
              </Link>
            </SignedOut>

            <SignedIn>
              <UserButton/>
            </SignedIn>
          </ClerkProvider>
        </div>
      </div>

      <div className="flex flex-row justify-between items-center h-[75vh] px-15 py-10">
        <div className="flex flex-col">
          <div className="text-6xl text-gray-800 font-semibold justify-center">
            Your All-in-One <br/>
            Business Companion
          </div>

          <div className="text-[1.1rem] font-light text-gray-400 italic leading-tight mt-5">
            Easily track your customers, sales, inventory, and expenses <br/>
            with <strong>NegosyoTracker</strong> built for small business success.
          </div>

          <div className="flex flex-row gap-2 mt-7">
            <Button variant="outline" size="lg" className="rounded-full font-medium text-md bg-gradient-to-br from-teal-400 via-teal-300 to-teal-500 text-white hover:opacity-40">
              Get Started
            </Button>

            <Button variant="outline" size="lg" className="rounded-full font-medium text-white text-md bg-slate-500 hover:opacity-40">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      
      <section className="bg-gray-50 py-16 border rounded-xl mb-5">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-gray-600">Core Features</h2>
          <p className="text-gray-400 text-sm italic mb-8">
            Everything you need to manage your business efficiently in one place.
          </p>

          <div className="flex flex-col md:flex-row gap-8 justify-center">
            <div className="flex-1 bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border-t-4 border-teal-500">
              <div className="flex flex-row items-center justify-center gap-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 mb-4 text-teal-600">
                  📈
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Sales Tracking</h3>
              </div>
              <p className="text-gray-600">
                Monitor your sales growth and revenue with real-time analytics.
              </p>
            </div>

            <div className="flex-1 bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border-t-4 border-teal-500">
              <div className="flex flex-row items-center justify-center gap-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 mb-4 text-teal-600">
                  👥
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Customer Management</h3>
              </div>
              <p className="text-gray-600">
                Keep track of your clients, contacts, and interactions in one place.
              </p>
            </div>

            <div className="flex-1 bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border-t-4 border-teal-500">
              <div className="flex flex-row items-center justify-center gap-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 mb-4 text-teal-600">
                  📦
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Inventory & Expenses</h3>
              </div>
              <p className="text-gray-600">
                Manage your inventory and expenses seamlessly for better business decisions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
