# Dashboard switcher

The dashboards hub. The reader comes here to look at one of several prepared views of the account (traffic, usage, edge health, threats, business figures, or a layout of their own) without hunting for each page in the navigation. One control picks the dashboard, one shared period scopes it, and the body under them is the chosen dashboard. Switching keeps the period, so comparing traffic and threats over the same 7 days is two clicks.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), which owns the rail, the header and the `main`.

## When to use

- An account has several dashboards that share one time scope, and the reader moves between them often.
- The set mixes platform, security and business views, so a grouped list beats a long navigation menu.
- Some dashboards report on their own calendar (a quarter, a billing cycle) and must say so instead of following the shared period.

## When not to use

- A single dashboard with its own page: use the dashboard block directly (`dashboard/dashboard-analytics`, `dashboard/dashboard-security`, and the rest of `dashboard`).
- A dashboard the reader arranges by hand: use `dashboard/dashboard-configurable` (it is the body of the Custom entry).
- An overview of the whole account with resources and recent activity: use `dashboard/dashboard-home`.

## Pick the dashboard by the shape of the data

| Data shape                                                                 | Block                                         |
| -------------------------------------------------------------------------- | --------------------------------------------- |
| Traffic volume and quality over one period (requests, status codes, hosts) | `dashboard/dashboard-analytics`               |
| Consumption per product or project against the previous period             | `dashboard/dashboard-analytics` (Usage)       |
| Blocked vs allowed requests, attack categories, source IPs                 | `dashboard/dashboard-security`                |
| Each request of known actors with the rule that decided it                 | `dashboard/dashboard-security` (ByActor)      |
| Open alerts to triage by severity                                          | `dashboard/dashboard-alerts`                  |
| Items waiting for a verdict from an asynchronous analysis                  | `dashboard/dashboard-scan-results`            |
| One total split into categories over time                                  | `dashboard/dashboard-breakdown`               |
| Many signals rolled up into one banded score                               | `dashboard/dashboard-health-score`            |
| Real-user web vitals                                                       | `dashboard/dashboard-health-score` (RealUser) |
| Latency percentiles, error rates and live state per service                | `dashboard/dashboard-service-monitoring`      |
| Cards each reader rearranges and resizes                                   | `dashboard/dashboard-configurable`            |
| The account's landing overview                                             | `dashboard/dashboard-home`                    |
| A one-page roll-up of business KPIs for leadership                         | `dashboard/dashboard-executive-summary`       |
| Several of these behind one picker and one shared period                   | `dashboard/dashboard-switcher`                |

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Dashboards` and one sentence that says what the views cover. The heading holds no action; the controls row below does.

### B. Dashboard picker — `Select` (required)

A medium `Select`, a fixed `--container-3xs` wide from `sm` (full width below), with a muted chart icon in the trigger's `prefix` slot and `aria-label="Dashboard"` on the trigger. Options are grouped with `Select.Group`: Platform, Security, Business, then Yours for the reader's own layout. `displayValue` prints the dashboard name, never its id.

### C. Shared period — `FilterMenu` (required)

A medium `FilterMenu` with one single-choice field, Period (Last hour, Last 24 hours, Last 7 days, Last 30 days). Its Filter button carries the count of applied filters; picking a period applies it at once. Hidden for a dashboard that owns its period. Never hand-build this filter from a `Popover`, a `Badge` and radios.

### D. Own period — `ToggleGroup` (optional)

When the chosen dashboard owns its period (Executive summary, Spend, Project status), a medium quarter `ToggleGroup` labelled `Quarter` takes the filter's place, so the reader always sees what the figures cover.

### E. Refresh — `IconButton`, `Tooltip` (required)

An outlined medium `IconButton` at the end of the row, named Refresh by its `Tooltip` and `aria-label`; it emits `refresh` and shows `loading` while the parent refetches (`loading` with `data` already shown).

### F. Applied period — `FilterMenu.ChipGroup` (required)

The applied period as a chip under the controls (`Period: Last 24 hours`), bound to the same model as the menu. Removing it returns the dashboard to the default period (Last 24 hours) and the chip leaves. Hidden with the filter.

### G. Dashboard body — `StatTile`, `Hint`, `ChartCard`, `Chart`, `BarList`, `Alert` (required)

The chosen dashboard, keyed by its id so switching remounts it: four `StatTile`s with a `Hint` each, the delta read against the comparison period (`vs previous 24 hours`, or `vs previous quarter`), then a `ChartCard` spanning 8 of 12 columns with the dashboard's `Chart` (stacked bars, areas or lines, a `Chart.Tooltip total` when it has more than one series, and a legend with totals) and a `ChartCard` spanning 4 with a ranked `BarList`. When the body fails to load, each card keeps its header and shows a danger `Alert` with Retry. Each body here is a placeholder with sample figures: in an app, render the matching dashboard block in its place (the bodies of `dashboard-analytics`, `dashboard-security`, `dashboard-scan-results`, `dashboard-breakdown` and the rest), and render `dashboard-configurable` for the Custom entry under Yours. Don't ship the placeholder bodies as the real dashboards.

## Data

The block takes its views and the selected view's data through props and emits every action; it fetches nothing. `DashboardSwitcherView`, `DashboardSwitcherFigure`, `DashboardSwitcherData`, `DashboardSwitcherFigureValue`, `DashboardSwitcherPeriod`, `DashboardSwitcherQuarter`, `DashboardSwitcherFormat`, `DashboardSwitcherMarkForm` and `DashboardSwitcherProps` are exported from `dashboard-switcher.vue`, and `sample.ts` holds the sample views and a generator of their figures that the block renders when `views` or `data` is left out (and never while `loading` or `error` is set).

| Prop / model      | Type                       | What it does                                                                                                     |
| ----------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `views`           | `DashboardSwitcherView[]`  | The dashboards in the picker, grouped by `group`, each with its figures, chart and breakdown titles and formats. |
| `data`            | `DashboardSwitcherData`    | The selected view's figure values by id, chart labels and series, and breakdown bars for the period.             |
| `loading`         | `boolean`                  | A request is in flight. With no `data` it is the first load (Skeletons); with `data` it is a refetch.            |
| `error`           | `string`                   | Why the view failed to load, shown after `Couldn't load requests over time.` in each card's danger `Alert`.      |
| `v-model:view`    | `string`                   | The selected view's `value`. Defaults to `traffic`.                                                              |
| `v-model:period`  | `DashboardSwitcherPeriod`  | The shared period, bound to the FilterMenu and its chip. Defaults to `24h`.                                      |
| `v-model:quarter` | `DashboardSwitcherQuarter` | The quarter of a view that owns its period. Defaults to `q4`.                                                    |

