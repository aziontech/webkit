# ViewTicketInbox (`view/view-ticket-inbox`)

> The support agent's ticket inbox: a `PageHeader` with Create ticket over one controls band (a `Select` of saved views with their counts, such as My open tickets (4), Unassigned (3) and Overdue (2, needs action); a `PropertyFilter` over status, priority, assignee, group, channel and tag, with free text over subject, requester and number; Refresh and `CollectionPreferences`) and a `DataTable` of the view's tickets on `useCollection`, most urgent SLA first: a selection checkbox, Subject as a `TableCellLink` with an unread mark, the requester `Avatar`, name and number under it, Status as `TableCellStatus`, `PriorityTag`, the assignee `Avatar` with presence, the next SLA as a `Countdown` (paused while Pending or On hold) and Updated as `TableCellTime`; Group and Channel are hidden columns. Selecting tickets opens a bulk bar in the controls band: the count, Select all N tickets, Clear selection, Assign and Change status as menus (`DropdownMenuRoot`), Merge (two or more) and Close, each label counting the selection. A row click or Enter opens the ticket. A view with no tickets says You're all caught up and offers all open tickets, filters that match nothing offer Clear filters, and a failed load is a danger `Alert` with Retry. A page body for ConsoleLayout, rendered in its default slot.

- Surface: app
- Source: `blocks/view/view-ticket-inbox/view-ticket-inbox.vue` in `@aziontech/webkit`
- MCP: `get_block("view/view-ticket-inbox")`
- Stability: preview. The API may still change in a minor release, named in the changelog, until the owner marks it GA.
- Components: [Alert](../../components/alert.md), [Avatar](../../components/avatar.md), [Button](../../components/button.md), [Card](../../components/card.md), [CollectionPreferences](../../components/collection-preferences.md), [ConfigProvider](../../components/config-provider.md), [Countdown](../../components/countdown.md), [DataTable](../../components/data-table.md), `DataTablePagination`, `DropdownMenuItem`, `DropdownMenuRoot`, `DropdownMenuTrigger`, [EmptyState](../../components/empty-state.md), [IconButton](../../components/icon-button.md), [PageHeader](../../components/page-header.md), [PriorityTag](../../components/priority-tag.md), [PropertyFilter](../../components/property-filter.md), [Select](../../components/select.md), `TableCellLink`, `TableCellStatus`, `TableCellTime`, [Tooltip](../../components/tooltip.md), `use-collection`
- Skills: `webkit-lists`, `webkit-tables`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

ticket inbox; support inbox; helpdesk; help desk views; ticket list; ticket queue; agent inbox; support queue; saved views; unassigned tickets; overdue tickets; sla countdown; bulk assign tickets; caixa de entrada de tickets; caixa de suporte; fila de chamados; lista de tickets; lista de chamados; visões salvas; chamados sem responsável; chamados atrasados; atribuir chamados em massa

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

One `useCollection` over the view's tickets (selection on, sorted by Next SLA, most urgent first; tickets with no SLA last), `DataTable` bound with `v-bind="tableProps"` in a flush `Card`. Columns: Subject (`parts/ticket-subject-cell.vue`: a `TableCellLink` to the ticket, an unread mark in `--info-mark` with the hidden word Unread, then the requester's avatar, name and `#number` in muted text), Status as `TableCellStatus` (New warning, since it waits for triage; Open info; Pending and On hold neutral; Solved success), Priority as a small `PriorityTag` sorted by rank, Assignee (`parts/ticket-assignee-cell.vue`: the `Avatar` with presence and the name, or muted Unassigned), Next SLA as a small `Countdown` (paused while Pending or On hold, a dash when no target runs), Updated as `TableCellTime`, then the hidden Group and Channel. A row click or Enter on a focused row emits `open`; clicks on the link, the checkbox or a button do not.

### E. Empty view and no match — `EmptyState` (required)

A view with no tickets replaces the table with a flush `Card` holding `You're all caught up`, `No tickets in My open tickets.` and Show all open tickets (switching the view; absent on All open). Filters that hide every ticket fill the table's `#empty` slot with `No matching tickets` and Clear filters.

### F. Load failure — `Alert` (conditional)

A danger `Alert` with Retry takes the table's place; the controls stay, disabled.

## Data

The block takes its records through props and emits every action; it fetches nothing. `TicketInboxTicket`, `TicketInboxView`, `TicketInboxAgent`, `TicketInboxBulkPayload` and `TicketInboxProps` are exported from `view-ticket-inbox.vue`. `sample.ts` holds the sample tickets, views, agents and clock the block renders when `tickets`, `views` and `agents` are left out (none of it while `loading` or `error` is set); `sampleTicketsOf` stands in for the server deciding which tickets a view holds. `lib/ticket-fields.ts` holds the statuses, the status colours, the priority order and the sort comparators.

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

