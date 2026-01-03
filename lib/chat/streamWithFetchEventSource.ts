import { SSEClient } from './sse-client';
import type { SSEConnectionConfig, SSEConnectionState, SSEEventHandlers } from '../../types/chat/sse-types';

export async function postSSE({
  url,
  body,
  signal,
  onChunk,
  onDone,
  onError,
  token,
  onEvent,
  onConnectionStateChange
}: {
  url: string;
  body: unknown;
  signal?: AbortSignal;
  onChunk: (text: string) => void;
  onDone?: () => void;
  onError?: (e: unknown) => void;
  token?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEvent?: (event: string, data: any) => void;
  onConnectionStateChange?: (state: SSEConnectionState) => void;
}) {
  const client = SSEClient();
  
  const config: SSEConnectionConfig = {
    url,
    body,
    token,
  };

  const handlers: SSEEventHandlers = {
    onChunk,
    onEvent,
    onError,
    onComplete: onDone,
    onConnectionStateChange,
  };

  if (signal) {
    signal.addEventListener('abort', () => {
      client.disconnect();
    });
  }

  try {
    await client.connect(config, handlers);
  } catch (error) {
    onError?.(error);
  }
}
