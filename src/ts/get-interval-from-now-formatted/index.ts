export const INTERVAL_DATE_ERR =
  'Invalid date provided. Please provide a valid Date object.';

/**
 * Formats the time interval between the given date and the current date
 * into a human-readable relative time string.
 */
export default function getIntervalFromNowFormatted(
  date: Date,
  locale: Intl.LocalesArgument
): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new TypeError(INTERVAL_DATE_ERR);
  }

  const now = new Date();
  const diffMs = date.getTime() - now.getTime();

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'always' });

  const seconds = diffMs / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;

  if (Math.abs(days) >= 1) {
    return rtf.format(Math.round(days), 'day');
  }

  if (Math.abs(hours) >= 1) {
    return rtf.format(Math.round(hours), 'hour');
  }

  if (Math.abs(minutes) >= 1) {
    return rtf.format(Math.round(minutes), 'minute');
  }

  return rtf.format(Math.round(seconds), 'second');
}
