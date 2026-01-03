import { Dispatch, FC, ReactNode, SetStateAction, useEffect, useState } from 'react';

interface IDebounceSearchInput {
  children: (prop: Dispatch<SetStateAction<string>>, value: string) => ReactNode;
  setState: (value: string) => void;
  debounce?: number;
  defaultValue?: string;
}

const DebounceSearchInput: FC<IDebounceSearchInput> = ({ setState, debounce = 500, children, defaultValue }) => {
  const [value, setValue] = useState<string>(defaultValue || '');
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (renderCount) {
        setState(value);
      }
      setRenderCount(renderCount + 1);
    }, debounce);
    return () => clearTimeout(timeout);
  }, [value, debounce]);

  useEffect(() => {
    if (defaultValue === '') {
      setValue('');
    }
  }, [defaultValue]);

  return <>{children(setValue, value)}</>;
};

export default DebounceSearchInput;
