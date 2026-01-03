import { useState, useCallback, useEffect } from 'react';
import type { K8sEvent } from '@/types/event';
import { setEventStreamConfig } from '@/lib/events/eventManager';

interface UseEventStreamingProps {
  clusterId?: string;
  timeRange?: string;
  events: K8sEvent[];
  selectedNodeIds?: string[];
  accessToken?: string;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  scrollDelay?: number;
  onAutoMerge?: (newEvents: K8sEvent[]) => void;
}

interface UseEventStreamingReturn {
  newEvents: K8sEvent[];
  showNewEventsButton: boolean;
  handleShowNewEvents: (onMerge: (newEvents: K8sEvent[]) => void) => void;
  clearNewEvents: () => void;
}

export function useEventStreaming({
  clusterId,
  timeRange,
  events,
  selectedNodeIds,
  accessToken,
  scrollContainerRef,
  scrollDelay = 100,
  onAutoMerge,
}: UseEventStreamingProps): UseEventStreamingReturn {
  const [newEvents, setNewEvents] = useState<K8sEvent[]>([]);
  const [showNewEventsButton, setShowNewEventsButton] = useState(false);

  // Watch setup for new events (from current time onwards)
  const onWatchEvent = useCallback(({ event }: { event: K8sEvent }) => {
    setNewEvents(prev => {
      // Check if event already exists
      if (prev.some(existing => existing.id === event.id)) return prev;
      const updated = [...prev, event];
      // Sort by eventTime (newest last for append)
      updated.sort((a, b) => new Date(a.eventTime).getTime() - new Date(b.eventTime).getTime());

      // Auto-merge if main event list is empty (better UX)
      if (events.length === 0 && onAutoMerge) {
        onAutoMerge(updated);
        return []; // Clear new events since they were auto-merged
      }

      return updated;
    });

    // Only show button if events list is not empty
    if (events.length > 0) {
      setShowNewEventsButton(true);
    }
  }, [events.length, onAutoMerge]);

  const onWatchClear = useCallback(() => {
    setNewEvents([]);
    setShowNewEventsButton(false);
  }, []);

  // Setup watch connection when events are loaded
  useEffect(() => {
    if (!accessToken || !clusterId || !timeRange) {
      return;
    }

    // Determine watch start time based on events state
    const watchFromTime = events.length > 0
      ? events[events.length - 1].eventTime  // Latest event time
      : new Date().toISOString();            // Current time if empty list

    setEventStreamConfig({
      token: accessToken,
      beginAt: watchFromTime,
      clusterID: clusterId,
      objectIDs: selectedNodeIds && selectedNodeIds.length > 0 ? selectedNodeIds : undefined,
      onEvent: onWatchEvent,
      onClear: onWatchClear,
    });

    return () => {
      // Cleanup on unmount or dependency change
      setNewEvents([]);
      setShowNewEventsButton(false);
    };
  }, [accessToken, clusterId, timeRange, events, selectedNodeIds, onWatchEvent, onWatchClear]);

  const handleShowNewEvents = useCallback((onMerge: (newEvents: K8sEvent[]) => void) => {
    if (newEvents.length === 0) return;

    // Call the merge function with current new events
    onMerge(newEvents);

    // Clear the new events state
    setNewEvents([]);
    setShowNewEventsButton(false);

    // Auto-scroll to bottom
    if (scrollContainerRef?.current) {
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
      }, scrollDelay);
    }
  }, [newEvents, scrollContainerRef, scrollDelay]);

  const clearNewEvents = useCallback(() => {
    setNewEvents([]);
    setShowNewEventsButton(false);
  }, []);

  return {
    newEvents,
    showNewEventsButton,
    handleShowNewEvents,
    clearNewEvents,
  };
}