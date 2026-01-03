import Container from '@/components/Container';
import { Cluster } from '@/types/cluster';
import { useCallback, useMemo } from 'react';
import CountInfoPanel from './CountInfoPanel';
import ClusterStatsPanel from './ClusterStatsPanel';
import { BaseButton } from '../ui/base-button';
import Link from 'next/link';
import { getClusterVisualizationPath } from '@/app/(root)/clusters/urls';
import { DoubleSideArrowIcon } from '@/components/svgs/DoubleSideArrowIcon';
import VisualizationIcon from '../svgs/VisualizationIcon';
import usePersistSelectedCluster from '@/lib/hooks/usePersistSelectedCluster';
import { getPersistedFilters } from '@/lib/hooks/usePersistVisualizationFilters';

export type ClusterInfoStatsProps = {
  cluster: Cluster | null;
};

const ClusterInfoStats = ({ cluster }: ClusterInfoStatsProps) => {
  const { setSelectedCluster } = usePersistSelectedCluster();
  const persistedFilters = getPersistedFilters(cluster?.id || '');
  const clusterEntitiesCounts = useMemo(() => {
    return [
      {
        count: cluster?.stats?.numberOfNodes,
        label: 'Nodes',
        description: 'Total nodes',
      },
      {
        count: cluster?.stats?.numberOfNamespaces,
        label: 'Namespaces',
        description: 'Total namespaces',
      },
      {
        count: cluster?.stats?.numberOfPods,
        label: 'Pods',
        description: 'Total pods',
      },
      {
        count: cluster?.stats?.numberOfContainers,
        label: 'Containers',
        description: 'Total containers',
      },
    ];
  }, [cluster]);

  const onClickVisualization = useCallback(() => {
    setSelectedCluster(cluster?.id || '');
  }, [setSelectedCluster, cluster]);

  if (!cluster) {
    return null;
  }

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <Container className="h-12 flex flex-row items-center justify-between gap-3 flex-1">
        <div className="flex flex-row items-center gap-2">
          <DoubleSideArrowIcon className="w-5 h-5 text-primary-950" />

          <div className="body-1 text-[#6d6d6d]">
            <p className="text-body-2 text-primary-950 font-bold">{cluster?.name}</p>
          </div>
        </div>

        <div className="flex flex-row gap-3">
          <Link onClick={onClickVisualization} href={getClusterVisualizationPath(cluster.id, persistedFilters)}>
            <BaseButton variant="contained" color="essence" size="small" className="flex flex-row gap-1">
              <VisualizationIcon className="w-[14px] h-[14px]" />
              <p className="body-2 text-white ">Visualization</p>
            </BaseButton>
          </Link>
        </div>
      </Container>

      <CountInfoPanel items={clusterEntitiesCounts} />

      <ClusterStatsPanel cluster={cluster} />
    </div>
  );
};

export default ClusterInfoStats;
