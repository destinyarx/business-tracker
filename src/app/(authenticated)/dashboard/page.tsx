"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  console.log(user)

  useEffect(() => {
    const fetchToken = async () => {
      const t = await getToken({ template: "supabase" });
      console.log(t)
      setToken(t);
    };
    fetchToken();
  }, [getToken]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="w-full max-w-full">
      {/* <h1>DASHBOARD</h1>
      <p><strong>User ID:</strong> {user.id}</p>
      <p><strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}</p>
      <p><strong>Name:</strong> {user.fullName}</p>

      <hr className="my-4" />

      <div className="mb-5"><strong>JWT Token:</strong></div> */}

      <div className="w-full max-w-full h-[95vh] bg-gray-50 p-4">
        <div className="grid grid-cols-6 grid-rows-5 gap-4 h-full border border-red p-4">
          {/* Header */}
          <div className="col-span-6 bg-white shadow-md flex items-center justify-center rounded-md">
            <span className="text-gray-700 font-semibold">1 - Header</span>
          </div>
  
          {/* Left Sidebar */}
          <div className="row-span-3 row-start-2 bg-white shadow-md flex items-center justify-center rounded-md">
            <div className="text-gray-700 font-semibold">2 - Sidebar Left</div>

            <div className="h-96 italic font-light">
              This is the sidebar left
            </div>
          </div>
  
          {/* Right Sidebar */}
          <div className="row-span-3 col-start-6 row-start-2 bg-white shadow-md flex items-center justify-center rounded-md">
            <span className="text-gray-700 font-semibold">3 - Sidebar Right</span>
          </div>
  
          {/* Main Content */}
          <div className="col-span-4 row-span-3 col-start-2 row-start-2 bg-white shadow-md flex items-center justify-center rounded-md">
            <span className="text-gray-700 font-semibold">4 - Main Content</span>
          </div>
  
          {/* Footer */}
          <div className="col-span-6 row-start-5 bg-white shadow-md flex items-center justify-center rounded-md">
            <span className="text-gray-700 font-semibold">5 - Footer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
