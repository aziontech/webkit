// The events the sample is seeded with — the Observe → Real-Time Events module.
//
// This is the one module in the console that is not a list of resources but a LOG
// EXPLORER: rows are documents, not records. Nobody browses the whole log — they cut
// it to a window, narrow it by a couple of fields, and then read ONE document in
// full. Everything here follows from that:
//
//   AN EVENT IS A DOCUMENT, not a row of five columns. Each event carries the whole
//     field set its source emits, so the page can decide which fields become columns
//     (the Fields panel) and still show every field when one event is opened.
//   FIELDS ARE SPARSE. A Functions event has no `requestMethod`; a firewall event has
//     no `functionName`. A field that no event in the current window answers for is
//     part of the truth of that window — the panel shows it with a count of 0 rather
//     than hiding it.
//   THE WINDOW IS SHORT. 15 minutes to 24 hours, not 7 days to 3 months. A week of
//     edge events is not a list, it is a report — that is Real-Time Metrics.
//
// `at` is the real instant; `time` is the display string derived from it.
import { withinRange } from "./dates";
import { DATE_CUSTOM } from "./filter-bar";

/** Minutes ago, for a log whose rows are minutes apart rather than days. */
const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60 * 1000);

// Composed from two formatters instead of one: a single Intl instance with both date
// and time parts inserts either ", " or " at " depending on the ICU version, so the
// output would drift between environments (see lib/dates.js).
const DAY_FORMAT = new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit" });
// 24-hour, seconds included: a log is read by lining timestamps up against each
// other, and "05:09:13 PM" costs three characters per row to say what "17:09:13"
// says — in the one column every row starts with.
const CLOCK_FORMAT = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const isDate = (value) => value instanceof Date && !Number.isNaN(value.getTime());

// The chart's clock. Seconds are what tells two log lines apart and are noise on an
// axis, where the label's job is to say roughly when — so the axis and the bar hints
// drop them.
const AXIS_FORMAT = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** The log's timestamp: "Aug 14, 17:09:13". Empty string for a missing date. */
export const formatEventTime = (date) =>
  isDate(date) ? `${DAY_FORMAT.format(date)}, ${CLOCK_FORMAT.format(date)}` : "";

/** Clock without seconds ("17:09") — the chart's axis and bar hints. */
export const formatEventClock = (date) => (isDate(date) ? AXIS_FORMAT.format(date) : "");

// The chart's hover card names one bucket, and a bucket is a POINT the reader is being
// asked to trust — so it carries the full date, not just a clock. Everything else on
// the page sits inside a window whose day is already established; this one label can be
// read on its own, out of that context.
const STAMP_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

/** A bucket's own timestamp: "Aug 14, 2026 10:07". */
export const formatEventStamp = (date) =>
  isDate(date) ? `${STAMP_FORMAT.format(date)} ${AXIS_FORMAT.format(date)}` : "";

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

/** The levels, most severe first — the order every level list reads in. */
export const LEVEL_ORDER = Object.keys(EVENT_LEVELS);

