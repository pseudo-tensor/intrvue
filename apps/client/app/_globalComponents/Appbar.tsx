'use client'
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { SessionProvider, } from "next-auth/react";
import { Button } from "@repo/ui/Elements";

export function AppBarWrapper() { return (
    <SessionProvider>
      <Appbar/>
    </SessionProvider>
  )
}

export function Appbar() {
  const { data: session } = useSession();
  return (
  <div>
    <div>
      { session? <UserProfileNavbar /> : <LandingAuthCompoenent /> }
    </div>
  </div>
  )
}

export function UserProfileNavbar() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div>
      <button onClick={() => { router.push('/me') }}><h4> {session?.user?.name} </h4></button>
      <button onClick={async ()=>{await signOut()}}><h4> Sign Out </h4></button>
    </div>
  )
}

export default function LandingAuthCompoenent() {
  const router = useRouter();

  return (
    <div style={{display: 'flex', justifyContent: 'space-between'}}>
			<Button text='Sign in'  handler={async () => { await signIn('token-req', { redirect: true })}} />
			<Button text='Sign up'  handler={() => { router.push('/sign-up') }} />
    </div>
  )
}
