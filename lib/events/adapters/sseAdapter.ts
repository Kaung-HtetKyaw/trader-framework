// lib/events/adapters/sseAdapter.ts
'use client';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import type { EventEmitter } from '../core/eventEmitter';
import type { ConnectionConfig } from '../core/connectionManager';
import { safeJsonParse } from '@/lib/utils/json';

export interface SSEAdapterConfig {
  emitter: EventEmitter;
}

export function createSSEAdapter({ emitter }: SSEAdapterConfig) {
  
  const handleConnectionStart = async (data?: { 
    config: ConnectionConfig & { signal: AbortSignal }, 
    sequence: number 
  }) => {
    if (!data) return;
    const { config } = data;
    const headers: Record<string, string> = {
      Accept: 'text/event-stream',
      'Content-Type': 'application/json',
    };
    
    if (config.token) {
      headers.Authorization = `Bearer ${config.token}`;
    }

    try {
      await fetchEventSource(config.url, {
        method: 'POST',
        headers,
        body: config.body == null ? '{}' : (typeof config.body === 'string' ? config.body : JSON.stringify(config.body)),
        signal: config.signal,
        mode: config.withCredentials ? 'cors' : undefined,
        credentials: config.withCredentials ? 'include' : undefined,

        onopen: async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
          }
          emitter.emit('sseStateChange', 'open');
        },

        onmessage: (event) => {
          const payload = safeJsonParse(event.data);
          const eventName = event.event || 'message';
          
          // Emit specific event type
          emitter.emit(eventName, payload);
          
          // Also emit generic message event
          emitter.emit('message', payload);
        },

        onerror: (error) => {
          emitter.emit('sseStateChange', 'error');
          emitter.emit('sseError', error);
          // Re-throw to let fetchEventSource handle retries
          throw error;
        },

        onclose: () => {
          emitter.emit('sseStateChange', 'closed');
          // Let the connection manager decide if retry is needed
          emitter.emit('sseConnectionLost');
        },

        openWhenHidden: true,
      });
    } catch (error) {
      emitter.emit('sseStateChange', 'error');
      emitter.emit('sseError', error);
    }
  };

  // Listen for connection start requests
  emitter.on('connectionStart', handleConnectionStart);

  return {
    destroy: () => {
      emitter.off('connectionStart', handleConnectionStart);
    }
  };
}