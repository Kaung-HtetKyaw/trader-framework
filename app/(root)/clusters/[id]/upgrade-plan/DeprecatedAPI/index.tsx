'use client';

import Chip from '@/components/Chip';
import Container from '@/components/Container';
import { ArrowRightIcon } from '@/components/svgs/ArrowRightIcon';
import { cn } from '@/lib/utils';
import type { DeprecatedAPIDetail } from '@/types/upgradePlan';
import { Checkbox } from '@/components/ui/checkbox';
import { useParams } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import {
  upgradePlanSelectionSignal,
  setUpgradePlanSelection,
  getUpgradePlanSelection,
  getUpgradePlanSelectionCount,
  isUpgradePlanItemSelected,
} from '@/signals/upgradePlan/selection';
import { useSignals } from '@preact/signals-react/runtime';
import config from '@/lib/config';
import { CustomToast } from '@/components/CustomToast';

type Props = {
  matchingDeprecatedAPI: DeprecatedAPIDetail[];
  readOnly?: boolean;
};

const DeprecatedAPI = ({ matchingDeprecatedAPI, readOnly = false }: Props) => {
  useSignals();
  const { id: clusterId } = useParams<{ id: string }>();

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(() => {
    const selectedItems = getUpgradePlanSelection('deprecatedAPI');
    return selectedItems.reduce((acc, item) => ({ ...acc, [item.selectionId]: true }), {});
  });

  const deprecatedAPISelections = upgradePlanSelectionSignal.value.deprecatedAPI;

  useEffect(() => {
    const selectedItems = getUpgradePlanSelection('deprecatedAPI');
    const newSelection = selectedItems.reduce((acc, item) => ({ ...acc, [item.selectionId]: true }), {});
    setRowSelection(newSelection);
  }, [deprecatedAPISelections]);

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
        !isUpgradePlanItemSelected('deprecatedAPI', id)
      );
    },
    []
  );

  const handleCheckboxChange = (item: DeprecatedAPIDetail, checked: boolean) => {
    const itemId = `${item.kind}-${item.name}-${item.currentGroupVersion}`;

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
        const foundItem = matchingDeprecatedAPI.find(
          api => `${api.kind}-${api.name}-${api.currentGroupVersion}` === selectionId
        );
        if (!foundItem) return null;
        return {
          ...foundItem,
          selectionId,
          clusterID: clusterId,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    setUpgradePlanSelection(clusterId, 'deprecatedAPI', selectedItems);
  };

  return (
    <Container className="flex flex-col gap-4 p-0 h-full">
      <div className="flex flex-col gap-3">
        <p className="body-1 font-bold">
          {1}. {'API deprecations'}
        </p>
        <p className="body-2">Ensure that all K8s YAML you&apos;re deploying are conformant with the next K8s version</p>
      </div>

      <Container
        className={cn(' body-2 h-full flex flex-col border-[0.5px] border-text-200 rounded-sm  gap-6 bg-white')}
      >
        {matchingDeprecatedAPI.length === 0 ? (
          <p className="body-2 px-2 py-2">No deprecated APIs found for the next Kubernetes upgrade.</p>
        ) : (
          matchingDeprecatedAPI.map((el, index) => {
            const itemId = `${el.kind}-${el.name}-${el.currentGroupVersion}`;
            const isDisabled = isRowDisabled(itemId);
            const isChecked = isUpgradePlanItemSelected('deprecatedAPI', itemId);

            return (
              <div
                data-id={el.kind + el.currentGroupVersion}
                key={index}
                className={cn(
                  'border-b-text-200 border-b-[0.5px]',
                  'flex flex-col gap-2 pb-4',
                  index === matchingDeprecatedAPI.length - 1 && 'border-b-0 pb-0'
                )}
              >
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center gap-3">
                    {!readOnly && (
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={value => handleCheckboxChange(el, !!value)}
                        aria-label="Select deprecated API"
                        className={cn(
                          'w-[1.125rem] h-[1.125rem] border border-text-200 rounded-[4px] data-[state=checked]:bg-primary-950 data-[state=checked]:text-text-50 shadow-none focus:shadow-none',
                          isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                        )}
                      />
                    )}
                    <p className="body-1">{`${el.kind} - ${el.name}/${el.currentGroupVersion}`}</p>
                  </div>
                  <Chip className="bg-error-100">
                    <p className="body-2 text-warningAction-400">Deprecated</p>
                  </Chip>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <div className={cn("px-0 flex gap-3 items-center bg-transparent rounded-sm", !readOnly && "ml-9")}>
                    <Chip className="bg-text-50" label={el.currentGroupVersion}>
                      <p className="body-2">
                        <span className="text-text-400">Current: </span>
                        <span>{el.currentGroupVersion}</span>
                      </p>
                    </Chip>

                    <div className="bg-text-50 rounded-sm p-[3px]">
                      <ArrowRightIcon className="w-4 h-4 text-secondary-500" />
                    </div>
                    <Chip className="bg-text-50" label={el.replacementVersion}>
                      <p className="body-2">
                        <span className="text-text-400">Next: </span>
                        <span>{el.replacementVersion || 'N/A'}</span>
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

export default DeprecatedAPI;