/** The level list a filter field offers, most severe first. */
export const eventLevelOptions = LEVEL_ORDER.map((value) => ({
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
  // A window with both bounds, for the two asks the presets cannot answer: "that spike,
  // there" (dragged on the chart) and "that specific stretch" (picked in the calendar).
  // `custom: true` is what the filter bar looks for to open a calendar rather than
  // commit a value (lib/filter-bar.js).
  { value: DATE_CUSTOM, label: "Custom…", custom: true },
];

/**
 * How long each preset window is, in minutes. One map, read by the filter's `match` AND
 * by the volume chart — the chart's x-axis IS the applied window, so a second copy of
 * these numbers would let the two disagree about what "Last 6 hours" means.
 */
export const PERIOD_MINUTES = { "15m": 15, "1h": 60, "6h": 360, "24h": 1440 };

/**
 * The window the page OPENS ON, applied as a real filter rather than an implicit
 * default. A log always has a window — there is no "all events" — so the widest one
 * the field offers is applied on arrival and shows as a chip like any other filter.
 * That is also what lets the chart drop its own "Last 24 hours" caption: the chip
 * already says it, and two labels for one window are one too many.
 */
export const DEFAULT_PERIOD = "24h";

/** The widest window the field offers — the chart's span when the chip is cleared. */
export const FULL_WINDOW_MINUTES = PERIOD_MINUTES["24h"];

/**
 * A period value → the `{ start, end }` window it means.
 *
 * TWO SHAPES, ONE FUNCTION, because a period field holds two kinds of thing once a
 * custom window exists: a preset id ("6h"), which is open-ended and means "since", and a
 * range object, which carries both of its own bounds — what the chart's drag produces and
 * what the calendar returns. Everything downstream (the filter's `match`, the chart's
 * axis, the bucket width) reads the window through here, so the three can never disagree
 * about what is on screen.
 *
 * @param {string | { start?: Date | null, end?: Date | null } | null} value
 * @param {Date} [now] The moment an open-ended window ends.
 * @returns {{ start: Date | null, end: Date }}
 */
export const periodRange = (value, now = new Date()) => {
  if (value && typeof value === "object") {
    return { start: value.start ?? null, end: value.end ?? now };
  }
  const minutes = PERIOD_MINUTES[value];
  if (!minutes) return { start: new Date(now.getTime() - FULL_WINDOW_MINUTES * 60000), end: now };
  return { start: new Date(now.getTime() - minutes * 60000), end: now };
};

/** Whether `date` falls inside the picked event window (preset id or custom range). */
export const matchPeriod = (date, values) => {
  const [period] = values ?? [];
  // The bare `custom` sentinel is "chosen, nothing picked yet": it narrows nothing
  // rather than narrowing to nothing.
  if (!period || period === DATE_CUSTOM || !isDate(date)) return true;
  return withinRange(date, periodRange(period));
};

/**
 * A period value as a chip-sized label. The custom shape gets the CLOCK, not just the
 * day: a log window is minutes wide, and "Aug 14 – Aug 14" would describe every window
 * the chart can produce identically.
 */
export const formatPeriod = (value) => {
  if (!value || typeof value !== "object") return "";
  const { start, end } = value;
  if (!start) return end ? `Until ${formatEventClock(end)}` : "";
  const sameDay = end && DAY_FORMAT.format(start) === DAY_FORMAT.format(end);
  const from = `${DAY_FORMAT.format(start)}, ${formatEventClock(start)}`;
  if (!end) return `Since ${from}`;
  return sameDay
    ? `${from} – ${formatEventClock(end)}`
    : `${from} – ${DAY_FORMAT.format(end)}, ${formatEventClock(end)}`;
};

// ── The document ────────────────────────────────────────────────────────────────
// The field catalog is the page's whole vocabulary: what the Fields panel lists, what
// a column can be, and what an opened document shows. Every field declares how its
// value READS (`format`) once here, rather than each surface re-deciding — a request
// time is "312 ms" in the table, in the panel and in the document, or the three stop
// looking like the same number.
//
// `core: true` marks the four fields the table always shows (time, level, source, the
// message). They are the log's spine: a document with no timestamp and no message is
// not a log line, so they are not offered as removable columns — the panel lists them
// as shown-and-locked instead of pretending they are optional.

/*
 * THE CATEGORIES COME FROM THE AZION DOCS, not from taste.
 *
 * Real-Time Events' own documentation says a data source's variables are "organized …
 * grouped by function", and names those functions: cache status, WAF metrics, SSL/TLS
 * details, upstream responses, and geolocation information. The GraphQL field reference
 * then lists the fields themselves alphabetically with no headings — so the docs give the
 * VOCABULARY of groups but no per-field table, and the field NAMES carry the rest:
 * `request*` / `host`, `status` / `bytesSent`, `upstreamCacheStatus`, `requestTime` /
 * `tcpinfoRtt`, `geoloc*`, `remoteAddress` / `httpUserAgent` / `httpReferer`, `waf*`,
 * `configurationId` / `solutionId` (v4: the workload). Nine groups, each one either a
 * name the docs use or a prefix the API uses:
 *
 *   https://www.azion.com/en/documentation/products/observe/real-time-events/
 *   https://www.azion.com/en/documentation/devtools/graphql-api/features/gql-real-time-events-fields/
 *
 * Functions is a group here because in the docs it is a whole DATA SOURCE of its own
 * (alongside HTTP Requests, Functions Console, Image Processor, Tiered Cache, Edge DNS,
 * Data Stream and Activity History) — this sample reads them as one log, so its fields
 * become the category a reader would otherwise have switched source to find.
 */

/** The functional groups the Fields panel collapses into, in reading order. */
export const EVENT_FIELD_CATEGORIES = [
  { id: "request", label: "Request" },
  { id: "response", label: "Response" },
  { id: "cache", label: "Cache" },
  { id: "performance", label: "Performance" },
  { id: "geolocation", label: "Geolocation" },
  { id: "client", label: "Client" },
  { id: "security", label: "Security" },
  { id: "functions", label: "Functions" },
  { id: "identifiers", label: "Identifiers" },
];

/**
 * Every field an event can carry, in the order the panel lists them.
 *
 * `category` is the doc group above (the spine carries none — it is not optional, so it
 * is never inside a collapsed section). `grow` is the table's flex weight (1–3, the only
 * values the Table's column model takes), `align: 'end'` marks a magnitude — a number
 * column reads right-aligned and in tabular figures — and `mono` marks a value that IS a
 * token rather than prose (a host, a path, an address, an id), so it renders in the code
 * face on every surface.
 */
export const EVENT_FIELDS = [
  { id: "time", label: "Time", core: true, grow: 2, mono: true },
  { id: "level", label: "Level", core: true },
  { id: "sourceLabel", label: "Source", core: true, grow: 2 },
  { id: "message", label: "Event", core: true, principal: true, grow: 3 },
  { id: "host", label: "Host", category: "request", grow: 2, mono: true },
  { id: "requestMethod", label: "Method", category: "request", mono: true },
  { id: "requestUri", label: "Path", category: "request", grow: 2, mono: true },
  { id: "status", label: "Status", category: "response", align: "end", mono: true },
  {
    id: "requestTimeMs",
    label: "Request Time",
    category: "performance",
    align: "end",
    format: (v) => `${v} ms`,
  },
  {
    id: "bytesSent",
    label: "Bytes Sent",
    category: "response",
    align: "end",
    format: (v) => v.toLocaleString("en-US"),
  },
  { id: "cacheStatus", label: "Cache Status", category: "cache", mono: true },
  { id: "country", label: "Country", category: "geolocation" },
  { id: "remoteAddress", label: "Remote Address", category: "client", grow: 2, mono: true },
  { id: "ruleName", label: "Rule", category: "security", grow: 2 },
  { id: "functionName", label: "Function", category: "functions", mono: true },
  {
    id: "functionDurationMs",
    label: "Function Duration",
    category: "functions",
    align: "end",
    format: (v) => `${v} ms`,
  },
  { id: "requestId", label: "Request ID", category: "identifiers", grow: 2, mono: true },
  { id: "workloadId", label: "Workload ID", category: "identifiers", mono: true },
  { id: "userAgent", label: "User Agent", category: "client", grow: 3, mono: true },
];

/** The four fields the table always carries, in column order. */
export const CORE_EVENT_FIELDS = EVENT_FIELDS.filter((field) => field.core);

/** The fields the Fields panel offers as columns. */
export const OPTIONAL_EVENT_FIELDS = EVENT_FIELDS.filter((field) => !field.core);

/**
 * The columns the page opens on — the three that answer "who asked for what, and did
 * it work". Everything else is one click away in the Fields panel.
 */
export const DEFAULT_EVENT_COLUMNS = ["host", "status", "remoteAddress"];

/** A field by id. */
export const eventField = (id) => EVENT_FIELDS.find((field) => field.id === id);

/**
 * A field's value as it reads on screen — the em dash for a field this event's source
 * does not emit, so a sparse column stays a column instead of a row of blanks.
 */
export const formatEventValue = (field, value) => {
  if (value === undefined || value === null || value === "") return "—";
  return field?.format ? field.format(value) : String(value);
};

// ── The seed ────────────────────────────────────────────────────────────────────
// Ten hand-written events would leave the volume chart with ten bars and the Fields
// panel with counts of one, so the log is generated from templates across the whole
// 24-hour window. It is generated DETERMINISTICALLY: a demo you can point at twice,
// and field counts stable enough to say out loud.

const HOSTS = [
  "edgeflow.com",
  "api.edgeflow.com",
  "staging.edgeflow.com",
  "legacy.edgeflow.com",
  "azion.design",
];
const ADDRESSES = [
  "45.132.11.9",
  "189.6.44.12",
  "201.17.88.3",
  "177.92.10.55",
  "91.220.4.18",
  "200.147.3.21",
  "138.99.7.42",
];
const COUNTRIES = ["Brazil", "United States", "Portugal", "Germany", "Chile"];
const AGENTS = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "curl/8.12.1",
  "Azion-Health-Check/1.0",
];
const CACHE_STATUSES = ["HIT", "MISS", "BYPASS", "EXPIRED"];
const WORKLOADS = ["wl-3f9a21", "wl-77c40b", "wl-91de55"];

// Each template is one KIND of thing that happens at the edge: the message a reader
// scans for, plus the request fields its source emits.
const TEMPLATES = [
  {
    source: "waf",
    level: "Error",
    message: "Blocked SQL injection attempt on /api/session",
    requestMethod: "POST",
    requestUri: "/api/session",
    status: 403,
    ruleName: "SQL Injection · rule 942100",
  },
  {
    source: "http",
    level: "Warning",
    message: "Origin responded 502 after 3 retries",
    requestMethod: "GET",
    requestUri: "/checkout/cart",
    status: 502,
  },
  {
    source: "functions",
    level: "Info",
    message: "auth-handler completed in 12ms",
    functionName: "auth-handler",
    functionDurationMs: 12,
  },
  {
    source: "firewall",
    level: "Warning",
    message: "Rate limit reached for a single address",
    requestMethod: "GET",
    requestUri: "/api/search",
    status: 429,
    ruleName: "Rate Limit · 100 rpm",
  },
  {
    source: "waf",
    level: "Error",
    message: "Blocked cross-site scripting attempt on /search",
    requestMethod: "GET",
    requestUri: "/search",
    status: 403,
    ruleName: "XSS · rule 941110",
  },
  {
    source: "functions",
    level: "Debug",
    message: "geo-router resolved region sa-east-1",
    functionName: "geo-router",
    functionDurationMs: 4,
  },
  {
    source: "http",
    level: "Info",
    message: "Delivered from cache",
    requestMethod: "GET",
    requestUri: "/assets/app.js",
    status: 200,
  },
  {
    source: "firewall",
    level: "Error",
    message: "Network list “Known scrapers” denied the request",
    requestMethod: "GET",
    requestUri: "/products",
    status: 403,
    ruleName: "Network list · Known scrapers",
  },
  {
    source: "http",
    level: "Warning",
    message: "TLS handshake failed before the request completed",
    requestMethod: "GET",
    requestUri: "/",
    status: 495,
  },
  {
    source: "functions",
    level: "Error",
    message: "image-optimizer exceeded its memory limit",
    functionName: "image-optimizer",
    functionDurationMs: 1840,
  },
  {
    source: "http",
    level: "Info",
    message: "Purge completed for 42 URLs",
    requestMethod: "POST",
    requestUri: "/purge/url",
    status: 201,
  },
  {
    source: "waf",
    level: "Warning",
    message: "Request scored 12 in learning mode",
    requestMethod: "POST",
    requestUri: "/api/comments",
    status: 200,
    ruleName: "Learning mode · score 12",
  },
  {
    source: "http",
    level: "Error",
    message: "Origin timed out after 30s",
    requestMethod: "GET",
    requestUri: "/reports/monthly.pdf",
    status: 504,
  },
  {
    source: "functions",
    level: "Info",
    message: "ab-splitter assigned variant B",
    functionName: "ab-splitter",
    functionDurationMs: 7,
  },
];

/**
 * A deterministic sequence — the same log on every load, so the numbers on this page
 * can be pointed at, screenshotted and compared. `Math.random()` would reseed the
 * Fields panel's counts on every reload.
 */
const sequence = (seed) => {
  let state = seed;
  return (length) => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state % length;
  };
};

