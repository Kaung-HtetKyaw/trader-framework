import { AI_PANEL_SIDEBAR_WIDTH } from '@/components/AgentPanel/PanelSidebar';
import { SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_EXPANDED_WIDTH } from '@/components/Sidebar';
import { localStorageSignal } from '@/lib/signals/localstorageSignal';
import { signal } from '@preact/signals-react';

export const getCIVLayoutWidthFromWindow = (isCollapsed: boolean) => {
  if (typeof window === 'undefined') {
    return 0;
  }

  return (
    window.innerWidth - AI_PANEL_SIDEBAR_WIDTH - (isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH) - 2
  );
};

export const SIDEBAR_COLLAPSED_LOCAL_STORAGE_KEY = 'isSidebarCollapsed';

const isSidebarCollapsed = localStorageSignal(SIDEBAR_COLLAPSED_LOCAL_STORAGE_KEY, false);

const setIsSidebarCollapsed = (value: boolean) => {
  isSidebarCollapsed.value = value;
  setCivLayoutWidth(getCIVLayoutWidthFromWindow(value));
};

const toggleIsSidebarCollapsed = () => {
  const value = !getIsSidebarCollapsed();
  setIsSidebarCollapsed(value);
  setCivLayoutWidth(getCIVLayoutWidthFromWindow(value));
};

const getIsSidebarCollapsed = () => {
  return isSidebarCollapsed.value;
};

export const ALERT_CAROUSEL_LOCAL_STORAGE_KEY = 'showAlertCarousel';

const showAlertCarousel = localStorageSignal(ALERT_CAROUSEL_LOCAL_STORAGE_KEY, false);

const setShowAlertCarousel = (value: boolean) => {
  showAlertCarousel.value = value;
};

const toggleShowAlertCarousel = () => {
  setShowAlertCarousel(!getShowAlertCarousel());
};

const getShowAlertCarousel = () => {
  return showAlertCarousel.value;
};

const civLayoutWidth = signal<number | undefined>(undefined);

const setCivLayoutWidth = (value: number | undefined) => {
  civLayoutWidth.value = value;
};

const getCivLayoutWidth = () => {
  return civLayoutWidth.value;
};

export {
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  getIsSidebarCollapsed,
  showAlertCarousel,
  setShowAlertCarousel,
  getShowAlertCarousel,
  toggleIsSidebarCollapsed,
  toggleShowAlertCarousel,
  civLayoutWidth,
  setCivLayoutWidth,
  getCivLayoutWidth,
};
