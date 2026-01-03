import { useCallback, useMemo } from 'react';
import { useGetBuiltInAgentsQuery, useGetCustomAgentsQuery } from '@/store/api/agentApi';
import { getAgentByName, AGENTS, DEFAULT_AGENT_COLOR } from '@/constants/agents';
import { Agent, CustomAgent } from '@/types/agent';
import DefaultCustomAgentIcon from '@/components/svgs/DefaultCustomAgentIcon';
import { useListOrganizationUserQuery } from '@/store/api/organizationApi';
import { useSession } from 'next-auth/react';

export type UseAgentsProps = {
  type: 'built-in' | 'custom';
};

/**
 * Custom hook to get agents with enriched and transformed data
 * Transforms raw API data into fully enriched Agent objects with icons, colors, labels, sorting, etc.
 */
export const useAgents = (props?: UseAgentsProps) => {
  const { data: session } = useSession();
  const {
    data: builtInAgentsData,
    isLoading: isBuiltInAgentsLoading,
    error: builtInAgentsError,
  } = useGetBuiltInAgentsQuery(undefined, {
    skip: props?.type === 'custom',
  });

  const {
    data: customAgentsData,
    isLoading: isCustomAgentsLoading,
    error: customAgentsError,
  } = useGetCustomAgentsQuery(undefined, {
    skip: props?.type === 'built-in',
  });

  const { data: users, isLoading: isUsersLoading } = useListOrganizationUserQuery();

  const builtInAgents = useMemo<Agent[]>(() => {
    if (!builtInAgentsData) return [];

    const transformedAgents = builtInAgentsData.map(apiAgent => {
      const agentConfig = getAgentByName(apiAgent.name);

      if (!agentConfig) {
        throw new Error(`Agent config not found for: ${apiAgent.name}`);
      }

      return {
        name: apiAgent.name,
        label: agentConfig.label,
        ownedBy: apiAgent.ownedBy,
        description: apiAgent.description,
        builtInInstruction: apiAgent.builtInInstruction,
        customInstruction: apiAgent.customInstruction,
        updatedAt: apiAgent.updatedAt,
        icon: agentConfig.icon,
        hexColor: agentConfig.hexColor,
      };
    });

    // Sort according to the order in AGENTS constant
    return transformedAgents.sort((a, b) => {
      const indexA = AGENTS.findIndex(agent => agent.name === a.name);
      const indexB = AGENTS.findIndex(agent => agent.name === b.name);
      return indexA - indexB;
    });
  }, [builtInAgentsData]);

  const getOwner = useCallback(
    (userId: string) => {
      const user = users?.find(user => user.id === userId);
      if (!user) return '';

      if (user.id === session?.user?.id) {
        return 'You';
      }

      if (!user.firstName && !user.lastName) return user.email;

      return `${user.firstName} ${user.lastName}`;
    },
    [users, session?.user?.id]
  );

  const customAgents: CustomAgent[] = useMemo(() => {
    if (!customAgentsData) return [];

    const transformedAgents = customAgentsData.items?.map(apiAgent => {
      return {
        id: apiAgent.agentID,
        name: apiAgent.name,
        label: apiAgent.name,
        ownedBy: getOwner(apiAgent.createdBy),
        description: apiAgent.description,
        instruction: apiAgent.instruction,
        updatedAt: apiAgent.updatedAt,
        icon: DefaultCustomAgentIcon,
        hexColor: DEFAULT_AGENT_COLOR,
      };
    });

    return transformedAgents || [];
  }, [customAgentsData, getOwner]);

  return {
    buildInAgents: {
      data: builtInAgents,
      isLoading: isBuiltInAgentsLoading,
      error: builtInAgentsError,
    },
    customAgents: {
      data: customAgents,
      isLoading: isCustomAgentsLoading || isUsersLoading,
      error: customAgentsError,
    },
  };
};