// Enough rows that the window has a SHAPE. A log seeded with a dozen events gives a
// histogram of one-event bars — every bucket identical, which is the one thing a
// volume chart must not be — and a Fields panel whose counts are all 1 or 2, so
// nothing in it is worth reading before the table.
const EVENT_COUNT = 1500;
const SEED_WINDOW_MINUTES = 1436;

/*
 * THE LOG RISES TOWARD NOW, and that is a deliberate shape, not filler.
 *
 * A flat log is the worst possible seed for this page: every bar the same height says
 * nothing, so the chart above the table would be decoration and the reader would have
 * no reason to look at it. Traffic ramping into the present is the commonest real shape
 * (a release went out, a campaign started) and it is the one the chart is for.
 *
 * The ramp is LINEAR IN THE RATE, not a power curve, and that is the whole trick. The
 * arrival rate falls off with age — four events now for every one a day ago — so the
 * newest bucket is ~3.7× the oldest: a ramp every bar of which is still readable. A
 * power curve (`24h × u^k`) looks equivalent on paper and is not: at k=2 the newest
 * 45-minute bucket already holds a sixth of the whole seed, so it pins the scale and
 * the other 31 bars collapse to slivers — one spike and no ramp, which says as little
 * as a flat band.
 *
 * `ageFraction` is the inverse CDF of that rate. With density f(x) = 4 − 3x over
 * x = age / 24h, the mass is ∫f = 2.5 and F(x) = (4x − 1.5x²) / 2.5; inverting
 * F(x) = u gives the expression below. Walking `u` from 0 to 1 across the seed
 * therefore lays events down at exactly that falling rate.
 */
