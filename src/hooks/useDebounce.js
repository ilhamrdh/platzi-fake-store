import { useEffect, useState, useMemo } from 'react';

export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    if (typeof delay !== 'number' || delay < 0) {
      throw new Error('Delay must be a non-negative number');
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  const debouncedValueMemo = useMemo(() => debouncedValue, [debouncedValue]);

  return debouncedValueMemo;
};
