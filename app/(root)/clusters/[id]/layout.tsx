'use client';

import type React from 'react';
import Container from '@/components/Container';
import { useParams, usePathname } from 'next/navigation';
import LoadingContainer from '@/components/LoadingContainer';
import {
  getClusterContainersPath,
  getClusterEventsPath,
  getClusterManagePath,
  getClusterNamespacesPath,
  getClusterNodesPath,
  getClusterPodsPath,
  getClusterUpgradePlanPath,
  isClusterManagepath,
  isEventsPath,
  isUpgradePlanPath,
  isVisualizationPath,
} from '../urls';
import { useMemo, useEffect } from 'react';
import CPUMemUsage, { ClusterMetrics, ClusterMetricsType } from '@/components/ClusterInfo/CPUMemUsage';
import ClusterInfoStats from '@/components/ClusterInfo/ClusterInfoStats';
import { useEnrichedCluster } from '@/lib/hooks/useEnrichedClusters';
import { useAbility } from '@/lib/authorization/casl/AbilityProvider';
import Can from '@/lib/authorization/casl/Can';
import { bytesToDecimalGB, cn, getCpuMetrics, getMemMetrics } from '@/lib/utils';
import useSetSelectCluster from '@/lib/hooks/useSetSelectCluster';
import { clearUpgradePlanSelections } from '@/signals/upgradePlan/selection';
import AgentPanelChatDrawer from '@/components/AgentPanel/AgentPanelChatDrawer';
import { clearSelections } from '@/signals/tables/selection';
import SegmentedTabs from '@/components/SegmentedTabs';
import ViewportContainer from '@/components/ViewportContainer';
import { useSignals } from '@preact/signals-react/runtime';
import {
  getCivLayoutWidth,
  getCIVLayoutWidthFromWindow,
  getIsSidebarCollapsed,
  setCivLayoutWidth,
} from '@/signals/global/misc';
import { useEventListener } from '@/lib/hooks/useEventListener';
import { CLUSTER_INFO_LAYOUT_PADDING_Y } from '@/constants';

const currentCPUUsage = 0;
const currentMemUsage = 0;

