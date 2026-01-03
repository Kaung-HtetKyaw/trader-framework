'use client';

import * as Dialog from '@radix-ui/react-dialog';
import {
  ActiveAIPanelTypeEnum,
  AI_PANEL_TYPES,
  AIPanel,
  closeAIPanel,
  openAIPanel,
  setActivePanelMenu,
} from '@/signals/drawers/ai-panel';
import { resetChatMessages } from '@/signals/chat/messages';
import { useSignals } from '@preact/signals-react/runtime';
import { useEffect } from 'react';
import PanelHeader from './PanelHeader';
import PanelSidebar from './PanelSidebar';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { misc } from '@/signals/visualiation/misc';
import { BaseButton } from '@/components/ui/base-button';
import { changeActiveAgent } from '@/signals/chat/agents';
import { chatMessages as chatMessagesSignal } from '@/signals/chat/messages';
import { usePathname } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PromptAgentTypes } from '@/types/chat';
import { useContextualSelection } from '@/lib/hooks/useContextualSelection';
import { useChatHandlers } from '@/lib/hooks/chat/useChatStream';
import { setChatMessagesLoading } from '@/signals/chat/messages';

const TAB_ITEMS = [
  { id: 'assistant', label: 'Assistant' },
  { id: 'events', label: 'Events' },
  { id: 'history', label: 'History' },
] as const;

interface DialogPanelProps {
  renderContent: (activePanel: ActiveAIPanelTypeEnum) => React.ReactNode;
}

