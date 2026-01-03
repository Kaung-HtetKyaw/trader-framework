import { useSelector } from 'react-redux';
import HeaderStats from '../HeaderStats';
import { RootState } from '@/store/store';
import useFeatureFlag from '@/lib/hooks/useFeatureFlag';
import HeaderWrapper from './HeaderWrapper';

const DashboardHeader = () => {
  const clusters = useSelector((state: RootState) => state.cluster.allClusters);
  const { isFeatureEnabled } = useFeatureFlag();

  if (!isFeatureEnabled('dashboard')) {
    return null;
  }

  return (
    <HeaderWrapper>
      <section className="bg-white overflow-auto md:overflow-hidden py-4 flex flex-row items-center justify-start gap-3">
        <HeaderStats clusters={clusters} />
      </section>
    </HeaderWrapper>
  );
};

export default DashboardHeader;
