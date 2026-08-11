// The events the sample is seeded with — the Observe → Real-Time Events module.
//
// This is the one list in the console read newest-first and in a WINDOW: nobody
// browses the whole event log, they look at the last hour of one source. So the
// Period field is `kind: 'range'` like every other date field, but its windows are
// short (15 minutes to 24 hours) — a week of edge events is not a list, it is a
// query — and the list is seeded within the last day so every window has something
// in it.
//
// `at` is the real instant; `time` is the display string derived from it.
import { formatListDate, hoursAgo } from "./dates";

/** Minutes ago, for a log whose rows are minutes apart rather than days. */
const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60 * 1000);

/** Which product emitted the event. */
export const EVENT_SOURCES = {
  http: "HTTP Requests",
  waf: "WAF",
  functions: "Functions",
  firewall: "Firewall",
};

/** The label for an event source id, falling back to the id itself. */
export const eventSourceLabel = (id) => EVENT_SOURCES[id] ?? id;

/** The source list a filter field offers. */
export const eventSourceOptions = Object.entries(EVENT_SOURCES).map(([value, label]) => ({
  value,
  label,
}));

/** Event level → Tag severity, so a level reads the same on every surface. */
export const EVENT_LEVELS = {
  Error: "danger",
  Warning: "warning",
  Info: "info",
  Debug: "secondary",
};

/** The Tag severity for an event level. */
export const eventLevelSeverity = (level) => EVENT_LEVELS[level] ?? "secondary";

/** The level list a filter field offers, most severe first. */
export const eventLevelOptions = Object.keys(EVENT_LEVELS).map((value) => ({
  value,
  label: value,
}));

/**
 * The windows the Period field offers.
 *
 * Short by design — this module answers "what is happening now". Anything longer is
 * a report, and reports live in Real-Time Metrics.
 */
export const EVENT_PERIODS = [
  { value: "15m", label: "Last 15 minutes" },
  { value: "1h", label: "Last hour" },
  { value: "6h", label: "Last 6 hours" },
  { value: "24h", label: "Last 24 hours" },
];

/** Whether `date` falls inside the picked event window. */
export const matchPeriod = (date, values) => {
  const [period] = values ?? [];
  if (!period || !(date instanceof Date)) return true;
  const minutes = (Date.now() - date.getTime()) / (60 * 1000);
  return { "15m": 15, "1h": 60, "6h": 360, "24h": 1440 }[period] >= minutes;
};

/** The seeded events, newest first. */
export const REAL_TIME_EVENTS = [
  {
    id: "ev-01",
    source: "waf",
    level: "Error",
    message: "Blocked SQL injection attempt on /api/session",
    host: "api.edgeflow.com",
    ip: "45.132.11.9",
    at: minutesAgo(2),
  },
  {
    id: "ev-02",
    source: "http",
    level: "Warning",
    message: "Origin responded 502 after 3 retries",
    host: "legacy.edgeflow.com",
    ip: "189.6.44.12",
    at: minutesAgo(7),
  },
  {
    id: "ev-03",
    source: "functions",
    level: "Info",
    message: "auth-handler completed in 12ms",
    host: "edgeflow.com",
    ip: "201.17.88.3",
    at: minutesAgo(11),
  },
  {
    id: "ev-04",
    source: "firewall",
    level: "Warning",
    message: "Rate limit reached for 177.92.10.55",
    host: "api.edgeflow.com",
    ip: "177.92.10.55",
    at: minutesAgo(24),
  },
  {
    id: "ev-05",
    source: "waf",
    level: "Error",
    message: "Blocked cross-site scripting attempt on /search",
    host: "edgeflow.com",
    ip: "91.220.4.18",
    at: minutesAgo(38),
  },
  {
    id: "ev-06",
    source: "functions",
    level: "Debug",
    message: "geo-router resolved region sa-east-1",
    host: "edgeflow.com",
    ip: "189.6.44.12",
    at: minutesAgo(52),
  },
  {
    id: "ev-07",
    source: "http",
    level: "Info",
    message: "Cache hit ratio recovered to 94%",
    host: "azion.design",
    ip: "200.147.3.21",
    at: hoursAgo(2),
  },
  {
    id: "ev-08",
    source: "firewall",
    level: "Error",
    message: "Network list “Known scrapers” denied 34 requests",
    host: "api.edgeflow.com",
    ip: "45.132.11.9",
    at: hoursAgo(4),
  },
  {
    id: "ev-09",
    source: "http",
    level: "Warning",
    message: "TLS handshake failures above threshold",
    host: "staging.edgeflow.com",
    ip: "138.99.7.42",
    at: hoursAgo(9),
  },
  {
    id: "ev-10",
    source: "functions",
    level: "Error",
    message: "image-optimizer exceeded memory limit",
    host: "edgeflow.com",
    ip: "201.17.88.3",
    at: hoursAgo(19),
  },
].map((event) => ({
  ...event,
  sourceLabel: eventSourceLabel(event.source),
  time: formatListDate(event.at),
}));
