# Activity history

The account's audit log. An admin or a security reviewer answers "who did this, from where, and when": a token that was revoked, a role that changed, a sign-in that failed, a plan that was upgraded. They narrow the log by period, category, person and address, read the newest events first, copy an IP address into another tool, and export what they found. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`.

## When to use

- The account or organisation audit log: sign-ins, security changes, member and role changes, billing changes, deploys.
- Any append-only list of events people search by who, what, where and when.

## When not to use

- Request logs or metrics explored over time with a chart: use `view/view-events-explorer`.
- The deploy history of one resource: use `detail/detail-deployment-logs` or the details page's history tab.
- A short "recent activity" card on a dashboard: use `Item` rows in a `Card` and link here with View all.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

Title `Activity history` and one sentence that says what is logged and how long it is kept. The only action is the outlined Documentation button: the log is read-only.

### B. Filter — `PropertyFilter` (required)

Bound with `v-bind="propertyFilterProps"`. Properties: Event (free text), Category and User (with options), IP address. Free text searches every column.

### C. Period — `DateRangePicker` (required)

The period comes first in the reader's mind and is filtered before the collection: relative ranges from the last 15 minutes to the last 90 days, the retention limit (last 30 days by default), or absolute dates. It is a separate control because time is not a property token.

### D. Listing actions — `Tooltip`, `IconButton`, `CollectionPreferences` (required)

Refresh and Download CSV as outlined icon buttons in tooltips, then `CollectionPreferences` (page size 25, 50 or 100; columns), saved under `storageKey`.

### E. Event table — `Card`, `DataTable`, `TableCellTime`, `Tag`, `CopyButton`, `useCollection` (required)

One `useCollection` over the events in the period, sorted by Date descending, `DataTable` bound with `v-bind="tableProps"` in a flush `Card`. Columns: Event (sentence in past tense naming the object), Category as a small `Tag` with one severity per category (a category is not a status), User, IP address (left to right, with a `CopyButton` named `Copy IP address`), and Date through `TableCellTime` (relative, exact time on the tooltip).

### F. No match and empty period — `EmptyState` (required)

Filters that hide every event fill the table's `#empty` slot with `No matching events` and Clear filters. A period with no events at all replaces the table with `No activity in this period` and a button that widens it to the next longer preset (`Show the last hour`, … `Show the last 90 days`). At 90 days, the retention limit, the button goes and the description says events are kept for 90 days.

### G. Load failure — `Alert` (conditional)

A danger `Alert` with Retry takes the table's place; the controls stay so the reader can change the period.

## Data

The block takes its records through props and emits every action; it fetches nothing. `ActivityHistoryEvent` and `ActivityHistoryProps` are exported from `account-activity-history.vue`, and `sample.ts` holds the sample events and the fixed clock the block renders when `events` and `now` are left out (the events never show while `loading` or `error` is set).

| Prop      | Type                     | What it does                                                                                                   |
| --------- | ------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `events`  | `ActivityHistoryEvent[]` | The log; the period, the filter, the sort and the pages run on it in the browser. Pass `[]` for none.          |
| `now`     | `Date`                   | The moment relative periods count back from; pass the request time.                                            |
| `range`   | `DateRangeValue`         | The selected period, two-way with `v-model:range` (the last 30 days by default); fetch the period it names.    |
| `loading` | `boolean`                | A request is in flight. With no events it is the first load (the table's loading rows); with events a refresh. |
| `error`   | `string`                 | Why the load failed, shown in the danger `Alert` with Retry that replaces the table.                           |

| Event          | Payload   | When                                                  |
| -------------- | --------- | ----------------------------------------------------- |
| `refresh`      | `(event)` | Refresh.                                              |
| `retry`        | `(event)` | Retry in the error alert.                             |
| `update:range` | `(range)` | The period changed in the picker or the widen button. |

To go live, render the block from a page that owns the request and pass what it returns:

```vue
<script setup lang="ts">
  import AccountActivityHistory from './account-activity-history.vue'

  const { data, range, requestedAt, pending, error, refresh } = useActivity()
  const loadError = 'The activity could not be loaded. Nothing was changed; try again.'
</script>

<template>
  <AccountActivityHistory
    v-model:range="range"
    :events="data ?? []"
    :now="requestedAt"
    :loading="pending"
    :error="error ? loadError : ''"
    @refresh="refresh"
    @retry="refresh"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Write each event as a past-tense sentence with the object's name: `Revoked personal token “Nightly export”`.
- Show the newest first and keep the exact time on the tooltip.
- Keep IP addresses left to right and copyable.
- Keep the period and the filters in the controls row, the export last but one, preferences last.

## Don't

- Don't let anyone edit or delete an event from this page.
- Don't put the period in the property filter, or show a period with no events as an error.
- Don't truncate the event sentence without the full text on the row.

## Copy

- **Title:** `Activity history`. **Filter:** `Filter activity`. **Period:** `Activity period`.
- **Categories:** `Sign-in`, `Security`, `Users`, `Billing`, `Deploy`.
- **Empty period:** `No activity in this period`, then `Nothing happened in the account in the selected period. Select a longer period to see older events.` and `Show the last <next preset>`; at 90 days, `Nothing happened in the account in the last 90 days, the longest period events are kept.` with no action.
- **No match:** `No matching events`, `No event in this period matches these filters.`, `Clear filters`.
- Follow `skills/webkit-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- No `main` of its own (the layout's is the only one); the `PageHeader` title is the only `h1`; the table is named `Activity history`.
- The filter and the period picker carry `aria-label`s; icon buttons have names that match their tooltips.
- Category is text in a tag, never colour alone; the relative date has the exact time on its tooltip.
- User and IP cells keep their own direction (`dir="auto"`, `dir="ltr"`) inside a right-to-left page.
- `/` focuses the property filter from anywhere on the page, except while typing in a field.

## States

- Default: ten events over three weeks, the last 30 days selected, with filter, period, refresh, export, preferences, sorting and paging wired.
- Empty: the period (`range`, the last 15 minutes) holds no event; a flush empty state offers the next longer period, the last hour.
- Loading: the first load (`loading` with no `events`); the controls and the table's loading rows.
- Error: the log did not load (`error` is set); a danger Alert with the message and Retry.

## Related

- `view/view-table` — the list page this one follows.
- `account/account-personal-tokens` and `account/account-team-permissions` — the screens whose changes are logged here.
- `view/view-events-explorer` — events over time with a chart and a document pane.
