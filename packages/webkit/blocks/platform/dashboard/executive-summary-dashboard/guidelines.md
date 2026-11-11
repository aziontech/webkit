# Executive summary dashboard

The one page a lead reads to see how the quarter went: the headline results against last quarter, the
twelve-month trend behind each one, progress on the quarter's goals and the notes the leads wrote when
they reviewed it. It favours a few numbers read in seconds over detail; every figure links back to its
own dashboard for the breakdown.

## When to use

- A recurring review (quarterly, monthly) where readers need results, trends, goals and context together.
- The audience reads the page, they do not investigate on it.
- There are a handful of headline metrics (about six) with targets.

## When not to use

- Investigating a metric by dimension: use `platform/dashboard/analytics-dashboard` or
  `platform/dashboard/data-dashboard`.
- Tracking one project's tasks and sprint: use `platform/dashboard/project-status-dashboard`.
- A total broken into categories: use `platform/dashboard/composition-dashboard`.

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Executive summary` and one sentence on what it contains. Actions hold the quarter and Export.

### B. Quarter — `Select` (required)

The reporting period, labelled `Quarter`. It scopes every region, including goals and commentary.

### C. Export — `Button` (optional)

`Export` the summary for sharing outside the product.

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

Each region names the quarter in its empty state: trend cards
(`No results for Q3` / `Nothing was reported in this period. Select a later quarter.`), goals and
commentary (`Leads add notes here when they review the quarter.`).

### M. Notes — `Item` (required)

One `Item` per note: author, role, date and the note itself.

### N. Author — `Avatar` (required)

The author's initials beside each note.

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

- Default: the reported quarter.
- Loading: tiles and charts render their own `Skeleton`; goals and commentary hold Skeleton rows.
- Empty: a quarter with nothing reported; tiles show a dash with no delta, every trend card keeps its box with an `EmptyState` that names the quarter, and goals and commentary say what fills them.
- Failed: the request for the quarter failed; tiles show a dash, and every card keeps its header with a danger `Alert` that names what did not load and offers Retry.

## Related

- `platform/dashboard/project-status-dashboard` — one project against its plan.
- `platform/dashboard/composition-dashboard` — where a cost metric breaks down.
- `platform/dashboard/analytics-dashboard` — the detail behind a traffic metric.
