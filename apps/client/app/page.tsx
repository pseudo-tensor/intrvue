'use client'
import { Appbar } from "./_globalComponents/Appbar";
import { SessionProvider, } from "next-auth/react";

export default function Home() {
  return (
    <SessionProvider>
      <Appbar/>
    </SessionProvider>
  );
}
