'use client'
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation"
import InterviewCreation from "./_Components/InterviewCreation";
import { InterviewStoreProvider } from "@repo/store/providers/interviewStoreProvider";
import { Button } from "@repo/ui/Elements";

export default function CreateSession() {
  const router = useRouter();
  return (
    <div>
      <SessionProvider>
        <InterviewStoreProvider>
          <InterviewCreation/>
        </InterviewStoreProvider>
      </SessionProvider>
    </div>
  )
}
