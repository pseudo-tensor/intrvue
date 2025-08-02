'use client'
import { useRouter } from 'next/navigation';

export default function Redirecting() {
  const router = useRouter();
  router.push('/');

  return (
    <div className='h-screen my-auto'>
      <p className='text-4xl text-center'>You are not logged in</p>
      <p className='text-4xl text-center'>Redirecting to home page</p>
    </div>
  )
}
