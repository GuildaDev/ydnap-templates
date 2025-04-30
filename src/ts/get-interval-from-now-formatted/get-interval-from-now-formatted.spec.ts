import { expect, it, describe, vi, beforeEach } from 'vitest';
import getIntevalFromNowFormatted, { INTERVAL_DATE_ERR } from '.';

describe('getRemainingTimeFormatted', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should return formatted time remaining in the future', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 day in the future
    const locale = 'en-US';
    const result = getIntevalFromNowFormatted(futureDate, locale);
    expect(result).toBe('in 1 day');
  });

  it('should return formatted time remaining in the past', () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24); // 1 day in the past
    const locale = 'en-US';
    const result = getIntevalFromNowFormatted(pastDate, locale);
    expect(result).toBe('1 day ago');
  });

  it('should return formatted time for 12 hours in the future', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 12); // 12 hours in the future
    const locale = 'en-US';
    const result = getIntevalFromNowFormatted(futureDate, locale);
    expect(result).toBe('in 12 hours');
  });

  it('should return formatted time for 12 minutes in the future', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 12); // 12 minutes in the future
    const locale = 'en-US';
    const result = getIntevalFromNowFormatted(futureDate, locale);
    expect(result).toBe('in 12 minutes');
  });

  it('should return formatted time in Portuguese', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 day in the future
    const locale = 'pt-BR';
    const result = getIntevalFromNowFormatted(futureDate, locale);
    expect(result).toBe('em 1 dia');
  });

  it('should return formatted time in Europe Portuguese', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 day in the future
    const locale = 'pt-PT';
    const result = getIntevalFromNowFormatted(futureDate, locale);
    expect(result).toBe('dentro de 1 dia');
  });

  it('should return formatted time in Spanish', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 day in the future
    const locale = 'es-ES';
    const result = getIntevalFromNowFormatted(futureDate, locale);
    expect(result).toBe('dentro de 1 día');
  });

  it('should throw for invalid date', () => {
    const invalidDate = new Date('invalid-date');
    const locale = 'en-US';
    expect(() => getIntevalFromNowFormatted(invalidDate, locale)).toThrowError(
      INTERVAL_DATE_ERR
    );
  });
});
