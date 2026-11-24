# Executive summary dashboard

The one page a lead reads to see how the quarter went: the headline results against last quarter, the
twelve-month trend behind each one, progress on the quarter's goals and the notes the leads wrote when
they reviewed it. It favours a few numbers read in seconds over detail; every figure links back to its
own dashboard for the breakdown.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), which owns the rail, the header and the `main`.

## When to use

- Use dashboard-executive-summary for a one-page roll-up of business KPIs for leadership.
- A recurring review (quarterly, monthly) where readers need results, trends, goals and context together.
- The audience reads the page, they do not investigate on it.
- There are a handful of headline metrics (about six) with targets.

## When not to use

- Investigating a metric by dimension: use `dashboard/dashboard-analytics`
  (Usage for consumption).
- A total broken into categories: use `dashboard/dashboard-breakdown`.

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Executive summary` and one sentence on what it contains. Actions hold the quarter and Export.

### B. Quarter — `Select` (required)

The header `Select` is `variant="ghost"`: no border until hover, so it shares the header row with the outlined buttons beside it; a header never holds a field outline.

The reporting period, labelled `Quarter`. It scopes every region, including goals and commentary.

### C. Export — `Button` (optional)

`Export` downloads the scorecard and the goals of the chosen quarter as CSV (`executive-summary-q3-2026.csv`) for sharing outside the product, and confirms with a success toast naming the file (an error toast when it fails). Disabled while loading, and when the quarter failed or has no data.

### D. Scorecard — `StatTile` (required)

Six tiles in a region labelled `Scorecard`: `Revenue`, `Monthly active users`, `Net revenue retention`,
`NPS`, `Uptime`, `Cost per request`, each with its delta against last quarter. Only `Cost per request`
passes `inverse`; a rise there is bad.

### E. Metric definitions — `Hint` (required)

One sentence per tile and trend card. Executives may not know how NPS or net revenue retention are
computed; the `Hint` says so without adding text to the tile.

### F. Trend cards — `ChartCard` (required)

Small multiples in a region labelled `Trends`, one card per scorecard metric, all the same size, so
the reader compares shapes, not axes.

### G. Twelve-month change — `Tag` (required)

The trend card's change over twelve months (`+25.2%`), and each goal's status (`On track`, `At risk`,
`Off track`).

### H. Compact trends — `Chart` (required)

Area or Line over the last 12 months. Every trend card shares one `active-index`, so hovering a month
moves the crosshair on all of them and the reader reads one month across every metric.

### I. Goals and commentary — `Card` (required)

The side column: a goals `Card` titled with the quarter (`Q3 goals`) and a `Commentary` card.

### J. Loading rows — `Skeleton` (required)

Holds goal rows and note rows while the quarter loads.

### K. Goal progress — `Progress` (required)

Current against target for each goal, with an `aria-label` naming the goal, and both figures printed
beside it in tabular numbers.

### L. Empty regions — `EmptyState` (required)

When the whole quarter has nothing reported, the tiles keep their dash (nothing was reported, so zero
would be false) and one bordered page-level `EmptyState` replaces the trends, goals and commentary:
`No results reported for Q3 2025`, what fills the page, and `Show Q4 2025` as the next step. When only
some regions are empty, each names the quarter in its own empty state: trend cards
(`No results for Q3` / `Nothing was reported in this period. Select a later quarter.`), goals and
commentary (`Leads add notes here when they review the quarter.`).

### M. Notes — `Item` (required)

One `Item` per note: author, role, date and the note itself.

### N. Author — `Avatar` (required)

The author's initials beside each note.

### O. Load failure — `Alert` (required)

When `error` is set, one danger `Alert` under the page heading says `Couldn't load <page>.` followed by the message, with Retry, which emits `retry`. Every region keeps its header and shows a quiet `Not available.` line in place of its content, and each tile shows a dash over a neutral `Couldn't load` band, so one failed request reads as one problem instead of a wall of red banners.

## Data

The block takes its figures and records through props and emits every action; it fetches nothing. `ExecutiveSummaryDashboardProps` and the record types (`ExecutiveSummaryDashboardKpis`, `ExecutiveSummaryDashboardGoal`, `ExecutiveSummaryDashboardTrends`, `ExecutiveSummaryDashboardNote`) are exported from `dashboard-executive-summary.vue`, and `sample.ts` holds the sample quarter the block renders when a data prop is left out (and never while `loading` or `error` is set).

| Prop              | Type                              | What it does                                                                                                                                                            |
| ----------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `kpis`            | `ExecutiveSummaryDashboardKpis`   | The value and delta of each scorecard tile, by metric (`revenue`, `active-users`, `retention`, `nps`, `uptime`, `cost-per-request`). A metric left out reads as a dash. |
| `goals`           | `ExecutiveSummaryDashboardGoal[]` | The quarter goals with their current figure, target and status. `[]` shows No goal results.                                                                             |
| `labels`          | `string[]`                        | The month labels of the trend charts.                                                                                                                                   |
| `trends`          | `ExecutiveSummaryDashboardTrends` | Each trend card's monthly values and change tag, by metric. A metric left out shows the card's empty state.                                                             |
| `notes`           | `ExecutiveSummaryDashboardNote[]` | The notes from the leads, newest first. `[]` shows No notes.                                                                                                            |
| `loading`         | `boolean`                         | The quarter is loading; tiles and charts show their skeleton, goals and commentary hold skeleton rows, Export disables.                                                 |
| `error`           | `string`                          | Why the period could not load; one danger `Alert` under the heading shows it with Retry, and the regions show `Not available.`                                          |
| `v-model:quarter` | `string`                          | The selected quarter (`Q3 2026` down to `Q3 2025`); default `Q3 2026`. Refetch when it changes.                                                                         |

| Event            | Payload   | When                                                                      |
| ---------------- | --------- | ------------------------------------------------------------------------- |
| `retry`          | `(event)` | Retry in the page's error alert.                                          |
| `export`         | `(event)` | Export in the header; the block downloads the scorecard and goals as CSV. |
| `update:quarter` | `(value)` | The reader picked another quarter.                                        |

To go live, render the block from a page that owns the request and pass what it returns:

```vue
<script setup lang="ts">
  import DashboardExecutiveSummary from './dashboard-executive-summary.vue'

  const quarter = ref('Q3 2026')
  const { data, pending, error, refresh } = useExecutiveSummary(quarter)
