"use client"

import { useRef, RefObject } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button'
import FeatureCard from '@/components/molecules/FeatureCard'
import Pricing from '@/components/organisms/Pricing'

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
  SignUpButton
} from '@clerk/nextjs'

export default function Home() {
  const featureRef = useRef(null)
  const pricingRef = useRef(null)

  const scrollToSection = <T extends HTMLElement>(elementRef: RefObject<T>) => {
    elementRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
    <div className="w-screen max-w-screen min-h-screen bg-gradient-to-br from-teal-100 via-teal-50 to-teal-200 pt-3 pb-5">
      <div className="flex flex-row justify-between items-center px-15">
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
          <div onClick={() => scrollToSection(featureRef)} className="hover:text-gray-800">
            Features
          </div>

          <div onClick={() => scrollToSection(pricingRef)} className=" hover:text-gray-800">
            Pricing
          </div>

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
                <Button variant="outline" size="sm" className="font-medium text-white bg-amber-500 hover:bg-amber-200">
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

      <hr className="w-full h-[1.3px] bg-gray-300 border-0 rounded-full mt-2 mx-5" />

      <div className="flex flex-row justify-between items-center h-[90vh] px-15 py-10">
        <div className="flex flex-col">
          <div className="text-6xl text-gray-800 font-semibold justify-center">
            Your All-in-One <br/>
            Business Companion
          </div>

          <div className="text-[1.1rem] font-light text-gray-400 italic leading-tight mt-3  ">
            Easily track your customers, sales, inventory, and expenses <br/>
            with <strong>NegosyoTracker</strong> built for small business success.
          </div>

          <div className="flex flex-row gap-2 mt-10">
            <Link href="/register">
              <Button variant="outline" size="lg" className="rounded-full font-medium text-md bg-gradient-to-br from-teal-400 via-teal-300 to-teal-500 text-white hover:opacity-40">
              Get Started
              </Button>
            </Link>

            <Button variant="outline" size="lg" className="rounded-full font-medium text-white text-md bg-slate-500 hover:opacity-40">
              Learn More
            </Button>
          </div>
        </div>

        <div className="ml-10">
            <Image
              src="/landing.jpg"
              alt="logo"
              width={600}
              height={300}
              className="rounded-[2vw]"
            />
        </div>
      </div>

      
      <section 
        ref={featureRef} 
        className="bg-gray-50 py-16 border rounded-xl mb-5 mx-16"
      >
        <div className="max-w-6xl mx-auto px-6 text-center mb-7">
          <h2 className="text-4xl font-semibold text-teal-600 -mt-10">Core Features</h2>
          <p className="text-gray-400 text-[1rem] font-light italic">
            Everything you need to manage your business efficiently in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mx-10">
          {features.map((item, index) => (
            <FeatureCard 
              key={index}
              title={item.title} 
              icon={item.icon} 
              description={item.description}
            />
          ))}
        </div>
      </section>

      <section 
        ref={pricingRef} 
        className="bg-gray-100 py-16 border rounded-xl mb-5 mx-16"
      >
        <Pricing />
      </section>
    </div>
  );
}