## Variants

- `Default` — primary (the code below)
- `Empty` — My open tickets holds no ticket: the heading and controls stay, and a flush EmptyState says You're all caught up, with Show all open tickets.
- `Loading` — The first load: the filter and preferences are disabled, Refresh spins and the table shows its skeleton rows.
- `Error` — The tickets could not load: the disabled controls stay and a danger Alert with Retry takes the table's place.
- `Filtered` — A Channel = Phone filter on My open tickets hides every ticket: the table shows No matching tickets with Clear filters.
- `Selected` — Three tickets selected: the bulk bar in the controls band counts them and offers Assign (3), Change status (3), Merge (3) and Close (3).

Each variant is the same screen in another state: `get_block("view/view-ticket-inbox", { variant })`, or the file under `blocks/view/view-ticket-inbox/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import type { AvatarPresence } from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfigProvider from '@aziontech/webkit/config-provider'
  import Countdown from '@aziontech/webkit/countdown'
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import EmptyState from '@aziontech/webkit/empty-state'
  import PageHeader from '@aziontech/webkit/page-header'
  import PriorityTag, { type PriorityTagPriority } from '@aziontech/webkit/priority-tag'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import {
    type FilteringProperty,
    type PropertyFilterQuery,
    useCollection
  } from '@aziontech/webkit/use-collection'
  import { computed, watch } from 'vue'

  import {
    optionsOf,
    priorityOptions,
    slaPaused,
    statusSeverity,
    TICKET_STATUSES,
    ticketComparators,
    ticketDefaultSort,
    ticketHiddenColumns
  } from './lib/ticket-fields'
  import InboxControls from './parts/inbox-controls.vue'
  import TicketAssigneeCell from './parts/ticket-assignee-cell.vue'
  import TicketBulkActions from './parts/ticket-bulk-actions.vue'
  import TicketSubjectCell from './parts/ticket-subject-cell.vue'
  import { sampleAgents, sampleNow, sampleTicketsOf, sampleViews } from './sample'

  /** Where a ticket stands in its lifecycle. */
  export type TicketInboxStatus = 'New' | 'Open' | 'Pending' | 'On hold' | 'Solved'

  /** How the request reached the team. */
  export type TicketInboxChannel = 'Email' | 'Chat' | 'Web form' | 'Phone'

  /** What a bulk action does to the selected tickets. */
  export type TicketInboxBulkAction = 'assign' | 'status' | 'merge' | 'close'

  /** One row of the inbox. */
  export interface TicketInboxTicket {
    /** Ticket number, the stable key. */
    id: string
    /** The request's subject line. */
    subject: string
    /** Name of the customer who asked. */
    requester: string
    /** Email of the customer who asked. */
    requesterEmail: string
    /** The agent has not read the latest reply. */
    unread: boolean
    /** Where the ticket stands. */
    status: TicketInboxStatus
    /** How urgent it is. */
    priority: PriorityTagPriority
    /** Name of the assigned agent; empty when unassigned. */
    assignee: string
    /** Whether the assigned agent is reachable now; empty when unknown. */
    assigneePresence: AvatarPresence | ''
    /** The team that owns it. */
    group: string
    /** How the request arrived. */
    channel: TicketInboxChannel
    /** Labels set by agents or rules. */
    tags: string[]
    /** When the next SLA target is due; null when no target runs. */
    slaDueAt: Date | null
    /** When it changed last. */
    updatedAt: Date
  }

  /** A saved view of the inbox. */
  export interface TicketInboxView {
    /** Stable key, the value of `v-model:viewKey`. */
    key: string
    /** Name shown in the views list. */
    label: string
    /** How many tickets the view holds. */
    count: number
    /** The count needs action now (an overdue view): drawn in danger above zero. */
    urgent?: boolean
  }

  /** An agent tickets can be assigned to. */
  export interface TicketInboxAgent {
    /** Full name. */
    name: string
    /** Whether the agent is reachable now; empty when unknown. */
    presence: AvatarPresence | ''
  }

  /** What a bulk action carries. */
  export interface TicketInboxBulkPayload {
    /** The action. */
    action: TicketInboxBulkAction
    /** The agent name for assign, the status for status; empty otherwise. */
    value: string
    /** The selected tickets. */
    tickets: TicketInboxTicket[]
  }

  export interface TicketInboxProps {
    /** The tickets of the active view; filtered, sorted and paged in the browser. Left out, the sample renders. */
    tickets?: TicketInboxTicket[]
    /** The saved views with their counts. Left out, the sample views render. */
    views?: TicketInboxView[]
    /** The agents Assign offers. Left out, the sample agents render. */
    agents?: TicketInboxAgent[]
    /** A fixed moment the SLA countdowns and relative times read (a test, a server render). Left out, the real clock; the sample uses its own. */
    now?: Date
    /** A request is in flight: with no tickets it is the first load, with tickets a refresh. */
    loading?: boolean
    /** Why the tickets could not load; a danger alert with Retry replaces the table. */
    error?: string
    /** Filter tokens applied on mount, for a link that opens the inbox already filtered. */
    defaultQuery?: PropertyFilterQuery
    /** Ticket numbers selected on mount. */
    defaultSelectedKeys?: string[]
  }

  const props = withDefaults(defineProps<TicketInboxProps>(), {
    tickets: undefined,
    views: undefined,
    agents: undefined,
    now: undefined,
    loading: false,
    error: '',
    defaultQuery: undefined,
    defaultSelectedKeys: () => []
  })

  const emit = defineEmits<{
    create: [event: MouseEvent]
    open: [event: MouseEvent | KeyboardEvent, ticket: TicketInboxTicket]
    'bulk-action': [event: Event, payload: TicketInboxBulkPayload]
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
  }>()

  const viewKey = defineModel<string>('viewKey', { default: 'my-open' })

  const fallback = <T,>(sample: T[]): T[] => (props.loading || props.error ? [] : sample)
  const items = computed<TicketInboxTicket[]>(
    () => props.tickets ?? fallback(sampleTicketsOf(viewKey.value))
  )
  const viewList = computed<TicketInboxView[]>(() => props.views ?? fallback(sampleViews))
  const clock = computed(
    () => props.now ?? (props.tickets || props.loading || props.error ? undefined : sampleNow)
  )
  const agentList = computed<TicketInboxAgent[]>(() => props.agents ?? fallback(sampleAgents))
  const activeView = computed(() => viewList.value.find((view) => view.key === viewKey.value))
  const offerAllOpen = computed(
    () => viewKey.value !== 'all-open' && viewList.value.some((view) => view.key === 'all-open')
  )

  const firstLoad = computed(() => props.loading && items.value.length === 0)
  const blocked = computed(() => firstLoad.value || props.error !== '')

  const properties = computed<FilteringProperty[]>(() => [
    { key: 'status', label: 'Status', options: TICKET_STATUSES.map((value) => ({ value })) },
    { key: 'priority', label: 'Priority', options: priorityOptions },
    { key: 'assignee', label: 'Assignee', options: optionsOf(agentList.value.map((a) => a.name)) },
    { key: 'group', label: 'Group', options: optionsOf(items.value.map((t) => t.group)) },
    { key: 'channel', label: 'Channel', options: optionsOf(items.value.map((t) => t.channel)) },
    { key: 'tags', label: 'Tag', options: optionsOf(items.value.flatMap((t) => t.tags)) }
  ])

  const columns: TableColumn[] = [
    { accessorKey: 'subject', header: 'Subject', principal: true, hideable: false, grow: 3 },
    { accessorKey: 'status', header: 'Status', sortable: true, minWidth: 112 },
    { accessorKey: 'priority', header: 'Priority', sortable: true, minWidth: 120 },
    { accessorKey: 'assignee', header: 'Assignee', sortable: true, minWidth: 168 },
    { accessorKey: 'slaDueAt', header: 'Next SLA', sortable: true, minWidth: 152 },
    { accessorKey: 'updatedAt', header: 'Updated', sortable: true, minWidth: 120 },
    { accessorKey: 'group', header: 'Group', minWidth: 120 },
    { accessorKey: 'channel', header: 'Channel', minWidth: 112 }
  ]

  const {
    paginationProps,
    tableProps,
    propertyFilterProps,
    preferencesProps,
    status,
    selectedItems,
    selectedCount,
    pageSelected,
    allMatchingSelected,
    totalCount,
    selectAllMatching,
    clearSelection,
    clearFilters
  } = useCollection({
    items,
    columns,
    filtering: { fields: ['subject', 'requester', 'requesterEmail', 'id'] },
    propertyFiltering: { properties, defaultQuery: props.defaultQuery },
    sorting: {
      defaultState: ticketDefaultSort,
      comparators: ticketComparators
    },
    selection: { defaultSelectedKeys: props.defaultSelectedKeys },
    pagination: { pageSize: 25, pageSizeOptions: [25, 50, 100] },
    preferences: {
      storageKey: 'ticket-inbox',
      defaults: { columns: ticketHiddenColumns }
    }
  })

  watch(viewKey, () => clearSelection())

  const canSelectAll = computed(
    () => pageSelected.value && !allMatchingSelected.value && selectedCount.value < totalCount.value
  )

  const onRowClick = (event: MouseEvent | KeyboardEvent, ticket: TicketInboxTicket) => {
    const target = event.target instanceof Element ? event.target : null
    if (target?.closest('a, button, input, label, [role="checkbox"]')) return
    emit('open', event, ticket)
  }

  const onBulk = (event: Event, action: TicketInboxBulkAction, value: string) => {
    emit('bulk-action', event, { action, value, tickets: [...selectedItems.value] })
    clearSelection()
  }
</script>

<template>
  <ConfigProvider :now="clock">
    <div class="layout-boundary">
      <div class="layout-column flex min-h-full flex-col">
        <PageHeader
          title="Tickets"
          description="Answer customer requests from the views your team shares."
        >
          <template #actions>
            <Button
              label="Create ticket"
              icon="az az-plus"
              variant="primary"
              size="medium"
              @click="(event: MouseEvent) => emit('create', event)"
            />
          </template>
        </PageHeader>

        <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
          <header class="@container/controls flex min-w-0 flex-col gap-(--spacing-xs)">
            <InboxControls
              v-model:view-key="viewKey"
              :views="viewList"
              :property-filter-props="propertyFilterProps"
              :preferences-props="preferencesProps"
              :loading="loading"
              :disabled="blocked"
              @refresh="(event: MouseEvent) => emit('refresh', event)"
            />
            <TicketBulkActions
              v-if="selectedCount"
              :selected-count="selectedCount"
              :total-count="totalCount"
              :can-select-all="canSelectAll"
              :agents="agentList"
              :statuses="TICKET_STATUSES"
              @select-all="selectAllMatching"
              @clear="clearSelection"
              @action="onBulk"
            />
          </header>

          <Alert
            v-if="error"
            severity="danger"
            :label="error"
            action-label="Retry"
            @action="(event: MouseEvent) => emit('retry', event)"
          />

          <Card
            key="card-empty"
            v-else-if="status === 'empty' && !loading"
            :padded="false"
          >
            <template #default>
              <EmptyState
                size="medium"
                icon="az az-inbox"
                title="You're all caught up"
                :description="`No tickets in ${activeView?.label ?? 'this view'}.`"
              >
                <template
                  v-if="offerAllOpen"
                  #actions
                >
                  <Button
                    label="Show all open tickets"
                    variant="secondary"
                    size="small"
                    @click="viewKey = 'all-open'"
                  />
                </template>
              </EmptyState>
            </template>
          </Card>

          <Card
            key="card-table"
            v-else
            :padded="false"
          >
            <template #default>
              <DataTable
                v-bind="tableProps"
                :loading="loading"
                sortable
                :bordered="false"
                :aria-label="activeView?.label ?? 'Tickets'"
                @row-click="onRowClick"
              >
                <template #cell-subject="{ row }">
                  <TicketSubjectCell :ticket="row" />
                </template>
                <template #cell-status="{ row }">
                  <TableCellStatus
                    :label="row.status"
                    :severity="statusSeverity[row.status]"
                  />
                </template>
                <template #cell-priority="{ row }">
                  <PriorityTag
                    :priority="row.priority"
                    size="small"
                  />
                </template>
                <template #cell-assignee="{ row }">
                  <TicketAssigneeCell :ticket="row" />
                </template>
                <template #cell-slaDueAt="{ row }">
                  <Countdown
                    :deadline="row.slaDueAt ?? undefined"
                    :paused="slaPaused(row)"
                    size="small"
                  />
                </template>
                <template #cell-updatedAt="{ row }">
                  <TableCellTime :value="row.updatedAt" />
                </template>
                <template #empty>
                  <EmptyState
                    size="medium"
                    icon="az az-filter-off"
                    title="No matching tickets"
                    description="No ticket in this view matches these filters."
                  >
                    <template #actions>
                      <Button
                        label="Clear filters"
                        variant="outline"
                        size="small"
                        @click="clearFilters"
                      />
                    </template>
                  </EmptyState>
                </template>
                <template #footer>
                  <DataTablePagination
                    v-bind="paginationProps"
                    manual
                  />
                </template>
              </DataTable>
            </template>
          </Card>
        </section>
      </div>
    </div>
  </ConfigProvider>
</template>
```

