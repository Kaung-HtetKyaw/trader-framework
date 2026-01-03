import { HEADER_HEIGHT } from '@/components/Header';
import { useState, useEffect, useMemo } from 'react';

export type UseGetClusterInfoTableHeightProps = {
  id: string;
  rowCount: number;
  rowHeight?: number;
  rowCountThreshold?: number;
  thresholdHeight?: number;
};

const useGetClusterInfoTableHeight = (props: UseGetClusterInfoTableHeightProps) => {
  const { id, rowCount, rowHeight = 48, rowCountThreshold = 5, thresholdHeight = 400 } = props;
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const table = document.getElementById(id);
      if (!table) {
        return;
      }

      const top = table.getBoundingClientRect().top;
      const height = window.innerHeight - top - (HEADER_HEIGHT + 20);
      setHeight(height);
    };

    // Use requestAnimationFrame to ensure DOM is ready
    handleResize();

    window.addEventListener('resize', handleResize);
    window.addEventListener('load', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', handleResize);
    };
  }, [id]);

  const tableHeight = useMemo(() => {
    if (rowCount > rowCountThreshold && height < thresholdHeight) {
      return rowCountThreshold * rowHeight;
    }

    if (rowCount <= rowCountThreshold) {
      return rowHeight * rowCount;
    }

    return height - 20;
  }, [rowCount, rowHeight, height, rowCountThreshold, thresholdHeight]);

  return tableHeight;
};

export default useGetClusterInfoTableHeight;
