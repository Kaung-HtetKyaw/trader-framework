'use client';
import AbilityProvider from '@/lib/authorization/casl/AbilityProvider';
import { PostHogProvider } from '@/posthog/providers/PostHogProvider';
import StoreProvider from '@/store/providers/StoreProvider';
import { SessionProvider } from 'next-auth/react';
import SessionHandler from './SessionHandler';
import AutoLogoutProvider from './AutoLogout';
import { HydrationProvider } from './HydrationProvider';
import IntercomProvider from './IntercomProvider';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={600} refetchOnWindowFocus={true}>
      <SessionHandler />
      <AutoLogoutProvider>
        <PostHogProvider>
          <StoreProvider>
            <AbilityProvider>
              <IntercomProvider>
                <HydrationProvider>{children}</HydrationProvider>
              </IntercomProvider>
            </AbilityProvider>
          </StoreProvider>
        </PostHogProvider>
      </AutoLogoutProvider>
    </SessionProvider>
  );
}
