import AddonCompatibilities from '@/app/(root)/clusters/[id]/upgrade-plan/AddonCompatibilities';
import AddonMutualInCompatibilities from '@/app/(root)/clusters/[id]/upgrade-plan/AddonMutualIncompatibilities';
import DeprecatedAPI from '@/app/(root)/clusters/[id]/upgrade-plan/DeprecatedAPI';
import { DeprecatedAPIDetail, MatchedComponent, MutualIncompatibilityEntry } from '@/types/upgradePlan';
import React from 'react';

type UpgradeCardContentProps = {
  matchingDeprecatedAPI: DeprecatedAPIDetail[];
  addonCompatibilities: MatchedComponent[];
  mutualIncompatibilities: MutualIncompatibilityEntry[];
  readOnly?: boolean;
};

const UpgradeCardContent = ({ matchingDeprecatedAPI, addonCompatibilities, mutualIncompatibilities, readOnly = false }: UpgradeCardContentProps) => {
  const hasDeprecatedAPI = matchingDeprecatedAPI.length > 0;
  const hasAddonCompatibilities = addonCompatibilities.length > 0;
  const hasMutualIncompatibilities = mutualIncompatibilities.length > 0;
  
  if (!hasDeprecatedAPI && !hasAddonCompatibilities && !hasMutualIncompatibilities) {
    return (
      <div className="text-text-500 text-sm py-4 text-center">
        No upgrade plan items selected
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {hasDeprecatedAPI && <DeprecatedAPI matchingDeprecatedAPI={matchingDeprecatedAPI} readOnly={readOnly} />}
      {hasAddonCompatibilities && <AddonCompatibilities addonCompatibilities={addonCompatibilities} readOnly={readOnly} />}
      {hasMutualIncompatibilities && <AddonMutualInCompatibilities mutualIncompatibilities={mutualIncompatibilities} readOnly={readOnly} />}
    </div>
  );
};

export default UpgradeCardContent;
