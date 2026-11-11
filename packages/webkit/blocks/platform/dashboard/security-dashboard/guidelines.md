# Security dashboard

The page a reader opens to see what their security rules are doing: how many requests were blocked
and inspected, how blocking moved over time, which attack categories and countries it came from, which
source addresses sent the most, and the short list of settings and traffic that need a decision now.
Needs attention is what makes it more than a report: every entry ends in one action.

## When to use

- Security rules (firewall, WAF, bot rules) inspect and block requests, and the reader owns those rules.
- The reader needs the trend and the breakdown, plus a short list of things to fix.
- Source addresses or networks are worth searching individually.

## When not to use

- Every request with the rule that decided it, for a set of actors: use
  `platform/dashboard/activity-outcomes-dashboard`.
- Alerts with severity and an open queue: use `platform/dashboard/alerts-dashboard`.
- Plain traffic volume and status codes: use `platform/dashboard/analytics-dashboard`.

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Security` and one sentence on what the page shows, over the rest of the page in the standard
`layout-column`.

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

### H. Expand — `IconButton` (optional)

Its `aria-label` names the card (`Expand Matched requests over time`).

### I. More options — `DropdownMenu` (optional)

`Copy query` and `Export CSV`.

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

### O. Top source IPs — `TableRoot` (required)

Searchable and paginated; addresses and counts in tabular figures.

### P. Empty regions — `EmptyState` (required)

Each chart keeps its box (`No matched requests in this period` / `Nothing was recorded in this period.`, and `No blocked requests in this period` on the breakdowns) and the table
says `No matching rows` / `Change the search.` When no rule set exists at all, the Empty variant
replaces the whole grid with one bordered `EmptyState` and its `Add rule set` button.

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
- **Setup empty state:** `No security rules protect your services` / `Security metrics and the Needs attention list appear once a rule set protects a service.`, action `Add rule set`.

## Accessibility

- Every icon-only control has an `aria-label` that names its card, plus a `Tooltip`.
- The search `Input` has an `aria-label` equal to its placeholder.
- Severity is a word in the `Tag`, not color alone.
- Figures use `tabular-nums`.

## States

- Default: rules in place, populated tiles, charts, attention list and table.
- Loading: every tile, chart and the table hold a `Skeleton`; Needs attention shows three placeholder rows.
- Empty: no rule set yet; tiles read as dashes and one bordered `EmptyState` offers `Add rule set` instead of a grid of empty charts.

## Related

- `platform/dashboard/alerts-dashboard` — the alert queue raised by these rules.
- `platform/dashboard/activity-outcomes-dashboard` — the rule that decided each request.
- `platform/edit/rule-builder` — where a rule set is edited.
