import { expect, it, describe, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import useKeyedDebouncedCallback from '.';

describe('useKeyedDebouncedCallback', () => {
  it('Should call many callbacks debounced by key', async () => {
    const callback_1 = vi.fn();
    const debounceTime = 1000;

    const { result } = renderHook(() =>
      useKeyedDebouncedCallback(callback_1, debounceTime)
    );

    // Call the debounced callback without key, it will debounce by default
    result.current({ item_id: 1 });
    result.current({ item_id: 2 });
    result.current({ item_id: 3 });

    expect(callback_1).toHaveBeenCalledTimes(1);
    // Should call the last callback
    // The last call should be the one with item_id: 3
    expect(callback_1).toHaveBeenNthCalledWith(1, { item_id: 3 });

    // Wait for debounce time to pass
    await new Promise((resolve) => setTimeout(resolve, debounceTime + 10));
    // reset counter
    callback_1.mockClear();

    // passing key to the callback, it will debounce by key
    result.current({ item_id: 1 }, 'key1');
    result.current({ item_id: 1 }, 'key2');
    result.current({ item_id: 2 }, 'key1');
    result.current({ item_id: 4 }, 'key1');
    result.current({ item_id: 2 }, 'key2');
    result.current({ item_id: 3 }, 'key2');

    // Wait for debounce time to pass
    await new Promise((resolve) => setTimeout(resolve, debounceTime + 10));

    expect(callback_1).toHaveBeenCalledTimes(2);
    expect(callback_1).toHaveBeenNthCalledWith(1, { item_id: 4 }, ['key1']);
    expect(callback_1).toHaveBeenNthCalledWith(2, { item_id: 3 }, ['key2']);
  });
});
