import { useRef } from 'react';

type DebounceKey = string | symbol | number;
const DEBOUNCE_ERR_KEY = 'Key is required for debouncing';

/**
 * A custom hook that returns a debounced function, which delays the execution
 * of the provided callback until after a specified delay has elapsed since the
 * last time it was invoked with the same key.
 *
 * @template T - The type of the callback function.
 * @param callback - The function to be debounced. It will be executed after the
 * delay period if no further calls are made with the same key.
 * @param delay - The delay in milliseconds to wait before invoking the callback.
 * @returns A debounced function that accepts a unique key and the arguments
 * to pass to the callback. The key is used to manage separate debounce timers.
 * 
 * @throws {TypeError} If the provided key is not a valid primitive type (e.g.,
 * string, number, or symbol).
 */
export default function useKeyedDebouncedCallback<
  T extends (...args: any[]) => void,
>(callback: T, delay: number) {
  const timeouts = useRef(
    new Map<DebounceKey, ReturnType<typeof setTimeout>>()
  );

  function debouncedFunction(key: DebounceKey, ...args: Parameters<T>) {
    if (!key || ['object', 'function'].includes(typeof key)) {
      throw new TypeError(DEBOUNCE_ERR_KEY);
    }

    if (timeouts.current.has(key)) {
      clearTimeout(timeouts.current.get(key));
    }

    const timeout = setTimeout(() => {
      callback(...args);
      timeouts.current.delete(key);
    }, delay);

    timeouts.current.set(key, timeout);
  }

  return debouncedFunction;
}
