import { Cluster, ClusterGroupData, ClusterGroupWithStats } from '@/types/cluster';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getClusterStatusByNumberOfUpgrades } from '../status';
import { UsageMeterSegment } from '@/components/ClusterInfo/CPUMemUsage';
export { stringify as stringifyQs, parse as parseQs } from 'qs';
import { v4 as uuidv4 } from 'uuid';
import { GitProvider } from '@/types/gitOps';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getInitials = (name: string): string =>
  name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

export const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getHoverProps = <T extends HTMLElement>({ color, hoverColor }: { color: string; hoverColor: string }) => {
  return {
    onMouseEnter: (e: React.MouseEvent<T>) => {
      e.currentTarget.style.backgroundColor = hoverColor;
    },
    onMouseLeave: (e: React.MouseEvent<T>) => {
      e.currentTarget.style.backgroundColor = color;
    },
  };
};

export const getNextK8sVersion = (version: string): string => {
  const parts = version.replace(/^v/, '').split('.');

  const major = parseInt(parts[0], 10);
  const minor = parseInt(parts[1], 10);

  // If patch version is missing, default it to 0
  //const patch = parts[2] ? parseInt(parts[2], 10) : 0;

  // Increment minor, reset patch to 0
  const nextMinor = minor + 1;
  const nextPatch = 0;

  return `v${major}.${nextMinor}.${nextPatch}`;
};

export const getNextK8sMinorVersion = (version: string): string => {
  const parts = version.replace(/^v/, '').split('.');
  const major = parseInt(parts[0], 10);
  const minor = parseInt(parts[1], 10);
  return `v${major}.${minor + 1}.0`;
};

export const compareVersions = (a: string, b: string): number => {
  const parse = (v: string) => v.replace(/^v/, '').split('.').map(Number);
  const [aMajor, aMinor = 0, aPatch = 0] = parse(a);
  const [bMajor, bMinor = 0, bPatch = 0] = parse(b);

  if (aMajor !== bMajor) return aMajor - bMajor;
  if (aMinor !== bMinor) return aMinor - bMinor;
  return aPatch - bPatch;
};
export const generateRandomString = (length: number): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const randomBytes = new Uint8Array(length);

  // Using crypto.getRandomValues() for cryptographically secure random numbers
  crypto.getRandomValues(randomBytes);

  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset[randomBytes[i] % charset.length];
  }

  return `kg_${result}`;
};

export const mapClustersToFrontendGroups = (
  groups: ClusterGroupData[] = [],
  clusters: Cluster[] = []
): ClusterGroupWithStats[] => {
  if (!Array.isArray(groups) || !Array.isArray(clusters)) {
    console.error('Invalid input: Expected arrays for groups and clusters');
    return [];
  }

  const groupMap = new Map<string, ClusterGroupWithStats>(
    groups.map(g => [
      g.id,
      {
        id: g.id,
        name: g.name,
        total: 0,
        healthy: 0,
        atRisk: 0,
        unhealthy: 0,
        noOfClustersNeedsUpgrades: 0,
        clusters: [],
      },
    ])
  );

  for (const cluster of clusters) {
    const groupId = cluster.clusterGroupID;

    // If group ID doesn't exist in groupMap, this is a data integrity issue
    const group = groupMap.get(groupId);

    if (!group) {
      console.warn(`Cluster ${cluster.id} has unknown clusterGroupID: ${groupId}`);
      continue; // optionally throw or skip
    }

    group.clusters.push(cluster);
    group.total += 1;

    const status = getClusterStatusByNumberOfUpgrades(cluster.stats?.numberOfUpgrades ?? 0);
    switch (status) {
      case 'HEALTHY':
        group.healthy += 1;
        break;
      case 'AT_RISK':
        group.atRisk += 1;
        break;
      case 'UNHEALTHY':
        group.unhealthy += 1;
        break;
    }

    if ((cluster.stats?.numberOfUpgrades ?? 0) > 0) {
      group.noOfClustersNeedsUpgrades += 1;
    }
  }

  return Array.from(groupMap.values());
};

