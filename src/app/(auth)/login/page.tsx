import Image from 'next/image';
import Link from 'next/link'

import {
  ClerkProvider,
  SignIn,
} from '@clerk/nextjs'

export default function Home() {
  return (
    <div className="w-full max-w-full min-h-screen bg-gradient-to-br from-teal-100 via-teal-50 to-teal-200">
      <ClerkProvider>
        <div className="flex flex-row justify-between items-center px-10 pt-3">
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

          {/* <div className="flex flex-row gap-8 text-gray-500 text-[1rem] font-semibold">
            <div className="hover:text-gray-800">Features</div>
            <div className="hover:text-gray-800">Services</div>
            <div className=" hover:text-gray-800">Pricing</div>
            <div className=" hover:text-gray-800">About</div>
            <div className="hover:text-gray-800">FAQ</div>
          </div> */}
        </div>

        <div className="flex flex-col justify-center items-center h-[85vh]">
            <SignIn routing="hash"/>
        </div>
      </ClerkProvider>
    </div>
  );
}
