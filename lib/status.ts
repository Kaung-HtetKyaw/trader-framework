import { ClusterStatusEnum } from '@/types/cluster';
import { CLUSTER_STATUS_COLORS, CLUSTER_STATUSES } from './config';
import tailwindConfig from '@/tailwind.config';

export const getColorByClusterStatus = (status: ClusterStatusEnum) => {
  return (
    CLUSTER_STATUS_COLORS[status] ?? {
      color: tailwindConfig.theme.extend.colors.secondary[100],
      hover: tailwindConfig.theme.extend.colors.secondary[200],
      dark: tailwindConfig.theme.extend.colors.secondary[900],
      darkHover: tailwindConfig.theme.extend.colors.secondary[800],
      light: tailwindConfig.theme.extend.colors.text[50],
    }
  );
};

export const getColorByClusterHealth = (health: number) => {
  if (health >= 80) return CLUSTER_STATUS_COLORS.HEALTHY;
  if (health < 80 && health >= 50) return CLUSTER_STATUS_COLORS.UNHEALTHY;
  return CLUSTER_STATUS_COLORS.AT_RISK;
};

export const getHealthStatusByClusterHealth = (health: number) => {
  if (health >= 80) return CLUSTER_STATUSES.HEALTHY;
  if (health < 80 && health >= 50) return CLUSTER_STATUSES.UNHEALTHY;
  return CLUSTER_STATUSES.AT_RISK;
};

export const getStatusColorByDeprecatedCount = (deprecatedCount: number) => {
  if (deprecatedCount > 0) return CLUSTER_STATUS_COLORS.UNHEALTHY.medium;
  return tailwindConfig.theme.extend.colors.success[600];
};

export const getClusterStatusByNumberOfUpgrades = (numberOfUpgrades: number) => {
  if (numberOfUpgrades === 0) return CLUSTER_STATUSES.HEALTHY;
  if (numberOfUpgrades >= 1 && numberOfUpgrades <= 4) return CLUSTER_STATUSES.AT_RISK;
  return CLUSTER_STATUSES.UNHEALTHY;
}

export const getClusterHealthPercentageByNumberOfUpgrades = (numberOfUpgrades: number): number => {
  const status = getClusterStatusByNumberOfUpgrades(numberOfUpgrades);

  switch (status) {
    case CLUSTER_STATUSES.UNHEALTHY:
      return getRandomNumberInRange(10, 20);
    case CLUSTER_STATUSES.AT_RISK:
      return getRandomNumberInRange(30, 60);
    case CLUSTER_STATUSES.HEALTHY:
    default:
      return getRandomNumberInRange(70, 100);
  }
};

const getRandomNumberInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

