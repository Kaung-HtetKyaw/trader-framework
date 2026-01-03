import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';
import { authFeedbackRoutes } from './urls';

const layout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(authOptions);
  const headerList = await headers();
  const pathname = headerList.get('x-current-path') || '';

  if (session && !authFeedbackRoutes.includes(pathname)) {
    return redirect('/dashboard');
  }

  return (
    <main className="auth-container">
      <section className="auth-form">
        <div className="auth-box">{children}</div>
      </section>
    </main>
  );
};

export default layout;
