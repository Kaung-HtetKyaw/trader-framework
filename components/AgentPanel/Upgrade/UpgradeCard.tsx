import React, { useMemo, useState } from 'react';
import { NewVersionIcon } from '@/components/svgs/NewVersionIcon';
import { BaseButton } from '@/components/ui/base-button';

import UpgradeCardContent from './UpgradeCardContent';
import LoadingSpinner from '@/components/LoadingSpinner';
import { DeprecatedAPIDetail, MutualIncompatibilityEntry } from '@/types/upgradePlan';
import { useGetClusterDeprecatedAPIQuery, useGetInCompatibilitiesQuery } from '@/store/api/clusterApi';
import { compareVersions, getNextK8sMinorVersion } from '@/lib/utils';
import { upgradePlanSelectionSignal } from '@/signals/upgradePlan/selection';
import { useSignals } from '@preact/signals-react/runtime';
interface UpgradeCardProps {
  description: string;
  upgradeOnNodeId: string;
  onRefChange?: (element: HTMLDivElement | null) => void;
  showSelectedOnly?: boolean;
}

const UpgradeCard = ({ description, upgradeOnNodeId, onRefChange, showSelectedOnly = false }: UpgradeCardProps) => {
  useSignals();
  const [showPlan, setShowPlan] = useState(false);

  const { data: deprecations = [], isLoading: isDeprecationLoading } = useGetClusterDeprecatedAPIQuery(
    { clusterID: upgradeOnNodeId },
    { skip: !upgradeOnNodeId }
  );

  const matchingDeprecatedAPI: DeprecatedAPIDetail[] = useMemo(() => {
    return deprecations.filter(item => {
      const nextVersion = getNextK8sMinorVersion(item.clusterK8SVersion);
      return compareVersions(item.deprecatedIn, nextVersion) <= 0 && compareVersions(nextVersion, item.removedIn) < 0;
    });
  }, [deprecations]);

  const { data: resolverData, isLoading: isResolverLoading } = useGetInCompatibilitiesQuery(
    { clusterID: upgradeOnNodeId },
    { skip: !upgradeOnNodeId }
  );

  const addonCompatibilities = useMemo(
    () => resolverData?.matchedComponents?.filter(component => component.nextCompatible === false) ?? [],
    [resolverData?.matchedComponents]
  );

  const mutualIncompatibilities: MutualIncompatibilityEntry[] =
    resolverData?.matchedComponents?.flatMap(component => {
      const entries = Object.entries(component.mutualInCompatibles || {});
      return entries.map(([target, details]) => ({
        source: component.name,
        target,
        details,
      }));
    }) ?? [];

  const filteredDeprecatedAPI = useMemo(() => {
    if (!showSelectedOnly) return matchingDeprecatedAPI;

    const selections = upgradePlanSelectionSignal.value.deprecatedAPI ?? [];
    if (selections.length === 0) return []; // Hide section when no selections

    const selectedIds = new Set(selections.map(s => s.selectionId));
    return matchingDeprecatedAPI.filter(item => {
      const itemId = `${item.kind}-${item.name}-${item.currentGroupVersion}`;
      return selectedIds.has(itemId);
    });
  }, [showSelectedOnly, matchingDeprecatedAPI]);

  const filteredAddonCompatibilities = useMemo(() => {
    if (!showSelectedOnly) return addonCompatibilities;

    const selections = upgradePlanSelectionSignal.value.addonCompatibility ?? [];
    if (selections.length === 0) return [];
    const selectedIds = new Set(selections.map(s => s.selectionId));
    return addonCompatibilities.filter(item => {
      const itemId = `${item.name}-${item.version}`;
      return selectedIds.has(itemId);
    });
  }, [showSelectedOnly, addonCompatibilities]);

  const filteredMutualIncompatibilities = useMemo(() => {
    if (!showSelectedOnly) return mutualIncompatibilities;

    const selections = upgradePlanSelectionSignal.value.addonMutualIncompatibility ?? [];
    if (selections.length === 0) return [];

    const selectedIds = new Set(selections.map(s => s.selectionId));
    return mutualIncompatibilities.filter(item => {
      const itemId = `${item.source}-${item.target}`;
      return selectedIds.has(itemId);
    });
  }, [showSelectedOnly, mutualIncompatibilities]);

  //ui
  const isLoading = isDeprecationLoading || isResolverLoading;

  const togglePlan = () => {
    setShowPlan(prev => !prev);
  };

  return (
    <div ref={onRefChange} className="relative w-full">
      <div className="flex flex-col items-center justify-between w-full border border-text-200 rounded-lg bg-white p-[16px] gap-2">
        <div className="flex flex-row items-center gap-2 justify-between w-full">
          <span className="bg-secondary-50 text-secondary-500 font-normal px-2 py-1 rounded-lg text-sm flex items-center gap-2">
            <NewVersionIcon />
            Upgrade info
          </span>

          <BaseButton
            variant={showPlan ? 'outlined' : 'contained'}
            color="secondary"
            size="small"
            onClick={togglePlan}
            className="font-normal"
          >
            {showPlan ? 'Hide Plan' : 'Show Plan'}
          </BaseButton>
        </div>

        <div className="flex flex-col gap-2 w-full justify-between">
          <div className="text-text-950 text-sm leading-snug">{description}</div>
        </div>
      </div>

      {showPlan && (
        <div className="absolute top-full left-0 right-0 mt-2 border border-text-200 rounded-lg bg-white shadow-lg z-20 p-[16px] max-h-[500px] overflow-y-auto">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <UpgradeCardContent
              matchingDeprecatedAPI={filteredDeprecatedAPI}
              addonCompatibilities={filteredAddonCompatibilities}
              mutualIncompatibilities={filteredMutualIncompatibilities}
              readOnly={showSelectedOnly}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default UpgradeCard;
