import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { setActivePanelMenu, closeAIPanel, AIPanel, AI_PANEL_TYPES } from '@/signals/drawers/ai-panel';
import { CircularCloseIcon } from '@/components/svgs/CircularCloseIcon';
import { useSignals } from '@preact/signals-react/runtime';
import { getSelectedNodes } from '@/signals/visualiation/nodes';
import { selectNode, resetSelectedNodes, selectedNodesArray, selectedNodesCount } from '@/signals/visualiation/misc';
import { getHealthStatusColor } from '@/lib/visualization/health';
import { changeActiveAgent } from '@/signals/chat/agents';
import { chatMessages, resetChatMessages } from '@/signals/chat/messages';

interface SelectedNodeCardProps {
  onRefChange?: (element: HTMLDivElement | null) => void;
}

const SelectedNodeCard = ({ onRefChange }: SelectedNodeCardProps) => {
  useSignals();
  const selectedNodes = getSelectedNodes();

  const handleRemoveNode = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    selectNode(nodeId);
  };

  useEffect(() => {
    if (selectedNodesCount.value === 0) {
      // Don't close panel if we're on the history tab (which doesn't require selected nodes)
      if (AIPanel.value.activePanelMenu === AI_PANEL_TYPES.history) {
        return;
      }

      setActivePanelMenu('');
      resetChatMessages();
      changeActiveAgent('');
      closeAIPanel();
    }
  }, [selectedNodesCount.value]);

  if (!selectedNodesArray.value.length || chatMessages.value.loading) return null;

  return (
    <div
      ref={onRefChange}
      className="flex flex-col border border-text-200 rounded-lg bg-white p-3 w-full max-h-[160px] overflow-y-auto"
    >
      <div className="flex justify-between items-center ">
        <h3 className="text-md font-medium">Selected Object{selectedNodes.length > 1 ? 's' : ''}</h3>
        {selectedNodes.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-text-500 hover:text-text-900"
            onClick={() => {
              setActivePanelMenu('');
              resetSelectedNodes();
              resetChatMessages();
              changeActiveAgent('');
              closeAIPanel();
            }}
          >
            Clear all
          </Button>
        )}
      </div>
      <ul>
        {selectedNodes.map(node => (
          <li
            key={node.id}
            className="flex items-center justify-between group hover:bg-gray-50 -mx-2 px-2 py-1 rounded"
          >
            <span className="flex items-center text-text-950 text-sm">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full mr-2"
                style={{ backgroundColor: getHealthStatusColor({ status: node.data?.healthStatus }).color }}
              />
              <strong>{node.data?.label || node.id}</strong>
              {node.data?.type && <span className="text-text-500 ml-1">({node.data.type})</span>}
            </span>

            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-text-400 hover:text-text-900 opacity-0 group-hover:opacity-100"
              onClick={e => handleRemoveNode(node.id, e)}
              title="Remove node"
            >
              <CircularCloseIcon className="w-4 h-4" />
              <span className="sr-only">Remove node</span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectedNodeCard;
