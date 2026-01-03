'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface VisualizationRefreshContextType {
  refreshKey: number;
  triggerRefresh: () => void;
  disableRefresh?: boolean;
  setDisableRefresh?: (disable: boolean) => void;
  isRefreshing: boolean;
  setIsRefreshing: (refreshing: boolean) => void;
}

const VisualizationRefreshContext = createContext<VisualizationRefreshContextType | undefined>(undefined);

export const useRefresh = () => {
  const context = useContext(VisualizationRefreshContext);
  if (!context) {
    throw new Error('useRefresh must be used within a VisualizationRefreshProvider');
  }
  return context;
};

export const VisualizationRefreshProvider = ({ children }: { children: ReactNode }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [disableRefresh, setDisableRefresh] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <VisualizationRefreshContext.Provider value={{ refreshKey, triggerRefresh, disableRefresh, setDisableRefresh, isRefreshing, setIsRefreshing  }}>
      {children}
    </VisualizationRefreshContext.Provider>
  );
};
