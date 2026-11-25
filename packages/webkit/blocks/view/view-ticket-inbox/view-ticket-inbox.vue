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
    /** The agent name for assign, the status for status, the number of the ticket kept for merge; empty for close. */
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
              :tickets="selectedItems"
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
