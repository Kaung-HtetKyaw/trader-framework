import { useState, useEffect } from 'react';

export type SetLocalStorageValue<T> = T | ((prevValue: T) => T);
export type SetLocalStorage<T> = (value: SetLocalStorageValue<T>) => void;

export default function useLocalStorage<T>(key: string, initialValue: T): [T, SetLocalStorage<T>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Load from localStorage after hydration
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Could not read ${key} from localStorage`, error);
    }
  }, [key]);

  const setValue = (value: SetLocalStorageValue<T>) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);

    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch {
      console.warn(`Could not save ${key} to localStorage`);
    }
  };

  return [storedValue, setValue];
}
