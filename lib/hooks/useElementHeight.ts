import { useEffect, useState, useCallback } from 'react';

export const useElementHeight = () => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [height, setHeight] = useState(0);

  const updateHeight = useCallback(() => {
    if (element) {
      setHeight(element.offsetHeight);
    } else {
      setHeight(0);
    }
  }, [element]);

  useEffect(() => {
    updateHeight();

    if (!element) return;

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [element, updateHeight]);

  return [height, setElement] as const;
};