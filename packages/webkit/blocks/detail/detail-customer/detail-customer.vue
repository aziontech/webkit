<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import { type PriorityTagPriority } from '@aziontech/webkit/priority-tag'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tabs from '@aziontech/webkit/tabs'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  import CustomerActivityTab from './parts/customer-activity-tab.vue'
  import CustomerClock from './parts/customer-clock.vue'
  import CustomerDetailsPanel from './parts/customer-details-panel.vue'
  import CustomerNotesTab from './parts/customer-notes-tab.vue'
  import CustomerTicketsTab from './parts/customer-tickets-tab.vue'
  import {
    sampleActivity,
    sampleCustomer,
    sampleNotes,
    sampleNow,
    sampleSatisfaction,
    sampleTickets
  } from './sample'

  /** A tab of the customer page. */
  export type DetailCustomerTab = 'tickets' | 'activity' | 'notes'

  /** Where a ticket stands. */
  export type DetailCustomerTicketStatus = 'open' | 'pending' | 'solved' | 'closed'

  /** What happened in an activity event; picks its marker. */
  export type DetailCustomerEventType =
    'joined' | 'created' | 'replied' | 'rated' | 'merged' | 'solved'

  /** The person who contacts support. */
  export interface DetailCustomerCustomer {
    /** The customer ID, used in links. */
    id: string
    /** Full name, the page title. */
    name: string
    /** Email address, copyable. */
    email: string
    /** Phone number in international format, copyable; empty shows Not set. */
    phone: string
    /** IANA time zone the local time is shown in, such as America/New_York. */
    timeZone: string
    /** The language the customer reads, written out. */
    language: string
    /** The organization the customer belongs to, also the page description. */
    organization: string
    /** Link to the organization page; empty shows the name as text. */
    organizationHref: string
    /** Tags on the customer, shown read-only. */
    tags: string[]
    /** When the customer first contacted support. */
    customerSince: string | Date
    /** Photo URL; empty shows the initials. */
    avatarSrc: string
  }

  /** The satisfaction surveys the customer answered. */
  export interface DetailCustomerSatisfaction {
    /** The average score, from 0 to 5. */
    average: number
    /** How many surveys were answered; 0 shows No ratings yet. */
    surveys: number
  }

  /** One ticket the customer opened. */
  export interface DetailCustomerTicket {
    /** The ticket number, without the hash. */
    id: string
    /** The subject line. */
    subject: string
    /** Where the ticket stands. */
    status: DetailCustomerTicketStatus
    /** The ticket priority. */
    priority: PriorityTagPriority
    /** When the next reply is due, an ISO string; empty when no SLA runs. */
    dueAt: string
    /** When the ticket last changed, an ISO string. */
    updatedAt: string
  }

  /** One event on the customer's account. */
  export interface DetailCustomerEvent {
    /** A stable ID. */
    id: string
    /** What happened; picks the marker. */
    type: DetailCustomerEventType
    /** What happened, in plain words. */
    title: string
    /** One line of detail; empty shows none. */
    description: string
    /** Who did it. */
    actor: string
    /** When it happened, an ISO string. */
    at: string
  }

  /** One internal note on the customer. */
  export interface DetailCustomerNote {
    /** A stable ID. */
    id: string
    /** The agent who wrote it. */
    author: string
    /** When it was written, an ISO string. */
    at: string
    /** The note text. */
    body: string
  }

  export interface DetailCustomerProps {
    /** The customer the page shows. Left out, the sample renders. */
    customer?: DetailCustomerCustomer
    /** Their satisfaction surveys. Left out, the sample renders. */
    satisfaction?: DetailCustomerSatisfaction
    /** Their tickets, open ones first; [] shows the empty state. Left out, the sample renders. */
    tickets?: DetailCustomerTicket[]
    /** Their account activity, newest first. Left out, the sample renders. */
    activity?: DetailCustomerEvent[]
    /** Internal notes, oldest first. Left out, the sample renders. */
    notes?: DetailCustomerNote[]
    /** A fixed reference time for the countdowns and relative times; left out, the real clock reads (the sample brings its own). */
    now?: string | number | Date
    /** The customer is loading; skeletons stand in for the data. */
    loading?: boolean
    /** Why the customer failed to load, shown with Retry; empty shows the page. */
    error?: string
    /** A note is being saved; Add note shows its loading state. */
    saving?: boolean
  }

  const props = withDefaults(defineProps<DetailCustomerProps>(), {
    customer: undefined,
    satisfaction: undefined,
    tickets: undefined,
    activity: undefined,
    notes: undefined,
    now: undefined,
    loading: false,
    error: '',
    saving: false
  })

  const emit = defineEmits<{
    'open-ticket': [event: MouseEvent, ticket: DetailCustomerTicket]
    'new-ticket': [event: MouseEvent]
    edit: [event: MouseEvent]
    'customer-action': [
      event: globalThis.MouseEvent | globalThis.KeyboardEvent,
      value: DropdownMenuItemValue
    ]
    'add-note': [event: MouseEvent, text: string]
    retry: [event: MouseEvent]
  }>()

  const tab = defineModel<DetailCustomerTab>('tab', { default: 'tickets' })
  const draft = defineModel<string>('draft', { default: '' })

  const blocked = computed(() => props.loading || props.error !== '')
  const customer = computed(() => props.customer ?? (blocked.value ? undefined : sampleCustomer))
  const satisfaction = computed(
    () => props.satisfaction ?? (blocked.value ? undefined : sampleSatisfaction)
  )
  const tickets = computed(() => props.tickets ?? (blocked.value ? [] : sampleTickets))
  const activity = computed(() => props.activity ?? (blocked.value ? [] : sampleActivity))
  const notes = computed(() => props.notes ?? (blocked.value ? [] : sampleNotes))
  const clock = computed(
    () => props.now ?? (props.customer === undefined && !blocked.value ? sampleNow : undefined)
  )
  const name = computed(() => customer.value?.name ?? '')
