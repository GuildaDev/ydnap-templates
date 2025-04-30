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
    result.current.debounce(Symbol.for('product_1'), 1, 1, { obj: false });
    result.current.debounce(Symbol.for('product_1'), 1, 2, { obj: false });
    result.current.debounce(Symbol.for('product_1'), 1, 3, { obj: true });

    // Wait for the debounce time to elapse
    await new Promise((resolve) => setTimeout(resolve, debounceTime + 10));

    // Verify the callback was called once
    expect(getSomeData).toHaveBeenCalledTimes(1);

    // Should call the last callback, passing correct quantity
    expect(getSomeData).toHaveBeenCalledWith(1, 3, { obj: true });
  });

  it('Should cancel the debounced callbacks', async () => {
    const { result } = renderHook(() =>
      useKeyedDebouncedCallback(getSomeData, debounceTime)
    );

    // Call the debounced callback without key, it will debounce by default
    result.current.debounce(Symbol.for('product_1'), 1, 1, { obj: false });
    result.current.debounce(Symbol.for('product_1'), 1, 2, { obj: false });
    result.current.debounce(Symbol.for('product_1'), 1, 3, { obj: true });

    // Cancel the debounced callback
    result.current.cancel(Symbol.for('product_1'));

    // Wait for the debounce time to elapse
    await new Promise((resolve) => setTimeout(resolve, debounceTime + 10));

    // Verify the callback was not called
    expect(getSomeData).toHaveBeenCalledTimes(0);
  });

  it('Should flush the debounced callbacks', async () => {
    const { result } = renderHook(() =>
      useKeyedDebouncedCallback(getSomeData, 100000000)
    );

    // Call the debounced callback without key, it will debounce by default
    result.current.debounce(Symbol.for('product_1'), 1, 1, { obj: false });
    result.current.debounce(Symbol.for('product_1'), 1, 2, { obj: false });
    result.current.debounce(Symbol.for('product_1'), 1, 3, { obj: true });
    result.current.debounce(Symbol.for('product_1'), 1, 4, { obj: true });
    result.current.debounce(Symbol.for('product_1'), 1, 5, { obj: true });
    result.current.debounce(Symbol.for('product_1'), 1, 6, { obj: true });

    // Flush the debounced callback
    result.current.flush(Symbol.for('product_1'));

    // Verify the callback was called once
    expect(getSomeData).toHaveBeenCalledTimes(1);
    // Should call the last callback, passing correct quantity
    expect(getSomeData).toHaveBeenCalledWith(1, 6, { obj: true });
  });

  it('Should flush all the debounced callbacks', async () => {
    const { result } = renderHook(() =>
      useKeyedDebouncedCallback(getSomeData, 100000000)
    );

    // Call the debounced callback without key, it will debounce by default
    result.current.debounce(Symbol.for('product_1'), 1, 1, { obj: false });
    result.current.debounce(Symbol.for('product_1'), 1, 2, { obj: false });
    result.current.debounce(Symbol.for('product_2'), 1, 3, { obj: true });
    result.current.debounce(Symbol.for('product_2'), 1, 4, { obj: true });
    result.current.debounce(Symbol.for('product_3'), 1, 5, { obj: true });
    result.current.debounce(Symbol.for('product_3'), 1, 6, { obj: true });

    // Flush All the debounced callback
    result.current.flushAll();

    expect(getSomeData).toHaveBeenCalledTimes(3);
    expect(getSomeData).toHaveBeenCalledWith(1, 2, { obj: false });
    expect(getSomeData).toHaveBeenCalledWith(1, 4, { obj: true });
    expect(getSomeData).toHaveBeenCalledWith(1, 6, { obj: true });
  });

  it('Should cancel the debounced callbacks', async () => {
    const { result } = renderHook(() =>
      useKeyedDebouncedCallback(getSomeData, debounceTime)
    );

    // Call the debounced callback without key, it will debounce by default
    result.current.debounce(Symbol.for('product_1'), 1, 1, { obj: false });
    result.current.debounce(Symbol.for('product_1'), 1, 2, { obj: false });
    result.current.debounce(Symbol.for('product_1'), 1, 3, { obj: true });

    // Cancel the debounced callback
    result.current.cancel(Symbol.for('product_1'));

    // Wait for the debounce time to elapse
    await new Promise((resolve) => setTimeout(resolve, debounceTime + 10));

    // Verify the callback was not called
    expect(getSomeData).toHaveBeenCalledTimes(0);
  });

  it('Should debounce callbacks by key and execute the last one for each key', async () => {
    const { result } = renderHook(() =>
      useKeyedDebouncedCallback(getSomeData, debounceTime)
    );

    // Call the debounced callback without key, it will debounce by default
    result.current.debounce('key1', 1, 1, { obj: false });
    result.current.debounce('key2', 1, 4, { obj: true });
    result.current.debounce('key1', 1, 4, { obj: false });
    result.current.debounce('key2', 1, 2, { obj: false });
    result.current.debounce('key1', 1, 5, { obj: false });
    result.current.debounce('key2', 1, 8, { obj: true });

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
      result.current.debounce('', 1, 1, { obj: false });
    }).toThrowError(new TypeError('Key is required for debouncing'));

    expect(() => {
      // @ts-expect-error - testing invalid key
      result.current.debounce(null, 1, 1, { obj: false });
    }).toThrowError(new TypeError('Key is required for debouncing'));

    expect(() => {
      // @ts-expect-error - testing invalid key
      result.current.debounce(undefined, 1, 1, { obj: false });
    }).toThrowError(new TypeError('Key is required for debouncing'));

    expect(() => {
      // @ts-expect-error - testing invalid key
      result.current.debounce(false, 1, 1, { obj: false });
    }).toThrowError(new TypeError('Key is required for debouncing'));

    expect(() => {
      result.current.debounce(0, 1, 1, { obj: false });
    }).toThrowError(new TypeError('Key is required for debouncing'));

    expect(() => {
      // @ts-expect-error - testing invalid key
      result.current.debounce({}, 1, 1, { obj: false });
    }).toThrowError(new TypeError('Key is required for debouncing'));

    expect(() => {
      // @ts-expect-error - testing invalid key
      result.current.debounce([], 1, 1, { obj: false });
    }).toThrowError(new TypeError('Key is required for debouncing'));

    expect(() => {
      // @ts-expect-error - testing invalid key
      result.current.debounce(() => {}, 1, 1, { obj: false });
    }).toThrowError(new TypeError('Key is required for debouncing'));

    // Wait for the debounce time to elapse
    await new Promise((resolve) => setTimeout(resolve, debounceTime + 10));
    expect(getSomeData).toHaveBeenCalledTimes(0);
  });
});
