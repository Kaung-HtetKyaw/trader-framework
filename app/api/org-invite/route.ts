import { NextResponse } from 'next/server';
import { acceptOrgInvitation } from '@/lib/authClient';
import config from '@/lib/config';
import { ErrorMessages } from '@/lib/utils/error';
import { ORG_INVITATION_FAILED_PATH, LOGIN_PATH, ORG_INVITATION_CHANGE_ACCOUNT_PATH } from '@/app/(auth)/urls';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const session = await getServerSession(authOptions);

  const email = searchParams.get('email');

  if (!session) {
    return NextResponse.redirect(new URL(`${LOGIN_PATH}?redirect=/api/org-invite&email=${email}`, config.HOSTNAME));
  }

  if (!email) {
    return NextResponse.redirect(new URL(ORG_INVITATION_FAILED_PATH, config.HOSTNAME));
  }

  if (session?.user?.email !== email) {
    return NextResponse.redirect(
      new URL(`${ORG_INVITATION_CHANGE_ACCOUNT_PATH}?redirect=/api/org-invite&email=${email}`, config.HOSTNAME)
    );
  }

  try {
    // accept org invitation
    const result = await acceptOrgInvitation();

    if (result.success) {
      return NextResponse.redirect(new URL('/', config.HOSTNAME));
    }

    if (result.errorCode === ErrorMessages.ORGANIZATION_INVITE_NOT_FOUND.errorCode) {
      return NextResponse.redirect(new URL(ORG_INVITATION_FAILED_PATH, config.HOSTNAME));
    }

    if (result.errorCode === ErrorMessages.USER_ALREADY_ACCEPTED_INVITE.errorCode) {
      return NextResponse.redirect(new URL(LOGIN_PATH, config.HOSTNAME));
    }
  } catch {
    return NextResponse.redirect(new URL(ORG_INVITATION_FAILED_PATH, config.HOSTNAME));
  }
}
