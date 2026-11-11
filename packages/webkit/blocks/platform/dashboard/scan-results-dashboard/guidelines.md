# Scan results dashboard

The page for a pipeline that sends items (files, attachments, packages) for analysis and gives each a
verdict. The reader checks what was submitted, what is still waiting, what was flagged, and above all
two exceptions: deliveries held until a verdict arrives, and items that were delivered before they
were flagged. It ends in the submissions table, where the reader finds a specific item.

## When to use

- Items get a verdict from an asynchronous analysis (Clean, Suspicious, Flagged, Pending).
- Some items are held or released depending on that verdict, and the exceptions need follow-up.
- The reader needs to look up a specific item by name or submitter.

## When not to use

- A continuous score rather than a verdict per item: use `platform/dashboard/health-score-dashboard`.
- Alerts triaged by severity: use `platform/dashboard/alerts-dashboard`.
- Requests decided by rules in real time: use `platform/dashboard/activity-outcomes-dashboard`.

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

### M. Submissions — `TableRoot` (required)

Paginated: name, verdict, category, score, type, size, source, first submitter and last seen. Score,
size and dates in tabular figures.

### N. Empty regions — `EmptyState` (required)

`No verdict yet` / `Verdicts appear once the first item finishes its analysis.` in the donut,
`No items yet` in sources, and `No matching items` / `Change the search or the filters.` in the table.

### O. Verdict — `Tag` (required)

The verdict of each row, in the same hue as its donut slice.

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
- Loading: tiles, donut and bar list render their own `Skeleton`, the summary card holds Skeleton lines and the table shows Skeleton rows.
- Empty: nothing submitted yet; tiles read zero, verdicts and sources keep their box with an `EmptyState`, and the Submissions card drops the filters and the table for one `EmptyState`.
- Failed: the request for the period failed; tiles show a dash, and every card keeps its header with a danger `Alert` that names what did not load and offers Retry.

## Related

- `platform/dashboard/alerts-dashboard` — the early delivery alerts as a triage queue.
- `platform/dashboard/activity-outcomes-dashboard` — decisions made in real time.
- `platform/view/table-view` — the submissions table on its own page.
