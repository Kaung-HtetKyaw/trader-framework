import { useEffect, useCallback, useRef } from 'react';

type KeyPressCallback = (event: KeyboardEvent) => void;

interface UseKeyPressCallbackOptions {
  target?: EventTarget | null;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  disableInInputs?: boolean;
}

const useKeyPress = (
  targetKey: string | string[],
  callback: KeyPressCallback,
  options: UseKeyPressCallbackOptions = {}
): void => {
  const { target = window, preventDefault = false, stopPropagation = false, disableInInputs = true } = options;

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Skip if focus is on input elements (optional)
      if (disableInInputs) {
        const activeElement = document.activeElement;
        if (
          activeElement instanceof HTMLInputElement ||
          activeElement instanceof HTMLTextAreaElement ||
          (activeElement as HTMLElement)?.isContentEditable
        ) {
          return;
        }
      }

      const keys = Array.isArray(targetKey) ? targetKey : [targetKey];

      if (keys.includes(event.key)) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        callbackRef.current(event);
      }
    },
    [targetKey, preventDefault, stopPropagation, disableInInputs]
  );

  useEffect(() => {
    if (!target) return;

    target.addEventListener('keydown', handleKeyDown as EventListener);

    return () => {
      target.removeEventListener('keydown', handleKeyDown as EventListener);
    };
  }, [handleKeyDown, target]);
};

export default useKeyPress;
