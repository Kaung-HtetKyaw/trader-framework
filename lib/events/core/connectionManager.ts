
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EventEmitter } from './eventEmitter';

export type ConnectionState = 'idle' | 'connecting' | 'connected' | 'error' | 'closed';

export interface ConnectionConfig {
  url: string;
  body?: unknown;
  token?: string;
  signal?: AbortSignal;
  withCredentials?: boolean;
}

export interface ConnectionManager {
  connect: (config: ConnectionConfig) => Promise<void>;
  disconnect: () => void;
  getState: () => ConnectionState;
  isConnected: () => boolean;
}

export function createConnectionManager(
  emitter: EventEmitter,
  onStateChange?: (state: ConnectionState) => void
): ConnectionManager {
  let state: ConnectionState = 'idle';
  let abortController: AbortController | null = null;
  let connectionSequence = 0;
  let intentionalDisconnect = false;

  const setState = (newState: ConnectionState) => {
    if (state !== newState) {
      state = newState;
      onStateChange?.(state);
      emitter.emit('connectionStateChange', state);
    }
  };

  const connect = async (config: ConnectionConfig) => {
    // Increment sequence to invalidate any pending operations
    const currentSequence = ++connectionSequence;

    // Clean up existing connection
    if (abortController) {
      abortController.abort();
    }

    abortController = new AbortController();
    
    // Listen for external abort signal
    if (config.signal) {
      config.signal.addEventListener('abort', () => {
        if (currentSequence === connectionSequence) {
          disconnect();
        }
      });
    }

    setState('connecting');
    intentionalDisconnect = false; // Reset flag for new connection
    
    // Fallback timer: if we're still 'connecting' after 1 second, assume connection works
    const connectTimeout = setTimeout(() => {
      if (currentSequence === connectionSequence && state === 'connecting') {
        setState('connected');
      }
    }, 1000);

    // Store timeout for cleanup
    (abortController as any)._connectTimeout = connectTimeout;
    
    // Return the connection config and sequence for SSE adapter to use
    emitter.emit('connectionStart', { 
      config: {
        ...config,
        signal: abortController.signal
      },
      sequence: currentSequence 
    });
  };

  const disconnect = () => {
    connectionSequence++; // Invalidate any ongoing operations
    intentionalDisconnect = true; // Mark as intentional disconnect
    
    if (abortController) {
      // Clear the timeout if it exists
      if ((abortController as any)._connectTimeout) {
        clearTimeout((abortController as any)._connectTimeout);
      }
      abortController.abort();
      abortController = null;
    }

    setState('closed');
    emitter.emit('connectionEnd');
  };

  const getState = () => state;
  
  const isConnected = () => state === 'connected';

  // Listen for state updates from SSE adapter
  emitter.on('sseStateChange', (sseState?: string) => {
    if (!sseState) return;
    switch (sseState) {
      case 'open':
        // Clear the fallback timeout since connection actually opened
        if (abortController && (abortController as any)._connectTimeout) {
          clearTimeout((abortController as any)._connectTimeout);
        }
        setState('connected');
        break;
      case 'connecting':
        setState('connecting');
        break;
      case 'error':
        // Clear the fallback timeout on error
        if (abortController && (abortController as any)._connectTimeout) {
          clearTimeout((abortController as any)._connectTimeout);
        }
        setState('error');
        break;
      case 'closed':
        if (state !== 'idle') {
          setState('closed');
        }
        break;
    }
  });

  // Handle connection lost events
  emitter.on('sseConnectionLost', () => {
    // Only retry if it wasn't an intentional disconnect
    if (!intentionalDisconnect && state === 'connected') {
      setState('connecting');
      emitter.emit('connectionRetry');
    }
  });

  return {
    connect,
    disconnect,
    getState,
    isConnected,
  };
}