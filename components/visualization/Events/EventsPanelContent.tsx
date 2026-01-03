'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import type { TimeRange, K8sEvent } from '@/types/event';
import TimeFilter from './TimeFilter';
import EventItem from './EventItem';
import EmptyEventNote from './EmptyEventNote';
import { useGetClusterByIdQuery, useLazyGetK8sEventsQuery } from '@/store/api/clusterApi';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { BaseButton } from '@/components/ui/base-button';
import { rangeToMs } from '@/lib/events/events';
import { useScrollCursorPagination } from '@/lib/hooks/events/useScrollCursorPagination';
import { useEventStreaming } from '@/lib/hooks/events/useEventStreaming';
import useListSettings from '@/lib/hooks/useListSettings';
import { ListViews } from '@/types/list';
import { useContextualSelectedIds } from '@/lib/hooks/useContextualSelectedIds';

const EVENTS_CONFIG = {
  SCROLL_THRESHOLD: 100,
  BUFFER_OFFSET: 200,
  SCROLL_DELAY: 100,
  VIEWPORT_DELAY: 50,
  EMPTY_STATE_DELAY: 200,
} as const;

const EventsPanelContent = () => {
  const { selectedIds: selectedNodeIds } = useContextualSelectedIds();
  const { id: clusterId } = useParams<{ id: string }>();

  const [timeRange, setTimeRange] = useState<TimeRange | undefined>('1h');
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(false);

  const { data: cluster } = useGetClusterByIdQuery({ id: clusterId!, includeStats: false });
  const [triggerGetK8sEvents] = useLazyGetK8sEventsQuery();
  const { settings } = useListSettings(ListViews.EVENT_LIST);

  const { data: session } = useSession();

  const beginAt = useMemo(() => {
    if (!timeRange) return undefined;
    const ms = rangeToMs[timeRange] ?? rangeToMs['15m'];
    return new Date(Date.now() - ms).toISOString();
  }, [timeRange]);

  // Pagination hook for loading more events
  const loadMoreEvents = useCallback(
    async (cursor: string) => {
      if (!timeRange || !clusterId) {
        throw new Error('Missing required parameters');
      }

      const result = await triggerGetK8sEvents({
        filter: {
          clusterID: clusterId,
          beginAt,
          endAt: timeRange ? new Date().toISOString() : undefined,
          ...(selectedNodeIds && selectedNodeIds.length > 0 && { objectIDs: selectedNodeIds }),
        },
        sort: {
          eventTime: 'desc',
          id: 'desc',
        },
        pagination: {
          nextCursor: cursor,
          pageSize: settings.rowNumber,
        },
      });

      return {
        items: result.data?.items || [],
        nextCursor: result.data?.pagination?.nextCursor || null,
        hasMore: !!result.data?.pagination?.nextCursor,
      };
    },
    [timeRange, clusterId, beginAt, triggerGetK8sEvents, selectedNodeIds]
  );

  const {
    items: events,
    setItems: setEvents,
    scrollContainerRef,
    setNextCursor,
    isLoadingMore,
    hasReachedEnd: hasReachedStart,
    setHasReachedEnd: setHasReachedStart,
    error,
    setError,
    reset: resetPagination,
  } = useScrollCursorPagination({
    loadMore: loadMoreEvents,
    getItemId: (event: K8sEvent) => event.id,
    scrollThreshold: EVENTS_CONFIG.SCROLL_THRESHOLD,
    bufferOffset: EVENTS_CONFIG.BUFFER_OFFSET,
  });

  // Auto-merge callback for when events list is empty
  const handleAutoMerge = useCallback(
    (newEventsToMerge: K8sEvent[]) => {
      setEvents(prevEvents => {
        const existingIds = new Set(prevEvents.map(e => e.id));
        const uniqueNewEvents = newEventsToMerge.filter(event => !existingIds.has(event.id));

        if (uniqueNewEvents.length > 0) {
          return [...prevEvents, ...uniqueNewEvents];
        }
        return prevEvents;
      });

      // Auto-scroll to bottom when auto-merging
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
      }, EVENTS_CONFIG.SCROLL_DELAY);
    },
    [scrollContainerRef, setEvents]
  );

  // Event streaming hook
  const { newEvents, showNewEventsButton, handleShowNewEvents } = useEventStreaming({
    clusterId,
    timeRange,
    events,
    selectedNodeIds,
    accessToken: session?.user?.accessToken,
    scrollContainerRef,
    scrollDelay: EVENTS_CONFIG.SCROLL_DELAY,
    onAutoMerge: handleAutoMerge,
  });

  const loadInitialEvents = useCallback(async () => {
    if (!timeRange || !clusterId) return;

    setIsInitialLoading(true);
    resetPagination();
    setShowEmptyState(false);

    try {
      const result = await triggerGetK8sEvents({
        filter: {
          clusterID: clusterId,
          beginAt,
          endAt: timeRange ? new Date().toISOString() : undefined,
          ...(selectedNodeIds && selectedNodeIds.length > 0 && { objectIDs: selectedNodeIds }),
        },
        sort: {
          eventTime: 'desc',
          id: 'desc',
        },
        pagination: {
          pageSize: settings.rowNumber,
        },
      });

      if (result.data?.items) {
        setEvents([...result.data.items].reverse());
        setNextCursor(result.data.pagination?.nextCursor || null);
        setHasReachedStart(!result.data.pagination?.nextCursor);
        // Scroll to bottom after events are loaded
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
          }
        }, EVENTS_CONFIG.SCROLL_DELAY);
      }
    } catch (error) {
      console.error('Failed to load initial events:', error);
      setError(`Failed to load events: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsInitialLoading(false);
      // Show empty state after a small delay to prevent flickering
      setTimeout(() => {
        setShowEmptyState(true);
      }, EVENTS_CONFIG.EMPTY_STATE_DELAY);
    }
  }, [
    timeRange,
    clusterId,
    beginAt,
    triggerGetK8sEvents,
    selectedNodeIds,
    resetPagination,
    setEvents,
    setNextCursor,
    setHasReachedStart,
    setError,
  ]);

  const handleTimeRangeChange = useCallback((newTimeRange: TimeRange) => {
    setTimeRange(newTimeRange);
  }, []);

  // Load events when timeRange changes
  useEffect(() => {
    if (timeRange && clusterId && beginAt) {
      loadInitialEvents();
    }
  }, [timeRange, clusterId, beginAt, loadInitialEvents]);

  return (
    <div className="relative flex h-full flex-col w-full">
      <div className="flex justify-start">
        <TimeFilter value={timeRange} onChange={handleTimeRangeChange} />
      </div>

      {cluster && timeRange && (
        <div ref={scrollContainerRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-1 space-y-6 pb-16">
          {isLoadingMore && (
            <div className="p-3 text-xs text-gray-600 text-center border-b border-gray-200">Loading more events...</div>
          )}

          {hasReachedStart && events.length > 0 && (
            <div className="p-3 text-xs text-gray-500 text-center border-b border-gray-200">No more events</div>
          )}

          {error && (
            <div className="p-3 text-xs text-center border-b border-gray-200">
              <div className="text-red-600 mb-2">{error}</div>
              <BaseButton
                onClick={() => {
                  setError(null);
                  loadInitialEvents();
                }}
                size="medium"
                variant="outlined"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Retry
              </BaseButton>
            </div>
          )}

          {isInitialLoading ? (
            <div className="p-3 text-xs text-gray-600 text-center">Loading events...</div>
          ) : events.length > 0 ? (
            events.map(event => <EventItem key={event.id} e={event} clusterName={cluster.name} />)
          ) : showEmptyState ? (
            <EmptyEventNote onClearFilter={() => setTimeRange(undefined)} />
          ) : null}
        </div>
      )}

      {showNewEventsButton && newEvents.length > 0 && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 z-50">
          <BaseButton
            size="medium"
            variant="outlined"
            className="pointer-events-auto shadow px-3 text-sm bg-white text-secondary-500 hover:bg-secondary-50"
            onClick={() =>
              handleShowNewEvents(newEventsToMerge => {
                // Append new events to existing events
                setEvents(prevEvents => {
                  const existingIds = new Set(prevEvents.map(e => e.id));
                  const uniqueNewEvents = newEventsToMerge.filter(event => !existingIds.has(event.id));

                  if (uniqueNewEvents.length > 0) {
                    return [...prevEvents, ...uniqueNewEvents];
                  }
                  return prevEvents;
                });
              })
            }
          >
            ↓ {newEvents.length} New Event{newEvents.length > 1 ? 's' : ''}
          </BaseButton>
        </div>
      )}
    </div>
  );
};

export default EventsPanelContent;
