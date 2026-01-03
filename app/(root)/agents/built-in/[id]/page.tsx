import AgentDetailsPage from '@/components/AgentDetailsPage';
import { AgentTypes } from '@/types/agent';

const Page = () => {
  return <AgentDetailsPage type={AgentTypes.builtIn} />;
};

export default Page;
