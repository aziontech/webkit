# Funnel and cohort dashboard

The growth page: how people move through the steps from a first visit to a paid plan, where they drop
off, and how well each weekly sign-up cohort keeps coming back. One global filter bar (period and
segment) drives every region, so the funnel, the tiles and the cohorts always describe the same slice
of users.

## When to use

- A sequence of steps where each one is a subset of the one before (visit, sign-up, activation, paid).
- Retention by cohort: groups that started in the same week, measured at the same offsets after.
- The reader compares segments by switching one filter and watching every region move.

## When not to use

- Parts of a total that do not happen in order: use `platform/dashboard/composition-dashboard`.
- Plain traffic over time: use `platform/dashboard/analytics-dashboard`.
- Configuring the onboarding steps themselves: use `platform/account/onboarding-form`.

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Funnel and retention` with one sentence on what it measures.

### B. Period and segment — `Select` (required)

One filter bar labelled `Filters` with a period (`Last 30 days`, `Last 6 weeks`, `Last 90 days`) and a
segment (`All users`, `Self-serve`, `Sales-assisted`, `Partner referrals`). The bar stays usable while
the page loads.

### C. Step tiles — `StatTile` (required)

Five tiles: `Visitors`, `Sign-ups`, `Activated`, `Paid`, `Overall conversion`, each against the
previous period with a sparkline.

### D. Definitions — `Hint` (required)

On every tile and card title. The funnel `Hint` states the counting rule:
`Unique users who reached each step in the period, in order, with the share lost between steps.`

### E. Cards — `ChartCard` (required)

`Conversion funnel` spans the grid; `Retention by cohort` and `Weekly cohorts` share the next row.

### F. More options — `DropdownMenu` (optional)

`Export CSV` in each card header.

### G. More options trigger — `IconButton` (optional)

Icon-only, `aria-label="More options for Conversion funnel"` and so on per card.

### H. Funnel and retention charts — `Chart` (required)

The funnel is a horizontal, labeled `Chart.Bar` of the steps in order, never re-sorted by size.
Retention is a multi-series `Chart.Line` by week since sign-up, one series per weekly cohort
(`Sep 28 cohort` …) in categorical order.

### I. Clear filters — `Button` (required in the empty state)

In each chart's and table's empty actions, `Clear filters` resets the period and the segment. It is the
only recovery when the filters match nothing.

### J. Step and cohort tables — `TableRoot` (required)

Beside the funnel, a table states each step's users, share of visitors and drop-off from the step
before. The cohort table lists each cohort's size and its week 1 to week 6 retention in tabular
figures, where a dash marks a week that has not ended. The retention matrix is a plain table, not a
heatmap.

### K. Empty regions — `EmptyState` (required)

`No visitors match these filters` / `Select another segment or widen the period.` and
`No cohorts match these filters`, each with `Clear filters`.

## Do

- Keep the funnel steps in their real order and show both the count and the drop-off.
- Use a dash, not zero, for a week that has not ended yet.
- Let one filter bar drive every region.
- Name the filters as the reason when nothing matches.

## Don't

- Don't color a retention matrix as a heatmap; a plain table with tabular figures is easier to compare.
- Don't sort the funnel by size.
- Don't add filters inside cards.
- Don't plot more than six cohorts as lines; fold the rest or narrow the period.

## Copy

- **Title:** `Funnel and retention`.
- **Description:** `How visitors move from a first visit to a paid plan, and how many of each weekly sign-up cohort keep coming back.`
- **Step names:** the state the user reached, one or two words. `Sign-ups`, `Activated`, `Paid`.
- **Cohort names:** the start date. `Oct 5 cohort`.
- **Column headers:** `Week 1` … `Week 6`.
- **Empty state:** `No visitors match these filters` / `Select another segment or widen the period.`, action `Clear filters`.

## Accessibility

- The filter bar is labelled `Filters`; each `Select` has an `aria-label` (`Period`, `Segment`).
- Funnel bars are labeled with their values, and the step table states the same numbers as text.
- Figures use `tabular-nums`.
- The `Weekly cohorts` `Hint` explains the dash (`A dash marks a week that has not ended yet.`), so the symbol is never unexplained.

## States

- Default: the funnel and cohorts for the selected period and segment.
- Loading: every tile, both charts and both tables hold their place with a `Skeleton`; the filter bar stays usable.
- Empty: the filters match nothing; tiles show a dash with no delta or trend, and each card keeps its box with an `EmptyState` that names the filters and offers `Clear filters`.

## Related

- `platform/dashboard/composition-dashboard` — parts of a whole without order.
- `platform/dashboard/executive-summary-dashboard` — the headline conversion beside other results.
- `platform/account/onboarding-form` — the steps a new user goes through.
