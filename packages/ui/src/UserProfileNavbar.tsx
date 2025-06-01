import { useRouter } from 'next/navigation';

export function UserProfileNavbar() {
  const router = useRouter();
  return (
    <button onClick={()=>{ router.push('/me')}}><h4> Profile </h4></button>
  )
}
