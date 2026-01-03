import { DeprecatedAPIDetail, MatchedComponent, MutualIncompatible } from './api';

// Upgrade Plan Item Types
export type UpgradePlanItemType = 'deprecatedAPI' | 'addonCompatibility' | 'addonMutualIncompatibility';

export interface MutualIncompatibilityEntry {
  source: string;
  target: string;
  details: MutualIncompatible;
}

// Selection-Enhanced Types (for UI state)
export interface SelectedDeprecatedAPIItem extends DeprecatedAPIDetail {
  selectionId: string;
  clusterID: string;
}

export interface SelectedAddonCompatibilityItem extends Omit<MatchedComponent, 'mutualInCompatibles'> {
  selectionId: string;
  clusterID: string;
}

export interface SelectedAddonMutualIncompatibilityItem {
  name: string;
  mutuallyIncompatibleComponent: string;
  currentVersion: string;
  minMutualVersion: string;
  maxMutualVersion: string;
  selectionId: string;
  clusterID: string;
}

export type SelectedUpgradePlanItem =
  | SelectedDeprecatedAPIItem
  | SelectedAddonCompatibilityItem
  | SelectedAddonMutualIncompatibilityItem;

// Selection State Management Types
export type UpgradePlanItemTypeMap = {
  deprecatedAPI: SelectedDeprecatedAPIItem;
  addonCompatibility: SelectedAddonCompatibilityItem;
  addonMutualIncompatibility: SelectedAddonMutualIncompatibilityItem;
};

export type UpgradePlanSelectionState = {
  deprecatedAPI: SelectedDeprecatedAPIItem[];
  addonCompatibility: SelectedAddonCompatibilityItem[];
  addonMutualIncompatibility: SelectedAddonMutualIncompatibilityItem[];
};