| Event     | Payload   | When                                |
| --------- | --------- | ----------------------------------- |
| `refresh` | `(event)` | Refresh at the end of the controls. |
| `retry`   | `(event)` | Retry in either card's error alert. |

To go live, render the block from a page that owns the request and refetch when the view, the period or the quarter changes:

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import DashboardSwitcher, {
    type DashboardSwitcherPeriod,
    type DashboardSwitcherQuarter
  } from './dashboard-switcher.vue'

  const view = ref('traffic')
  const period = ref<DashboardSwitcherPeriod>('24h')
  const quarter = ref<DashboardSwitcherQuarter>('q4')
  const { data, pending, error, refresh } = useDashboard(view, period, quarter)
</script>

<template>
  <DashboardSwitcher
    v-model:view="view"
    v-model:period="period"
    v-model:quarter="quarter"
    :views="dashboards"
    :data="data"
    :loading="pending"
    :error="error ? 'Check your connection and retry.' : ''"
    @refresh="refresh"
    @retry="refresh"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Keep the period when the reader switches dashboards; reset only the hover state.
- Load the body on a switch (Skeletons in the final boxes) and refetch it on a period change or Refresh (previous render held), so the controls never jump.
- Hide the shared period for a dashboard that owns its own, and show that dashboard's control in the same place.

## Don't

- Don't list the dashboards as tabs; twelve views in four groups need the grouped picker.
- Don't keep a Period chip that the body ignores.
- Don't put a second period control inside a card.

## Copy

- **Title:** `Dashboards`.
- **Description:** one sentence on what the views cover. `Traffic, security and business views across every workload, plus a layout of your own.`
- **Groups:** one word. `Platform`, `Security`, `Business`, `Yours`.
- **Dashboard names:** a noun phrase in sentence case. `Edge health`, `Funnel and cohorts`.
- **Chip:** the field, then its value. `Period: Last 7 days`.
- **Comparison:** `vs previous 24 hours`, `vs previous quarter`.

## Accessibility

- The picker trigger is named `Dashboard`; the controls sit in a section labelled `Dashboard controls`, the body in a section named after the dashboard, with `aria-busy` while it loads or refetches.
- The period lives in `FilterMenu`, which names its applied count on the Filter button and gives every row and chip its own name.
- Refresh is an icon-only button with `aria-label="Refresh"`.

## States

- Default: Traffic over the last 24 hours.
- OwnPeriod: `v-model:view` set to Executive summary; the shared filter and chip are hidden and the quarter `ToggleGroup` shows.
- Loading: `loading` with no `data`; tiles, chart and list render their Skeletons.
- Error: `error`; the tiles show dashes and each card keeps its header with a danger `Alert` and Retry, which emits `retry`.
- Empty: `data` with no series and no bars; the tiles show dashes, the chart and the ranked list show their empty state (`No data in this period`).
- Refetching: `loading` while `data` is shown, after a period change or Refresh; the chart holds the previous render at reduced opacity and Refresh shows its spinner.

## Related

- `dashboard/dashboard-configurable` — the Custom entry, laid out by the reader.
- `dashboard/dashboard-analytics` (Default and Usage), `dashboard/dashboard-security` — the Traffic, Usage and Threats bodies on their own pages.
- `dashboard/dashboard-home` — the account overview.
