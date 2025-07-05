'use client'
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { SessionProvider, } from "next-auth/react";

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
    <div>
      <button onClick={async () => { await signIn('token-req', { redirect: true })}}>
        <h4> Sign In </h4>
      </button>
      <button onClick={() => { router.push('/sign-up') }}><h4> Sign up </h4></button>
    </div>
  )
}