const DialogPanel = ({ renderContent }: DialogPanelProps) => {
  useSignals();
  const pathname = usePathname();
  const isAIPanelOpen = AIPanel.value.isAIPanelOpen;
  const activePanel = AIPanel.value.activePanelMenu;
  const hasMessages = chatMessagesSignal.value.messages.length > 0;
  const isVisualizationLoading = misc.value.isLoading;
  const isChatLoading = chatMessagesSignal.value.loading;
  const { selectionCount, hasSelection, isUpgradePlanPage } = useContextualSelection();
  const { handleChatSubmit } = useChatHandlers();

  const getPanelTitle = (panelId: ActiveAIPanelTypeEnum) =>
    TAB_ITEMS.find(item => item.id === panelId)?.label || 'Assistant';

  const handlePanelChange = (panelId: ActiveAIPanelTypeEnum) => {
    // For history panel, always open even without selected nodes
    if (panelId === AI_PANEL_TYPES.history) {
      setActivePanelMenu(panelId);
      openAIPanel();
      return;
    }

    setActivePanelMenu(panelId);

    // For other panels, require selected nodes
    if (selectionCount === 0) {
      return;
    }

    if (panelId === AI_PANEL_TYPES.assistant && !hasMessages) {
      changeActiveAgent(PromptAgentTypes.assistant);
    }
    openAIPanel();
  };

  const handlePanelMenuChange = (panelId: ActiveAIPanelTypeEnum) => {
    // TODO: Handle user switching panel menu when AI is thinking or responding (probably by redesigning how the PanelContent are shown)
    setActivePanelMenu(panelId);
  };

  const handleOpenPanel = () => {
    // On upgrade-plan page, don't open if no messages exist
    if (isUpgradePlanPage && !hasMessages) {
      return;
    }

    if (!activePanel && selectionCount === 0) {
      return;
    }
    const panelToOpen = activePanel || AI_PANEL_TYPES.assistant;
    setActivePanelMenu(panelToOpen);
    if (panelToOpen !== AI_PANEL_TYPES.history && selectionCount === 0) {
      return;
    }
    if (!hasMessages) {
      changeActiveAgent(PromptAgentTypes.assistant);
    }
    openAIPanel();
  };

  const handleNewChat = () => {
    resetChatMessages();
    setActivePanelMenu(AI_PANEL_TYPES.assistant);

    // If on upgrade-plan page, handle upgrade-specific behavior
    if (isUpgradePlanPage) {
      // Set loading state before opening panel to show loader instead of empty state
      setChatMessagesLoading(true);

      changeActiveAgent(PromptAgentTypes.upgrader);
      openAIPanel();
      handleChatSubmit('Plan an upgrade for the current selection');
    } else {
      changeActiveAgent(PromptAgentTypes.assistant);
      openAIPanel();
    }
  };

  useEffect(() => {
    if (selectionCount === 0) {
      changeActiveAgent('');
    }
  }, [selectionCount]);

  useEffect(() => {
    // Reset active panel and messages when navigating away from visualization page
    return () => {
      setActivePanelMenu('');
      resetChatMessages();
    };
  }, [pathname]);

  return (
    <TooltipProvider delayDuration={100}>
      {!isAIPanelOpen && (
        <div className="relative flex-shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute -left-5 top-1/2 -translate-y-1/2 z-[50]">
                <BaseButton
                  onClick={handleOpenPanel}
                  disabled={selectionCount === 0 || isVisualizationLoading || (isUpgradePlanPage && !hasMessages)}
                  className={`h-8 w-8 rounded-sm shadow-lg transition-colors duration-200 ${
                    selectionCount === 0 || isVisualizationLoading || (isUpgradePlanPage && !hasMessages)
                      ? '!cursor-not-allowed !bg-text-50 !text-text-400'
                      : 'bg-primary-950 hover:bg-primary-900'
                  }`}
                  aria-label="Open AI panel"
                  variant="contained"
                  size="small"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </BaseButton>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              sideOffset={8}
              className="text-xs font-medium bg-white text-secondary-300 rounded-md shadow-md px-3 py-2"
            >
              {isVisualizationLoading
                ? 'Loading visualization...'
                : isUpgradePlanPage && !hasMessages
                  ? 'Click "Plan Upgrade" button to start'
                  : selectionCount === 0
                    ? 'Select objects to give context to the agents'
                    : 'Open AI panel'}
            </TooltipContent>
          </Tooltip>
          <PanelSidebar
            activePanel={activePanel}
            onPanelChange={handlePanelChange}
            hasSelectedObjects={hasSelection}
            hasMessages={hasMessages}
            onOpenPanel={handleNewChat}
            isChatLoading={isChatLoading}
          />
        </div>
      )}

      <Dialog.Root open={isAIPanelOpen} onOpenChange={open => !open && closeAIPanel()}>
        <Dialog.Portal>
          <Dialog.Overlay
            className="
              fixed inset-0 z-40 bg-black/20
              opacity-0 data-[state=open]:opacity-100
              transition-opacity duration-120 will-change-[opacity]
            "
            onClick={closeAIPanel}
          />
          <Dialog.Content
            className="
              fixed top-0 right-0 h-screen
              w-[min(720px,calc(100%-80px))] sm:w-[min(720px,calc(100%-80px))] lg:w-[60%] xl:w-[50%] 2xl:w-[50%]
              bg-white shadow-2xl z-50 flex
              translate-x-full data-[state=open]:translate-x-0
              transition-all duration-300 will-change-transform
              max-[800px]:overflow-x-auto
            "
          >
            <Dialog.Title className="sr-only">{getPanelTitle(activePanel)} Panel</Dialog.Title>

            <BaseButton
              onClick={closeAIPanel}
              className="absolute -left-4 top-1/2 -translate-y-1/2 bg-primary-950 hover:bg-primary-900 h-8 w-8 rounded-sm shadow-lg"
              aria-label="Close AI panel"
              variant="contained"
              size="small"
            >
              <ChevronsRight className="w-4 h-4 text-white" />
            </BaseButton>

            <PanelSidebar
              activePanel={activePanel}
              onPanelChange={handlePanelMenuChange}
              hasSelectedObjects={hasSelection}
              hasMessages={hasMessages}
              onOpenPanel={handleNewChat}
              isChatLoading={isChatLoading}
            />

            <div className="flex flex-col flex-1 min-w-[640px]">
              <PanelHeader title={getPanelTitle(activePanel)} />
              <div className="flex-1 min-h-0 flex flex-col overflow-hidden">{renderContent(activePanel)}</div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </TooltipProvider>
  );
};

export default DialogPanel;
