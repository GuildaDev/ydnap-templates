import { useRef } from 'react';

export default function useDebounceCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) {
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const lastArgs = useRef<Parameters<T>>();

  function debouncedFunction(...args: Parameters<T>) {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    lastArgs.current = args;

    timeout.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }

  function cancel() {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = undefined;
    }
  }

  function flush() {
    if (timeout.current) {
      clearTimeout(timeout.current);
      callback(...lastArgs.current);
      timeout.current = undefined;
      lastArgs.current = undefined;
    }
  }

  return {
    debounce: debouncedFunction,
    cancel,
    flush,
  };
}
