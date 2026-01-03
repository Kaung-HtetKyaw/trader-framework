import config from '@/lib/config';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { authOptions } from '@/lib/auth';

export const GET = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ token: null });
  }

  const payload = {
    user_id: session.user.id,
    email: session.user.email,
    name: `${session.user.firstName} ${session.user.lastName}`,
  };

  const token = jwt.sign(payload, config.INTERCOM_SECRET_KEY, { expiresIn: '1h' });

  return NextResponse.json({ token });
};