## `sample.ts`

```ts
import type { TicketInboxAgent, TicketInboxTicket, TicketInboxView } from './view-ticket-inbox.vue'

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export const sampleNow = new Date(Date.UTC(2026, 10, 10, 12))
const ago = (ms: number) => new Date(sampleNow.getTime() - ms)
const ahead = (ms: number) => new Date(sampleNow.getTime() + ms)

const sampleAgent = 'Jane Doe'

export const sampleAgents: TicketInboxAgent[] = [
  { name: 'Jane Doe', presence: 'online' },
  { name: 'John Smith', presence: 'away' },
  { name: 'Priya Patel', presence: 'busy' },
  { name: 'Sam Lee', presence: 'offline' }
]

const sampleTickets: TicketInboxTicket[] = [
  {
    id: '4812',
    subject: 'Custom domain returns a certificate error',
    requester: 'Alex Morgan',
    requesterEmail: 'alex.morgan@example.com',
    unread: true,
    status: 'Open',
    priority: 'urgent',
    assignee: 'Jane Doe',
    assigneePresence: 'online',
    group: 'Technical',
    channel: 'Email',
    tags: ['certificates', 'domains'],
    slaDueAt: ago(20 * MINUTE),
    updatedAt: ago(12 * MINUTE)
  },
  {
    id: '4815',
    subject: 'Cache purge does not reach every edge location',
    requester: 'Chris Taylor',
    requesterEmail: 'chris.taylor@example.com',
    unread: true,
    status: 'New',
    priority: 'high',
    assignee: '',
    assigneePresence: '',
    group: 'Technical',
    channel: 'Chat',
    tags: ['cache'],
    slaDueAt: ahead(35 * MINUTE),
    updatedAt: ago(25 * MINUTE)
  },
  {
    id: '4818',
    subject: 'Invoice shows the wrong billing address',
    requester: 'Morgan Lee',
    requesterEmail: 'morgan.lee@example.com',
    unread: false,
    status: 'Pending',
    priority: 'medium',
    assignee: 'Jane Doe',
    assigneePresence: 'online',
    group: 'Billing',
    channel: 'Web form',
    tags: ['invoice'],
    slaDueAt: ahead(7 * HOUR),
    updatedAt: ago(2 * HOUR)
  },
  {
    id: '4821',
    subject: 'Add a teammate to the Acme account',
    requester: 'Taylor Kim',
    requesterEmail: 'taylor.kim@example.com',
    unread: false,
    status: 'Open',
    priority: 'low',
    assignee: 'Jane Doe',
    assigneePresence: 'online',
    group: 'Accounts',
    channel: 'Email',
    tags: ['access'],
    slaDueAt: ahead(26 * HOUR),
    updatedAt: ago(3 * HOUR)
  },
  {
    id: '4824',
    subject: 'Function cold starts after the last deploy',
    requester: 'Jordan Rivera',
    requesterEmail: 'jordan.rivera@example.com',
    unread: true,
    status: 'Open',
    priority: 'high',
    assignee: 'John Smith',
    assigneePresence: 'away',
    group: 'Technical',
    channel: 'Chat',
    tags: ['functions', 'performance'],
    slaDueAt: ago(90 * MINUTE),
    updatedAt: ago(40 * MINUTE)
  },
  {
    id: '4827',
    subject: 'Refund for a duplicate charge in October',
    requester: 'Casey Brooks',
    requesterEmail: 'casey.brooks@example.com',
    unread: false,
    status: 'On hold',
    priority: 'medium',
    assignee: 'Priya Patel',
    assigneePresence: 'busy',
    group: 'Billing',
    channel: 'Phone',
    tags: ['refund', 'invoice'],
    slaDueAt: ahead(2 * DAY),
    updatedAt: ago(5 * HOUR)
  },
  {
    id: '4830',
    subject: 'Firewall rule blocks the checkout page',
    requester: 'Riley Chen',
    requesterEmail: 'riley.chen@example.com',
    unread: true,
    status: 'New',
    priority: 'urgent',
    assignee: '',
    assigneePresence: '',
    group: 'Technical',
    channel: 'Web form',
    tags: ['firewall'],
    slaDueAt: ahead(15 * MINUTE),
    updatedAt: ago(6 * MINUTE)
  },
  {
    id: '4833',
    subject: 'Single sign-on stopped working for two users',
    requester: 'Drew Parker',
    requesterEmail: 'drew.parker@example.com',
    unread: false,
    status: 'Open',
    priority: 'high',
    assignee: 'Jane Doe',
    assigneePresence: 'online',
    group: 'Accounts',
    channel: 'Email',
    tags: ['sso', 'access'],
    slaDueAt: ahead(3 * HOUR),
    updatedAt: ago(70 * MINUTE)
  },
  {
    id: '4836',
    subject: 'Question about the storage pricing tiers',
    requester: 'Jamie Fox',
    requesterEmail: 'jamie.fox@example.com',
    unread: false,
    status: 'New',
    priority: 'low',
    assignee: '',
    assigneePresence: '',
    group: 'Billing',
    channel: 'Chat',
    tags: ['pricing'],
    slaDueAt: ahead(5 * HOUR),
    updatedAt: ago(50 * MINUTE)
  },
  {
    id: '4839',
    subject: 'Logs are missing for the staging workload',
    requester: 'Avery Scott',
    requesterEmail: 'avery.scott@example.com',
    unread: false,
    status: 'Open',
    priority: 'medium',
    assignee: 'Sam Lee',
    assigneePresence: 'offline',
    group: 'Technical',
    channel: 'Email',
    tags: ['logs'],
    slaDueAt: ahead(20 * HOUR),
    updatedAt: ago(8 * HOUR)
  },
  {
    id: '4801',
    subject: 'Change the billing contact email',
    requester: 'Quinn Adams',
    requesterEmail: 'quinn.adams@example.com',
    unread: false,
    status: 'Solved',
    priority: 'low',
    assignee: 'Jane Doe',
    assigneePresence: 'online',
    group: 'Billing',
    channel: 'Web form',
    tags: ['invoice'],
    slaDueAt: null,
    updatedAt: ago(DAY)
  },
  {
    id: '4797',
    subject: 'DNS records do not resolve after the zone import',
    requester: 'Reese Martin',
    requesterEmail: 'reese.martin@example.com',
    unread: false,
    status: 'Solved',
    priority: 'high',
    assignee: 'John Smith',
    assigneePresence: 'away',
    group: 'Technical',
    channel: 'Email',
    tags: ['dns', 'domains'],
    slaDueAt: null,
    updatedAt: ago(2 * DAY)
  }
]

const inView: Record<string, (ticket: TicketInboxTicket) => boolean> = {
  'my-open': (ticket) => ticket.assignee === sampleAgent && ticket.status !== 'Solved',
  unassigned: (ticket) => ticket.assignee === '' && ticket.status !== 'Solved',
  overdue: (ticket) =>
    ticket.status !== 'Solved' &&
    ticket.status !== 'Pending' &&
    ticket.status !== 'On hold' &&
    ticket.slaDueAt !== null &&
    ticket.slaDueAt.getTime() <= sampleNow.getTime(),
  'all-open': (ticket) => ticket.status !== 'Solved',
  solved: (ticket) => ticket.status === 'Solved'
}

export const sampleTicketsOf = (viewKey: string): TicketInboxTicket[] =>
  sampleTickets.filter(inView[viewKey] ?? (() => true))

const VIEW_LABELS: Array<[string, string]> = [
  ['my-open', 'My open tickets'],
  ['unassigned', 'Unassigned'],
  ['overdue', 'Overdue'],
  ['all-open', 'All open'],
  ['solved', 'Solved']
]

export const sampleViews: TicketInboxView[] = VIEW_LABELS.map(([key, label]) => ({
  key,
  label,
  count: sampleTicketsOf(key).length,
  urgent: key === 'overdue'
}))
```

