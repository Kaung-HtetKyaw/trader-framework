import { useGetOrganizationQuery } from '@/store/api/organizationApi';
import HeaderWrapper from './HeaderWrapper';
import CreateAgentButton from '../CreateAgentButton';

const AgentsHeader = () => {
  const { data: organization } = useGetOrganizationQuery();

  return (
    <HeaderWrapper customActionButton={<CreateAgentButton />}>
      <section className="bg-white flex flex-row items-center justify-center gap-3">
        <p className="text-primary-950 font-[500] text-[18px]">{organization?.name || 'Org Name'}</p>
      </section>
    </HeaderWrapper>
  );
};

export default AgentsHeader;
