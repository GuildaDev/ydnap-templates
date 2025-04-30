import { expect, it, describe, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import useDebounceCallback from '.';

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

describe('useDebounceCallback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Should debounce callbacks and execute the last one for each key', async () => {
    const { result } = renderHook(() =>
      useDebounceCallback(getSomeData, debounceTime)
    );

    // Call the debounced callback without key, it will debounce by default
    result.current.debounce(1, 1, { obj: false });
    result.current.debounce(1, 4, { obj: true });
    result.current.debounce(1, 4, { obj: false });
    result.current.debounce(1, 2, { obj: false });
    result.current.debounce(1, 5, { obj: false });
    result.current.debounce(1, 8, { obj: true });

    // Wait for the debounce time to elapse
    await new Promise((resolve) => setTimeout(resolve, debounceTime + 10));

    expect(getSomeData).toHaveBeenCalledTimes(1);
    expect(getSomeData).toHaveBeenCalledWith(1, 8, { obj: true });
  });

  it('Should not debounce if flush', async () => {
    const { result } = renderHook(() =>
      useDebounceCallback(getSomeData, 10000000)
    );

    // Call the debounced callback without key, it will debounce by default
    result.current.debounce(1, 1, { obj: false });
    result.current.debounce(1, 4, { obj: true });
    result.current.debounce(1, 4, { obj: false });
    result.current.debounce(1, 2, { obj: false });
    result.current.debounce(1, 5, { obj: false });
    result.current.debounce(1, 8, { obj: true });

    result.current.flush();

    expect(getSomeData).toHaveBeenCalledTimes(1);
    expect(getSomeData).toHaveBeenCalledWith(1, 8, { obj: true });
  });

  it('Should cancel debounce callback', async () => {
    const { result } = renderHook(() =>
      useDebounceCallback(getSomeData, debounceTime)
    );

    // Call the debounced callback without key, it will debounce by default
    result.current.debounce(1, 1, { obj: false });
    result.current.debounce(1, 4, { obj: true });
    result.current.debounce(1, 4, { obj: false });
    result.current.debounce(1, 2, { obj: false });
    result.current.debounce(1, 5, { obj: false });
    result.current.debounce(1, 8, { obj: true });

    result.current.cancel();

    expect(getSomeData).toHaveBeenCalledTimes(0);
  });
});
