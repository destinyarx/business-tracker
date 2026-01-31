import React from 'react';
import Image from 'next/image'
import Link from 'next/link'

export default function DeveloperSection() {
  return (
    <section className="w-full max-w-full py-5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-12">

        <div className="flex-1 flex justify-center lg:justify-start">
            <Image
                src="/developer.png"
                alt="NegosyoTracker illustration"
                width={300}
                height={300}
                className="w-full max-w-md rounded-xl shadow-lg"
            />
        </div>

        <div className="flex-1">
          <h2 className="text-4xl font-bold text-teal-600 mb-4">About the Developer</h2>
          <p className="text-gray-700 mb-4 leading-relaxed indent-5">
            Hi! I’m
            <Link href="https://www.linkedin.com/in/iamgiljeremy/">
                <span className="font-semibold text-slate-800">&nbsp;Gil Jeremy Ditablan</span>,&nbsp;
            </Link>
            a full-stack developer who loves building web applications and continually improving my craft. I’m dedicated to creating helpful, user-friendly solutions that make a difference for businesses and communities.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed indent-5">
            I developed <span className="font-semibold text-teal-600">NegosyoTracker</span> to help entrepreneurs, small business owners, and local businesses efficiently manage their daily operations through a cloud-based platform.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed indent-5">
            My goal is to create secure, reliable, and intuitive web apps that allow business owners to focus on growth while leveraging modern technology.
          </p>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Built With:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Frontend: <span className="font-semibold">Next.js / Tailwind CSS / Shadcn / Tanstack / Zustand</span></li>
              <li>Backend: <span className="font-semibold">Nest.js / Supabase (PostgreSQL) / Drizzle ORM</span></li>
              <li>Authentication: <span className="font-semibold">Clerk OAuth / JWT</span></li>
              <li>Deployment: 
                <span className="font-semibold text-[0.83rem]">
                  Vercel (Frontend) / Render (Backend) / AWS EC2 
                  <span className="text-[0.7rem]"> (previously used)</span>
                </span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