</script>

<template>
  <DashboardExecutiveSummary
    v-model:quarter="quarter"
    :kpis="data?.kpis ?? {}"
    :goals="data?.goals ?? []"
    :labels="data?.labels ?? []"
    :trends="data?.trends ?? {}"
    :notes="data?.notes ?? []"
    :loading="pending"
    :error="error ? 'Check your connection and retry.' : ''"
    @retry="refresh"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Keep every trend card the same size and form so shapes compare.
- Show the target next to the current value for every goal; a bar alone hides the gap.
- Use status words for goals (`On track`, `At risk`, `Off track`), with color as reinforcement.
- Link from each metric to the dashboard that explains it, when one exists.

## Don't

- Don't add more than about six scorecard tiles; the page is read, not explored.
- Don't give trend cards different periods or sizes.
- Don't mark growth metrics `inverse`; only cost and error style metrics read a rise as bad.
- Don't leave commentary empty without saying who fills it.

## Copy

- **Title:** `Executive summary`.
- **Description:** `Headline results for the quarter, progress on its goals, twelve-month trends and notes from the leads.`
- **Tile labels:** spelled-out metric, acronyms uppercase. `Net revenue retention`, `NPS`.
- **Goal status:** two words at most. `On track`, `At risk`, `Off track`.
- **Empty states:** name the period. `No goal results for Q3` / `Progress appears once the quarter reports its first month.`

## Accessibility

- The quarter `Select` trigger has `aria-label="Quarter"`; tiles and trends are regions labelled `Scorecard` and `Trends`.
- Each goal `Progress` has an `aria-label` with the goal name; current and target are visible text.
- Goal status is a word in a `Tag`, never color alone.
- Figures use `tabular-nums`.

## States

- Default: the reported quarter (`v-model:quarter`).
- Loading: `loading` is set; tiles and charts render their own `Skeleton`; goals and commentary hold Skeleton rows.
- Empty: a quarter with nothing reported (`kpis` and `trends` are `{}`, `goals` and `notes` are `[]`); tiles show a dash with no delta, and one page-level `EmptyState` names the quarter and offers the next later one in place of the trend cards, goals and commentary.
- Error: `error` is set; one danger `Alert` under the heading names what did not load, carries the message and offers Retry; tiles show a dash over a quiet band and every region keeps its header over `Not available.`

## Related

- `dashboard/dashboard-breakdown` — where a cost metric breaks down.
- `dashboard/dashboard-analytics` — the detail behind a traffic metric.
