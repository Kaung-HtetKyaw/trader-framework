import { BaseButton } from '../ui/base-button';
import { AGENT_PATHNAME } from '@/app/(root)/agents/urls';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../LoadingSpinner';

export type AgentDetailsContainerProps = {
  children: React.ReactNode;
  hasAgent: boolean;
  isLoading: boolean;
};

const AgentDetailsContainer = (props: AgentDetailsContainerProps) => {
  const { children, hasAgent, isLoading } = props;
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (!hasAgent) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-semibold text-text-950 mb-4">Agent not found</h1>
        <BaseButton
          onClick={() => router.push(AGENT_PATHNAME)}
          className="bg-secondary-500 text-white hover:bg-secondary-600"
        >
          Back to Agents
        </BaseButton>
      </div>
    );
  }

  return <>{children}</>;
};

export default AgentDetailsContainer;