## `lib/ticket-fields.ts`

```ts
import type { PriorityTagPriority } from '@aziontech/webkit/priority-tag'
import type { TagSeverity } from '@aziontech/webkit/tag'

import type { TicketInboxStatus, TicketInboxTicket } from '../view-ticket-inbox.vue'

export const TICKET_STATUSES: TicketInboxStatus[] = ['New', 'Open', 'Pending', 'On hold', 'Solved']

export const statusSeverity: Record<TicketInboxStatus, TagSeverity> = {
  New: 'warning',
  Open: 'info',
  Pending: 'neutral',
  'On hold': 'neutral',
  Solved: 'success'
}

const PRIORITY_RANK: Record<PriorityTagPriority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
  none: 4
}

export const priorityOptions = [
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
  { value: 'none', label: 'No priority' }
]

export const optionsOf = (values: string[]) =>
  [...new Set(values.filter(Boolean))].sort().map((value) => ({ value }))

export const slaPaused = (ticket: TicketInboxTicket) =>
  ticket.status === 'Pending' || ticket.status === 'On hold'

export const ticketComparators = {
  priority: (a: TicketInboxTicket, b: TicketInboxTicket) =>
    PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority],
  slaDueAt: (a: TicketInboxTicket, b: TicketInboxTicket) =>
    (a.slaDueAt?.getTime() ?? Number.POSITIVE_INFINITY) -
    (b.slaDueAt?.getTime() ?? Number.POSITIVE_INFINITY)
}

export const ticketDefaultSort = [{ id: 'slaDueAt', desc: false }]

export const ticketHiddenColumns = [
  { id: 'group', visible: false },
  { id: 'channel', visible: false }
]
```

