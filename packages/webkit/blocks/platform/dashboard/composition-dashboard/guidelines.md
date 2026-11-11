# Composition dashboard

The page that answers "what is this total made of, and how did the mix move?". The block's example is
the organization's monthly spend: the total and its three largest categories first, then the mix over
12 months, the current month's split, and the resources that drive it, ranked. The same shape fits any
total that breaks down into exclusive parts (storage by type, requests by product, seats by team).

## When to use

- One total splits into a small number of exclusive categories (up to six, plus Other).
- The reader needs both the current split and how it changed over time.
- The reader has to find the individual items that drive the largest share.

## When not to use

- The parts are not exclusive or do not sum to the total: use a multi-series line in
  `platform/dashboard/analytics-dashboard` instead of a stack or a donut.
- The reader tracks progress against targets: use `platform/dashboard/executive-summary-dashboard`.
- Steps that people drop out of: use `platform/dashboard/funnel-cohort-dashboard`.
- Changing the plan that drives the spend: use `platform/account/change-plan-drawer`.

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Cost breakdown` with one sentence on what it shows. Its actions hold the period and the export.

### B. Period — `Select` (required)

`Last 12 months` or `Last 6 months`, labelled `Period`. It scopes every region.

### C. Export — `Button` (optional)

`Export CSV` in the page heading exports the whole breakdown. Per-card exports live in each card's menu.

### D. Total and top categories — `StatTile` (required)

Four tiles: `Total spend` first, then the three largest categories. Each shows the change against the
previous month and a 12-month sparkline. A rise in spend is bad, so every tile passes `inverse`.

### E. Metric definitions — `Hint` (required)

Each tile and card title carries a `Hint` (`Everything billed to the organization this month.`).

### F. Cards — `ChartCard` (required)

`Spend by category` and `Current split` share a row; `Top contributors` spans the full width.

### G. Area or Bar — `ToggleGroup` (optional)

Switches the stacked trend between Area and Bar. Labelled `Chart form for Spend by category`.

### H. More options — `DropdownMenu` (optional)

Per-card secondary actions such as `Export CSV`, behind the more-options button.

### I. More options trigger — `IconButton` (optional)

Opens the card's `DropdownMenu`. Icon-only, with an `aria-label` that names the card
(`More options for Spend by category`).

### J. Spend by category — `Chart` (required)

A stacked chart over 12 months, one series per category in the categorical role, with a crosshair, one
tooltip that lists every category for the hovered month, and a legend with range totals. A seventh
category folds into Other; never invent a hue.

### K. Current split — `DonutChart` (required)

This month's split with the total in its center (`This month`). Same category order and colors as the
stacked chart, so the two read as one.

### L. Top contributors — `TableRoot` (required)

Rank, the resource behind its category glyph, the category, the amount, its share of the total and the
change against last month. Amounts and shares use tabular numbers and align right.

### M. Empty regions — `EmptyState` (required)

Each chart and the table keep their box with an empty state: `No spend in this range` /
`Nothing was billed to the organization in the selected period.`

### N. Category and change — `Tag` (required)

The category of each contributor, and its change against last month, are `Tag`s. A rise in spend reads
as bad in the change tag too.

### O. Share of total — `Progress` (required)

Each contributor's share as a `Progress` beside the percentage, with an `aria-label` naming the
resource (`web-app share of total`). The bar is a visual aid; the number is the value.

## Do

- Keep the category order and colors identical across tiles, stacked chart, donut and table.
- Put the total first in the tile row, then the parts.
- Show a percentage next to every share bar.
- Mark spend tiles as `inverse`.

## Don't

- Don't use a donut for more than six slices; fold the tail into Other.
- Don't stack series that overlap or do not sum to the total.
- Don't color categories with status tokens; a category is not a state.
- Don't drop the absolute amount and show only the share.

## Copy

- **Title:** `Cost breakdown`.
- **Description:** `How the organization’s spend splits across categories and the resources that drive it.`
- **Tile labels:** the category name only. `Total spend`, `Compute`, `Database`, `Storage`.
- **Card titles:** `Spend by category`, `Current split`, `Top contributors`.
- **Donut center label:** the period it shows. `This month`.
- **Empty state:** `No spend in this range` / `Nothing was billed to the organization in the selected period.`

## Accessibility

- The period `Select` has `aria-label="Period"`; icon-only controls name their card.
- The donut has an `aria-label` (`Current split`) and its legend lists every category with its value.
- Each `Progress` names its resource; the percentage is visible text, not only the bar.
- Amounts and shares use `tabular-nums`.

## States

- Default: the populated breakdown for the period.
- Loading: every tile, both charts and the table hold their place with a `Skeleton`.
- Empty: nothing billed in the period; tiles show a dash with no delta or trend, and the stacked chart, donut and table each keep their box with an `EmptyState` that names the reason.
- Failed: the request for the period failed; tiles show a dash, and every card keeps its header with a danger `Alert` that names what did not load and offers Retry.

## Related

- `platform/dashboard/executive-summary-dashboard` — targets and trends instead of parts.
- `platform/dashboard/analytics-dashboard` — non-exclusive series as lines.
- `platform/account/change-plan-drawer` — where a reader acts on the spend.
- `DonutChart` / `Chart` — share now, mix over time.
