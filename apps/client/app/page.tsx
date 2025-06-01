'use client'
import { useRouter } from 'next/navigation';
import { UserProfileNavbar } from "@repo/ui/UserProfileNavbar";
import userAuthenticated from '../temporary';

export default function Home() {

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <h1>Landing</h1>
        {
          userAuthenticated? <UserProfileNavbar /> : <LandingAuthCompoenent />
        }
     </div>
    </div>
  );
}

function LandingAuthCompoenent() {
  const router = useRouter();
  return (
    <div>
      <button onClick={()=>{ router.push('/sign-in')}}><h4> Sign In </h4></button>
      <button onClick={()=>{ router.push('/sign-up')}}><h4> Sign Up </h4></button>
    </div>
  )
}
