# Health score dashboard

The page that answers "how well does this work for the people who use it, and where is it worst?".
Experience is reduced to one score out of 100 with three bands (Good at 80 or more, Fair from 50 to 79,
Poor under 50). The page shows the overall score and its trend, ranks applications and locations
lowest first with the top cause of poor samples, gives each application an hour-by-hour strip, and ends
in the open incidents that need someone's attention.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shells/console`), which owns the rail, the header and the `main`.

## When to use

- Many raw signals (latency, packet loss, DNS time, Wi-Fi signal) are combined into one score the
  reader can act on.
- The score has fixed bands that mean the same thing everywhere on the page.
- The reader's job is to find the worst application or place and the cause behind it.

## When not to use

- The raw metrics themselves (p50, p95, error rate) matter more than a score: use
  `platform/dashboard/service-monitoring-dashboard`.
- A pass or fail verdict per item: use `platform/dashboard/scan-results-dashboard`.
- Alerts triaged by severity: use `platform/dashboard/alerts-dashboard`.

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Experience score` with one sentence on what it measures. Actions hold the period.

### B. Period — `Select` (required)

`Last hour`, `Last 24 hours`, `Last 7 days`, labelled `Period`. Empty states name the period back to
the reader.

### C. Cards — `ChartCard` (required)

`Overall score` spans the grid; `Score per application` and `Score per location` share a row;
`Hourly score` follows.

### D. Definitions — `Hint` (required)

The overall score's `Hint` states the bands:
`Average of every sample in the period, out of 100. Good is 80 or more, fair 50 to 79, poor under 50.`

### E. Band — `Tag` (required)

The band word (`Good`, `Fair`, `Poor`) with its status severity, beside the overall score, at the end
of every hourly row and on each incident. The band is always written; color reinforces it.

### F. Loading placeholders — `Skeleton` (required)

Holds the score figure, hourly row labels, band tags and incident rows while the period loads.

### G. Score per hour — `Chart` (required)

A line of the overall score per hour beside the figure and the top cause of poor samples.

### H. Rankings — `BarList` (required)

Score per application and per location, sorted lowest first, because the reader looks for the worst.
Each row names its top cause (`Video calls · packet loss`).

### I. Hourly strips — `Tracker` (required)

One strip per application, one block per hour colored by band, with an `aria-label`
(`Video calls, score per hour`) and a label on each block (`08:00 · 35 · Poor`).

### J. Empty regions — `EmptyState` (required)

Every region names the period and what fills it: `No samples in the last 24 hours` /
`Scores appear once devices report their first samples. Select a longer period.`

### K. Open incidents — `Card` (required)

A card titled `Open incidents` under the grid.

### L. Incident rows — `Item` (required)

One `Item` per incident: what is affected, the cause, how many devices and what share of samples,
when it opened, and its band.

## Do

- Use the same three bands, with the same thresholds and words, in every region.
- Sort rankings lowest first.
- Name the top cause next to every poor score, so the reader knows what to fix.
- State the band thresholds in the overall `Hint`.

## Don't

- Don't show a score without its band word.
- Don't use the status colors for anything other than the bands on this page.
- Don't average away the worst hour; the hourly strip exists to show it.
- Don't sort rankings best first.

## Copy

- **Title:** `Experience score`.
- **Band words:** one word each. `Good`, `Fair`, `Poor`.
- **Cause:** subject, a middle dot, the cause in lowercase. `CRM · slow DNS lookups`.
- **Empty state:** name the period. `No open incidents in the last 24 hours` / `An incident opens when an application or a location stays poor for several samples in a row.`

## Accessibility

- Each `Tracker` has an `aria-label` naming its application, and each block a label with time, score and band.
- Bands are always words; the strip is never color alone.
- Rankings carry an `aria-label` (`Score per application`, `Score per location`).
- Loading regions set `aria-busy="true"`.
- Scores use `tabular-nums`.

## States

- Default: the scored period.
- Loading: the chart, rankings and trackers render their own `Skeleton`; incidents hold Skeleton rows.
- Empty: a period with no samples; the score shows a dash with no band, and every region keeps its box with an empty state that names the period and says what fills it.
- Failed: the request failed; the score shows a dash, and every region keeps its header with a danger `Alert` that names what did not load and offers Retry.

## Related

- `platform/dashboard/service-monitoring-dashboard` — the raw latency and error metrics.
- `platform/dashboard/alerts-dashboard` — when incidents are triaged as alerts by severity.
- `Tracker` — hour-by-hour status strips.
