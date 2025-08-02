'use client'
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { SessionProvider, } from "next-auth/react";
import { Button } from "@repo/ui/Elements";
import { Link } from "next/link";

export function AppBarWrapper() { 
  const router = useRouter();

  return (
    <div className='sticky top-0 flex justify-between bg-gunmetal z-100'>
      <p className='p-2 mx-2 my-auto '><button className='text-3xl cursor-pointer' onClick={() => {router.push('/')}}> intrvue </button></p>
      <div>
        <SessionProvider>
          <Appbar/>
        </SessionProvider>
      </div>
    </div>
  )
}

export function Appbar() {
  const { data: session } = useSession();
  return session? <UserProfileNavbar /> : <LandingAuthCompoenent />
}

export function UserProfileNavbar() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div style={{display: 'flex', justifyContent: 'space-between'}}>
      {/* <Button text={session?.user?.name} handler={() => { router.push('/me') }} /> */}
			<Button text='Interview' handler={() => { router.push('/interview') }} />
			<Button text='Sessions' handler={() => { router.push('/events') }} />
			<Button text='Sign out' handler={async ()=>{router.push('/'); await signOut(); }} />
    </div>
  )
}

export default function LandingAuthCompoenent() {
  const router = useRouter();

  return (
    <div style={{display: 'flex', justifyContent: 'space-between'}}>
			<Button text='Sign In'  handler={async () => { await signIn('token-req', { redirect: true })}} />
			<Button text='Sign Up'  handler={() => { router.push('/sign-up') }} />
    </div>
  )
}
