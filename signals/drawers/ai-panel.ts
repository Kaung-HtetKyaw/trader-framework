import { signal } from '@preact/signals-react';
import { setIsSidebarCollapsed, setShowAlertCarousel } from '../global/misc';

export const AI_PANEL_TYPES = {
  assistant: 'assistant',
  events: 'events',
  history: 'history',
} as const;
export type AIPanelTypeEnum = keyof typeof AI_PANEL_TYPES;

export type ActiveAIPanelTypeEnum = AIPanelTypeEnum | '';

type AIPanelSignal = {
  isAIPanelOpen: boolean;
  activePanelMenu: ActiveAIPanelTypeEnum;
};

const AIPanel = signal<AIPanelSignal>({
  isAIPanelOpen: false,
  activePanelMenu: '',
});

const openAIPanel = () => {
  AIPanel.value = {
    ...AIPanel.value,
    isAIPanelOpen: true,
  };

  // Close sidebar and alert carousel
  setIsSidebarCollapsed(true);
  setShowAlertCarousel(false);
};

const closeAIPanel = () => {
  AIPanel.value = {
    ...AIPanel.value,
    isAIPanelOpen: false,
  };
};

const setActivePanelMenu = (panelMenu: ActiveAIPanelTypeEnum) => {
  AIPanel.value = {
    ...AIPanel.value,
    activePanelMenu: panelMenu,
  };
};

export { AIPanel, openAIPanel, closeAIPanel, setActivePanelMenu };
