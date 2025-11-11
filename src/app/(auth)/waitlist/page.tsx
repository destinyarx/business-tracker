import Image from "next/image";

import {
  ClerkProvider,
  Waitlist
} from '@clerk/nextjs'

export default function Home() {
  return (
    <div className="w-full max-w-full min-h-screen bg-gradient-to-br from-teal-100 via-teal-50 to-teal-200">
      <ClerkProvider>
        <div className="flex justify-center items-center h-screen">
            <Waitlist/>
        </div>
      </ClerkProvider>
    </div>
  );
}
