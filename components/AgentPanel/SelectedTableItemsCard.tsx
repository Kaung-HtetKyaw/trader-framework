'use client';

import React, { useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { setActivePanelMenu, closeAIPanel, AIPanel, AI_PANEL_TYPES } from '@/signals/drawers/ai-panel';
import { CircularCloseIcon } from '@/components/svgs/CircularCloseIcon';
import { useSignals } from '@preact/signals-react/runtime';
import { removeFromSelectedObjects, getSelectedObjects, clearSelections } from '@/signals/tables/selection';
import { changeActiveAgent } from '@/signals/chat/agents';
import { chatMessages, resetChatMessages } from '@/signals/chat/messages';
import { usePathname } from 'next/navigation';

interface SelectedTableItemsCardProps {
  onRefChange?: (element: HTMLDivElement | null) => void;
}

const SelectedTableItemsCard = ({ onRefChange }: SelectedTableItemsCardProps) => {
  useSignals();
  const pathname = usePathname();
  const selectedItems = getSelectedObjects();
  const isUpgradePlanPage = pathname?.includes('/upgrade-plan');

  const handleRemoveItem = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    removeFromSelectedObjects(id);
  }, []);

  const handleClearAll = useCallback(() => {
    clearSelections();
    setActivePanelMenu('');
    resetChatMessages();
    changeActiveAgent('');
    closeAIPanel();
  }, []);

  useEffect(() => {
    if (isUpgradePlanPage) {
      return;
    }

    if (selectedItems.length === 0) {
      if (AIPanel.value.activePanelMenu === AI_PANEL_TYPES.history) {
        return;
      }

      setActivePanelMenu('');
      resetChatMessages();
      changeActiveAgent('');
      closeAIPanel();
    }
  }, [selectedItems.length, isUpgradePlanPage]);

  if (selectedItems.length === 0 || chatMessages.value.loading) return null;

  return (
    <div
      ref={onRefChange}
      className="flex flex-col border border-text-200 rounded-lg bg-white p-3 w-full max-h-[160px] overflow-y-auto"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-md font-medium">Selected Object{selectedItems.length > 1 ? 's' : ''}</h3>
        {selectedItems.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-text-500 hover:text-text-900"
            onClick={handleClearAll}
          >
            Clear all
          </Button>
        )}
      </div>
      <ul>
        {selectedItems.map(item => (
          <li
            key={`${item.kind}-${item.id}`}
            className="flex items-center justify-between group hover:bg-gray-50 -mx-2 px-2 py-1 rounded"
          >
            <span className="flex items-center text-text-950 text-sm">
              <span className="inline-block w-2.5 h-2.5 rounded-full mr-2 bg-secondary-500" />{' '}
              {/* TODO: Add health status when available */}
              <strong>{item.name}</strong>
              <span className="text-text-500 ml-1 capitalize">({item.kind})</span>
            </span>

            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-text-400 hover:text-text-900 opacity-0 group-hover:opacity-100"
              onClick={e => handleRemoveItem(e, item.id)}
              title="Remove item"
            >
              <CircularCloseIcon className="w-4 h-4" />
              <span className="sr-only">Remove item</span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectedTableItemsCard;
