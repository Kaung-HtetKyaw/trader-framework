import { BaseButton } from '../ui/base-button';
import { useRouter } from 'next/navigation';
import { AGENT_PATHNAME } from '@/app/(root)/agents/urls';

const EmptyAgentDetails = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-normal text-text-500 mb-4">Agent not found</h1>
      <BaseButton
        onClick={() => router.push(AGENT_PATHNAME)}
        className="bg-secondary-500 text-white hover:bg-secondary-600"
      >
        Back to Agents
      </BaseButton>
    </div>
  );
};

export default EmptyAgentDetails;
