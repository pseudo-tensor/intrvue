'use client'
import { SessionProvider } from "next-auth/react";
import UserDisplay from "./_Components/UserDisplay";

export default function Me() {
  return (
    <div>
      <SessionProvider>
        <UserDisplay />
      </SessionProvider>
    </div>
  );
}
