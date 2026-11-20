# Security dashboard

The page a reader opens to see what their security rules are doing: how many requests were blocked
and inspected, how blocking moved over time, which attack categories and countries it came from, which
source addresses sent the most, and the short list of settings and traffic that need a decision now.
Needs attention is what makes it more than a report: every entry ends in one action.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), which owns the rail, the header and the `main`.

## When to use

- Use dashboard-security for WAF/firewall traffic: blocked vs allowed over time, attack categories, source IPs; ByActor lists each request of known actors with the rule that decided it.
- Security rules (firewall, WAF, bot rules) inspect and block requests, and the reader owns those rules.
- The reader needs the trend and the breakdown, plus a short list of things to fix.
- Source addresses or networks are worth searching individually.

## When not to use

- Alerts with severity and an open queue: use `dashboard/dashboard-alerts`.
- Plain traffic volume and status codes: use `dashboard/dashboard-analytics`.
- Items waiting for a verdict from an asynchronous analysis: use `dashboard/dashboard-scan-results`.

## Building blocks

### A. Page heading and period — `PageHeader`, `Select` (required)

The header `Select` is `variant="ghost"`: no border until hover, so it shares the header row with the outlined buttons beside it; a header never holds a field outline.

Title `Security` and one sentence on what the page shows, over the rest of the page in the standard
`layout-column`. The header actions hold one medium `Select` named `Period` by its `aria-label`
(`Last hour`, `Last 24 hours`, `Last 7 days`, `Last 30 days`); it sets the comparison label of every
delta (`vs previous 7 days`) and the period in the exported CSV file name
(`requests-last-7-days.csv`). No card has a period control of its own.

### B. KPI row — `StatTile` (required)

`Requests blocked`, `Requests inspected`, `Block rate`, each with a sparkline and the change
`vs previous 24 hours`. `Requests blocked` and `Block rate` pass `inverse`: more blocking means more
attacks.

### C. Definitions — `Hint` (required)

One sentence on every tile and card title.

### D. Cards — `ChartCard` (required)

`Matched requests over time` and `Needs attention` share a row; `Blocked requests by attack category`
and `Blocked requests by country` share the next; `Top source IPs by blocked requests` closes it.

### E. Tags — `Tag` (required)

`Sum` and the signed change in each chart header, the open count on Needs attention, and the kind of
each attention entry (`Log only`, `Spike`, `No rules`) with its severity.

### F. Line or Bar — `ToggleGroup` (optional)

Only on `Matched requests over time`.

### G. Control labels — `Tooltip` (required)

Names Expand and More options.

### H. Expand — `IconButton`, `Dialog`, `DialogContent`, `PanelHeader`, `DialogTitle`, `DialogDescription`, `PanelBody` (optional)

Its `aria-label` names the card (`Expand Matched requests over time`). It opens one large `Dialog`
with the card title, its Hint sentence as the description, and the region at full size: the matched
requests chart at a 420px plot with the same Line or Bar choice, the breakdown `BarList`, or the
source IP table at ten rows per page. Closing it returns focus to Expand. Disabled while loading and
after a failure.

### I. More options — `DropdownMenu`, `toast` (optional)

`Copy query` copies the card's GraphQL query (`securityMetrics`, the period as `tsRange`) and
confirms with `Query copied.`; `Export CSV` saves the card's rows with `toCsv` and `downloadCsv`
from `@aziontech/webkit/utils/csv` and confirms with `CSV exported.` and the file name. Export is
disabled while loading and after a failure; the app mounts the toast region.

### J. Matched requests — `Chart` (required)

`Blocked` and `Logged` over time, in the danger and warning status colors, because each color means a
state.

### K. Needs attention — `Item` (required)

One `Item` per entry: a title that states the problem, one sentence with the evidence, a severity
`Tag` and one action.

### L. Attention action — `Link` (required)

The one move per entry: `Review rules`, `Open security metrics`, `Attach a rule set`.

### M. Breakdowns — `BarList` (required)

Blocked requests by attack category and by country, largest first, each with an `aria-label`.

