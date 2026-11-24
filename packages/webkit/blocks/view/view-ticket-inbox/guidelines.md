# Ticket inbox

The support agent's inbox. An agent opens a saved view (their own open tickets, the unassigned queue, what is overdue), scans what needs an answer first, opens a ticket, and moves several tickets at once: assigns them, changes their status, merges duplicates or closes them. It follows Zendesk views, the Freshdesk ticket list and the Help Scout mailbox, on the house list page. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`.

## When to use

- A help desk's ticket queue, where agents work saved views with SLA targets.
- Any assignable work queue with owners, priorities and deadlines (review requests, abuse reports, onboarding cases).

## When not to use

- One ticket's conversation with the customer: use the `message-thread` component on the ticket's own page.
- A resource list with no owner, priority or deadline: use `view/view-table`.
- A log of who did what: use `account/account-activity-history`.

## Building blocks

### A. Page heading — `ConfigProvider`, `PageHeader`, `Button` (required)

Title `Tickets` and one sentence. The one action is the primary medium Create ticket. `ConfigProvider` only fixes the clock (`now`) for the sample, a test or a server render; with live tickets and no `now` the countdowns read the real clock.

### B. Views and filter — `Select`, `PropertyFilter`, `Tooltip`, `IconButton`, `CollectionPreferences` (required)

The controls band (`parts/inbox-controls.vue`). A `Select` labelled View leads it: each saved view with its count (`My open tickets (4)`), and a view marked `urgent` (Overdue) says `needs action` with its count above zero. The views are presets of this one list, not pages, so they never become a side menu (the rail navigates, the page does not). The `PropertyFilter` grows beside it, with Status, Priority, Assignee, Group, Channel and Tag as properties and free text over subject, requester, email and number. Refresh and `CollectionPreferences` (page size 25, 50 or 100; columns, Group and Channel hidden by default) close the row. Below `@2xl` of the band the select takes its own line.

### C. Bulk actions — `Button`, `DropdownMenuRoot`, `DropdownMenuTrigger`, `DropdownMenuItem`, `Avatar` (conditional)

`parts/ticket-bulk-actions.vue`, under the filter in the controls band while tickets are selected: `3 selected` (a polite status), `Select all 12 tickets` once the whole page is ticked and more match (`selectAllMatching`), Clear selection, then Assign (an agent menu, each agent with their avatar and presence), Change status (the five statuses), Merge (disabled with a reason under two tickets) and Close. Every label counts the selection: `Assign (3)`. An action emits `bulk-action` and clears the selection; the app saves, refreshes the list and confirms in a toast.

### D. Ticket table — `Card`, `DataTable`, `DataTablePagination`, `TableCellLink`, `TableCellStatus`, `PriorityTag`, `Countdown`, `TableCellTime`, `useCollection` (required)

One `useCollection` over the view's tickets (selection on, sorted by Next SLA, most urgent first; tickets with no SLA last), `DataTable` bound with `v-bind="tableProps"` in a flush `Card`. Columns: Subject (`parts/ticket-subject-cell.vue`: a `TableCellLink` to the ticket, an unread mark in `--info-mark` with the hidden word Unread, then the requester's avatar, name and `#number` in muted text), Status as `TableCellStatus` (New info, Open warning, Pending and On hold neutral, Solved success), Priority as a small `PriorityTag` sorted by rank, Assignee (`parts/ticket-assignee-cell.vue`: the `Avatar` with presence and the name, or muted Unassigned), Next SLA as a small `Countdown` (paused while Pending or On hold, a dash when no target runs), Updated as `TableCellTime`, then the hidden Group and Channel. A row click or Enter on a focused row emits `open`; clicks on the link, the checkbox or a button do not.

### E. Empty view and no match — `EmptyState` (required)

A view with no tickets replaces the table with a flush `Card` holding `You're all caught up`, `No tickets in My open tickets.` and Show all open tickets (switching the view; absent on All open). Filters that hide every ticket fill the table's `#empty` slot with `No matching tickets` and Clear filters.

### F. Load failure — `Alert` (conditional)

A danger `Alert` with Retry takes the table's place; the controls stay, disabled.

## Data

The block takes its records through props and emits every action; it fetches nothing. `TicketInboxTicket`, `TicketInboxView`, `TicketInboxAgent`, `TicketInboxBulkPayload` and `TicketInboxProps` are exported from `view-ticket-inbox.vue`. `sample.ts` holds the sample tickets, views, agents and clock the block renders when `tickets`, `views` and `agents` are left out (never while `loading` or `error` is set); `sampleTicketsOf` stands in for the server deciding which tickets a view holds. `lib/ticket-fields.ts` holds the statuses, the status colours, the priority order and the sort comparators.

