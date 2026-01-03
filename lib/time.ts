import {
  intervalToDuration,
  differenceInDays,
  differenceInMonths,
  formatDistanceToNow,
  FormatDistanceToNowOptions,
  FormatDistanceToken,
} from 'date-fns';
import { enUS } from 'date-fns/locale';

export const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  // Get full duration breakdown
  const duration = intervalToDuration({ start: date, end: now });

  // Total days difference
  const totalDays = differenceInDays(now, date);

  // Total months difference
  const totalMonths = differenceInMonths(now, date);

  if (duration.years && duration.years > 0) {
    return duration.years === 1 ? '1 year' : `${duration.years} years`;
  } else if (totalMonths > 0) {
    return totalMonths === 1 ? '1 month' : `${totalMonths} months`;
  } else {
    return totalDays === 1 ? '1 day' : `${totalDays} days`;
  }
};

const customTimeAbbrevLocale = {
  ...enUS,
  formatDistance: (token: FormatDistanceToken, count: number, options?: FormatDistanceToNowOptions) => {
    const result = enUS.formatDistance(token, count, options);
    return result
      .replace(/\bminute\b/g, 'min')
      .replace(/\bminutes\b/g, 'mins')
      .replace(/\bsecond\b/g, 'sec')
      .replace(/\bseconds\b/g, 'secs')
      .replace(/\bhour\b/g, 'hr')
      .replace(/\bhours\b/g, 'hrs')
      .replace(/\about\b/g, '');
  },
};

export const formatAbbrevDistanceToNow = (date: string) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: customTimeAbbrevLocale });
};
