/**
 * Format an absolute timestamp as a short, human relative string:
 * "just now", "2 min ago", "3 hours ago", "5 days ago", "2 weeks ago",
 * "3 months ago", "1 year ago". Returns "" for empty or unparseable input.
 *
 * @param {string | Date} input Absolute timestamp (Date or any string `new Date()` parses).
 * @returns {string}
 */
export function relativeTime(input) {
  if (!input) return "";
  const then = input instanceof Date ? input : new Date(input);
  const ms = then.getTime();
  if (Number.isNaN(ms)) return "";

  const diff = Math.max(0, Date.now() - ms);
  const sec = Math.round(diff / 1000);
  if (sec < 45) return "just now";

  const min = Math.round(sec / 60);
  if (min < 60) return `${min} min ago`;

  const hour = Math.round(min / 60);
  if (hour < 24) return `${hour} ${hour === 1 ? "hour" : "hours"} ago`;

  const day = Math.round(hour / 24);
  if (day < 7) return `${day} ${day === 1 ? "day" : "days"} ago`;

  if (day < 30) {
    const week = Math.round(day / 7);
    return `${week} ${week === 1 ? "week" : "weeks"} ago`;
  }

  const month = Math.round(day / 30);
  if (month < 12) return `${month} ${month === 1 ? "month" : "months"} ago`;

  const year = Math.round(day / 365);
  return `${year} ${year === 1 ? "year" : "years"} ago`;
}