</script>

<template>
  <CustomerClock :now="clock">
    <div class="@container/customer layout-column layout-boundary flex min-w-0 flex-col">
      <PageHeader :title="customer?.name ?? 'Customer'">
        <template #icon>
          <Skeleton
            v-if="loading"
            width="2rem"
            height="2rem"
          />
          <Avatar
            v-else-if="customer"
            :label="customer.name"
            :src="customer.avatarSrc"
            variant="square"
          />
        </template>
        <template
          v-if="customer && !loading"
          #description
        >
          <bdi>{{ customer.organization }}</bdi>
        </template>
        <template
          v-if="!error"
          #actions
        >
          <Button
            label="Edit"
            icon="az az-pencil"
            variant="outline"
            size="medium"
            :disabled="loading"
            @click="(event: MouseEvent) => emit('edit', event)"
          />
          <DropdownMenu
            side="bottom"
            align="end"
            :disabled="loading"
            @select="(event, value) => emit('customer-action', event, value)"
          >
            <DropdownMenu.Trigger>
              <Tooltip content="More actions">
                <IconButton
                  icon="az az-ellipsis"
                  variant="outline"
                  size="medium"
                  aria-label="More actions"
                  :disabled="loading"
                />
              </Tooltip>
            </DropdownMenu.Trigger>
            <DropdownMenu.Group>
              <DropdownMenu.Item
                value="merge"
                label="Merge customer"
              >
                <template #leading>
                  <i
                    class="az az-git-merge"
                    aria-hidden="true"
                  />
                </template>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                value="export"
                label="Export data"
              >
                <template #leading>
                  <i
                    class="az az-download"
                    aria-hidden="true"
                  />
                </template>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                value="delete"
                label="Delete customer"
              >
                <template #leading>
                  <i
                    class="az az-trash"
                    aria-hidden="true"
                  />
                </template>
              </DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu>
          <Button
            label="New ticket"
            icon="az az-plus"
            variant="primary"
            size="medium"
            :disabled="loading"
            @click="(event: MouseEvent) => emit('new-ticket', event)"
          />
        </template>
      </PageHeader>

      <section class="layout-section-start flex min-w-0 flex-col">
        <Alert
          v-if="error"
          severity="danger"
          title="Couldn't load this customer"
          :label="error"
          action-label="Retry"
          @action="(event: MouseEvent) => emit('retry', event)"
        />
        <div
          v-else
          class="grid min-w-0 grid-cols-1 items-start gap-(--layout-section-gap) @3xl/customer:grid-cols-[minmax(0,var(--container-xs))_minmax(0,1fr)]"
        >
          <CustomerDetailsPanel
            :customer="customer"
            :satisfaction="satisfaction"
            :now="clock"
            :loading="loading"
          />
          <Tabs
            v-model="tab"
            class="min-w-0"
          >
            <Tabs.List>
              <Tabs.Trigger
                value="tickets"
                label="Tickets"
              />
              <Tabs.Trigger
                value="activity"
                label="Activity"
              />
              <Tabs.Trigger
                value="notes"
                label="Notes"
              />
            </Tabs.List>
            <Tabs.Content value="tickets">
              <CustomerTicketsTab
                :tickets="tickets"
                :name="name"
                :loading="loading"
                @open-ticket="(event, ticket) => emit('open-ticket', event, ticket)"
                @new-ticket="(event) => emit('new-ticket', event)"
              />
            </Tabs.Content>
            <Tabs.Content value="activity">
              <CustomerActivityTab
                :activity="activity"
                :name="name"
                :loading="loading"
                :now="clock"
              />
            </Tabs.Content>
            <Tabs.Content value="notes">
              <CustomerNotesTab
                v-model:draft="draft"
                :notes="notes"
                :name="name"
                :loading="loading"
                :saving="saving"
                @add-note="(event, text) => emit('add-note', event, text)"
              />
            </Tabs.Content>
          </Tabs>
        </div>
      </section>
    </div>
  </CustomerClock>
</template>
