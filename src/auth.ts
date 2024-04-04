import NextAuth from 'next-auth';
import Github from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/db';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECTER = process.env.GITHUB_CLIENT_SECTER;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECTER) {
  throw new Error('github credentials not provided!');
}

export const {
  handlers: { GET, POST },
  auth,
  signOut,
  signIn
} = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Github({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECTER
    })
  ],
  callbacks: {
    //this is usually not needed! fixing a bug in next-auth
    async session({ session, user }: any) {
      if (session && user) {
        session.user.id = user.id;
      }
      return session;
    }
  }
});
