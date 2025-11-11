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
      <h1>DASHBOARD</h1>
      <p><strong>User ID:</strong> {user.id}</p>
      <p><strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}</p>
      <p><strong>Name:</strong> {user.fullName}</p>

      <hr className="my-4" />

      <p><strong>JWT Token:</strong></p>

      {/* <div className="max-w-full bg-gray-100 p-2 rounded">
        {token ? token : "Fetching token..."}
      </div> */}
    </div>
  );
}
