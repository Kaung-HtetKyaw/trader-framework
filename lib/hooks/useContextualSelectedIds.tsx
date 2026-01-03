'use client';

import { usePathname } from 'next/navigation';
import { selectedNodesArray } from '@/signals/visualiation/misc';
import { getSelectedObjectIds } from '@/signals/tables/selection';
import { useMemo, useRef } from 'react';
import { getDefaultVisualizationPath } from '@/app/(root)/clusters/urls';

/**
 * Hook that returns selected object IDs based on the current page context
 * - On visualization pages: returns selected node IDs from visualization
 * - On cluster info pages: returns all selected IDs from table selections (namespaces, pods, containers, nodes)
 *
 * Note: Does not call useSignals() - parent component should handle signal subscription
 * The returned array reference is stable if the actual IDs haven't changed (prevents unnecessary re-renders)
 */
export const useContextualSelectedIds = () => {
  const pathname = usePathname();

  const isVisualizationPage = pathname?.includes(getDefaultVisualizationPath());

  const selectedObjectIds = getSelectedObjectIds();

  const prevIdsRef = useRef<string[]>([]);

  const selectedIds = useMemo(() => {
    if (isVisualizationPage) {
      return selectedNodesArray.value;
    }

    const prevIds = prevIdsRef.current;
    if (selectedObjectIds.length === prevIds.length && selectedObjectIds.every((id, index) => id === prevIds[index])) {
      return prevIds;
    }

    prevIdsRef.current = selectedObjectIds;
    return selectedObjectIds;
  }, [isVisualizationPage, selectedObjectIds]);

  return {
    selectedIds,
    isVisualizationPage,
  };
};
