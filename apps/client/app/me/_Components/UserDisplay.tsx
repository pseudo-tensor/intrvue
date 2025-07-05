import { useSession } from "next-auth/react"
import Loading from "../../_globalComponents/Loading";
import Redirecting from "../../interview/[id]/Components/Redirecting";
import { AppBarWrapper } from "../../_globalComponents/Appbar";

export default function UserDisplay() {
  const session = useSession();
  if (session.status == 'loading') return (<Loading />)
  if (session.status == 'unauthenticated') return (<Redirecting />)
  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <h1>User Profile</h1>
        <AppBarWrapper />
      </div>
      <h2>{JSON.stringify(session)}</h2>
    </div>
 
  )
}

