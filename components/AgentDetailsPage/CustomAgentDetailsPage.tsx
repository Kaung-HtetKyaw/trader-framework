'use client';

import React, { useMemo } from 'react';
import { CustomAgent } from '@/types/agent';
import { useParams } from 'next/navigation';
import { useGetCustomAgentDetailsQuery } from '@/store/api/agentApi';
import DefaultCustomAgentIcon from '../svgs/DefaultCustomAgentIcon';
import LoadingSpinner from '../LoadingSpinner';
import EmptyAgentDetails from './EmptyAgentDetails';
import { DEFAULT_AGENT_COLOR } from '@/constants/agents';
import { useSession } from 'next-auth/react';
import { useListOrganizationUserQuery } from '@/store/api/organizationApi';

const CustomAgentDetailsPage = () => {
  const params = useParams();
  const { data: session } = useSession();
  const { data: users, isLoading: isUsersLoading } = useListOrganizationUserQuery();
  const agentId = params.id as string;

  const { data: agent, isLoading: isAgentLoading } = useGetCustomAgentDetailsQuery({ id: agentId });

  const ownedBy = useMemo(() => {
    const user = users?.find(user => user.id === agent?.createdBy);
    if (!user) return '';

    if (user.id === session?.user?.id) {
      return 'You';
    }
    if (!user.firstName && !user.lastName) return user.email;

    return `${user.firstName} ${user.lastName}`;
  }, [users, session?.user?.id, agent?.createdBy]);

  const customAgent: CustomAgent = useMemo(() => {
    return {
      id: agent?.agentID || '',
      name: agent?.name || '',
      description: agent?.description || '',
      instruction: agent?.instruction || '',
      mcpClientConfigs: agent?.mcpClientConfigs || [],
      updatedAt: agent?.updatedAt || '',
      ownedBy: ownedBy,
      // TODO: Add these properties after agent avatar customization is implemented
      icon: DefaultCustomAgentIcon,
      hexColor: DEFAULT_AGENT_COLOR,
      label: '',
    };
  }, [agent, ownedBy]);

  const isLoading = useMemo(() => isAgentLoading || isUsersLoading, [isAgentLoading, isUsersLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (!agent) {
    return <EmptyAgentDetails />;
  }

  return (
    <div>
      <h1>{customAgent.name}</h1>
    </div>
  );
};

export default CustomAgentDetailsPage;
