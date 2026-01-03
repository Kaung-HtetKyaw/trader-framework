'use client';

import ClusterUpgradeButton from '@/components/ClusterUpgradeButton';
import SimpleSortableHeader from '@/components/SimpleTable/SimpleSortableHeader';
import { Cluster } from '@/types/cluster';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { ClusterGroupIcon } from '@/components/svgs/ClusterGroupIcon';
import ClusterRowActionMenu from '@/components/ClusterRowActionMenu';
import { formatAbbrevDistanceToNow } from '@/lib/time';
import { getProviderImage, getProviderName } from '@/lib/providers';
import TableContentTooltip from '@/components/TableContentTooltip';
import TableContentTooltipText from '@/components/TableContentTooltipText';
import { INDEX_COL_SIZE } from '@/components/SimpleTable';

export type ClusterWithIndex = Cluster & { index: number };

export const columns: ColumnDef<ClusterWithIndex>[] = [
  {
    id: 'index',
    maxSize: INDEX_COL_SIZE,
    minSize: INDEX_COL_SIZE,
    header: '#',
    cell: ({ row, column }) => (
      <p
        style={{
          width: `${column.getSize()}px`,
        }}
      >
        {row.original.index}
      </p>
    ),
  },
  {
    id: 'name',
    header: 'Name',
    minSize: 150,
    cell: ({ row, table }) => {
      return (
        <div className="flex flex-col row items-start justify-center truncate">
          <TableContentTooltip table={table} row={row} label={row.original.name}>
            <TableContentTooltipText>{row.original.name}</TableContentTooltipText>
          </TableContentTooltip>
          <p className="inline-1 text-[0.714rem] text-text-500 truncate max-w-full">
            {row.original.group?.toLowerCase() || ''}
          </p>
        </div>
      );
    },
  },
  {
    id: 'provider',
    header: 'Provider',
    minSize: 150,
    cell: ({ row }) => {
      const providerName = getProviderName(row.original.provider);
      const providerImage = getProviderImage(row.original.provider);

      return (
        <div className="flex items-center gap-2">
          <div className="bg-text-50 min-w-9 h-9 flex items-center justify-center rounded-sm">
            {providerImage ? (
              <Image src={providerImage} alt={providerName} width={30} height={30} />
            ) : (
              <ClusterGroupIcon className="w-6 h-6 text-text-950" />
            )}
          </div>
          <div className="flex flex-col items-center">
            <p className="body-2 text-text-950 font-[500] ">{providerName}</p>
          </div>
        </div>
      );
    },
  },
  {
    id: 'nodes',
    header: 'Nodes',
    minSize: 50,
    cell: ({ row }) => {
      return <p className="font-normal body-2">{row.original.stats?.numberOfNodes}</p>;
    },
  },
  {
    id: 'namespaces',
    header: 'Namespaces',
    minSize: 50,
    cell: ({ row }) => {
      return <p className="font-normal body-2">{row.original.stats?.numberOfNamespaces}</p>;
    },
  },
  {
    id: 'pods',
    header: 'Pods',
    minSize: 50,
    cell: ({ row }) => {
      return <p className="font-normal body-2">{row.original.stats?.numberOfPods}</p>;
    },
  },
  {
    id: 'lastObserved',
    minSize: 125,
    enableSorting: true,
    header: ({ column }) => {
      return <SimpleSortableHeader column={column}>Last Seen</SimpleSortableHeader>;
    },
    cell: ({ row }) => {
      return <p className="font-normal body-2 truncate">{formatAbbrevDistanceToNow(row.original.lastObserved)}</p>;
    },
  },
  {
    id: 'version',
    minSize: 100,
    header: ({ column }) => {
      return <SimpleSortableHeader column={column}>Version</SimpleSortableHeader>;
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const versionA = rowA.original.version;
      const versionB = rowB.original.version;

      // Extract version numbers and EKS hash
      const parseVersion = (version: string) => {
        const match = version.match(/v?(\d+)\.(\d+)\.(\d+)(?:-eks-([a-f0-9]+))?/);
        if (!match) return null;

        const [, major, minor, patch, eksHash] = match;
        return {
          major: parseInt(major, 10),
          minor: parseInt(minor, 10),
          patch: parseInt(patch, 10),
          eksHash: eksHash || '',
        };
      };

      const verA = parseVersion(versionA);
      const verB = parseVersion(versionB);

      // Handle invalid versions
      if (!verA && !verB) return 0;
      if (!verA) return 1;
      if (!verB) return -1;

      // Compare major versions
      if (verA.major !== verB.major) {
        return verA.major - verB.major;
      }

      // Compare minor versions
      if (verA.minor !== verB.minor) {
        return verA.minor - verB.minor;
      }

      // Compare patch versions
      if (verA.patch !== verB.patch) {
        return verA.patch - verB.patch;
      }

      // If versions are equal, compare EKS hashes
      return verA.eksHash.localeCompare(verB.eksHash);
    },
    cell: ({ row, table }) => {
      return (
        <div className="w-full truncate">
          <TableContentTooltip table={table} row={row} label={row.original.version}>
            <TableContentTooltipText className="font-normal body-2">{row.original.version}</TableContentTooltipText>
          </TableContentTooltip>
        </div>
      );
    },
  },
  {
    id: 'stats.numberOfUpgrades',
    minSize: 100,
    header: ({ column }) => {
      return <SimpleSortableHeader column={column}>Status</SimpleSortableHeader>;
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const valueA = rowA.original.stats?.numberOfUpgrades || 0;
      const valueB = rowB.original.stats?.numberOfUpgrades || 0;

      return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    },
    cell: ({ row }) => {
      return (
        <div onClick={e => e.stopPropagation()}>
          <ClusterUpgradeButton cluster={row.original} />
        </div>
      );
    },
  },
  {
    id: 'Actions',
    minSize: 100,
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <div onClick={e => e.stopPropagation()}>
          <ClusterRowActionMenu id={row.original.id} />
        </div>
      );
    },
  },
];
