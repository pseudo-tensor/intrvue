'use client'
import { SessionProvider } from "next-auth/react"
import InterviewPage from "./Components/InterviewPage"
import { useSession } from "next-auth/react";
import { InterviewStoreProvider } from "@repo/store/providers/interviewStoreProvider"
import Loading from "../../_globalComponents/Loading";

export default function Interview() {
  const session = useSession();
  if (session.status != 'authenticated') return (<Loading />);

  return (
    <div>
      <InterviewStoreProvider>
        <InterviewPage />
      </InterviewStoreProvider>
    </div>
  )
}
