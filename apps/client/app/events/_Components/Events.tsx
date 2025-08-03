'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Loading from "../../_globalComponents/Loading";
import Redirecting from "../../interview/[id]/Components/Redirecting";
import { getUserHostedSessions } from "../../../lib/interviewService";
import { getUserParticipatedSessions } from "../../../lib/interviewService";
import EventCard from "./EventCard";
import { sessionDataTsType } from "@repo/types/userTypes";
import { AppBarWrapper } from "../../_globalComponents/Appbar";

export default function EventsComponent() {
  // TODO: Use zustand persisted states for these session states
  // TODO: Better types for these
  const [hostedSessions, setHostedSessions] = useState<sessionDataTsType[]>([]);
  const [participatedSessions, setParticipatedSessions] = useState<sessionDataTsType[]>([]);
  const session = useSession();
  const router = useRouter();
  const id = session.data?.user.id;

  useEffect(() => {
    if (!id) return;
    const fetchHostedSessions = async () => {
      const hostedSessionArray = await getUserHostedSessions(id);
      setHostedSessions(hostedSessionArray.data);
    }
    const fetchParticipatedSessions = async () => {
      const participatedSessionArray = await getUserParticipatedSessions(id);
      setParticipatedSessions(participatedSessionArray.data);
    }
    fetchHostedSessions();
    fetchParticipatedSessions();
  }, [id]);

  if (session.status == 'loading') return (<Loading />);
  if (session.status == 'unauthenticated') return (<Redirecting />);

  return (
    <div>
      <AppBarWrapper />
      <div className='flex'>
        <div className='w-4/5 my-5'>
          <p className='mb-8 text-3xl text-center'>Hosted Sessions</p>
          { 
            hostedSessions.map((session: any) => {
              return (
                <div key={session.session_id} >
                  <EventCard type='host' sessionData={session} router={router} />
                </div>
              );
            })
          }
          <p className='mb-8 text-3xl text-center'>Participated Sessions</p>
          { 
            participatedSessions.map((session: any) => {
              return (
                <div key={session.session_id} >
                  <EventCard type='participant' sessionData={session} router={router} />
                </div>
              );
            }) 
          }
        </div>
        <div className='sticky top-16 w-full h-[calc(100svh-4rem)]'>
          <img src='image.webp' className='object-cover w-full h-full'/>
        </div>
      </div>
    </div>
  );
}


