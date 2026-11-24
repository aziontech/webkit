# Scan results dashboard

The page for a pipeline that sends items (files, attachments, packages) for analysis and gives each a
verdict. The reader checks what was submitted, what is still waiting, what was flagged, and above all
two exceptions: deliveries held until a verdict arrives, and items that were delivered before they
were flagged. It ends in the submissions table, where the reader finds a specific item.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), which owns the rail, the header and the `main`.

## When to use

- Use dashboard-scan-results when items wait for a verdict from an asynchronous analysis.
- Items get a verdict from an asynchronous analysis (Clean, Suspicious, Flagged, Pending).
- Some items are held or released depending on that verdict, and the exceptions need follow-up.
- The reader needs to look up a specific item by name or submitter.

## When not to use

- A continuous score rather than a verdict per item: use `dashboard/dashboard-health-score`.
- Alerts triaged by severity: use `dashboard/dashboard-alerts`.
- Requests decided by rules in real time: use `dashboard/dashboard-security`.

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Scan results` with one sentence on what it covers.

### B. Refresh — `IconButton` (optional)

Re-reads the results, `aria-label="Refresh"`. Analysis is asynchronous, so the reader needs a way to
pull new verdicts without reloading the page.

### C. Summary tiles — `StatTile` (required)

Six tiles in a region labelled `Summary`: `Submitted`, `In analysis`, `Last 24 hours`, `Flagged`,
`Held for a verdict`, `Open alerts`.

### D. Definitions — `Hint` (required)

One sentence on every tile and card title.

### E. Verdicts and sources — `ChartCard` (required)

Two cards in a row with the summary card: verdicts and sources.

### F. Verdicts — `DonutChart` (required)

Clean, Suspicious and Flagged in the success, warning and danger status hues (the color means the
verdict) and Pending in the neutral Other hue, with the
item count in the center (`Items`).

### G. Sources — `BarList` (required)

Where the items came from (`Inline scan`, `API submission`, `Manual upload`, `Scheduled scan`), largest
first.

### H. Held and flagged — `Card` (required)

Two sentences with counts: deliveries held for a verdict, and alerts for items delivered before they
were flagged. Each is followed by a link to its list. A card, not a chart, because these are
exceptions to act on.

### I. Loading lines — `Skeleton` (required)

Holds the summary card's sentences while the results load.

### J. Exception links — `Link` (required)

`Held deliveries` and `Early delivery alerts`, each to the list that resolves it.

### K. Search — `Input` (required)

`Search by name or submitter`, in the Submissions card's filter row.

### L. Filters — `Select` (required)

Status, verdict and source, each with an "Any" option (`Any status`, `Any verdict`, `Any source`) and
an `aria-label`.

### M. Submissions — `DataTable` (required)

Paginated: name, verdict, category, score, type, size, source, first submitter and last seen. Score,
size and dates in tabular figures. The table sets `stackable`: on a phone each submission becomes a
card of label and value lines, so the verdict is never cut off.

### N. Empty regions — `EmptyState` (required)

`No verdict yet` / `Verdicts appear once the first item finishes its analysis.` in the donut,
`No items yet` in sources, and `No matching items` / `Change the search or the filters.` in the table.

### O. Verdict — `TableCellStatus` (required)

The verdict of each row, in the same hue as its donut slice.

### P. Load failure — `Alert` (required)

When `error` is set, one danger `Alert` under the page heading says `Couldn't load <page>.` followed by the message, with Retry, which emits `retry`. Every region keeps its header and shows a quiet `Not available.` line in place of its content, and each tile shows a dash over a neutral `Couldn't load` band, so one failed request reads as one problem instead of a wall of red banners.

## Data

The block takes its records through props and emits every action; it fetches nothing. `ScanResultsSubmission`, `ScanResultsSummary`, `ScanResultsVerdict`, `ScanResultsSource` and `ScanResultsDashboardProps` are exported from `dashboard-scan-results.vue`, and `sample.ts` holds the sample figures, splits and submissions the block renders when a data prop is left out (and never while `loading` or `error` is set).

| Prop           | Type                      | What it does                                                                                                                   |
| -------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `summary`      | `ScanResultsSummary`      | The six tiles and the Held and flagged card. All zeros is the nothing-submitted state.                                         |
| `verdictSplit` | `ChartSeries[]`           | One donut slice per verdict, each with its status color. `[]` shows `No verdict yet`.                                          |
| `sources`      | `BarListItem[]`           | One bar per source. `[]` shows `No items yet`.                                                                                 |
| `submissions`  | `ScanResultsSubmission[]` | The Submissions rows; the search and the filters run on them in the browser. `[]` shows `No items yet`.                        |
| `loading`      | `boolean`                 | The period is loading: every region shows its Skeleton.                                                                        |
| `error`        | `string`                  | Why the period could not load; one danger `Alert` under the heading shows it with Retry, and the regions show `Not available.` |

| Event     | Payload   | When                             |
| --------- | --------- | -------------------------------- |
| `refresh` | `(event)` | Refresh in the page heading.     |
| `retry`   | `(event)` | Retry in the page's error alert. |

The `Held deliveries` and `Early delivery alerts` links point at `#held` and `#alerts`; point them at your pages. To go live, render the block from a page that owns the request and pass what it returns:

