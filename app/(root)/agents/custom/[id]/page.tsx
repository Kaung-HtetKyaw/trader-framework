'use client';
import Container from '@/components/Container';
import AgentFormTabs from '@/components/AgentFormTabs';
import Can from '@/lib/authorization/casl/Can';
import { useGetCustomAgentDetailsQuery } from '@/store/api/agentApi';
import { useParams } from 'next/navigation';
import EmptyAgentDetails from '@/components/AgentDetailsPage/EmptyAgentDetails';
import { CustomAgent } from '@/types/agent';
import { useMemo } from 'react';
import DefaultCustomAgentIcon from '@/components/svgs/DefaultCustomAgentIcon';
import { DEFAULT_AGENT_COLOR } from '@/constants/agents';
import LoadingContainer from '@/components/LoadingContainer';
import { useListOrganizationUserQuery } from '@/store/api/organizationApi';
import { useSession } from 'next-auth/react';

const Page = () => {
  const params = useParams<{ id: string }>();
  const { data: session } = useSession();
  const { data: agent, isLoading: isAgentLoading } = useGetCustomAgentDetailsQuery({ id: params.id });
  const { data: users, isLoading: isUsersLoading } = useListOrganizationUserQuery();

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
      label: '',
      icon: DefaultCustomAgentIcon,
      hexColor: DEFAULT_AGENT_COLOR,
    };
  }, [agent, ownedBy]);

  const isLoading = useMemo(() => isAgentLoading || isUsersLoading, [isAgentLoading, isUsersLoading]);

  return (
    <LoadingContainer className="w-full h-full" isLoading={isLoading}>
      <Can do="update" on="agents">
        <Container className="m-3 h-full">
          {agent ? <AgentFormTabs agent={customAgent} /> : <EmptyAgentDetails />}
        </Container>
      </Can>
    </LoadingContainer>
  );
};

export default Page;