const ageFraction = (u) => (4 - Math.sqrt(16 - 15 * u)) / 3;

// Errors are ~22% of the log, not a third of it: the rotation carries the calm
// templates twice and the error ones once, so the stacked red in a bar reads as a rate
// worth watching rather than as the bar's own baseline.
const CALM_TEMPLATES = TEMPLATES.filter((template) => template.level !== "Error");
const ERROR_TEMPLATES = TEMPLATES.filter((template) => template.level === "Error");
const ROTATION = [...CALM_TEMPLATES, ...CALM_TEMPLATES, ...ERROR_TEMPLATES];

/** The seeded events, newest first. */
export const REAL_TIME_EVENTS = (() => {
  const pick = sequence(20260814);
  return Array.from({ length: EVENT_COUNT }, (_, index) => {
    const template = ROTATION[index % ROTATION.length];
    // The ramp (see above), jittered inside its own step so two events never land on
    // the same second and the bars keep a ragged top edge.
    const progress = (index + pick(100) / 100) / EVENT_COUNT;
    const at = minutesAgo(0.2 + SEED_WINDOW_MINUTES * ageFraction(progress));
    const requestScoped = template.source !== "functions";
    return {
      id: `ev-${String(index + 1).padStart(3, "0")}`,
      at,
      time: formatEventTime(at),
      source: template.source,
      sourceLabel: eventSourceLabel(template.source),
      level: template.level,
      message: template.message,
      host: requestScoped ? HOSTS[pick(HOSTS.length)] : undefined,
      requestMethod: template.requestMethod,
      requestUri: template.requestUri,
      status: template.status,
      requestTimeMs: requestScoped ? 40 + pick(960) : undefined,
      bytesSent: requestScoped ? 512 + pick(180_000) : undefined,
      cacheStatus: requestScoped ? CACHE_STATUSES[pick(CACHE_STATUSES.length)] : undefined,
      country: COUNTRIES[pick(COUNTRIES.length)],
      remoteAddress: ADDRESSES[pick(ADDRESSES.length)],
      ruleName: template.ruleName,
      functionName: template.functionName,
      functionDurationMs: template.functionDurationMs,
      requestId: `${(pick(0xffffff) + 0x100000).toString(16)}-${(pick(0xffff) + 0x1000).toString(16)}`,
      workloadId: WORKLOADS[pick(WORKLOADS.length)],
      userAgent: requestScoped ? AGENTS[pick(AGENTS.length)] : undefined,
    };
  });
})();

