import { getClusterVisualizationPath, getDefaultVisualizationPath } from '@/app/(root)/clusters/urls';
import { ClusterIcon } from '@/components/svgs/ClusterIcon';
import { DashboardIcon } from '@/components/svgs/DashboardIcon';
import { SettingsIcon } from '@/components/svgs/SettingsIcon';
import VisualizationIcon from '@/components/svgs/VisualizationIcon';
import StackedLayersIcon from '@/components/svgs/StackedLayersIcon';
import { UseAbilityType } from '@/lib/authorization/casl/AbilityProvider';
import { VisualizationListFilterParams } from '@/types/visualization/list';

export type SidebarLink = {
  img: React.ComponentType<{ className?: string; alt?: string }>;
  route: string;
  text: string;
  enabled: boolean;
};

export const getSidebarLinks = (
  ability: UseAbilityType,
  selectedCluster?: string,
  selectedFilters?: VisualizationListFilterParams
): SidebarLink[] => [
  {
    img: DashboardIcon,
    route: '/dashboard',
    text: 'Dashboard',
    enabled: ability.can('list', 'clusters') && ability.can('list', 'cluster_groups'),
  },
  {
    img: ClusterIcon,
    route: '/clusters',
    text: 'Clusters',
    enabled: ability.can('list', 'clusters'),
  },
  {
    img: VisualizationIcon,
    route: selectedCluster
      ? getClusterVisualizationPath(selectedCluster, selectedFilters)
      : getDefaultVisualizationPath(),
    text: 'Visualization',
    enabled: true,
  },
  {
    img: StackedLayersIcon,
    route: '/agents',
    text: 'Agents',
    enabled: true,
  },
  {
    img: SettingsIcon,
    route: '/settings',
    text: 'Settings',
    enabled: true,
  },
];

export const alerts = [
  {
    title: 'Welcome!',
    content:
      'Start on the Dashboard view to get a better understanding of your cluster groups, their health status and possible updates.\n\nClick anywhere inside a cluster group to continue.',
  },
];

export const FIELD_NAMES = {
  fullName: 'Full name',
  email: 'Email',
  password: 'Password',
  confirmPassword: 'Confirm Password',
};

export const FIELD_TYPES = {
  fullName: 'text',
  email: 'email',
  password: 'password',
  confirmPassword: 'password',
};

export const INFO_TYPE = {
  error: 'ERROR',
  success: 'SUCCESS',
  info: 'INFO',
};

export const INFO_IMAGES: Record<string, string> = {
  [INFO_TYPE.error]: '/icons/error-icon.svg',
  [INFO_TYPE.success]: '/icons/success-icon.svg',
  [INFO_TYPE.info]: '/icons/info-icon.svg',
};

export const CLUSTER_INFO_LAYOUT_PADDING_Y = 16;
