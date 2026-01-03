import { useGetOrganizationQuery } from '@/store/api/organizationApi';
import HeaderWrapper from './HeaderWrapper';

const SettingsHeader = () => {
  const { data: organization } = useGetOrganizationQuery();

  return (
    <HeaderWrapper>
      <section className="bg-white flex flex-row items-center justify-center gap-3">
        <p className="text-primary-950 font-[500] text-[18px]">{organization?.name || 'Org Name'}</p>
      </section>
    </HeaderWrapper>
  );
};

export default SettingsHeader;