## `parts/inbox-controls.vue`

```ts
<script setup lang="ts">
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import IconButton from '@aziontech/webkit/icon-button'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Select from '@aziontech/webkit/select'
  import Tooltip from '@aziontech/webkit/tooltip'
  import type {
    CollectionPreferencesProps,
    CollectionPropertyFilterProps
  } from '@aziontech/webkit/use-collection'

  import type { TicketInboxView } from '../view-ticket-inbox.vue'

  export interface InboxControlsProps {
    /** The saved views, in order, each with its ticket count. */
    views: TicketInboxView[]
    /** The filter bindings from the collection. */
    propertyFilterProps: CollectionPropertyFilterProps
    /** The preferences bindings from the collection. */
    preferencesProps: CollectionPreferencesProps
    /** A request is in flight. */
    loading?: boolean
    /** The list cannot be filtered yet (first load or failure). */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<InboxControlsProps>(), {
    loading: false,
    disabled: false
  })

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
  }>()

  const viewKey = defineModel<string>('viewKey', { required: true })

  const labelOf = (view: TicketInboxView) =>
    view.urgent && view.count > 0
      ? `${view.label} (${view.count}, needs action)`
      : `${view.label} (${view.count})`

  const displayView = (key: string) => {
    const view = props.views.find((entry) => entry.key === key)
    return view ? labelOf(view) : ''
  }
</script>

<template>
  <div class="flex w-full flex-wrap items-start gap-(--spacing-xs)">
    <div class="w-full @2xl/controls:w-(--container-3xs) @2xl/controls:shrink-0">
      <Select
        v-model="viewKey"
        size="medium"
        placeholder="View"
        :disabled="!views.length"
        :display-value="displayView"
      >
        <Select.Trigger
          aria-label="View"
          class="w-full"
        />
        <Select.Content>
          <Select.Item
            v-for="view in views"
            :key="view.key"
            :value="view.key"
          >
            {{ labelOf(view) }}
          </Select.Item>
        </Select.Content>
      </Select>
    </div>
    <div class="flex min-w-0 flex-1 basis-(--container-3xs) items-start gap-(--spacing-xs)">
      <div class="flex min-w-0 grow">
        <PropertyFilter
          v-bind="propertyFilterProps"
          placeholder="Filter tickets"
          aria-label="Filter tickets"
          :disabled="disabled"
        />
      </div>
      <div class="flex shrink-0 items-center gap-(--spacing-xs)">
        <Tooltip
          content="Refresh"
          class="shrink-0"
        >
          <IconButton
            icon="az az-refresh"
            variant="outline"
            size="medium"
            :loading="loading"
            aria-label="Refresh"
            @click="(event: MouseEvent) => emit('refresh', event)"
          />
        </Tooltip>
        <CollectionPreferences
          v-bind="preferencesProps"
          title="Table preferences"
          :disabled="disabled"
        />
      </div>
    </div>
  </div>
</template>
```

