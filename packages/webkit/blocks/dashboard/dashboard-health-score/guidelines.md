# Health score dashboard

The page that answers "how well does this work for the people who use it, and where is it worst?".
Experience is reduced to one score out of 100 with three bands (Good at 80 or more, Fair from 50 to 79,
Poor under 50). The page shows the overall score and its trend, ranks applications and locations
lowest first with the top cause of poor samples, gives each application an hour-by-hour strip, and ends
in the open incidents that need someone's attention.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), which owns the rail, the header and the `main`.

## When to use

- Use dashboard-health-score when many signals roll up into one banded score (including real-user web vitals).
- Many raw signals (latency, packet loss, DNS time, Wi-Fi signal) are combined into one score the
  reader can act on.
- The score has fixed bands that mean the same thing everywhere on the page.
- The reader's job is to find the worst application or place and the cause behind it.

## When not to use

- The raw metrics themselves (p50, p95, error rate) matter more than a score: use
  `dashboard/dashboard-service-monitoring`.
- A pass or fail verdict per item: use `dashboard/dashboard-scan-results`.
- Alerts triaged by severity: use `dashboard/dashboard-alerts`.

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Experience score` with one sentence on what it measures. Actions hold the period.

### B. Period — `Select` (required)

The header `Select` is `variant="ghost"`: no border until hover, so it shares the header row with the outlined buttons beside it; a header never holds a field outline.

`Last hour`, `Last 24 hours`, `Last 7 days`, labelled `Period`. Empty states name the period back to
the reader.

### C. Cards — `ChartCard` (required)

`Overall score` spans the grid; `Score per application` and `Score per location` share a row;
`Hourly score` follows.

### D. Definitions — `Hint` (required)

The overall score's `Hint` states the bands:
`Average of every sample in the period, out of 100. Good is 80 or more, fair 50 to 79, poor under 50.`

### E. Overall figure — `StatTile` (required)

The overall score as a `StatTile` with `variant="sans"`, labelled `Overall score`, the unit `/ 100` and
no delta, with the top cause of poor samples under it. The tile owns its loading Skeleton and prints
a dash when the period has no score; never hand-build the figure.

### F. Band — `Tag` (required)

The band word (`Good`, `Fair`, `Poor`) with its status severity, beside the overall score, at the end
of every hourly row and on each incident. The band is always written; color reinforces it.

### G. Loading placeholders — `Skeleton` (required)

Holds the hourly row labels, band tags and incident rows while the period loads.

### H. Score per hour — `Chart` (required)

A line of the overall score per hour beside the figure and the top cause of poor samples.

### I. Rankings — `BarList` (required)

Score per application and per location, sorted lowest first, because the reader looks for the worst.
Each row names its top cause (`Video calls · packet loss`).

### J. Hourly strips — `Tracker` (required)

One strip per application, one block per hour colored by band, with an `aria-label`
(`Video calls, score per hour`) and a label on each block (`08:00 · 35 · Poor`).

### K. Empty regions — `EmptyState` (required)

Every region names the period and what fills it: `No samples in the last 24 hours` /
`Scores appear once devices report their first samples. Select a longer period.`

### L. Open incidents — `Card` (required)

A card titled `Open incidents` under the grid.

### M. Incident rows — `Item` (required)

One `Item` per incident, with `href` to the incident's page (`/incidents/incident-03`) so the whole row
is a link: what is affected, the cause, how many devices and what share of samples, when it opened,
and its band.

### N. Real-user monitoring — `PageHeader`, `Select`, `StatTile`, `Hint` (optional)

Variant RealUser only: the timings measured in the reader's browsers that such a score is built
from. Title `Real-user monitoring`, and a medium Period `Select` (`Last hour`, `Last 24 hours`,
`Last 7 days`, `Last 30 days`) in the `PageHeader` actions drives every figure. Four vitals
`StatTile`s (`variant="sans"`) lead: `Page load time`, `Largest contentful paint`, `First input delay`,
`Sessions`, each a median value beside its unit (`s`, `ms`, `K`) with no delta, and a `Hint` in the
aside that defines the timing. Under them, a two-column grid of trend `StatTile`s, one per vital,
each with the latest value, its unit, a sparkline of the period and the period name in the aside.
A timing has no "previous period" the reader acts on here, so these tiles carry no delta and no
`inverse`.

### O. Load failure — `Alert` (required)

With `error` set, a danger `Alert` with Retry takes the place of each region's content, naming what
did not load (`Couldn't load overall score.`); the score shows a dash with no band.

