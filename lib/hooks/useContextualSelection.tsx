'use client';

import { usePathname } from 'next/navigation';
import { selectedNodesCount } from '@/signals/visualiation/misc';
import { getSelectedObjectsCount } from '@/signals/tables/selection';
import { getUpgradePlanSelectionCount } from '@/signals/upgradePlan/selection';
import { useCallback, useMemo } from 'react';

/**
 * Hook that returns selection count based on the current page context
 * - On visualization pages: returns selected nodes count from visualization
 * - On upgrade-plan pages: returns upgrade plan selections count (deprecated APIs, addon incompatibilities)
 * - On cluster info pages: returns total table selections count (namespaces + pods + containers + nodes)
 *
 * Note: Does not call useSignals() - parent component should handle signal subscription
 */
export const useContextualSelection = () => {
  const pathname = usePathname();

  const isVisualizationPage = useMemo(() => pathname?.includes('/visualization'), [pathname]);
  const isUpgradePlanPage = useMemo(() => pathname?.includes('/upgrade-plan'), [pathname]);

  const getSelectionCount = useCallback(() => {
    if (isVisualizationPage) {
      return selectedNodesCount.value;
    }

    if (isUpgradePlanPage) {
      return getUpgradePlanSelectionCount();
    }

    return getSelectedObjectsCount();
  }, [isVisualizationPage, isUpgradePlanPage]);

  return {
    selectionCount: getSelectionCount(),
    hasSelection: getSelectionCount() > 0,
    isVisualizationPage,
    isUpgradePlanPage,
  };
};
