import Container from '@/components/Container';
import { cn } from '@/lib/utils';
import { Cluster } from '@/types/cluster';
import Image from 'next/image';
import { ClusterGroupIcon } from '../svgs/ClusterGroupIcon';
import ClockDownloadTime from '../svgs/ClockDownloadTime';
import { formatAbbrevDistanceToNow } from '@/lib/time';
import Divider from '../Divider';
import { getProviderImage, getProviderName } from '@/lib/providers';
import HorizontalScrollContainer from '../HorizontalScrollContainer';

export type ClusterStatsPanelProps = {
  cluster: Cluster;
};

const ClusterStatsPanel = ({ cluster }: ClusterStatsPanelProps) => {
  const providerName = getProviderName(cluster.provider);
  const providerImage = getProviderImage(cluster.provider);

  return (
    <HorizontalScrollContainer>
      <Container className={cn('py-4 flex flex-row justify-between gap-0 items-center min-w-[770px]')}>
        <div className={cn('flex flex-row items-center gap-2 ')}>
          <div className="bg-text-50 min-w-9 h-9 flex items-center justify-center rounded-sm">
            <ClusterGroupIcon className="w-6 h-6 text-text-950" />
          </div>

          <div className="flex flex-col items-start">
            <p className="body-1 font-[400] truncate max-w-[100px]">{cluster.group} </p>
            <p className="inline-1 text-text-500">Cluster Group</p>
          </div>
        </div>

        <Divider type="vertical" className="block h-9" />

        <div className={cn('flex flex-row items-center gap-2')}>
          <div className="bg-text-50 min-w-9 h-9 flex items-center justify-center rounded-sm">
            {providerImage ? (
              <Image src={providerImage} alt={providerName} width={30} height={30} />
            ) : (
              <ClusterGroupIcon className="w-6 h-6 text-text-950" />
            )}
          </div>

          <div className="flex flex-col items-start">
            <p className="body-1 font-[400]">{providerName} </p>
            <p className="inline-1 text-text-500">Provider</p>
          </div>
        </div>

        <Divider type="vertical" className="block h-9" />

        <div className={cn('flex flex-row items-center gap-2')}>
          <div className="bg-text-50 min-w-9 h-9 flex items-center justify-center rounded-sm">
            {providerImage ? (
              <Image src={providerImage} alt={providerName} width={30} height={30} />
            ) : (
              <ClusterGroupIcon className="w-6 h-6 text-text-950" />
            )}
          </div>

          <div className="flex flex-col items-start">
            <p className="body-1 font-bold">{cluster.version} </p>
            <p className="inline-1 text-text-500 text-nowrap ">Version</p>
          </div>
        </div>

        <Divider type="vertical" className=" block h-9" />

        <div className={cn('flex flex-row items-center  gap-2')}>
          <ClockDownloadTime className="w-9 h-9 p-1 rounded-sm text-text-500 bg-text-50" />

          <div className="flex flex-col  items-start">
            <p className="body-1 font-[400] ">Last Seen {formatAbbrevDistanceToNow(cluster.lastObserved)} </p>
          </div>
        </div>

        <div className=" hidden md:block "></div>
      </Container>
    </HorizontalScrollContainer>
  );
};

export default ClusterStatsPanel;
