'use client'
import { useState } from "react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Loading from "../../_globalComponents/Loading";
import Redirecting from "../../interview/[id]/Components/Redirecting";
import { getUserHostedSessions } from "../../api/interview/route";
import { getUserParticipatedSessions } from "../../api/interview/route";

export default function EventsComponent() {
	// TODO: Use zustand persisted states for these session states
	// TODO: Better types for these
	const [hostedSessions, setHostedSessions] = useState<sessionDataTsType[]>([]);
	const [participatedSessions, setParticipatedSessions] = useState<sessionDataTsType[]>([]);
	const session = useSession();
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
			<h1>Hosted Sessions</h1>
			{ 
				hostedSessions.map((session: any) => {
					return (<div key={session.session_id} ><h4> {JSON.stringify(session)} </h4></div>);
				}) 
			}
			<h1>Participated Sessions</h1>
    </div>
  );
}


