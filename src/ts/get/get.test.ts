import { describe, it, expect } from 'vitest';
import { get } from '.';

describe('get', () => {
  it('should return the value at the specified path', () => {
    const obj = { a: { b: { c: 42 } } };
    const result = get(obj, 'a.b.c');
    expect(result).toBe(42);
  });

  it('should return the default value if the path does not exist', () => {
    const obj = { a: { b: { c: 42 } } } as any;
    const result = get(obj, 'a.b.d', 'default');
    expect(result).toBe('default');
  });

  it('should handle array indices in the path', () => {
    const obj = { a: [{ b: 42 }, { b: 43 }] };
    const result = get(obj, 'a[1].b');
    expect(result).toBe(43);
  });

  it('should return the default value if the object is null or undefined', () => {
    const result = get(null, 'a.b.c', 'default');
    expect(result).toBe('default');
  });

  it('should return undefined if the path does not exist and no default value is provided', () => {
    const obj = { a: { b: { c: 42 } } };
    const result = get(obj, 'a.b.d');
    expect(result).toBeUndefined();
  });

  it('should handle nested arrays', () => {
    const obj = { a: [{ b: [{ c: 42 }] }] };
    const result = get(obj, 'a[0].b[0].c');
    expect(result).toBe(42);
  });

  it('should handle top-level properties', () => {
    const obj = { a: 42 };
    const result = get(obj, 'a');
    expect(result).toBe(42);
  });

  it('should handle empty path', () => {
    const obj = { a: 42 };
    const result = get(obj, '' as any, 'default');
    expect(result).toBe('default');
  });

  it('should handle non-object values gracefully', () => {
    const obj = { a: 42 };
    const result = get(obj, 'a.b', 'default');
    expect(result).toBe('default');
  });
});
