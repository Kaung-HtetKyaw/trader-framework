import HeaderWrapper from './HeaderWrapper';
import { useGetOrganizationQuery } from '@/store/api/organizationApi';

const ClusterListHeader = () => {
  const { data: organization } = useGetOrganizationQuery();
  return (
    <HeaderWrapper>
      <section className="bg-white py-4 flex flex-row items-center justify-center gap-3">
        <p className="text-primary-950 font-[500] text-[18px]">{organization?.name || 'Org Name'}</p>
      </section>
    </HeaderWrapper>
  );
};

export default ClusterListHeader;
