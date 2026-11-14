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

### A. Page heading and period — `PageHeader`, `Select` (required)

Title `Data usage` and one sentence on what the page shows, over the rest of the page in the standard
`layout-column`. The header actions hold one medium `Select` named `Period` by its `aria-label`
(`Last hour`, `Last 24 hours`, `Last 7 days`, `Last 30 days`); it sets the comparison label of every
delta (`vs previous 7 days`) and the period in the exported CSV file name
(`requests-last-7-days.csv`). No card has a period control of its own.

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

### H. Expand — `IconButton`, `Dialog`, `DialogPortal`, `DialogOverlay`, `DialogContent`, `PanelHeader`, `DialogTitle`, `DialogDescription`, `DialogClose`, `PanelContent` (optional)

Its `aria-label` names the card (`Expand Data transferred by project`). It opens one large `Dialog`
with the card title, its Hint sentence as the description, and the region at full size: the chart
at a 420px plot with the same Line or Bar choice, or the usage table at ten rows per page. Closing
it returns focus to Expand. Disabled while loading and after a failure.

### I. More options — `DropdownMenu`, `toast` (optional)

`Copy query` copies the card's GraphQL query and confirms with `Query copied.`; `Export CSV` saves
the card's rows with `toCsv` and `downloadCsv` from `@aziontech/webkit/utils/csv` and confirms with
`CSV exported.` and the file name. Export is disabled while loading and after a failure; the app
mounts the toast region.

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

### N. Real-user monitoring — `StatTile`, `Hint` (optional)

Variant RealUser only; it adds `Select` to the page. Timings measured in the reader's browsers instead of consumption: title
`Real-user monitoring`, and a medium Period `Select` (`Last hour`, `Last 24 hours`, `Last 7 days`,
`Last 30 days`) in the `PageHeader` actions drives every figure. Four vitals `StatTile`s
(`kind="sans"`) lead: `Page load time`, `Largest contentful paint`, `First input delay`,
`Sessions`, each a median value beside its unit (`s`, `ms`, `K`) with no delta, and a `Hint` in the
aside that defines the timing. Under them, a two-column grid of trend `StatTile`s, one per vital,
each with the latest value, its unit, a sparkline of the period and the period name in the aside.
A timing has no "previous period" the reader acts on here, so these tiles carry no delta and no
`inverse`.

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
- **RealUser:** title `Real-user monitoring`, description `Real-user timings collected in the browser, for the selected period.`; tile labels are the timing in sentence case (`First input delay`); the aside of a trend tile is the period name (`Last 24 hours`).

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
- RealUser: the real-user monitoring page; the vitals and the trend tiles follow the Period select.

## Related

- `platform/dashboard/analytics-dashboard` — the same grammar for traffic quality.
- `platform/dashboard/composition-dashboard` — when the total is money split by category.
- `platform/account/change-plan-drawer` — where usage limits are changed.
