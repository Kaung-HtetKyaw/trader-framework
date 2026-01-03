// next-auth.d.ts

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      role: string;
      email: string;
      accessToken: string;
      refreshToken: string;
      createdAt: string;
    } | null;
    error?: 'InvalidSession';
  }
  interface User {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    createdAt: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    createdAt: string;
  }
}
