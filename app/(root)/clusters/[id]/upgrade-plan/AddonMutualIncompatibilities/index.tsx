'use client';

import Chip from '@/components/Chip';
import Container from '@/components/Container';
import { ArrowRightIcon } from '@/components/svgs/ArrowRightIcon';
import { cn } from '@/lib/utils';
import { MutualIncompatibilityEntry } from '@/types/upgradePlan';
import { Checkbox } from '@/components/ui/checkbox';
import { useParams } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import {
  setUpgradePlanSelection,
  getUpgradePlanSelection,
  getUpgradePlanSelectionCount,
  isUpgradePlanItemSelected,
  upgradePlanSelectionSignal,
} from '@/signals/upgradePlan/selection';
import { useSignals } from '@preact/signals-react/runtime';
import config from '@/lib/config';
import { CustomToast } from '@/components/CustomToast';

interface Props {
  mutualIncompatibilities: MutualIncompatibilityEntry[];
  readOnly?: boolean;
}
const AddonMutualInCompatibilities = ({ mutualIncompatibilities, readOnly = false }: Props) => {
  useSignals();
  const { id: clusterId } = useParams<{ id: string }>();

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(() => {
    const selectedItems = getUpgradePlanSelection('addonMutualIncompatibility');
    return selectedItems.reduce((acc, item) => ({ ...acc, [item.selectionId]: true }), {});
  });

  const mutualIncompatibilitySelections = upgradePlanSelectionSignal.value.addonMutualIncompatibility;

  useEffect(() => {
    const selectedItems = getUpgradePlanSelection('addonMutualIncompatibility');
    const newSelection = selectedItems.reduce((acc, item) => ({ ...acc, [item.selectionId]: true }), {});
    setRowSelection(newSelection);
  }, [mutualIncompatibilitySelections]);

  const onLimitReached = useCallback(() => {
    CustomToast({
      type: 'error',
      message: `You can only select ${config.NEXT_PUBLIC_OBJECT_SELECTION_LIMIT} objects at a time`,
    });
  }, []);

  const isRowDisabled = useCallback(
    (id: string) => {
      return (
        getUpgradePlanSelectionCount() >= config.NEXT_PUBLIC_OBJECT_SELECTION_LIMIT &&
        !isUpgradePlanItemSelected('addonMutualIncompatibility', id)
      );
    },
    []
  );

  const handleCheckboxChange = (item: MutualIncompatibilityEntry, checked: boolean) => {
    const itemId = `${item.source}-${item.target}`;

    if (isRowDisabled(itemId) && checked) {
      onLimitReached();
      return;
    }

    const newSelection = { ...rowSelection, [itemId]: checked };
    if (!checked) {
      delete newSelection[itemId];
    }
    setRowSelection(newSelection);

    const selectedIds = Object.keys(newSelection).filter(key => newSelection[key]);
    const selectedItems = selectedIds
      .map(selectionId => {
        const foundItem = mutualIncompatibilities.find(
          mi => `${mi.source}-${mi.target}` === selectionId
        );
        if (!foundItem) return null;
        // Rename source to name and target to mutuallyIncompatibleComponent
        // Include version details from foundItem.details
        return {
          name: foundItem.source,
          mutuallyIncompatibleComponent: foundItem.target,
          currentVersion: foundItem.details.version,
          minMutualVersion: foundItem.details.minMutualVersion,
          maxMutualVersion: foundItem.details.maxMutualVersion,
          selectionId,
          clusterID: clusterId,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    setUpgradePlanSelection(clusterId, 'addonMutualIncompatibility', selectedItems);
  };
  return (
    <Container className="flex flex-col gap-4 p-0 h-full">
      <div className="flex flex-col gap-3">
        <p className="body-1 font-bold">
          {3}. {'Add-on mutual incompatibilities'}
        </p>
        <p className="body-2 ">{'Ensure all known third-party add-ons are supported on the next K8s version'}</p>
      </div>

      <Container className=" body-2 h-full flex flex-col border-[0.5px] border-text-200 rounded-sm  gap-6 bg-white">
        {mutualIncompatibilities.length === 0 ? (
          <p className="body-2 px-2 py-2">No mutual incompatibilities found.</p>
        ) : (
          mutualIncompatibilities.map((el, index) => {
            const itemId = `${el.source}-${el.target}`;
            const isDisabled = isRowDisabled(itemId);
            const isChecked = isUpgradePlanItemSelected('addonMutualIncompatibility', itemId);

            return (
              <div
                data-id={`${el.source}-${el.target}`}
                key={index}
                className={cn(
                  'border-b-text-200 border-b-[0.5px]',
                  'flex flex-col gap-2 pb-4',
                  index === mutualIncompatibilities.length - 1 && 'border-b-0 pb-0'
                )}
              >
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center gap-3">
                    {!readOnly && (
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={value => handleCheckboxChange(el, !!value)}
                        aria-label="Select addon mutual incompatibility"
                        className={cn(
                          'w-[1.125rem] h-[1.125rem] border border-text-200 rounded-[4px] data-[state=checked]:bg-primary-950 data-[state=checked]:text-text-50 shadow-none focus:shadow-none',
                          isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                        )}
                      />
                    )}
                    <p className="body-1">{`${el.source} is incompatible with ${el.target}`}</p>
                  </div>
                  <Chip className="bg-error-100">
                    <p className="body-2 text-warningAction-400">Incompatible</p>
                  </Chip>
                </div>
                <div className={cn("flex flex-row items-center justify-between", !readOnly && "ml-9")}>
                <div className="px-0 flex gap-3 items-center bg-transparent rounded-sm">
                  <Chip className="bg-text-50" label={el.details.version}>
                    <p className="body-2">
                      <span className="text-text-400">Current: </span>
                      <span>{el.details.version?.replace(/^v/, '') || 'unknown'}</span>
                    </p>
                  </Chip>

                  <div className="bg-text-50 rounded-sm p-[3px]">
                     <ArrowRightIcon className="w-4 h-4 text-secondary-500" />
                  </div>
                  <Chip className="bg-text-50" label={el.details.minMutualVersion}>
                    <p className="body-2">
                      <span className="text-text-400">Next: </span>
                      <span>{el.details.minMutualVersion || 'N/A'}</span>
                    </p>
                  </Chip>
                </div>
              </div>
              </div>
            );
          })
        )}
      </Container>
    </Container>
  );
};
export default AddonMutualInCompatibilities;
