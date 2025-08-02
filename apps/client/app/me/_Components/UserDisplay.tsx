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
      <div
        style={{display: 'flex', justifyContent: 'space-between'}}
        className=''>
        <p className='p-2 my-auto text-3xl'> intrvue </p>
        <div>
          <AppBarWrapper />
        </div>
      </div>
      <div className='flex items-center justify-evenly h-[calc(100svh-4rem)]'>
        <div>
          <p className='p-10 pb-2 text-4xl text-center'> Hello, {session.data.user.name} </p>
          <p className='p-10 pt-2 text-4xl text-center'> You aren't supposed to see this :( </p>
        </div>
      </div>
    </div>
  )
}
