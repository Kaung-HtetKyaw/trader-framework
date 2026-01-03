import { Cluster } from '@/types/cluster';
import { useMemo } from 'react';
import { BaseButton } from './ui/base-button';
import { useRouter } from 'next/navigation';
import { cn, getHoverProps } from '@/lib/utils';
import { getColorByClusterStatus } from '@/lib/status';
import { WarningIcon } from '@/components/svgs/WarningIcon';
export type ClusterUpgradeButtonProps = {
  cluster: Cluster;
};

const ClusterUpgradeButton = (props: ClusterUpgradeButtonProps) => {
  const { cluster } = props;
  const router = useRouter();

  const numberOfUpgrades = useMemo(() => {
    return cluster.stats?.numberOfUpgrades || 0;
  }, [cluster]);

  const label = useMemo(() => {
    if (numberOfUpgrades > 0) {
      return 'Upgrades';
    }

    return 'No Upgrades';
  }, [numberOfUpgrades]);

  const variant = useMemo(() => {
    if (numberOfUpgrades === 0) {
      return 'outlined';
    }
    return 'contained';
  }, [numberOfUpgrades]);

  const handleUpgradeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/clusters/${cluster.id}/upgrade-plan`);
  };

  const color = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    return getColorByClusterStatus(cluster.stats?.status!);
  }, [cluster.stats?.status]);

  return (
    <BaseButton
      className={cn('h-8 w-[8.75rem] rounded-sm')}
      {...(numberOfUpgrades > 0 && getHoverProps({ color: color.medium, hoverColor: color.mediumHover }))}
      style={{ backgroundColor: numberOfUpgrades > 0 ? color.medium : 'transparent' }}
      variant={variant}
      size="medium"
      onClick={handleUpgradeClick}
    >
      {numberOfUpgrades > 0 && <WarningIcon className="w-4 h-4 text-text-50" />}

      <p className="body-2 font-normal">
        <span>
          {label} {numberOfUpgrades >= 10 ? `9+` : numberOfUpgrades || ''}
        </span>
      </p>
    </BaseButton>
  );
};

export default ClusterUpgradeButton;
