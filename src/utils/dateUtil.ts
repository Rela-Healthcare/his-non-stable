// src/utils/diffForHumans.ts
export function dateForHumans(date: Date | string | number): string {
  const now = new Date();
  const inputDate = new Date(date);
  const secondsDiff = Math.floor((now.getTime() - inputDate.getTime()) / 1000);

  const intervals: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, 'second'],
    [60 * 60, 'minute'],
    [60 * 60 * 24, 'hour'],
    [60 * 60 * 24 * 7, 'day'],
    [60 * 60 * 24 * 30, 'week'],
    [60 * 60 * 24 * 365, 'month'],
    [Infinity, 'year'],
  ];

  const rtf = new Intl.RelativeTimeFormat('en', {numeric: 'auto'});

  for (let i = 0; i < intervals.length; i++) {
    const [threshold, unit] = intervals[i];
    const prevThreshold = i === 0 ? 1 : intervals[i - 1][0];

    if (secondsDiff < threshold) {
      const value = Math.floor(secondsDiff / prevThreshold);
      return rtf.format(-value, unit);
    }
  }

  return 'just now';
}