## Data

The block takes its records through props and emits every action; it fetches nothing. `HealthScoreOverall`, `HealthScoreHourlyRow`, `HealthScoreIncident`, `HealthScoreBand`, `HealthScorePeriod` and `HealthScoreDashboardProps` are exported from `dashboard-health-score.vue`, and `sample.ts` holds the sample score, rankings, hourly rows and incidents the block renders when a data prop is left out (and never while `loading` or `error` is set). The RealUser variant is a separate page and keeps its own sample figures.

| Prop / model     | Type                     | What it does                                                                                                               |
| ---------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `overall`        | `HealthScoreOverall`     | The score, its band, the top cause and the score line with its labels. `score: null` shows a dash, no band.                |
| `applications`   | `BarListItem[]`          | Score per application, lowest first; the cause goes in the name (`Video calls · packet loss`).                             |
| `locations`      | `BarListItem[]`          | Score per location, the same shape.                                                                                        |
| `hourly`         | `HealthScoreHourlyRow[]` | One tracker row per application with one block per hour.                                                                   |
| `incidents`      | `HealthScoreIncident[]`  | The incidents still open, each linking to `/incidents/<id>`. Pass `[]` for `No open incidents`.                            |
| `loading`        | `boolean`                | The period is loading: every region shows its Skeleton.                                                                    |
| `error`          | `string`                 | Why the request failed, shown after `Couldn't load overall score.` (hourly score, open incidents…) in each danger `Alert`. |
| `v-model:period` | `HealthScorePeriod`      | The period every region reads and the empty states name; refetch when it changes. Defaults to `Last 24 hours`.             |

| Event   | Payload   | When                              |
| ------- | --------- | --------------------------------- |
| `retry` | `(event)` | Retry in any of the error alerts. |

To go live, render the block from a page that owns the request and pass what it returns:

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import DashboardHealthScore, { type HealthScorePeriod } from './dashboard-health-score.vue'

  const period = ref<HealthScorePeriod>('Last 24 hours')
  const { data, pending, error, refresh } = useExperienceScore(period)
</script>

<template>
  <DashboardHealthScore
    v-model:period="period"
    :overall="data?.overall"
    :applications="data?.applications ?? []"
    :locations="data?.locations ?? []"
    :hourly="data?.hourly ?? []"
    :incidents="data?.incidents ?? []"
    :loading="pending"
    :error="error ? 'Check your connection and retry.' : ''"
    @retry="refresh"
  />
</template>
```

Then delete `sample.ts` and its import.

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
- **RealUser:** title `Real-user monitoring`, description `Real-user timings collected in the browser, for the selected period.`; tile labels are the timing in sentence case (`First input delay`); the aside of a trend tile is the period name (`Last 24 hours`).
- **Empty state:** name the period. `No open incidents in the last 24 hours` / `An incident opens when an application or a location stays poor for several samples in a row.`

## Accessibility

- Each `Tracker` has an `aria-label` naming its application, and each block a label with time, score and band.
- Bands are always words; the strip is never color alone.
- Rankings carry an `aria-label` (`Score per application`, `Score per location`).
- Loading regions set `aria-busy="true"`.
- Scores use `tabular-nums`.

## States

- Default: the scored period.
- Loading: `loading`; the chart, rankings and trackers render their own `Skeleton`; incidents hold Skeleton rows.
- Empty: a period with no samples (`overall.score: null`, every list `[]`); the score shows a dash with no band, and every region keeps its box with an empty state that names the period and says what fills it.
- RealUser: the real-user monitoring page; the vitals and the trend tiles follow the Period select.
- Error: `error`; the score shows a dash, and every region keeps its header with a danger `Alert` that names what did not load and offers Retry.

## Related

- `dashboard/dashboard-service-monitoring` — the raw latency and error metrics.
- `dashboard/dashboard-alerts` — when incidents are triaged as alerts by severity.
- `Tracker` — hour-by-hour status strips.