### N. Search — `Input` (optional)

`Search addresses, networks or attacks` for the source IP table.

### O. Top source IPs — `DataTable` (required)

Searchable and paginated; addresses and counts in tabular figures.

### P. Empty regions — `EmptyState` (required)

Each chart keeps its box (`No matched requests in this period` / `Nothing was recorded in this period.`, and `No blocked requests in this period` on the breakdowns) and the table
says `No matching rows` / `Change the search.` When no rule set exists at all, the Empty variant
replaces the whole grid with one bordered `EmptyState` and its `Add rule set` button.

### Q. Request activity by actor — `PageHeader`, `Select`, `IconButton`, `Input`, `StatTile`, `Hint`, `ChartCard`, `Chart`, `BarList`, `DataTable`, `Tag`, `EmptyState` (optional)

Variant ByActor only; it adds `FilterMenu`, `Button`, `Table` and `SeverityTag` to the page: the same blocked and allowed data, pivoted per known actor, with the rule that
decided each request. Title `Request activity`. The heading's actions hold the time range `Select`
(named `Time range`) and a Refresh `IconButton` (`aria-label="Refresh"`, the block emits `refresh`).
Under it, one `FilterMenu` with three multi-choice fields (Actor, Outcome, Category) in a container
labelled `Filters`, its `FilterMenu.ChipGroup` on the row below, and a destination `Input` named
`Destination host`. The filters are global: every tile, chart, breakdown and the log read them; when
they match nothing, the chart and the log show `No requests match these filters` with an outlined
`Clear filters` `Button`, and the tiles show a dash.

Seven outcome `StatTile`s in a grid labelled `Outcomes` (requests, allowed, blocked, held, approved,
denied, over budget), each with its delta and a `Hint`; pass `inverse` on every outcome where a rise
is bad. Outcomes over time are stacked bars, one series per exclusive outcome in its status color
(allowed success, blocked danger, held warning) — here the color means a state. Three `BarList`s rank
by actor, by category and by destination, largest first. The request log `DataTable` lists time,
actor, outcome (a `TableCellStatus` in the same hue as its series), category, a `SeverityTag`,
destination, method and the rule that decided it; outcome and severity are two different facts.

### R. Load failure — `Alert` (required)

With `error` set, a danger `Alert` with Retry takes the place of each card's content, naming what
did not load (`Couldn't load matched requests over time.`); the card actions disable and the tiles
read as a dash.

### S. Loading placeholders — `Skeleton` (required)

Holds the Needs attention rows during the first load.

### T. Add rule set — `Button` (required)

The primary action of the empty state, linking to the rules page.

## Data

The block takes its records through props and emits every action; it fetches nothing. `SecuritySummary`, `SecurityMetric`, `SecurityMatchedRequests`, `SecuritySourceIp`, `SecurityAttentionEntry`, `SecurityCardChanges`, `SecurityPeriodRange`, `SecurityPeriod`, `SecurityCardId` and `SecurityDashboardProps` are exported from `dashboard-security.vue`, and `sample.ts` holds the sample figures, series, breakdowns, IPs and attention entries the block renders when a data prop is left out (and never while `loading` or `error` is set). Export CSV and Copy query run in the browser on the data the block holds. The ByActor variant is a separate page and keeps its own sample log.

| Prop / model      | Type                       | What it does                                                                                                |
| ----------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `summary`         | `SecuritySummary`          | The three tiles: value, change and sparkline. A `null` value shows a dash.                                  |
| `matchedRequests` | `SecurityMatchedRequests`  | The Blocked and Logged series with their labels.                                                            |
| `categories`      | `BarListItem[]`            | Blocked requests by attack category.                                                                        |
| `countries`       | `BarListItem[]`            | Blocked requests by country.                                                                                |
| `sourceIps`       | `SecuritySourceIp[]`       | The Top source IPs rows; the search runs on them in the browser.                                            |
| `attention`       | `SecurityAttentionEntry[]` | The Needs attention list, each with the link that resolves it.                                              |
| `changes`         | `SecurityCardChanges`      | Each card's change against the previous period, in percent; a rise is danger, a fall success.               |
| `range`           | `SecurityPeriodRange`      | The start and end of the period, written into the copied query.                                             |
| `loading`         | `boolean`                  | The period is loading: tiles, charts and the table show Skeletons, the card actions disable.                |
| `error`           | `string`                   | Why the request failed, shown after `Couldn't load matched requests over time.` (…) in each danger `Alert`. |
| `v-model:period`  | `SecurityPeriod`           | The period the tiles compare against; refetch when it changes. Defaults to `24h`.                           |

