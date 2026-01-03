import { type NextAuthOptions, type SessionStrategy } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';
import config from './config';
import { jwtDecode } from 'jwt-decode';
import { Mutex } from 'async-mutex';

const isTokenExpired = (token: string, thresholdSeconds: number = 300): boolean => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    const now = Math.floor(Date.now() / 1000);
    const timeRemaining = exp - now;
    return timeRemaining < thresholdSeconds; // treat as expired if expiring in less than 5 mins
  } catch {
    return true;
  }
};

type FetchToken = {
  accessToken: string;
  refreshToken: string;
};

const refreshMutex = new Mutex();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error(
            JSON.stringify({
              errorCode: 'EMTX00002',
              errorMessage: 'Missing email or password',
            })
          );
        }

        const loginRes = await fetch(`${config.NEXT_PUBLIC_API_BASE_URL}/auth.login.basic`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });

        if (!loginRes.ok) {
          const err = await loginRes.json();
          throw new Error(
            JSON.stringify({
              errorCode: err.errorCode,
              errorMessage: err.errorMessage,
            })
          );
        }
        const { accessToken, refreshToken }: FetchToken = await loginRes.json();
        if (!accessToken || !refreshToken) return null;

        const userRes = await fetch(`${config.NEXT_PUBLIC_API_BASE_URL}/user.personalInfo.find`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({}),
        });
        if (!userRes.ok) return null;
        const user = await userRes.json();

        return { ...user, accessToken, refreshToken };
      },
    }),
  ],
  session: {
    strategy: 'jwt' as SessionStrategy,
    maxAge: 86400, // seconds, same as your refresh token expiry
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: JWT; user?: any }): Promise<JWT> {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
        token.email = user.email;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.createdAt = user.createdAt;
      }

      // Acquire mutex lock before refresh logic
      return refreshMutex.runExclusive(async () => {
        if (isTokenExpired(token.accessToken)) {
          console.warn('[jwt] token expired, refreshing token');
          try {
            const res = await fetch(`${config.NEXT_PUBLIC_API_BASE_URL}/auth.jwt.refresh`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token.accessToken}`,
              },
              body: JSON.stringify({ refreshToken: token.refreshToken }),
            });
            if (res.ok) {
              const data: { accessToken: string } = await res.json();
              token.accessToken = data.accessToken;
            } else {
              console.warn('[jwt] refresh failed, clearing tokens');
              token.accessToken = '';
              token.refreshToken = '';
              token.error = 'InvalidSession';
            }
          } catch {
            token.accessToken = '';
            token.refreshToken = '';
            token.error = 'InvalidSession';
          }
        }
        return token;
      });
    },

    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      if (!token.accessToken) {
        return {
          ...session,
          user: null,
          error: 'InvalidSession' as const,
        };
      }
      return {
        ...session,
        user: {
          id: token.id as string,
          firstName: token.firstName as string,
          lastName: token.lastName as string,
          role: token.role as string,
          email: token.email as string,
          accessToken: token.accessToken as string,
          refreshToken: token.refreshToken as string,
          createdAt: token.createdAt as string,
        },
      };
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
