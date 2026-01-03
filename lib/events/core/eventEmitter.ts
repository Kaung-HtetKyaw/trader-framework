// lib/events/core/eventEmitter.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

export type EventHandler<T = any> = (data?: T) => void;

export interface EventEmitter {
  on: <T = any>(event: string, handler: EventHandler<T>) => () => void;
  once: <T = any>(event: string, handler: EventHandler<T>) => () => void;
  off: <T = any>(event: string, handler: EventHandler<T>) => void;
  emit: <T = any>(event: string, data?: T) => void;
  removeAllListeners: (event?: string) => void;
}

export function createEventEmitter(): EventEmitter {
  const eventMap = new Map<string, EventHandler[]>();
  
  const on = <T = any>(event: string, handler: EventHandler<T>) => {
    if (!eventMap.has(event)) {
      eventMap.set(event, []);
    }
    eventMap.get(event)!.push(handler);
    
    // Return unsubscribe function
    return () => off(event, handler);
  };
  
  const once = <T = any>(event: string, handler: EventHandler<T>) => {
    const wrapper: EventHandler<T> = (data) => {
      off(event, wrapper);
      handler(data);
    };
    return on(event, wrapper);
  };
  
  const off = <T = any>(event: string, handler: EventHandler<T>) => {
    const handlers = eventMap.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
      if (handlers.length === 0) {
        eventMap.delete(event);
      }
    }
  };
  
  const emit = <T = any>(event: string, data?: T) => {
    const handlers = eventMap.get(event);
    if (handlers) {
      // Create a copy to prevent issues if handlers modify the array during iteration
      [...handlers].forEach(handler => handler(data));
    }
  };
  
  const removeAllListeners = (event?: string) => {
    if (event) {
      eventMap.delete(event);
    } else {
      eventMap.clear();
    }
  };
  
  return {
    on,
    once,
    off,
    emit,
    removeAllListeners,
  };
}