import { useEffect, useRef } from 'react';

export type UseDebounceFn<T> = (...args: T[]) => void;

function useDebounce<T>(debounceFn: UseDebounceFn<T>, defaultState?: T, time = 500): UseDebounceFn<T> {
  const timer = useRef<NodeJS.Timeout | undefined>(undefined);
  useEffect(() => () => timer.current && clearTimeout(timer.current), []);

  return (...args: T[]) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => debounceFn(...args), time);
  };
}

export default useDebounce;