// ── Reading the set ─────────────────────────────────────────────────────────────

/**
 * Free-text search over the WHOLE document, not only the visible columns.
 *
 * On a log the search field is part of the query, not a find-in-table: an address or
 * a request id is what a reader arrives holding, and demanding they add the column
 * first would make the field useless exactly when it matters. So it is the page —
 * not the table's own global filter — that narrows here, which is also what keeps the
 * volume chart, the summary and the Fields panel counts agreeing with the rows.
 *
 * @param {Array<object>} events
 * @param {string} term
 */
export const searchEvents = (events, term) => {
  const needle = term.trim().toLowerCase();
  if (!needle) return events;
  return events.filter((event) =>
    EVENT_FIELDS.some((field) => {
      const value = event[field.id];
      return value !== undefined && String(value).toLowerCase().includes(needle);
    }),
  );
};

/**
 * A field's values in the set, most frequent first — what the Fields panel offers to
 * filter by. Frequency order, not alphabetical: the reason to open a field's values is
 * to find the one that dominates the window (the host that is failing, the address that
 * is hammering), and that one has to be at the top rather than under the letter it
 * happens to start with.
 *
 * @param {Array<object>} events
 * @param {string} id Field id.
 * @returns {Array<{ value: unknown, count: number }>}
 */
