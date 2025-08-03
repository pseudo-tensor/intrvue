'use client'
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation"
import InterviewCreation from "./_Components/InterviewCreation";
import { InterviewStoreProvider } from "@repo/store/providers/interviewStoreProvider";
import { Button } from "@repo/ui/Elements";
import { useSession } from "next-auth/react";
import Loading from "../_globalComponents/Loading";

export default function CreateSession() {
  const router = useRouter();
  const session = useSession();

  if (session.status == 'loading') return (<Loading />);

  return (
    <div>
      <InterviewStoreProvider>
        <InterviewCreation/>
      </InterviewStoreProvider>
    </div>
  )
}
