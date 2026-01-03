/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  SSEMessage,
  SSELLMResponseEvent,
  SSELLMSuggestionEvent,
  SSEDeltaEvent,
  ParsedSSEEvent,
} from '../../types/chat/sse-types';

function isLLMResponseEvent(data: any): data is SSELLMResponseEvent {
  return typeof data === 'object' && data !== null && 'm' in data;
}

function isLLMSuggestionEvent(data: any): data is SSELLMSuggestionEvent {
  return typeof data === 'object' && data !== null && 'a' in data;
}

function isDeltaEvent(data: any): data is SSEDeltaEvent {
  return typeof data === 'object' && data !== null && ('delta' in data || 'text' in data);
}

function parseSuggestionData(data: SSELLMSuggestionEvent): any {
  if (typeof data.a === 'string') {
    try {
      return JSON.parse(data.a.trim());
    } catch {
      return data.a;
    }
  }
  return data.a;
}

export function parseSSEEvent(message: SSEMessage): ParsedSSEEvent | null {
  const { data, event } = message;

  if (!data) return null;

  if (data === '[DONE]') {
    return { type: 'done', data: null, raw: message };
  }

  try {
    const parsedData = JSON.parse(data);

    if (event === 'llm.responsed' && isLLMResponseEvent(parsedData)) {
      return { type: 'llm.responsed', data: parsedData, raw: message };
    }

    if (event === 'llm.suggested' && isLLMSuggestionEvent(parsedData)) {
      return { type: 'llm.suggested', data: parseSuggestionData(parsedData), raw: message };
    }

    if (isDeltaEvent(parsedData)) {
      return { type: 'delta', data: parsedData, raw: message };
    }

    // If we have data with 'm' field but no event type, treat as llm.responsed
    if (!event && parsedData && typeof parsedData === 'object' && 'm' in parsedData) {
      return { type: 'llm.responsed', data: parsedData, raw: message };
    }

    return { type: (event as ParsedSSEEvent['type']) || 'unknown', data: parsedData, raw: message };
  } catch (error) {
    console.error('Error parsing SSE event:', error);
    return { type: 'raw', data, raw: message };
  }
}

export function extractTextContent(event: ParsedSSEEvent): string | null {

  switch (event.type) {
    case 'llm.responsed': {
      const responseData = event.data as SSELLMResponseEvent;
      return responseData.m ?? null;
    }
    case 'delta': {
      const deltaData = event.data as SSEDeltaEvent;
      return deltaData.delta ?? deltaData.text ?? null;
    }
    case 'raw': {
      return event.data as string;
    }
    case 'unknown': {
      if (typeof event.data === 'object' && event.data?.m && typeof (event.data as any).m === 'string') {
        return (event.data as any).m;
      }
      return null;
    }
    default:
      return null;
  }
}

export function extractEventData(event: ParsedSSEEvent): any {
  if (event.type === 'llm.suggested') {
    const suggestionData = event.data as SSELLMSuggestionEvent;
    return suggestionData;
  }
  if (event.type === 'system.warning') {
    return event.data;
  }
  return null;
}

export const SSEEventParser = {
  parseEvent: parseSSEEvent,
  extractTextContent,
  extractEventData,
};
