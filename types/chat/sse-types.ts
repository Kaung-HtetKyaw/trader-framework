export interface SSEMessage {
  data: string;
  event?: string;
  id?: string;
  retry?: number;
}

export interface SSELLMResponseEvent {
  m: string;
}

export interface SSELLMSuggestionEvent {
  a: string | object;
}

export interface SSEDeltaEvent {
  delta?: string;
  text?: string;
}

export enum SSEConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error',
}

export interface SSEConnectionConfig {
  url: string;
  body: unknown;
  token?: string;
}

export interface SSEEventHandlers {
  onChunk?: (text: string) => void;
  onEvent?: (event: string, data: any) => void;
  onConnectionStateChange?: (state: SSEConnectionState) => void;
  onError?: (error: unknown) => void;
  onComplete?: () => void;
}

export interface SSEConnectionInfo {
  state: SSEConnectionState;
  error?: Error;
}

export type SSEEventType = 'llm.responsed' | 'llm.suggested' | 'done' | 'delta' | 'raw' | string;

export interface ParsedSSEEvent {
  type: SSEEventType;
  data: any;
  raw: SSEMessage;
}