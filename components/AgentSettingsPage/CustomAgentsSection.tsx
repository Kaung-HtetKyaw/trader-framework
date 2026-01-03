import { AddIcon } from '../svgs/AddIcon';
import { useMemo } from 'react';
import DefaultCustomAgentIcon from '../svgs/DefaultCustomAgentIcon';
import { CREATE_AGENT_PATHNAME, getCustomAgentDetailsPath, getCustomAgentDraftPath } from '@/app/(root)/agents/urls';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useLocalStorage from '@/lib/hooks/useLocalStorage';
import { AgentDraft, CREATE_AGENT_DRAFT_KEY } from '../AgentFormTabs';
import AgentOverviewCard from './AgentOverviewCard';
import AgentsPageSkeleton from '@/app/(root)/agents/AgentsPageSkeleton';
import { DEFAULT_AGENT_COLOR } from '@/constants/agents';
import { CustomAgent } from '@/types/agent';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { BackendError } from '@/lib/utils/error';
import { SerializedError } from '@reduxjs/toolkit';

export type CustomAgentSectionProps = {
  agents: CustomAgent[];
  isLoading: boolean;
  error: FetchBaseQueryError | BackendError | SerializedError | undefined;
};

const CustomAgentsSection = (props: CustomAgentSectionProps) => {
  const { agents, isLoading, error } = props;
  const router = useRouter();

  const [draft] = useLocalStorage<AgentDraft | undefined>(CREATE_AGENT_DRAFT_KEY, undefined);

  const draftAgent = useMemo(() => {
    if (!draft) return null;

    return {
      id: '',
      name: draft.name,
      description: draft.description,
      instruction: draft.instruction,
      updatedAt: draft.lastUpdatedAt,
      ownedBy: draft.ownedBy,
      type: 'custom',
      label: draft.name,
      icon: DefaultCustomAgentIcon,
      hexColor: DEFAULT_AGENT_COLOR,
    };
  }, [draft]);

  return (
    <div className="flex-1 px-8 py-6 space-y-8">
      <section>
        <h2 className="text-lg font-semibold text-text-950 mb-4">Custom Agents</h2>
        {isLoading && <AgentsPageSkeleton />}
        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-error-500">Failed to load custom agents. Please try again later.</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {!isLoading && (
            <div
              onClick={() => router.push(CREATE_AGENT_PATHNAME)}
              className="min-h-[160px] md:min-h-[auto] bg-transparent border border-dashed border-text-300 rounded-lg p-5 hover:bg-secondary-50 transition-colors cursor-pointer"
            >
              <div className="w-full h-full flex flex-col justify-center items-center">
                <AddIcon className={'text-text-500 w-4 h-4'} />
                <h3 className="font-normal text-text-500 body-2">Create Agent</h3>
              </div>
            </div>
          )}

          {agents.map(agent => (
            <Link key={agent.id} href={getCustomAgentDetailsPath(agent.id)}>
              <AgentOverviewCard agent={agent} type="custom" />
            </Link>
          ))}

          {draftAgent && (
            <Link key={'draft-agent'} href={getCustomAgentDraftPath()}>
              <AgentOverviewCard agent={draftAgent} type="custom" isDraft />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default CustomAgentsSection;
