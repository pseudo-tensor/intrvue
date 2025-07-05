'use client'
import { SessionProvider } from "next-auth/react"
import InterviewPage from "./Components/InterviewPage"
import { InterviewStoreProvider } from "@repo/store/providers/interviewStoreProvider"

export default function Interview() {

  return (
    <div>
      <SessionProvider>
        <InterviewStoreProvider>
          <InterviewPage />
        </InterviewStoreProvider>
      </SessionProvider>
    </div>
  )
}
