import Link from "next/link"
import { signOut, useSession } from "next-auth/react"

export function Appbar() {
  const { data: session } = useSession();
  return (
  <div>
    <div style={{display: 'flex', justifyContent: 'space-between'}}>
      <h1>Landing</h1>
      {
        session? <UserProfileNavbar /> : <LandingAuthCompoenent />
      }
    </div>
  </div>
  )
}

export function UserProfileNavbar() {
  const { data: session } = useSession();
  return (
    <div>
      <Link href="/me"><button ><h4> {session?.user?.name} </h4></button></Link>
      <button onClick={async ()=>{await signOut()}}><h4> Sign Out </h4></button>
    </div>
  )
}

export default function LandingAuthCompoenent() {
  return (
    <div>
      <Link href="/sign-in"><button><h4> Sign In </h4></button></Link>
      <Link href="/sign-up"><button><h4> Sign up </h4></button></Link>
    </div>
  )
}
