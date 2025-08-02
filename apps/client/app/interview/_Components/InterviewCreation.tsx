'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react";
import Loading from "../../_globalComponents/Loading";
import Redirecting from "../[id]/Components/Redirecting";
import { submitNewSessionReq } from "../../api/interview/route";
import { useInterviewStore } from '@repo/store/providers/interviewStoreProvider';
import { Button } from "@repo/ui/Elements";
import { AppBarWrapper } from "../../_globalComponents/Appbar";

export default function InterviewCreation() {
  const router = useRouter();
  const session = useSession();
  const [pUser, setPUser] = useState("");
  const [date, setDate] = useState(Date);
  const [buttonLoading, setButtonLoading] = useState(false);
  const interview = useInterviewStore((s) => s)
  const setInterview = useInterviewStore((s) => s.setInterview)

  if (session.status == 'loading') return (<Loading />);
  if (session.status == 'unauthenticated') return (<Redirecting />);

  const payload = {
    id: session.data!.user.id, // dw about this :P
    pUsername: pUser,
    date: new Date(date)
  };

  const tryCreateSession = async () => {
    setButtonLoading(true);
    const result = await submitNewSessionReq(payload);
    if (!result.success) {
      console.debug("failure");
      // handle error here
      // error = result.error
      // 
      router.refresh();
    }
    setInterview(result.data);
    router.push(`/interview/${result.data.session_id}`);
    setButtonLoading(false);
  }

  return (
    <div>
      <AppBarWrapper />
      <div id="pageroot"
        style={{ width: '100vw', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}
        className='h-[calc(100svh-8rem)]'
      >
        <div
          className='w-3/5 p-12 h-40vh w-40vw grid'
        >
          <p className='mb-20 text-5xl font-thin text-center font'> Create New Session </p>
          <input
            type="datetime-local" onChange={(e)=>{setDate(e.target.value)}}
            className='px-2 py-4 text-3xl text-center border bg-gunmetal'
          />
          <span className='h-2' />
          <input
            type="text" placeholder="participant (optional)" onChange={(e)=>{setPUser(e.target.value)}}
            className='px-2 py-4 text-3xl text-center border bg-gunmetal'
          />
          <span className='h-2' />
          <span className='h-20'></span>
          <Button loading={buttonLoading} buttonid="createSession" text="Create new session" handler={tryCreateSession}></Button>
        </div>
        <img style={{objectFit: 'cover', width: '100%', height: '100vh'}} src='image.webp'/>
      </div>
    </div>
  )

}
