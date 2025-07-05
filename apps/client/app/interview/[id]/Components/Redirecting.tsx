'use client'
import { useRouter } from 'next/navigation';

export default function Redirecting() {
  const router = useRouter();
  setTimeout(async () => { router.push('/')}, 5000);

  return (
    <div>
      <h1>You are not logged in</h1>
      <h3>Redirecting to home page</h3>
    </div>
  )
}
