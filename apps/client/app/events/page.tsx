'use client'
import { SessionProvider } from 'next-auth/react';
import EventsComponent from './_Components/Events';

export default function Events() {
  return (
    <div>
      <SessionProvider>
        <EventsComponent/>
      </SessionProvider>
    </div>
  );
}

