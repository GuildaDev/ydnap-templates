import { describe, it, expect } from 'vitest';
import { get } from '.';

describe('get', () => {
  it('should retrieve the value at the given path (dot notation)', () => {
    const obj = { a: { b: { c: 42 } } };
    expect(get(obj, 'a.b.c')).toBe(42);
  });

  it('should retrieve the value at the given path (array notation)', () => {
    const obj = { a: { b: { c: 42 } } };
    expect(get(obj, ['a', 'b', 'c'])).toBe(42);
  });

  it('should return the default value if the path does not exist', () => {
    const obj = { a: { b: { c: 42 } } };
    expect(get(obj, 'a.b.d', 'default')).toBe('default');
  });

  it('should return the default value if the object is null', () => {
    expect(get(null, 'a.b.c', 'default')).toBe('default');
  });

  it('should return the default value if the object is undefined', () => {
    expect(get(undefined, 'a.b.c', 'default')).toBe('default');
  });

  it('should handle array indices in path (dot/bracket notation)', () => {
    const obj = { a: [{ b: 42 }] };
    expect(get(obj, 'a[0].b')).toBe(42);
  });

  it('should handle array indices in path (array notation)', () => {
    const obj = { a: [{ b: 42 }] };
    expect(get(obj, ['a', '0', 'b'])).toBe(42);
  });

  it('should return undefined if no default value is provided and path does not exist', () => {
    const obj = { a: { b: { c: 42 } } };
    expect(get(obj, 'a.b.d')).toBeUndefined();
  });

  it('should handle empty path and return the object itself', () => {
    const obj = { a: { b: { c: 42 } } };
    expect(get(obj, '', 'default')).toBe(obj);
  });

  it('should handle empty path array and return the object itself', () => {
    const obj = { a: { b: { c: 42 } } };
    expect(get(obj, [], 'default')).toBe(obj);
  });
});
