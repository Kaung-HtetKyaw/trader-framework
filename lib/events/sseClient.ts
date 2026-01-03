// lib/events/event-sse-client.ts
  /* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import { fetchEventSource } from '@microsoft/fetch-event-source';

type Handler = (data?: any) => void;

type Emitter = {
  on: (event: string, handler: Handler) => () => void;
  once: (event: string, handler: Handler) => () => void;
  off: (event: string, handler: Handler) => void;
  emit: (event: string, data?: any) => void;
};

function createEmitter(): Emitter {
  const map = new Map<string, Handler[]>();
  
  const on = (e: string, h: Handler) => {
    if (!map.has(e)) map.set(e, []);
    map.get(e)!.push(h);
    return () => off(e, h);
  };
  
  const once = (e: string, h: Handler) => {
    const wrap: Handler = (d) => { off(e, wrap); h(d); };
    return on(e, wrap);
  };
  
  const off = (e: string, h: Handler) => { 
    const handlers = map.get(e);
    if (handlers) {
      const index = handlers.indexOf(h);
      if (index > -1) handlers.splice(index, 1);
    }
  };
  
  const emit = (e: string, d?: any) => { 
    map.get(e)?.forEach(fn => fn(d)); 
  };
  
  return { on, once, off, emit };
}

export type SSEConnectConfig = {
  url: string;
  body?: unknown;           // will be JSON.stringify-ed
  token?: string;           // Bearer
  signal?: AbortSignal;     // optional external AbortController
  withCredentials?: boolean; // set true if using cookies across origins
};

export function EventSSEClient(update?: (state: 'connecting' | 'open' | 'error' | 'closed') => void) {
  const emitter = createEmitter();
  let ac: AbortController | null = null;

  const disconnect = () => {
    ac?.abort();
    ac = null;
    update?.('closed');
    emitter.emit('close');
  };

  const connect = async ({ url, body, token, signal, withCredentials }: SSEConnectConfig) => {
    // fresh controller per connection
    ac = new AbortController();
    if (signal) signal.addEventListener('abort', disconnect);

    update?.('connecting');
    emitter.emit('connecting');

    const headers: Record<string, string> = {
      Accept: 'text/event-stream',
      'Content-Type': 'application/json',
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    await fetchEventSource(url, {
      method: 'POST',
      headers,
      body: body == null ? '{}' : (typeof body === 'string' ? body : JSON.stringify(body)),
      signal: ac.signal,
      mode: withCredentials ? 'cors' : undefined,
      credentials: withCredentials ? 'include' : undefined,

      onopen: async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        update?.('open');
        emitter.emit('open');
      },

      onmessage: (ev) => {
        // ev.event is the named SSE event (or empty for "message")
        // ev.data is the string payload
        let payload: any = ev.data;
        try { payload = JSON.parse(ev.data); } catch { /* keep as string */ }

        const name = ev.event || 'message';
        emitter.emit(name, payload);    // e.g. 'k8sEvent.detected'
        emitter.emit('message', payload); // generic hook if you ever want it
      },

      onerror: (err) => {
        update?.('error');
        emitter.emit('error', err);
        // rethrow to let fetch-event-source auto-retry; remove next line to disable retries
        throw err;
      },

      onclose: () => {
        // server closed (may auto-retry). We surface a 'close' + 'connecting' hint.
        emitter.emit('close');
        update?.('connecting');
        emitter.emit('connecting');
      },

      openWhenHidden: true,
    });
  };

  return {
    on: emitter.on,
    once: emitter.once,
    off: emitter.off,
    connect,
    disconnect,
  };
}
