# Data dashboard

The usage page: how much the account's projects consumed in the period, how that compares with the
previous period, and which projects drove it. It leads with six KPI tiles (each with a sparkline and
the change against the previous 24 hours), then explains the headline number with this period against
the previous one, a ranking of projects and a table of usage per project.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shells/console`), which owns the rail, the header and the `main`.

## When to use

- The reader checks consumption across several products or meters (requests, data, jobs, images).
- The comparison that matters is this period against the previous one.
- Usage is attributed to projects or other owners the reader can act on.

## When not to use

- Traffic quality (status codes, success rate) rather than consumption: use
  `platform/dashboard/analytics-dashboard`.
- Money, split by category: use `platform/dashboard/composition-dashboard`.
- The reader arranges the cards: use `platform/dashboard/configurable-dashboard`.

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Data usage` and one sentence on what the page shows, over the rest of the page in the standard
`layout-column`.

### B. KPI row — `StatTile` (required)

Six tiles: `Requests`, `Data transferred`, `Jobs run`, `Images processed`, `Requests inspected`,
`Logs exported`. Each has its period total, a sparkline and the change `vs previous 24 hours`.
Consumption is neither good nor bad by itself, so these tiles do not pass `inverse`; pass it only on a
metric where a rise is bad.

### C. Metric definitions — `Hint` (required)

One sentence per tile and card title (`Images resized, cropped or converted in the period.`).

### D. Cards — `ChartCard` (required)

`Data transferred, this period vs previous`, `Data transferred by project` and `Usage by project`,
each with the same header.

### E. Aggregation and change — `Tag` (required)

`Sum` plus the signed change for the period in every card header.

### F. Line or Bar — `ToggleGroup` (optional)

Only on the period comparison chart, labelled with its card.

### G. Control labels — `Tooltip` (required)

Names Expand and More options on hover and focus.

### H. Expand — `IconButton` (optional)

Opens a card full size; its `aria-label` names the card.

### I. More options — `DropdownMenu` (optional)

`Copy query` and `Export CSV` in every card.

### J. Charts — `Chart` (required)

The comparison draws `This period` and `Previous period` as two series of the same metric; the
current period is declared first so it takes the first series color. The project ranking is a labeled
horizontal bar chart, largest first.

### K. Table search — `Input` (optional)

`Search projects`, inside the `Usage by project` card.

### L. Usage by project — `TableRoot` (required)

Searchable, paginated; requests and data transferred per project in tabular, right-aligned figures.

### M. Empty regions — `EmptyState` (required)

`No usage yet` / `Usage appears here once a project serves requests.` when nothing was recorded, and
`No matching rows` / `Change the search.` when the search matches nothing.

## Do

- Compare against the previous period of the same length, and say so in the delta label.
- Keep the same card header on every card.
- Rank breakdowns largest first.

## Don't

- Don't color a rise in usage red unless it is a cost or a limit the reader wants to stay under.
- Don't mix units in one chart; one metric per chart.
- Don't add a per-card period.

## Copy

- **Title:** `Data usage`. **Description:** `What your projects consumed in the period, against the previous period.`
- **Tile labels:** the meter name. `Jobs run`, `Logs exported`.
- **Delta label:** what the change is against. `vs previous 24 hours`.
- **Card titles:** say what is compared. `Data transferred, this period vs previous`.
- **Series names:** `This period`, `Previous period`.
- **Empty state:** `No usage yet` / `Usage appears here once a project serves requests.`
- **No-match state:** `No matching rows` / `Change the search.`

## Accessibility

- Every icon-only control has an `aria-label` naming its card and a `Tooltip`.
- The search `Input` has `aria-label="Search projects"`.
- Figures use `tabular-nums`; deltas carry a sign.
- The two comparison series differ in more than color (legend names, tooltip rows).

## States

- Default: the populated usage page.
- Loading: `Skeleton`s hold every tile, chart and table row in place.
- Empty: no usage recorded yet; each tile shows a dash, and every chart and the table explain that nothing was recorded.
- Failed: the request for the period failed; tiles show a dash, and every card keeps its header with a danger `Alert` that names what did not load and offers Retry.

## Related

- `platform/dashboard/analytics-dashboard` — the same grammar for traffic quality.
- `platform/dashboard/composition-dashboard` — when the total is money split by category.
- `platform/account/change-plan-drawer` — where usage limits are changed.
