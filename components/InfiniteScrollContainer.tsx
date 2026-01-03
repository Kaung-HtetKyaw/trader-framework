'use client';

import { cn } from '@/lib/utils';
import { useCallback, useRef } from 'react';

export type InfiniteScrollContainerProps = {
  children: React.ReactNode;
  height?: number;
  threshold: number;
  enabledFetchNextPage: boolean;
  enabledInfiniteScroll: boolean;
  onFetchNextPage: () => void;
  className?: string;
};

/**
 * This component is used to create an infinite scroll container.
 * It will fetch more data when the user scrolls to the bottom of the container or pass the threshold provided and enabled is true.
 * @param {InfiniteScrollContainerProps} props
 * @returns
 */
const InfiniteScrollContainer = (props: InfiniteScrollContainerProps) => {
  const { children, onFetchNextPage, enabledFetchNextPage, enabledInfiniteScroll, height, className, threshold } =
    props;
  const tableContainerRef = useRef<HTMLDivElement | HTMLTableSectionElement>(null);

  const onReachBottom = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (!enabledInfiniteScroll) return;

      if (containerRefElement) {
        const { scrollHeight, clientHeight, scrollTop } = containerRefElement;
        if (scrollHeight - scrollTop - clientHeight < threshold && enabledFetchNextPage) {
          onFetchNextPage();
        }
      }
    },
    [enabledFetchNextPage, onFetchNextPage, threshold]
  );

  return (
    <div
      style={{ height: height ? `${height}px` : 'auto' }}
      ref={tableContainerRef}
      id="scroll-container"
      onScroll={e => onReachBottom(e.currentTarget)}
      className={cn('overflow-auto relative', className || '')}
    >
      {children}
    </div>
  );
};

export default InfiniteScrollContainer;
