import { effect, signal, type Signal } from '@preact/signals-react';

/**
 * Creates a signal that syncs with localStorage.
 *
 * @param key - The localStorage key to use
 * @param defaultValue - The default value to use if localStorage is empty or unavailable (SSR)
 * @returns A signal that automatically syncs with localStorage
 */
export function localStorageSignal<T>(key: string, defaultValue: T): Signal<T> {
  const initialValue = (() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const stored = localStorage.getItem(key);
      if (stored === null) {
        return defaultValue;
      }
      return JSON.parse(stored) as T;
    } catch (error) {
      console.error(`Failed to parse localStorage key "${key}":`, error);
      return defaultValue;
    }
  })();

  const sig = signal<T>(initialValue);

  // Sync to localStorage whenever the signal changes
  effect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(key, JSON.stringify(sig.value));
    } catch (error) {
      console.error(`Failed to save to localStorage key "${key}":`, error);
    }
  });

  return sig;
}
