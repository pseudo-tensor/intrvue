'use client'
import { SessionProvider } from 'next-auth/react';
import EventsComponent from './_Components/Events';
import { useSession } from "next-auth/react";
import Loading from "../_globalComponents/Loading";

export default function Events() {
  const session = useSession();

  if (session.status == 'loading') return (<Loading />);

  return (
    <div>
      <EventsComponent/>
    </div>
  );
}