Every region empty (`[]` lists and no series) is the no-rule-set state: one `EmptyState` with `Add rule set` replaces the grid.

| Event   | Payload   | When                              |
| ------- | --------- | --------------------------------- |
| `retry` | `(event)` | Retry in any of the error alerts. |

To go live, render the block from a page that owns the request and pass what it returns:

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import DashboardSecurity, { type SecurityPeriod } from './dashboard-security.vue'

  const period = ref<SecurityPeriod>('24h')
  const { data, pending, error, refresh } = useSecurityMetrics(period)
</script>

<template>
  <DashboardSecurity
    v-model:period="period"
    :summary="data?.summary"
    :matched-requests="data?.matched"
    :categories="data?.categories ?? []"
    :countries="data?.countries ?? []"
    :source-ips="data?.sourceIps ?? []"
    :attention="data?.attention ?? []"
    :changes="data?.changes"
    :range="data?.range"
    :loading="pending"
    :error="error ? 'Check your connection and retry.' : ''"
    @retry="refresh"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- End every Needs attention entry with exactly one action.
- Mark blocking metrics as `inverse`.
- Replace the grid with one setup empty state when no rule exists; empty charts would only repeat it.
- Keep the attention list short; it is a queue, not a log.

## Don't

- Don't use the danger color for a categorical breakdown such as countries.
- Don't put more than one action on an attention entry.
- Don't show the full grid of empty charts when the cause is a missing rule set.

## Copy

- **Title:** `Security`. **Description:** `Requests your rules blocked and inspected, and the settings that need a decision.`
- **Attention title:** the problem as a statement. `Service without a rule set`.
- **Attention description:** one sentence of evidence with a figure. `SQL injection against the API rose 64% in the last hour.`
- **Attention action:** verb first. `Review rules`, `Attach a rule set`.
- **Kind tag:** two words at most. `Log only`, `Spike`, `No rules`.
- **ByActor:** title `Request activity`, description `What each actor requested through the rules and what the rules decided.`; outcome tags are one past participle (`Allowed`, `Blocked`, `Held`); no match `No requests match these filters` / `Clear the filters or pick other values.`
- **Setup empty state:** `No security rules protect your services` / `Security metrics and the Needs attention list appear once a rule set protects a service.`, action `Add rule set`.

## Accessibility

- Every icon-only control has an `aria-label` that names its card, plus a `Tooltip`.
- The search `Input` has an `aria-label` equal to its placeholder.
- The expanded `Dialog` traps focus, closes on Escape and returns focus to the Expand button.
- Severity is a word in the `Tag`, not color alone.
- Figures use `tabular-nums`.

## States

- Default: rules in place, populated tiles, charts, attention list and table.
- Loading: `loading`; every tile, chart and the table hold a `Skeleton`; Needs attention shows three placeholder rows.
- Empty: no rule set yet (every list `[]`, tiles with `null` values); tiles read as dashes and one bordered `EmptyState` offers `Add rule set` instead of a grid of empty charts.
- ByActor: request activity per actor with the rule that decided each request; NoMatch is a state of it.
- Error: `error`; tiles show a dash, and every card keeps its header with a danger `Alert` that names what did not load and offers Retry.

## Related

- `dashboard/dashboard-alerts` — the alert queue raised by these rules.
- `dashboard/dashboard-scan-results` — verdicts from an asynchronous analysis.
- `view/view-table` — the request log on its own, as a filterable list page.
- `edit/edit-rule-builder` — where a rule set is edited.