## `parts/ticket-bulk-actions.vue`

```ts
<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import type { DropdownMenuItemValue } from '@aziontech/webkit/data-table'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'

  import type {
    TicketInboxAgent,
    TicketInboxBulkAction,
    TicketInboxStatus
  } from '../view-ticket-inbox.vue'

  export interface TicketBulkActionsProps {
    /** How many tickets are selected. */
    selectedCount: number
    /** How many tickets match the filters. */
    totalCount: number
    /** The whole page is selected and more tickets match: offer Select all. */
    canSelectAll: boolean
    /** The agents Assign offers. */
    agents: TicketInboxAgent[]
    /** The statuses Change status offers. */
    statuses: TicketInboxStatus[]
  }

  defineProps<TicketBulkActionsProps>()

  const emit = defineEmits<{
    'select-all': [event: MouseEvent]
    clear: [event: MouseEvent]
    action: [event: Event, action: TicketInboxBulkAction, value: string]
  }>()

  const pick =
    (action: TicketInboxBulkAction) =>
    (event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue) =>
      emit('action', event, action, String(value))
</script>

<template>
  <div
    class="flex w-full flex-wrap items-center gap-(--spacing-xs) rounded-(--shape-control) bg-(--bg-surface-raised) px-(--spacing-sm) py-(--spacing-xs)"
    role="group"
    aria-label="Bulk actions"
  >
    <span
      class="text-label-sm text-(--text-default)"
      role="status"
      >{{ selectedCount }} selected</span
    >
    <Button
      v-if="canSelectAll"
      :label="`Select all ${totalCount} tickets`"
      variant="ghost"
      size="small"
      @click="(event: MouseEvent) => emit('select-all', event)"
    />
    <Button
      label="Clear selection"
      variant="ghost"
      size="small"
      @click="(event: MouseEvent) => emit('clear', event)"
    />
    <div class="ms-auto flex flex-wrap items-center gap-(--spacing-xs)">
      <DropdownMenuRoot
        side="bottom"
        align="end"
        @select="pick('assign')"
      >
        <DropdownMenuTrigger>
          <Button
            :label="`Assign (${selectedCount})`"
            icon="az az-chevron-down"
            icon-position="trailing"
            variant="outline"
            size="small"
          />
        </DropdownMenuTrigger>
        <DropdownMenuItem
          v-for="agent in agents"
          :key="agent.name"
          :value="agent.name"
          :label="agent.name"
        >
          <template #leading>
            <Avatar
              :label="agent.name"
              :alt="agent.name"
              :presence="agent.presence"
              size="small"
              aria-hidden="true"
            />
          </template>
        </DropdownMenuItem>
      </DropdownMenuRoot>
      <DropdownMenuRoot
        side="bottom"
        align="end"
        @select="pick('status')"
      >
        <DropdownMenuTrigger>
          <Button
            :label="`Change status (${selectedCount})`"
            icon="az az-chevron-down"
            icon-position="trailing"
            variant="outline"
            size="small"
          />
        </DropdownMenuTrigger>
        <DropdownMenuItem
          v-for="status in statuses"
          :key="status"
          :value="status"
          :label="status"
        />
      </DropdownMenuRoot>
      <Button
        :label="`Merge (${selectedCount})`"
        icon="az az-git-merge"
        variant="outline"
        size="small"
        :disabled="selectedCount < 2"
        disabled-reason="Select two or more tickets to merge them."
        @click="(event: MouseEvent) => emit('action', event, 'merge', '')"
      />
      <Button
        :label="`Close (${selectedCount})`"
        icon="az az-circle-check"
        variant="outline"
        size="small"
        @click="(event: MouseEvent) => emit('action', event, 'close', '')"
      />
    </div>
  </div>
</template>
```

