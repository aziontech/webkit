// The observability fixtures — what the two Observe DASHBOARDS show.
//
// Real-Time Metrics and Edge Pulse are the two pages in the console that are not
// lists: there is no row to open, no create action, nothing to select. They answer
// "how is it going" with a metric strip and a series per panel, over a window.
//
// The WINDOW is the one control they share with every list, and deliberately so: it
// is the same filter bar, holding one `kind: 'range'` field, so picking a period is
// the same gesture as picking a status anywhere else in the product.

/** The windows the two dashboards offer. One at a time — they are spans, not a set. */
export const METRIC_PERIODS = [
  { value: "1h", label: "Last hour" },
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

/** The window a dashboard opens on, before anything is picked. */
export const DEFAULT_PERIOD = "24h";

/** The label for a period value, for the panel subtitles. */
export const periodLabel = (value) =>
  METRIC_PERIODS.find((period) => period.value === value)?.label ?? "Last 24 hours";

// A deterministic pseudo-random series, so a panel looks like real telemetry and
// looks the SAME on every render — a chart that reshuffles on each keystroke reads
// as broken. FNV-1a over the seed, advanced per point.
const seriesFor = (seed, points, min, max) => {
  let h = 0x811c9dc5;
  for (const char of seed) {
    h ^= char.charCodeAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return Array.from({ length: points }, () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    h >>>= 0;
    return min + ((h % 1000) / 1000) * (max - min);
  });
};

/**
 * One dashboard panel: its title, the unit its numbers carry, and the series.
 *
 * @param {string} title
 * @param {string} unit
 * @param {string} period The window id — part of the seed, so changing it reshapes
 *   the series the way a real re-query would.
 * @param {[number, number]} range
 */
export const panel = (title, unit, period, [min, max]) => ({
  title,
  unit,
  series: seriesFor(`${title}:${period}`, 24, min, max),
});

/** The metric strip + panels of Real-Time Metrics, for one window. */
export const metricsFor = (period) => ({
  strip: [
    { label: "Requests", value: "48.2", unit: "M", hint: "Requests handled at the edge." },
    { label: "Data Transferred", value: "6.4", unit: "TB", hint: "Bytes delivered to clients." },
    { label: "Bandwidth Saved", value: "71", unit: "%", hint: "Served from cache, not your origin." },
    { label: "Status 5xx", value: "0.03", unit: "%", hint: "Share of responses that failed." },
  ],
  panels: [
    panel("Requests per second", "req/s", period, [1200, 4800]),
    panel("Data transferred", "MB/s", period, [40, 210]),
    panel("Cache hit ratio", "%", period, [78, 97]),
    panel("Status codes 5xx", "%", period, [0, 0.4]),
  ],
});

/** The metric strip + panels of Edge Pulse, for one window. */
export const pulseFor = (period) => ({
  strip: [
    { label: "Page Load Time", value: "1.24", unit: "s", hint: "Median, as measured in the browser." },
    { label: "Largest Contentful Paint", value: "1.86", unit: "s", hint: "Median LCP across sessions." },
    { label: "First Input Delay", value: "18", unit: "ms", hint: "Median delay before the page responds." },
    { label: "Sessions", value: "412", unit: "K", hint: "Real user sessions measured." },
  ],
  panels: [
    panel("Page load time", "s", period, [0.9, 2.4]),
    panel("Largest contentful paint", "s", period, [1.2, 3.1]),
    panel("First input delay", "ms", period, [8, 46]),
    panel("Sessions", "k", period, [8, 32]),
  ],
});
