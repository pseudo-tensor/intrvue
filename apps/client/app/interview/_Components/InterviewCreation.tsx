'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"
import { useState } from "react";
import Loading from "../../_globalComponents/Loading";
import Redirecting from "../[id]/Components/Redirecting";
import { submitNewSessionReq } from "../../api/interview/route";
import { useInterviewStore } from '@repo/store/providers/interviewStoreProvider';

export default function InterviewCreation() {
  const router = useRouter();
  const session = useSession();
  const [pUser, setPUser] = useState("");
  const [date, setDate] = useState(Date);
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
    console.debug("hallo");
    const result = await submitNewSessionReq(payload);
    if (!result.success) {
      console.debug("failure");
      // handle error here
      // error = result.error
      // 
      return -1;
    }
    setInterview(result.data);
    console.debug(interview);
    return 0;
  }

  return (
    <div>
      <form>
        <input type="datetime-local" onChange={(e)=>{setDate(e.target.value)}}/>
        <br/>
        <input type="text" placeholder="participant username" onChange={(e)=>{setPUser(e.target.value)}}/>
      </form>
      <button onClick={async () => {
        if (await tryCreateSession() == 0) {
          router.push(`/interview/${interview.session_id}`);
          console.debug("no push")
        }
        else router.refresh(); // maybe trigger some modal or error indcation here
      }}>Create new session</button>
    </div>
  )
}