## `parts/ticket-subject-cell.vue`

```ts
<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import TableCellLink from '@aziontech/webkit/table-cell-link'

  import type { TicketInboxTicket } from '../view-ticket-inbox.vue'

  export interface TicketSubjectCellProps {
    /** The ticket the row shows. */
    ticket: TicketInboxTicket
  }

  defineProps<TicketSubjectCellProps>()
</script>

<template>
  <div class="flex min-w-0 items-start gap-(--spacing-xs)">
    <span
      class="mt-(--spacing-xs) size-2 shrink-0 rounded-full data-[unread]:bg-(--info-mark)"
      :data-unread="ticket.unread || null"
      aria-hidden="true"
    />
    <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs)">
      <div class="flex min-w-0 items-center">
        <span
          v-if="ticket.unread"
          class="sr-only"
          >Unread:</span
        >
        <TableCellLink
          :label="ticket.subject"
          :to="`/tickets/${ticket.id}`"
          destination="Tickets"
        />
      </div>
      <div class="flex min-w-0 items-center gap-(--spacing-xs) text-body-xs text-(--text-muted)">
        <Avatar
          :label="ticket.requester"
          size="small"
          aria-hidden="true"
        />
        <span
          class="truncate"
          dir="auto"
          >{{ ticket.requester }}</span
        >
        <span
          class="shrink-0 tabular-nums"
          dir="ltr"
          >#{{ ticket.id }}</span
        >
      </div>
    </div>
  </div>
</template>
```

## `parts/ticket-assignee-cell.vue`

```ts
<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'

  import type { TicketInboxTicket } from '../view-ticket-inbox.vue'

  export interface TicketAssigneeCellProps {
    /** The ticket the row shows. */
    ticket: TicketInboxTicket
  }

  defineProps<TicketAssigneeCellProps>()
</script>

<template>
  <div
    v-if="ticket.assignee"
    class="flex min-w-0 items-center gap-(--spacing-xs)"
  >
    <Avatar
      :label="ticket.assignee"
      :alt="ticket.assignee"
      :presence="ticket.assigneePresence"
      size="small"
    />
    <span
      class="truncate"
      dir="auto"
      aria-hidden="true"
      >{{ ticket.assignee }}</span
    >
  </div>
  <span
    v-else
    class="text-(--text-muted)"
    >Unassigned</span
  >
</template>
```
