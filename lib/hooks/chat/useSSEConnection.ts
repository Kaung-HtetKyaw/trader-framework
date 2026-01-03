'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SSEClient } from '@/lib/chat/sse-client';
import type {
  SSEConnectionConfig,
  SSEEventHandlers,
  SSEConnectionInfo,
} from '@/types/chat/sse-types';
import { SSEConnectionState } from '@/types/chat/sse-types';

type SSEClientInstance = ReturnType<typeof SSEClient>;
interface UseSSEConnectionResult {
  connectionInfo: SSEConnectionInfo;
  connect: (config: SSEConnectionConfig, handlers: SSEEventHandlers) => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  hasError: boolean;
}

export function useSSEConnection(): UseSSEConnectionResult {
  const [connectionInfo, setConnectionInfo] = useState<SSEConnectionInfo>({
    state: SSEConnectionState.DISCONNECTED,
  });

  const clientRef = useRef<SSEClientInstance | null>(null);

  const updateConnectionInfo = useCallback((info: SSEConnectionInfo) => {
    setConnectionInfo(info);
  }, []);

  const getClient = useCallback((): SSEClientInstance => {
    if (!clientRef.current) {
      clientRef.current = SSEClient(updateConnectionInfo);
    }
    return clientRef.current;
  }, [updateConnectionInfo]);

  const connect = useCallback(async (config: SSEConnectionConfig, handlers: SSEEventHandlers) => {
    const client = getClient();
    await client.connect(config, handlers);
  }, [getClient]);

  const disconnect = useCallback(() => {
    clientRef.current?.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connectionInfo,
    connect,
    disconnect,
    isConnected: connectionInfo.state === SSEConnectionState.CONNECTED,
    isConnecting: connectionInfo.state === SSEConnectionState.CONNECTING,
    hasError: connectionInfo.state === SSEConnectionState.ERROR,
  };
}