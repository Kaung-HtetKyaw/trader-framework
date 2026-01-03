/**
 * @deprecated This hook is deprecated. Instead:
 * 1. For Redux state: Use useSelector and dispatch directly
 * 2. For local state: Use useState with useEffect for prop synchronization
 * 3. For derived state: Use useMemo
 *
 * Example with Redux:
 * ```typescript
 * const value = useSelector(state => state.value);
 * const dispatch = useDispatch();
 * const onChange = (newValue) => dispatch(setValue(newValue));
 * ```
 *
 * Example with local state:
 * ```typescript
 * const [value, setValue] = useState(initialValue);
 * useEffect(() => {
 *   if (value !== propValue) {
 *     setValue(propValue);
 *   }
 * }, [propValue]);
 * ```
 */

import isEqual from 'lodash/isEqual';
import { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react';

export interface UseStateFromPropsOpts<T> {
  mergeFunc?: (prevData: T, state: T, newData: T) => T;
  onRefresh?: (data: T) => void;
  onChange?: (newState: T) => void;
}

function useStateFromProps<T>(
  data: T,
  opts?: UseStateFromPropsOpts<T>
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setInternalState] = useState(data);
  const [prevData, setPrevData] = useState(data);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Wrap setState to call onChange when state changes
  const setState: Dispatch<SetStateAction<T>> = (value) => {
    const newState =
      value instanceof Function ? value(stateRef.current) : value;
    setInternalState(newState);
    opts?.onChange?.(newState);
  };

  useEffect(() => {
    if (!isEqual(prevData, data)) {
      const mergeFunc = opts?.mergeFunc;
      const newData =
        typeof mergeFunc === 'function'
          ? mergeFunc(prevData, stateRef.current, data)
          : data;

      setInternalState(newData);
      setPrevData(data);

      opts?.onRefresh?.(newData);
      opts?.onChange?.(newData);
    }
  }, [data, prevData, opts]);

  return [state, setState];
}

export default useStateFromProps;
