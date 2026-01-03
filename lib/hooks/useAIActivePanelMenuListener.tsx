import { ActiveAIPanelTypeEnum, AIPanel } from '@/signals/drawers/ai-panel';
import { useSignalEffect, useSignals } from '@preact/signals-react/runtime';

const useAIActivePanelMenuListener = (onActivePanelMenuChange: (panelMenu: ActiveAIPanelTypeEnum) => void) => {
  useSignals();

  useSignalEffect(() => {
    onActivePanelMenuChange(AIPanel.value.activePanelMenu);
  });
};

export default useAIActivePanelMenuListener;
