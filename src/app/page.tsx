import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button'
import FeatureCard from '@/components/FeatureCard'


import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
  SignUpButton
} from '@clerk/nextjs'

export default function Home() {
  const features = [
    {
      title: "Sales & Revenue Tracking",
      description:
        "Monitor your sales performance and revenue growth with comprehensive real-time analytics. Track sales on a daily, weekly, and monthly basis, identify emerging trends, and obtain the insights necessary to make informed, strategic business decisions.",
      icon: "📈",
    },
    {
      title: "Customer Management",
      description:
        "Centralize all customer information in one secure platform. Access contact details, purchase history, and interaction records to strengthen relationships, deliver tailored service, and consistently enhance customer satisfaction.",
      icon: "👥",
    },
    {
      title: "Inventory Management",
      description:
        "Optimize inventory management with a comprehensive overview of product availability. Monitor inventory movement, prevent shortages or overstock, and support uninterrupted, profitable business operations.",
      icon: "📦",
    },
    {
      title: "Expense Tracking & Reporting",
      description:
        "Accurately record and categorize expenses with ease. Generate detailed reports to analyze cash flow, identify spending patterns, and support informed financial decisions for sustained business stability.",
      icon: "💰",
    },
    {
      title: "NegosyoAI Insights",
      description:
        "Harness the capabilities of NegosyoAI to analyze your business data. Access actionable insights, identify key trends, forecast performance, and make data-driven decisions that drive growth and operational efficiency.",
      icon: "🤖",
    },
    {
      title: "Scheduler & Automated Receipts",
      description:
        "Coordinate tasks, set reminders, and streamline operations with an integrated scheduling solution. Automatically generate receipts or PDF reports and deliver them to customers via email, enhancing efficiency and projecting a professional business image.",
      icon: "📅",
    },
  ];

  return (
    <div className="w-full max-w-full min-h-screen bg-gradient-to-br from-teal-100 via-teal-50 to-teal-200 px-10 pt-3 pb-5">
      <div className="flex flex-row justify-between items-center">
        <div className="bg-zinc-50 border-1 border-teal-600 rounded-lg py-1">
          <Link href="/">
            <Image
              src="/logo-with-title.png"
              alt="logo"
              width={200}
              height={200}
            />
          </Link>
        </div>

        <div className="flex flex-row gap-8 text-gray-500 text-[1rem] font-semibold">
          <div className="hover:text-gray-800">Features</div>
          <div className="hover:text-gray-800">Services</div>
          <div className=" hover:text-gray-800">Pricing</div>
          <div className=" hover:text-gray-800">About</div>
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
        <div className="max-w-6xl mx-auto px-6 text-center mb-7">
          <h2 className="text-4xl font-semibold text-teal-600 -mt-10">Core Features</h2>
          <p className="text-gray-400 text-[1rem] font-light italic">
            Everything you need to manage your business efficiently in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mx-15">
          {features.map((item, index) => (
            <FeatureCard 
              title={item.title} 
              icon={item.icon} 
              description={item.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