export default function ClustersLayout({ children }: { children: React.ReactNode }) {
  useSignals();
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();
  const ability = useAbility();

  const { cluster, isLoading } = useEnrichedCluster(id, {
    skip: !ability.can('find', 'clusters'),
  });

  useSetSelectCluster(cluster?.name || '');

  useEventListener('resize', () => {
    setCivLayoutWidth(getCIVLayoutWidthFromWindow(getIsSidebarCollapsed()));
  });

  // NOTE: using useEffect with an empty dependency array because load event by useEventListener may not fire if the component mounts after the page has loaded.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCivLayoutWidth(getCIVLayoutWidthFromWindow(getIsSidebarCollapsed()));
    }, 100);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (id) {
        clearSelections();
        clearUpgradePlanSelections();
      }
    };
  }, [id]);

  const segmentedMenus = useMemo(
    () => [
      {
        label: 'Namespaces',
        getHref: () => getClusterNamespacesPath(id),
        isActive: (pathname: string) => pathname.split('/').length < 4 || pathname.split('/')[3] === 'namespaces',
        enabled: true,
      },
      {
        label: 'Pods',
        getHref: () => getClusterPodsPath(id),
        isActive: (pathname: string) => pathname.split('/')[3] === 'pods',
        enabled: true,
      },
      {
        label: 'Containers',
        getHref: () => getClusterContainersPath(id),
        isActive: (pathname: string) => pathname.split('/')[3] === 'containers',
        enabled: true,
      },
      {
        label: 'Events',
        getHref: () => getClusterEventsPath(id),
        isActive: (pathname: string) => pathname.split('/')[3] === 'events',
        enabled: true,
      },
      {
        label: 'Nodes',
        getHref: () => getClusterNodesPath(id),
        isActive: (pathname: string) => pathname.split('/')[3] === 'nodes',
        enabled: true,
      },
      {
        label: 'Upgrade',
        getHref: () => getClusterUpgradePlanPath(id),
        isActive: (pathname: string) => pathname.split('/')[3] === 'upgrade-plan',
        enabled: true,
      },
      ...(ability.can('delete', 'clusters')
        ? [
            {
              label: 'Manage',
              getHref: () => getClusterManagePath(id),
              isActive: (pathname: string) => pathname.split('/')[3] === 'manage',
              enabled: true,
            },
          ]
        : []),
    ],
    [ability, id]
  );

  const cpuMetrics = useMemo(() => getCpuMetrics(cluster), [cluster]);
  const memMetrics = useMemo(() => getMemMetrics(cluster), [cluster]);

  const totalCPU = Number(cluster?.stats?.totalAvailableCPUAcrossNodes ?? 0);
  const totalMem = bytesToDecimalGB(cluster?.stats?.totalAvailableMemAcrossNodes ?? 0);

  const cpuPercentage = useMemo(() => (totalCPU ? (Number(currentCPUUsage) / totalCPU) * 100 : 0), [totalCPU]);

  const memPercentage = useMemo(
    () => (totalMem ? Math.round((Number(currentMemUsage) / totalMem) * 10000) / 100 : 0),
    [totalMem]
  );

  const usageMetrics: Record<ClusterMetricsType, ClusterMetrics> = {
    cpu: {
      title: 'CPU',
      description: 'CPU Usage',
      metrics: cpuMetrics,
      percentage: cpuPercentage,
    },
    memory: {
      title: 'Memory',
      description: 'Memory Usage',
      metrics: memMetrics,
      percentage: memPercentage,
    },
  };

  const shouldUseViewportContainer = useMemo(() => {
    return isClusterManagepath(pathname) || isUpgradePlanPath(pathname) || isEventsPath(pathname);
  }, [pathname]);

  if (isVisualizationPath(pathname)) {
    return children;
  }

  return (
    <Can do="find" on="clusters">
      <LoadingContainer isLoading={isLoading} className="min-h-screen h-screen overflow-hidden">
        <div className="flex flex-row h-full overflow-y-visible overflow-x-hidden vertical-scroll-container">
          <div className={cn("h-full max-h-full", isEventsPath(pathname) || isUpgradePlanPath(pathname) || isClusterManagepath(pathname) ? "overflow-hidden" : "overflow-y-auto scroll-container")}>
            <div
              id="testing-id"
              style={{ width: getCivLayoutWidth() ? `${getCivLayoutWidth()}px` : 'auto' }}
              className="flex flex-col h-full"
            >
              <div className="grid grid-cols-12 gap-3 p-4">
                <div className="col-span-12 xl:col-span-7">
                  <ClusterInfoStats cluster={cluster ?? null} />
                </div>

                <Container className="col-span-12 xl:col-span-5 px-5 py-4">
                  <CPUMemUsage usageMetrics={usageMetrics} />
                </Container>
              </div>

              <div className="flex min-h-fit px-4 py-0 pb-3 flex-1">
                <Container className="flex w-full h-full py-0 px-0">
                  <SegmentedTabs menus={segmentedMenus}>
                    {shouldUseViewportContainer ? (
                      <ViewportContainer
                        style={{
                          paddingTop: `${CLUSTER_INFO_LAYOUT_PADDING_Y}px`,
                          paddingBottom: `${CLUSTER_INFO_LAYOUT_PADDING_Y}px`,
                        }}
                        className={cn(
                          'flex-1 min-w-0',
                          isUpgradePlanPath(pathname)
                            ? 'overflow-y-auto'
                            : isEventsPath(pathname)
                              ? 'overflow-hidden'
                              : 'overflow-x-auto overflow-y-auto horizontal-scroll-container '
                        )}
                        offset={16}
                        type="default"
                      >
                        <div className={cn("h-full", isEventsPath(pathname) ? "flex flex-col" : "")}>{children}</div>
                      </ViewportContainer>
                    ) : (
                      <div
                        style={{
                          paddingTop: `${CLUSTER_INFO_LAYOUT_PADDING_Y}px`,
                          paddingBottom: `${CLUSTER_INFO_LAYOUT_PADDING_Y}px`,
                        }}
                        className={cn(
                          'w-full flex-1 min-w-0',
                          isUpgradePlanPath(pathname)
                            ? 'overflow-y-auto'
                            : isEventsPath(pathname)
                              ? 'overflow-hidden'
                              : 'overflow-x-auto overflow-y-auto horizontal-scroll-container '
                        )}
                      >
                        <div className={cn("h-full", isEventsPath(pathname) ? "flex flex-col" : "")}>{children}</div>
                      </div>
                    )}
                  </SegmentedTabs>
                </Container>
              </div>
            </div>
          </div>

          <div className="border-l border-l-text-200 h-full flex w-20 min-w-20">
            <AgentPanelChatDrawer />
          </div>
        </div>
      </LoadingContainer>
    </Can>
  );
}