export const isDefaultClusterGroup = (groupName: string) => {
  return groupName.toLowerCase() === 'default';
};

export const noop = () => {};

export const bytesToDecimalGB = (bytes: number | string, digits = 2): number => {
  const b = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
  if (isNaN(b)) return NaN;
  const gb = b / 1e9;
  return Number(gb.toFixed(digits));
};

export const getCpuMetrics = (cluster: Cluster | undefined): UsageMeterSegment[] => [
  {
    type: 'current usage',
    value: Number(cluster?.stats?.totalCPUUsageAcrossNode ?? 0),
    unit: 'Cores',
    color: 'bg-essence-500',
  },
  {
    type: 'request',
    value: Number(cluster?.stats?.sumCPURequest ?? 0),
    unit: 'Cores',
    color: 'bg-primary-800',
  },
  {
    type: 'limit',
    value: Number(cluster?.stats?.sumCPULimit ?? 0),
    unit: 'Cores',
    color: 'bg-primary-500',
  },
  {
    type: 'full size',
    value: Number(cluster?.stats?.totalAvailableCPUAcrossNodes ?? 0),
    unit: 'Cores',
    color: 'bg-primary-950',
  },
];

export const getMemMetrics = (cluster: Cluster | undefined): UsageMeterSegment[] => [
  {
    type: 'current usage',
    value: bytesToDecimalGB(cluster?.stats?.totalMemUsageAcrossNode ?? 0),
    unit: 'GB',
    color: 'bg-essence-500',
  },
  {
    type: 'request',
    value: bytesToDecimalGB(cluster?.stats?.sumMemRequest ?? 0),
    unit: 'GB',
    color: 'bg-primary-800',
  },
  {
    type: 'limit',
    value: bytesToDecimalGB(cluster?.stats?.sumMemLimit ?? 0),
    unit: 'GB',
    color: 'bg-primary-500',
  },

  {
    type: 'full size',
    value: bytesToDecimalGB(cluster?.stats?.totalAvailableMemAcrossNodes ?? 0),
    unit: 'GB',
    color: 'bg-primary-950',
  },
];

export const getCeiledModulo = (value: number, modulo: number): number => {
  const decimalPart = value % 1;

  // Check if decimal part when multiplied by 10 has remainder 9
  if (Math.floor(decimalPart * 10) % 10 === modulo) {
    return Math.ceil(value);
  }
  return value;
};

export type HighlightedPart = {
  text: string;
  isMatch: boolean;
};

export function getHighlightedParts(label: string, search: string): HighlightedPart[] {
  if (!search?.trim()) return [{ text: label, isMatch: false }];

  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedSearch})`, 'gi');

  return label.split(regex).map(part => ({
    text: part,
    isMatch: part.toLowerCase() === search.toLowerCase(),
  }));
}
export const getUniqueId = () => uuidv4();

export const getTimeAgo = (timestamp: number): string => {
  const diffInSeconds = Math.floor((Date.now() - timestamp) / 1000);
  const minutes = Math.floor(diffInSeconds / 60);
  const seconds = diffInSeconds % 60;

  const minStr = minutes > 0 ? `${minutes}min` : '';
  const secStr = `${seconds}sec`;

  return `${minStr} ${secStr} ago`.trim();
};

export const truncateString = (input: string, max: number) => {
  if (max < 0) {
    throw new Error('Max must be a non-negative number');
  }

  if (input.length <= max) {
    return input;
  }

  return input.substring(0, max) + '...';
};

export const getPATFromProvider = (provider: GitProvider | null) => {
  if (!provider) return null;

  return provider.personalAccessTokens?.[0];
};

export const getUnixTimestamp = (date: string): number => {
  return Math.floor(new Date(date).getTime() / 1000);
};
