
import { fetchEventSource } from '@microsoft/fetch-event-source';
import type {
  SSEConnectionConfig,
  SSEEventHandlers,
  SSEConnectionInfo,
  SSEMessage,
} from '../../types/chat/sse-types';
import { SSEConnectionState } from '../../types/chat/sse-types';
import { SSEEventParser } from './sse-parser';

export function SSEClient(updateConnectionInfo?: (info: SSEConnectionInfo) => void) {
  let abortController: AbortController | null = null;
  let handlers: SSEEventHandlers = {};
  let config: SSEConnectionConfig | null = null;

  let connectionInfo: SSEConnectionInfo = {
    state: SSEConnectionState.DISCONNECTED,
  };

  const updateState = (state: SSEConnectionState, error?: Error) => {
    connectionInfo = { state, error };
    updateConnectionInfo?.({ ...connectionInfo });
    handlers.onConnectionStateChange?.(state);
  };

  const disconnect = () => {
    abortController?.abort();
    abortController = null;
    updateState(SSEConnectionState.DISCONNECTED);
  };

  const getConnectionInfo = (): SSEConnectionInfo => ({ ...connectionInfo });

  const handleMessage = (event: SSEMessage) => {
    // Normalize to our message shape (fetchEventSource already provides .data and .event)
    const parsed = SSEEventParser.parseEvent({ data: event.data, event: event.event });
    if (!parsed) return;

    if (parsed.type === 'done' || parsed.data === '[DONE]') {
      handlers.onComplete?.();
      return;
    }

    const text = SSEEventParser.extractTextContent(parsed);
    if (text) handlers.onChunk?.(text);

    const payload = SSEEventParser.extractEventData(parsed);
    if (payload) handlers.onEvent?.(parsed.type, payload);
  };

  const handleStreamError = (error: unknown) => {
    if (abortController?.signal.aborted) return;
    updateState(SSEConnectionState.ERROR, error as Error);
    handlers.onError?.(error);
  };

  const handleStreamClose = () => {
    if (abortController?.signal.aborted) return;
    // small grace window if backend forgot to send [DONE]
    setTimeout(() => handlers.onComplete?.(), 200);
  };

  const establishConnection = async () => {
    if (!config) throw new Error('No connection configuration provided');

    abortController = new AbortController();
    const { url, body, token } = config;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    await fetchEventSource(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: abortController.signal,
      onopen: async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        updateState(SSEConnectionState.CONNECTED);
      },
      onmessage: (ev) => handleMessage({ data: ev.data, event: ev.event }),
      onerror: (err) => {
        handleStreamError(err);
        throw err;
      },
      onclose: handleStreamClose,
      openWhenHidden: true,
    });
  };

  const connect = async (cfg: SSEConnectionConfig, h: SSEEventHandlers) => {
    config = cfg;
    handlers = h;
    disconnect();
    updateState(SSEConnectionState.CONNECTING);
    try {
      await establishConnection();
    } catch (err) {
      updateState(SSEConnectionState.ERROR, err as Error);
      handlers.onError?.(err);
    }
  };

  return {
    connect,
    disconnect,
    getConnectionInfo,
    isConnected: () => connectionInfo.state === SSEConnectionState.CONNECTED,
  };
}
