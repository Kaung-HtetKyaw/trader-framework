'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface HydrationContextType {
  isHydrated: boolean;
}

const HydrationContext = createContext<HydrationContextType>({ isHydrated: false });

export const useHydration = () => useContext(HydrationContext);

export function HydrationProvider({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Wait for next tick to ensure all useLocalStorage hooks have run
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (!isHydrated) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <HydrationContext.Provider value={{ isHydrated }}>
      {children}
    </HydrationContext.Provider>
  );
}
