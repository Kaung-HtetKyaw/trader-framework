import { NextResponse } from 'next/server';
import { verifyUser } from '@/lib/authClient';
import config from '@/lib/config';
import { ErrorMessages } from '@/lib/utils/error';
import { closePosthogServer, getPosthogServer } from '@/lib/posthog-server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  if (!email || !token) {
    return NextResponse.redirect(new URL('/email-verification/email-verification-failed', config.HOSTNAME));
  }

  const result = await verifyUser(token);

  if (result.success) {
    if (result.userID && email) {
      const posthog = getPosthogServer();

      if (!posthog) {
        console.error(
          'PostHog server not initialized. This could be because PostHog is not enabled in the config or the required credentials are not set.'
        );
        return NextResponse.redirect(new URL('/email-verification/email-verified', config.HOSTNAME));
      }

      try {
        posthog.identify({
          distinctId: result.userID,
          properties: { email },
        });
      } catch (error) {
        console.error('Error identifying user in PostHog', error);
        await closePosthogServer();
      }
    }

    return NextResponse.redirect(new URL('/email-verification/email-verified', config.HOSTNAME));
  }

  if (result.errorCode === ErrorMessages.VERIFY_TOKEN_EXPIRED.errorCode) {
    return NextResponse.redirect(
      new URL(`/email-verification/link-expired?email=${encodeURIComponent(email)}`, config.HOSTNAME)
    );
  }

  if (
    result.errorCode === ErrorMessages.NOT_FOUND.errorCode ||
    result.errorCode === ErrorMessages.INVALID_VERIFY_TOKEN.errorCode
  ) {
    return NextResponse.redirect(new URL(`/email-verification/invalid-token`, config.HOSTNAME));
  }

  return NextResponse.redirect(new URL('/email-verification/email-verification-failed', config.HOSTNAME));
}
