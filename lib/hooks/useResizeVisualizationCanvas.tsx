import { VISUALIZATION_FILTER_BAR_ID } from '@/app/(root)/visualization/VisualizationFilters';
import { VISUALIZATION_FILTER_BAR_MARGIN_Y } from '@/app/(root)/visualization/VisualizationFilters/VisualizationFilterBar';
import { HEADER_HEIGHT } from '@/components/Header';
import { useEffect, useMemo, useState } from 'react';

const useResizeVisualizationCanvas = () => {
  const [height, setHeight] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const filterBar = document.getElementById(VISUALIZATION_FILTER_BAR_ID);
      if (!filterBar) {
        return;
      }

      setHeight(filterBar.clientHeight);
      setIsInitialized(true);
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      handleResize();
    });

    window.addEventListener('resize', handleResize);
    window.addEventListener('load', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', handleResize);
    };
  }, []);

  const computedHeight = useMemo(() => {
    // Use a fixed fallback height during initial render to prevent layout shift
    const effectiveHeight = isInitialized ? height : 60;
    return `calc(100vh - ${effectiveHeight + HEADER_HEIGHT + VISUALIZATION_FILTER_BAR_MARGIN_Y}px)`;
  }, [height, isInitialized]);

  return { computedHeight };
};

export default useResizeVisualizationCanvas;
