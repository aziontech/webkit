# Project status dashboard

Where one project stands against its plan, one project and sprint at a time. A lead or a team member
opens it before a stand-up or a review to see completion, the sprint burndown, the next milestones,
what is at risk and who carries the open work. The page heading (`Project status`) sits over a filter
row that picks the project and the sprint; every region reads that pair.

## When to use

- Work is tracked as tasks with status, estimates, owners and due dates, grouped in sprints.
- The reader needs the plan (ideal burndown, milestones) next to the actual.
- Risks have reasons the reader can act on, not only a count.

## When not to use

- Results for a whole quarter across teams: use `platform/dashboard/executive-summary-dashboard`.
- The full task list with filters and bulk actions: use `platform/view/table-view`.
- Live service health: use `platform/dashboard/service-monitoring-dashboard`.

## Building blocks

### A. Project and sprint — `Select` (required)

Two selects labelled `Project` and `Sprint` under the page heading. The sprint label carries its dates
(`Sprint 6 · Oct 27 – Nov 7` in the SFC).

### B. Sprint tiles — `StatTile` (required)

`Completion`, `Tasks done`, `Open tasks`, `Overdue`, each against the previous sprint. `Open tasks` and
`Overdue` pass `inverse`.

### C. Definitions — `Hint` (required)

One sentence on every tile and card title.

### D. Cards — `ChartCard` (required)

`Completion` and `Sprint burndown` share a row; `Milestones` and `At risk` share the next; `Owners`
closes the grid. Every card has the same header: title with `Hint`, its tags, and a menu.

### E. Card menu — `DropdownMenu` (optional)

`Copy link` and `Export CSV`.

### F. Card menu trigger — `IconButton` (optional)

Icon-only, `aria-label="More options for Completion"` and so on.

### G. Tasks by status — `DonutChart` (required)

Done, in progress, not started and blocked; blocked takes the danger color because it means a state.
The center shows the task count.

### H. Add tasks — `Button` (required in the empty state)

The completion card's one setup action when the project has no tasks.

### I. Card tags — `Tag` (required)

How far behind the sprint runs on the burndown (`23 pts behind`), the open count on At risk, each
at-risk reason (`Blocked`, `Overdue`, `Behind`), and overdue counts in the owners table as a danger tag.

### J. Sprint burndown — `Chart` (required)

Two lines: `Actual` story points left against `Ideal`, the straight line to zero. The ideal line is the
reference; keep it quieter than the actual.

### K. Loading rows — `Skeleton` (required)

Holds milestone and at-risk rows while the sprint loads.

### L. Milestones and at-risk rows — `Item` (required)

The milestone timeline is an `Item` list with the date, title and status of each checkpoint (there is
no timeline component). At risk lists each task with its reason and a `Tag`.

### M. Milestone status — `StatusIndicator` (required)

`Done`, `At risk`, `Upcoming` in words beside each milestone.

### N. Empty regions — `EmptyState` (required)

Every card says what will appear: `No tasks yet` / `Progress appears here once the project has tasks.`,
`Nothing to burn down`, `No milestones yet`, `Nothing at risk`, `No owners yet`.

### O. Owners — `TableRoot` (required)

Each owner with open and done counts and overdue as a danger `Tag`, in tabular figures.

### P. Owner identity — `Avatar` (required)

The owner's initials beside the name.

## Do

- Write the reason next to every at-risk task; a count alone does not tell anyone what to do.
- Keep milestone status in words and in order of date.
- Mark open and overdue tiles as `inverse`.
- Offer exactly one setup action (`Add tasks`) when the project is empty.

## Don't

- Don't color the donut's categories with status hues except for the one that means a state (blocked).
- Don't make the ideal line louder than the actual.
- Don't hide an empty card; keep its box and say what fills it.
- Known gap: the SFC writes the page heading as plain markup (`h1` and a paragraph) instead of `PageHeader`, which the other dashboards use.

## Copy

- **Title:** `Project status`. **Description:** `Progress, milestones and risks for the selected project and sprint.`
- **Sprint labels:** name, a middle dot, the date range written with `to`. `Sprint 5 · Oct 13 to Oct 24`.
- Known gap: the SFC's sprint labels use an en dash for the range (`Oct 13 – Oct 24`), which `webkit-microcopy` bans.
- **At-risk reason:** one sentence with a period, the cause and its effect. `Blocked by a library upgrade waiting on security review.`
- **Behind tag:** amount plus unit. `23 pts behind`.
- **Empty state:** `Nothing at risk` / `Tasks that are blocked, overdue or behind appear here.`

## Accessibility

- Both selects have `aria-label`s (`Project`, `Sprint`).
- The donut has `aria-label="Tasks by status"` and a legend with counts.
- Status is written (`StatusIndicator`, `Tag`), never color alone.
- Figures use `tabular-nums`.

## States

- Default: the selected project and sprint.
- Loading: tiles, both charts and the table hold their place with a `Skeleton`; the two lists show Skeleton rows.
- Empty: a project with no tasks; tiles show a dash with no delta or trend, every card keeps its box with an `EmptyState`, and the completion card offers `Add tasks`.

## Related

- `platform/dashboard/executive-summary-dashboard` — goals and trends across a quarter.
- `platform/view/table-view` — the task list itself.
- `StatusIndicator` / `Tag` — status in words.
