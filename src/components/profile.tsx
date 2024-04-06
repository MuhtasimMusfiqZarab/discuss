'use client';

import { useSession } from 'next-auth/react';

export default function Profile() {
  const session = useSession();

  if (session.data?.user) {
    return <div>User Is Signed In {JSON.stringify(session.data?.user)} </div>;
  }
  return <div>User Is signed out</div>;
}
