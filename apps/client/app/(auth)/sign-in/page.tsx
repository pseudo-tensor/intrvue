'use client'

import { useRouter } from "next/navigation";
import userAuthenticated from "../../../temporary";

export default function Home() {
  const router = useRouter();

  if (userAuthenticated) router.push('/me');

  return (
    <div>
      sign in
    </div>
  );
}
