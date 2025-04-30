import { expect, it, describe, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import useKeyedDebouncedCallback from '.';

const getSomeData = vi.fn(
  (id: number, quantity: number, options: { obj?: boolean }) => {
    return {
      id,
      quantity,
      ...options,
    };
  }
);
const debounceTime = 10;

describe('useKeyedDebouncedCallback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Should call many callbacks and execute the last one', async () => {
    const { result } = renderHook(() =>
      useKeyedDebouncedCallback(getSomeData, debounceTime)
    );

    // Call the debounced callback without key, it will debounce by default
    result.current(Symbol.for('product_1'), 1, 1, { obj: false });
    result.current(Symbol.for('product_1'), 1, 2, { obj: false });
    result.current(Symbol.for('product_1'), 1, 3, { obj: true });

    // Wait for the debounce time to elapse
    await new Promise((resolve) => setTimeout(resolve, debounceTime + 10));

    // Verify the callback was called once
    expect(getSomeData).toHaveBeenCalledTimes(1);

    // Should call the last callback, passing correct quantity
    expect(getSomeData).toHaveBeenCalledWith(1, 3, { obj: true });
  });

  it('Should debounce callbacks by key and execute the last one for each key', async () => {
    const { result } = renderHook(() =>
      useKeyedDebouncedCallback(getSomeData, debounceTime)
    );

    // Call the debounced callback without key, it will debounce by default
    result.current('key1', 1, 1, { obj: false });
    result.current('key2', 1, 4, { obj: true });
    result.current('key1', 1, 4, { obj: false });
    result.current('key2', 1, 2, { obj: false });
    result.current('key1', 1, 5, { obj: false });
    result.current('key2', 1, 8, { obj: true });

    // Wait for the debounce time to elapse
    await new Promise((resolve) => setTimeout(resolve, debounceTime + 10));

    expect(getSomeData).toHaveBeenCalledTimes(2);
    expect(getSomeData).toHaveBeenCalledWith(1, 5, { obj: false });
    expect(getSomeData).toHaveBeenCalledWith(1, 8, { obj: true });
  });

  it('Should fail if passing non valid key', async () => {
    const { result } = renderHook(() =>
      useKeyedDebouncedCallback(getSomeData, debounceTime)
    );

    // Call the debounced callback without key, it will debounce by default
    expect(() => {
      result.current('', 1, 1, { obj: false });
    }).toThrowError(new TypeError('Key is required for debouncing'));

    expect(() => {
      // @ts-expect-error - testing invalid key
      result.current(null, 1, 1, { obj: false });
    }).toThrowError(new TypeError('Key is required for debouncing'));

    expect(() => {
      // @ts-expect-error - testing invalid key
      result.current(undefined, 1, 1, { obj: false });
    }).toThrowError(new TypeError('Key is required for debouncing'));

    expect(() => {
      // @ts-expect-error - testing invalid key
      result.current(false, 1, 1, { obj: false });
    }).toThrowError(new TypeError('Key is required for debouncing'));

    expect(() => {
      result.current(0, 1, 1, { obj: false });
    }).toThrowError(new TypeError('Key is required for debouncing'));

    expect(() => {
      // @ts-expect-error - testing invalid key
      result.current({}, 1, 1, { obj: false });
    }).toThrowError(new TypeError('Key is required for debouncing'));

    expect(() => {
      // @ts-expect-error - testing invalid key
      result.current([], 1, 1, { obj: false });
    }).toThrowError(new TypeError('Key is required for debouncing'));

    expect(() => {
      // @ts-expect-error - testing invalid key
      result.current(() => {}, 1, 1, { obj: false });
    }).toThrowError(new TypeError('Key is required for debouncing'));

    // Wait for the debounce time to elapse
    await new Promise((resolve) => setTimeout(resolve, debounceTime + 10));
    expect(getSomeData).toHaveBeenCalledTimes(0);
  });
});
