'use client';

import { useMemo } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import ClusterVisualizationHeader from './ClusterVisualizationHeader';
import ClusterListHeader from './ClusterListHeader';
import DashboardHeader from './DashboardHeader';
import { usePathname } from 'next/navigation';
import DefaultHeader from './DefaultHeader';
import SettingsHeader from './SettingsHeader';
import AgentsHeader from './AgentsHeader';

export const HEADER_HEIGHT = 64;

export const HeaderPageTypes = {
  agents: 'agents',
  visualization: 'visualization',
  clusters: 'clusters',
  dashboard: 'dashboard',
  settings: 'settings',
  default: 'default',
} as const;
export type HeaderPageTypeEnum = keyof typeof HeaderPageTypes;

export const getHeaderPageType = (pathname: string): HeaderPageTypeEnum => {
  const isDashboardPage = pathname.startsWith('/dashboard');
  const isClustersPage = pathname.startsWith('/clusters');
  const isVisualizationPage = pathname.startsWith('/visualization');
  const isAgentspage = pathname.startsWith('/agents');
  const isSettingsPage = pathname.startsWith('/settings');

  if (isAgentspage) {
    return HeaderPageTypes.agents;
  }

  if (isVisualizationPage) {
    return HeaderPageTypes.visualization;
  }

  if (isClustersPage) {
    return HeaderPageTypes.clusters;
  }

  if (isDashboardPage) {
    return HeaderPageTypes.dashboard;
  }

  if (isSettingsPage) {
    return HeaderPageTypes.settings;
  }

  return HeaderPageTypes.default;
};

const Header = () => {
  useSignals();
  const pathname = usePathname();
  const headerPageType = useMemo(() => getHeaderPageType(pathname), [pathname]);

  const HeaderComponent = useMemo(() => {
    switch (headerPageType) {
      case HeaderPageTypes.agents:
        return <AgentsHeader />;
      case HeaderPageTypes.visualization:
        return <ClusterVisualizationHeader />;
      case HeaderPageTypes.clusters:
        return <ClusterListHeader />;
      case HeaderPageTypes.dashboard:
        return <DashboardHeader />;
      case HeaderPageTypes.settings:
        return <SettingsHeader />;
      case HeaderPageTypes.default:
        return <DefaultHeader />;
    }
  }, [headerPageType]);

  return HeaderComponent;
};

export default Header;
