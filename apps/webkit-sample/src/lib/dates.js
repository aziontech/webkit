// Date helpers shared by the console list views.
//
// A list row keeps its instant as a real `Date` (`modifiedAt`) and derives the
// display string from it — never the other way round. Parsing a display string
// like "July 20, 2026, 01:03:00 PM" with `new Date()` is engine-dependent (the
// comma before the time is not part of any format the spec requires an engine
// to accept), so a filter built on it would compare garbage on some browsers.

// Composed from two formatters instead of one: a single Intl instance with both
// date and time parts inserts either ", " or " at " depending on the ICU
// version, so the output would drift between environments.
const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "2-digit",
  year: "numeric",
});
const TIME_FORMAT = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

/**
 * The console's "Last Modified" display string: "July 20, 2026, 01:03:00 PM".
 *
 * @param {Date} date
 * @returns {string} Empty string for a missing or invalid date.
 */
export function formatListDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  return `${DATE_FORMAT.format(date)}, ${TIME_FORMAT.format(date)}`;
}

/**
 * `n` days before `from` (default: now), keeping the time of day.
 *
 * @param {number} n
 * @param {Date} [from]
 * @returns {Date}
 */
export const daysAgo = (n, from = new Date()) => {
  const date = new Date(from);
  date.setDate(date.getDate() - n);
  return date;
};

/**
 * `n` months before `from` (default: now). Uses the native month arithmetic, so
 * an overflowing day-of-month rolls forward the way `Date` defines it
 * (March 31 minus one month → March 3).
 *
 * @param {number} n
 * @param {Date} [from]
 * @returns {Date}
 */
export const monthsAgo = (n, from = new Date()) => {
  const date = new Date(from);
  date.setMonth(date.getMonth() - n);
  return date;
};

/**
 * Whether `date` falls inside a Calendar range value.
 *
 * A range whose `end` sits exactly at midnight came from a day-granular pick
 * (the month grid or a preset), so it means "through the end of that day" —
 * comparing against midnight itself would drop every row modified after 00:00
 * on the final day. An `end` that carries a time came from the Period parser or
 * the time fields and is taken literally.
 *
 * @param {Date} date
 * @param {{ start?: Date | null, end?: Date | null } | null} [range]
 * @returns {boolean} True when there is no range to apply.
 */
export function withinRange(date, range) {
  if (!range) return true;
  const { start, end } = range;
  if (!start && !end) return true;
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return false;

  if (start && date.getTime() < start.getTime()) return false;
  if (end) {
    const midnight =
      end.getHours() === 0 &&
      end.getMinutes() === 0 &&
      end.getSeconds() === 0 &&
      end.getMilliseconds() === 0;
    const bound = midnight
      ? new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999)
      : end;
    if (date.getTime() > bound.getTime()) return false;
  }
  return true;
}
