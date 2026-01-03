import useLocalStorage from './useLocalStorage';
import { useCallback, useEffect, useState } from 'react';

export type UseFormDraftProps<T> = {
  key: string;
  enabled: boolean;
  onDraftReady: (data: T) => void;
  getValues: () => T;
};

const useFormDraft = <T,>(props: UseFormDraftProps<T>) => {
  const { key, getValues, onDraftReady, enabled } = props;
  const [alreadySetDraft, setAlreadySetDraft] = useState(false);
  const [draft, setDraft] = useLocalStorage<T | undefined>(key, undefined);

  useEffect(() => {
    if (!enabled) return;

    if (draft && !alreadySetDraft) {
      setAlreadySetDraft(true);
      onDraftReady(draft);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, alreadySetDraft, enabled]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(key);
  }, [key]);

  const setDraftByFieldName = useCallback(
    (key: keyof T, value: T[keyof T]) => {
      const draft = getValues();
      draft[key] = value;
      setDraft(draft);
    },
    [getValues, setDraft]
  );

  return { clearDraft, setDraft, setDraftByFieldName };
};

export default useFormDraft;
