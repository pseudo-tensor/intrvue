'use client'
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation"
import InterviewCreation from "./_Components/InterviewCreation";
import { InterviewStoreProvider } from "@repo/store/providers/interviewStoreProvider";

export default function CreateSession() {
  const router = useRouter();
  return (
    <div>
      <h1>Create New Session</h1>
      <SessionProvider>
        <InterviewStoreProvider>
          <InterviewCreation/>
        </InterviewStoreProvider>
      </SessionProvider>
      <button onClick={()=>{router.push('/events')}}>View Upcomnig interviews</button>
    </div>
  )
}