| Prop                  | Type                  | What it does                                                                                                    |
| --------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------- |
| `tickets`             | `TicketInboxTicket[]` | The active view's tickets; filter, sort, selection and pages run on them in the browser. `[]` is an empty view. |
| `views`               | `TicketInboxView[]`   | The saved views with their counts; `urgent` marks a count that needs action (Overdue).                          |
| `agents`              | `TicketInboxAgent[]`  | The agents Assign offers, with presence.                                                                        |
| `viewKey`             | `string`              | The active view, two-way with `v-model:view-key` (`my-open` by default); fetch the view it names.               |
| `now`                 | `Date`                | A fixed clock for a test or a server render. Leave it out in the app.                                           |
| `loading`             | `boolean`             | A request is in flight. With no tickets it is the first load; with tickets a refresh.                           |
| `error`               | `string`              | Why the load failed, shown in the danger `Alert` with Retry.                                                    |
| `defaultQuery`        | `PropertyFilterQuery` | Filter tokens applied on mount, for a link that opens the inbox already filtered.                               |
| `defaultSelectedKeys` | `string[]`            | Ticket numbers selected on mount.                                                                               |

| Event            | Payload                               | When                                                                            |
| ---------------- | ------------------------------------- | ------------------------------------------------------------------------------- |
| `create`         | `(event)`                             | Create ticket.                                                                  |
| `open`           | `(event, ticket)`                     | A row click or Enter on a focused row.                                          |
| `bulk-action`    | `(event, { action, value, tickets })` | Assign (`value` the agent), Change status (`value` the status), Merge or Close. |
| `refresh`        | `(event)`                             | Refresh.                                                                        |
| `retry`          | `(event)`                             | Retry in the error alert.                                                       |
| `update:viewKey` | `(key)`                               | Another view was picked.                                                        |

To go live, render the block from a page that owns the requests and pass what they return:

```vue
<script setup lang="ts">
  import ViewTicketInbox from './view-ticket-inbox.vue'

  const { viewKey, tickets, views, agents, pending, error, refresh, runBulk, openTicket } =
    useTicketInbox()
  const loadError = 'The tickets could not be loaded. Nothing was changed; try again.'
</script>

<template>
  <ViewTicketInbox
    v-model:view-key="viewKey"
    :tickets="tickets ?? []"
    :views="views"
    :agents="agents"
    :loading="pending"
    :error="error ? loadError : ''"
    @open="(event, ticket) => openTicket(ticket.id)"
    @bulk-action="(event, payload) => runBulk(payload)"
    @refresh="refresh"
    @retry="refresh"
  />
</template>
```

Then delete `sample.ts` and its import. A queue too large for the browser moves to `useCollection` server mode (`fetch`), which pages and filters on the server.

## Do

- Sort by the next SLA target so the most urgent ticket is on top, and pause the countdown while the ticket waits on the customer.
- Keep the views few and named for the work: My open tickets, Unassigned, Overdue, All open, Solved.
- Count the selection in every bulk label and clear the selection after the action.
- Confirm a bulk action's result in a toast from the app, with the number of tickets it changed.

## Don't

- Don't turn the views into a side menu or tabs that navigate: they are presets of this one list.
- Don't show unread by colour alone: the mark comes with the hidden word Unread.
- Don't open the ticket when the agent clicks the checkbox or a control in the row.

## Copy

- **Title:** `Tickets`. **Create:** `Create ticket`. **View select:** `View`. **Filter:** `Filter tickets`.
- **Statuses:** `New`, `Open`, `Pending`, `On hold`, `Solved`. **Unassigned:** `Unassigned`.
- **Bulk:** `3 selected`, `Select all 12 tickets`, `Clear selection`, `Assign (3)`, `Change status (3)`, `Merge (3)`, `Close (3)`; Merge's reason `Select two or more tickets to merge them.`
- **Empty view:** `You're all caught up`, `No tickets in <view>.`, `Show all open tickets`. **No match:** `No matching tickets`, `No ticket in this view matches these filters.`, `Clear filters`.
- Follow `skills/webkit-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- No `main` of its own and no second navigation: the `PageHeader` title is the only `h1`; the table is named after the active view.
- Focus order: Create ticket, View, the filter, Refresh, preferences, the bulk controls while a selection exists, the table (select all, then the rows, one tab stop with the arrow keys), then pagination.
- Rows: Arrow Up and Down move, Enter opens the ticket, Space toggles its selection; the subject link is reachable with Tab too.
- Announcements: the selection count is a polite status; the filter announces its match count; Refresh shows its busy state; the result of a bulk action comes from the app's toast.
- Presence is part of the assignee avatar's name (`Jane Doe, online`), so the printed name beside it is hidden from screen readers; priority and status are text, never colour alone.
- Names and numbers keep their own direction (`dir="auto"`, `dir="ltr"`) inside a right-to-left page.

## States

- Default: My open tickets with four tickets, one overdue, one paused, two unread, the sample clock fixed; views, filter, sorting, selection, bulk actions and paging wired.
- Empty: My open tickets holds no ticket (`tickets` is `[]`); You're all caught up with Show all open tickets.
- Loading: the first load (`loading` with no tickets); the disabled controls and the table's loading rows.
- Error: the tickets did not load (`error` is set); a danger Alert with the message and Retry.
- Filtered: `defaultQuery` filters My open tickets by Channel = Phone; No matching tickets with Clear filters.
- Selected: `defaultSelectedKeys` selects three tickets; the bulk bar counts them.

## Related

- `view/view-table` — the list page this one follows.
- `account/account-activity-history` — the same filtered table for an audit log.
