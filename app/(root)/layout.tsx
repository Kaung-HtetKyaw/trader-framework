import React, { ReactNode } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { VisualizationRefreshProvider } from '@/context/VisualizationRefreshContext';
import MainLayoutContainer from '@/components/MainLayoutContainer';

const layout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/log-in');
  }

  return (
    <VisualizationRefreshProvider>
      <MainLayoutContainer>
        <Sidebar />
        <div className="flex flex-col w-full h-screen bg-text-100 overflow-hidden">
          <Header />
          <div className="flex flex-col w-full h-[calc(100vh-64px)] overflow-auto ">{children}</div>
        </div>
      </MainLayoutContainer>
    </VisualizationRefreshProvider>
  );
};

export default layout;
