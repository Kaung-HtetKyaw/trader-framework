import { useState, useCallback, useRef, useEffect } from 'react';

interface UseScrollCursorPaginationProps<T> {
  loadMore: (cursor: string) => Promise<{
    items: T[];
    nextCursor?: string | null;
    hasMore: boolean;
  }>;
  scrollThreshold?: number;
  bufferOffset?: number;
  getItemId: (item: T) => string;
}

interface UseScrollCursorPaginationReturn<T> {
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  nextCursor: string | null;
  setNextCursor: React.Dispatch<React.SetStateAction<string | null>>;
  isLoadingMore: boolean;
  hasReachedEnd: boolean;
  setHasReachedEnd: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  loadMoreItems: () => Promise<void>;
  handleScroll: () => void;
  reset: () => void;
}

export function useScrollCursorPagination<T>({
  loadMore,
  scrollThreshold = 100,
  bufferOffset = 200,
  getItemId,
}: UseScrollCursorPaginationProps<T>): UseScrollCursorPaginationReturn<T> {
  const [items, setItems] = useState<T[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const loadMoreItems = useCallback(async () => {
    if (!nextCursor || isLoadingMore || hasReachedEnd) return;

    setIsLoadingMore(true);
    setError(null);

    // Store current first item for viewport preservation
    const firstItemId = items[0] ? getItemId(items[0]) : null;

    try {
      const result = await loadMore(nextCursor);

      if (result.items.length > 0) {
        // Deduplicate by item ID using current state
        setItems(prevItems => {
          const existingIds = new Set(prevItems.map(getItemId));
          const uniqueNewItems = result.items.filter(item => !existingIds.has(getItemId(item)));

          if (uniqueNewItems.length > 0) {
            // Reverse new items to get oldest first, then prepend
            return [...uniqueNewItems.reverse(), ...prevItems];
          }
          return prevItems;
        });

        setNextCursor(result.nextCursor || null);
        setHasReachedEnd(!result.hasMore);

        // Preserve viewport position after loading more
        setTimeout(() => {
          if (scrollContainerRef.current && firstItemId) {
            // Find where the previously first visible item is now located
            const newFirstItemElement = Array.from(scrollContainerRef.current.children)
              .find(child => child.getAttribute('data-event-id') === firstItemId) as HTMLElement;

            if (newFirstItemElement) {
              if (result.nextCursor) {
                // Still has more data - position to show the previously first item with some buffer
                scrollContainerRef.current.scrollTop = Math.max(0, newFirstItemElement.offsetTop - bufferOffset);
              } else {
                // No more data - preserve exact position
                scrollContainerRef.current.scrollTop = newFirstItemElement.offsetTop;
              }
            }
          }
        }, 50);
      } else {
        setHasReachedEnd(true);
      }
    } catch (error) {
      console.error('Failed to load more items:', error);
      setError('Failed to load more items');
    } finally {
      setIsLoadingMore(false);
    }
  }, [nextCursor, isLoadingMore, hasReachedEnd, items, loadMore, getItemId, bufferOffset]);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isLoadingMore) return;

    const scrollTop = scrollContainerRef.current.scrollTop;

    // Only trigger loading if we're near top AND there's more data to load
    if (scrollTop <= scrollThreshold && nextCursor && !hasReachedEnd) {
      loadMoreItems();
    }
  }, [isLoadingMore, nextCursor, hasReachedEnd, loadMoreItems, scrollThreshold]);

  const reset = useCallback(() => {
    setItems([]);
    setNextCursor(null);
    setIsLoadingMore(false);
    setHasReachedEnd(false);
    setError(null);
  }, []);

  useEffect(() => {
    const scrollElement = scrollContainerRef.current;
    if (!scrollElement) return;

    scrollElement.addEventListener('scroll', handleScroll);
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return {
    items,
    setItems,
    scrollContainerRef,
    nextCursor,
    setNextCursor,
    isLoadingMore,
    hasReachedEnd,
    setHasReachedEnd,
    error,
    setError,
    loadMoreItems,
    handleScroll,
    reset,
  };
}