import React from 'react';
import Image from 'next/image'

export default function About() {
  return (
    <section className="w-full max-w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col-reverse lg:flex-row items-center gap-12">
        
        <div className="flex-1">
          <h2 className="text-4xl font-bold text-teal-600 mb-6">What is NegosyoTracker</h2>
          <p className="text-gray-500 mb-4 leading-relaxed indent-5">
            NegosyoTracker is an all-in-one, <span className="font-semibold text-slate-800">cloud-based business management platform</span> designed to help entrepreneurs, small business owners, and local businesses efficiently track their daily operations.
          </p>
          <p className="text-gray-500 mb-4 leading-relaxed indent-5">
            It provides a secure, centralized space where business owners can manage their primary business needs —from sales monitoring to customer and order management— in a single web app.
          </p>
          <p className="text-gray-500 leading-relaxed indent-5">
            Our mission is to make business operations simpler and more accessible, so owners can focus on growth and decision-making, while keeping their business data <span className="font-semibold text-slate-800">safe and accessible anytime, anywhere</span>.
          </p>
        </div>

        <Image
            src="/illustration.png"
            alt="NegosyoTracker illustration"
            width={200}
            height={180}
            className="w-full max-w-md rounded-xl shadow-lg"
        />
      </div>
    </section>
  );
}
