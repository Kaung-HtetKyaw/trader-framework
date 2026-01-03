import { getBuiltInAgentDetailsPath } from '@/app/(root)/agents/urls';
import Link from 'next/link';
import AgentOverviewCard from './AgentOverviewCard';
import AgentsPageSkeleton from '@/app/(root)/agents/AgentsPageSkeleton';
import { Agent } from '@/types/agent';
import { SerializedError } from '@reduxjs/toolkit';
import { BackendError } from '@/lib/utils/error';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export type BuiltInAgentsSectionProps = {
  agents: Agent[];
  isLoading: boolean;
  error: FetchBaseQueryError | BackendError | SerializedError | undefined;
};

const BuiltInAgentsSection = (props: BuiltInAgentsSectionProps) => {
  const { agents, isLoading, error } = props;

  return (
    <div className="flex-1 px-8 py-6 space-y-8">
      <section>
        <h2 className="text-lg font-semibold text-text-950 mb-4">Built-in Agents</h2>
        {isLoading && <AgentsPageSkeleton />}
        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-error-500">Failed to load built-in agents. Please try again later.</div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map(agent => (
            <Link key={agent.name} href={getBuiltInAgentDetailsPath(agent.name)}>
              <AgentOverviewCard agent={agent} type="built-in" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BuiltInAgentsSection;