```vue
<script setup lang="ts">
  import DashboardScanResults from './dashboard-scan-results.vue'

  const { data, pending, error, refresh } = useScanResults()
</script>

<template>
  <DashboardScanResults
    :summary="data?.summary"
    :verdict-split="data?.verdicts ?? []"
    :sources="data?.sources ?? []"
    :submissions="data?.submissions ?? []"
    :loading="pending"
    :error="error ? 'Check your connection and retry.' : ''"
    @refresh="refresh"
    @retry="refresh"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Keep verdict colors identical in the donut and the table.
- Put the exceptions (held, delivered then flagged) in sentences with links, so each leads to an action.
- Offer an "Any" option on every filter so the default is the whole set.
- When nothing was ever submitted, replace the filters and the table with one empty state.

## Don't

- Don't show Pending as a failure; it is an unknown, not a verdict.
- Don't use the verdict hues for sources or categories.
- Don't keep filters visible over a table that can never have rows.

## Copy

- **Title:** `Scan results`.
- **Tile labels:** short noun phrases. `Held for a verdict`, `In analysis`.
- **Verdicts:** one word. `Clean`, `Suspicious`, `Flagged`, `Pending`.
- **Exception sentences:** count first, past tense, period. `12 deliveries held for a verdict now, 4 in the last 24 hours.`
- **Links:** the destination, not "Click here". `Held deliveries`.
- **No-match state:** `No matching items` / `Change the search or the filters.`

## Accessibility

- Refresh, search and every filter have an `aria-label`.
- The donut and the bar list have `aria-label`s (`Verdicts`, `Sources`).
- Verdicts are words in a `Tag`, never color alone.
- Loading regions set `aria-busy="true"`; figures use `tabular-nums`.

## States

- Default: results with verdicts, exceptions and the submissions table.
- Loading: `loading`; tiles, donut and bar list render their own `Skeleton`, the summary card holds Skeleton lines and the table shows Skeleton rows.
- Empty: nothing submitted yet (a zero `summary`, `[]` splits and `submissions`); tiles read zero, verdicts and sources keep their box with an `EmptyState`, and the Submissions card drops the filters and the table for one `EmptyState`.
- Error: `error` is set; one danger `Alert` under the heading names what did not load, carries the message and offers Retry; tiles show a dash over a quiet band and every region keeps its header over `Not available.`

## Related

- `dashboard/dashboard-alerts` — the early delivery alerts as a triage queue.
- `dashboard/dashboard-security` — decisions made in real time.
- `view/view-table` — the submissions table on its own page.
