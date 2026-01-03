import { deepSignal } from '@preact-signals/utils';
import type {
  UpgradePlanItemType,
  SelectedUpgradePlanItem,
  UpgradePlanItemTypeMap,
  UpgradePlanSelectionState,
} from '@/types/upgradePlan';

/**
 * UpgradePlanState manages selections for upgrade plan items (deprecated APIs, addon incompatibilities, etc.)
 * This is separate from table selections to maintain independent selection state for upgrade planning
 *
 * Note: Selections are scoped per cluster and cleared when navigating away from a cluster
 */

export const upgradePlanSelectionSignal = deepSignal<UpgradePlanSelectionState>({
  deprecatedAPI: [],
  addonCompatibility: [],
  addonMutualIncompatibility: [],
});

export const getUpgradePlanSelectionCount = () => {
  return (
    upgradePlanSelectionSignal.value.deprecatedAPI.length +
    upgradePlanSelectionSignal.value.addonCompatibility.length +
    upgradePlanSelectionSignal.value.addonMutualIncompatibility.length
  );
};

export const setUpgradePlanSelection = <T extends UpgradePlanItemType>(
  clusterId: string,
  itemType: T,
  selectedItems: UpgradePlanItemTypeMap[T][]
) => {
  if (!clusterId) {
    console.warn('[UpgradePlanSelection] Cannot set selection: clusterId is required');
    return;
  }

  if (!selectedItems) {
    console.warn('[UpgradePlanSelection] Cannot set selection: selectedItems is required');
    return;
  }

  const currentSelection = upgradePlanSelectionSignal.value[itemType];

  // Skip update if reference is the same or contents are equal
  if (currentSelection === selectedItems || areSelectionsEqual(currentSelection, selectedItems)) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (upgradePlanSelectionSignal.value as any)[itemType] = selectedItems;
};

export const getUpgradePlanSelection = <T extends UpgradePlanItemType>(itemType: T): UpgradePlanItemTypeMap[T][] => {
  return upgradePlanSelectionSignal.value[itemType] as UpgradePlanItemTypeMap[T][];
};

export const clearUpgradePlanSelections = () => {
  upgradePlanSelectionSignal.value.deprecatedAPI = [];
  upgradePlanSelectionSignal.value.addonCompatibility = [];
  upgradePlanSelectionSignal.value.addonMutualIncompatibility = [];
};

export const isUpgradePlanItemSelected = (itemType: UpgradePlanItemType, itemId: string) => {
  const selection = getUpgradePlanSelection(itemType);
  return selection.some(item => item.selectionId === itemId);
};

function areSelectionsEqual(arr1: SelectedUpgradePlanItem[], arr2: SelectedUpgradePlanItem[]): boolean {
  if (arr1.length !== arr2.length) return false;

  const ids1 = new Set(arr1.map(item => item.selectionId));
  return arr2.every(item => ids1.has(item.selectionId));
}