export const fieldValueCounts = (events, id) => {
  const counts = new Map();
  for (const event of events) {
    const value = event[id];
    if (value === undefined || value === null || value === "") continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);
};

/** How many distinct values the set answers with for one field (0 = none do). */
export const countFieldValues = (events, id) => {
  const values = new Set();
  for (const event of events) {
    const value = event[id];
    if (value !== undefined && value !== null && value !== "") values.add(value);
  }
  return values.size;
};

/*
 * How many bars a window gets. Fewer for a short window, because the bar count — not
 * the window — is what decides how many events land in each bar: 15 minutes of a log
 * split 32 ways is a row of one-event ticks, and a bucket holding one event has an
 * error share of either 0% or 100%, which reads as noise rather than as a rate. Wider
 * bars over less time keep the shape legible at every period the field offers.
 */
const bucketCountFor = (windowMinutes) => {
  if (windowMinutes <= 15) return 12;
  if (windowMinutes <= 60) return 20;
  return 32;
};

/**
 * The set bucketed into the window's bars — the total per bucket AND its split by
 * level, so the chart says WHEN, how much and how bad in one pass.
 *
 * It takes the WINDOW, not a duration, because a custom range ends in the past: bucketing
 * "the last 45 minutes" for a range that closed two hours ago would draw an empty chart
 * beside a table full of rows. Each bucket carries its own `end` too, so the chart can
 * turn a bar into a time filter without re-deriving the bucket width.
 *
 * The split is by LEVEL rather than by HTTP status class, because level is the
 * vocabulary the rest of the page already speaks: the same four values the Level
 * column tags, the Level filter offers, and this file maps to Tag severities. A bar
 * segment and the Tag on the row it contains are then the same colour by construction.
 *
 * @param {Array<object>} events
 * @param {{ start: Date | null, end: Date }} window The applied window (`periodRange`).
 * @param {number} [count] Bars. Defaults to `bucketCountFor` — see below.
 */
export const eventBuckets = (events, window, count) => {
  const end = (window?.end ?? new Date()).getTime();
  const start = (
    window?.start ?? new Date(end - FULL_WINDOW_MINUTES * 60000)
  ).getTime();
  const span = Math.max(1, end - start);
  const bars = count ?? bucketCountFor(span / 60000);
  const width = span / bars;
  const buckets = Array.from({ length: bars }, (_, index) => ({
    at: new Date(start + index * width),
    end: new Date(start + (index + 1) * width),
    total: 0,
    levels: Object.fromEntries(LEVEL_ORDER.map((level) => [level, 0])),
  }));
  for (const event of events) {
    if (!isDate(event.at)) continue;
    const offset = event.at.getTime() - start;
    if (offset < 0 || offset > span) continue;
    const bucket = buckets[Math.min(bars - 1, Math.floor(offset / width))];
    bucket.total += 1;
    if (bucket.levels[event.level] !== undefined) bucket.levels[event.level] += 1;
  }
  return buckets;
};

/** The three numbers above the log: how many, how many broke, how slow. */
export const eventSummary = (events) => {
  const errors = events.filter((event) => event.level === "Error").length;
  const timed = events.filter((event) => typeof event.requestTimeMs === "number");
  return {
    total: events.length,
    errors,
    errorShare: events.length ? errors / events.length : 0,
    avgRequestTimeMs: timed.length
      ? Math.round(timed.reduce((sum, event) => sum + event.requestTimeMs, 0) / timed.length)
      : null,
  };
};
