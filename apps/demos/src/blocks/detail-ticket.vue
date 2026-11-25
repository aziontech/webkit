<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import type { AvatarPresence } from '@aziontech/webkit/avatar'
  import ConfigProvider from '@aziontech/webkit/config-provider'
  import Countdown from '@aziontech/webkit/countdown'
  import type {
    MessageThreadChannel,
    MessageThreadFrom,
    MessageThreadItemType
  } from '@aziontech/webkit/message-thread'
  import PageHeader from '@aziontech/webkit/page-header'
  import PriorityTag, { type PriorityTagPriority } from '@aziontech/webkit/priority-tag'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import type { TimelineItemSeverity } from '@aziontech/webkit/timeline'
  import { computed } from 'vue'

  import {
    sampleActivity,
    sampleAgents,
    sampleGroups,
    sampleMessages,
    sampleNow,
    sampleRequester,
    sampleResponses,
    sampleTagOptions,
    sampleTicket,
    sampleViewers
  } from './detail-ticket.sample'
  import { slaPaused, statusSeverity } from './detail-ticket.ticket-fields'
  import TicketActivity from './detail-ticket-ticket-activity.vue'
  import TicketComposer from './detail-ticket-ticket-composer.vue'
  import TicketConversation from './detail-ticket-ticket-conversation.vue'
  import TicketHeaderActions from './detail-ticket-ticket-header-actions.vue'
  import TicketProperties from './detail-ticket-ticket-properties.vue'
  import TicketRequester from './detail-ticket-ticket-requester.vue'

  /** Where a ticket stands in its lifecycle. */
  export type DetailTicketStatus = 'New' | 'Open' | 'Pending' | 'On hold' | 'Solved'

  /** What kind of request the ticket is. */
  export type DetailTicketType = 'Question' | 'Incident' | 'Problem' | 'Task'

  /** Whether the composer writes to the customer or to the team. */
  export type DetailTicketReplyMode = 'reply' | 'note'

  /** A ticket property the side column edits. */
  export type DetailTicketField = 'status' | 'priority' | 'type' | 'group' | 'assignee' | 'tags'

  /** An action of the More menu. */
  export type DetailTicketAction = 'copy-link' | 'print' | 'spam' | 'delete'

  /** The ticket itself. */
  export interface DetailTicketTicket {
    /** Ticket number, the stable key. */
    id: string
    /** The request's subject line. */
    subject: string
    /** Where the ticket stands. */
    status: DetailTicketStatus
    /** How urgent it is. */
    priority: PriorityTagPriority
    /** What kind of request it is. */
    type: DetailTicketType
    /** The team that owns it. */
    group: string
    /** Name of the assigned agent; empty when unassigned. */
    assignee: string
    /** Labels set by agents or rules. */
    tags: string[]
    /** Name of the SLA target that runs next, such as Next reply. */
    slaLabel: string
    /** When the next SLA target is due; null when no target runs. */
    slaDueAt: Date | null
  }

  /** A file attached to a message. */
  export interface DetailTicketAttachment {
    /** File name with its extension. */
    name: string
    /** Size in bytes. */
    size: number
  }

  /** One item of the conversation. */
  export interface DetailTicketMessage {
    /** Stable key. */
    id: string
    /** A public reply, an internal note or a system event. */
    type: MessageThreadItemType
    /** Who wrote it; empty for an event. */
    author: string
    /** Whether the author is the customer or an agent. */
    from: MessageThreadFrom
    /** How a reply came in or went out; empty for a note or an event. */
    channel: MessageThreadChannel | ''
    /** When it was sent. */
    sentAt: Date
    /** Addresses the reply went to. */
    to: string[]
    /** Addresses copied on the reply. */
    cc: string[]
    /** The message text, or the event sentence. */
    body: string
    /** The earlier email the reply quotes; empty when none. */
    quoted: string
    /** Files attached to the message. */
    attachments: DetailTicketAttachment[]
  }

  /** The customer who asked. */
  export interface DetailTicketRequester {
    /** Full name. */
    name: string
    /** Email address. */
    email: string
    /** Organization the customer belongs to. */
    organization: string
    /** How many other tickets the customer opened. */
    otherTickets: number
  }

  /** One entry of the ticket's activity. */
  export interface DetailTicketActivity {
    /** Stable key. */
    id: string
    /** The day header it is listed under, formatted by the app. */
    day: string
    /** What happened. */
    title: string
    /** Who did it. */
    actor: string
    /** When it happened. */
    time: Date
    /** What it means for the reader. */
    severity: TimelineItemSeverity
    /** Icon class drawn as the marker; empty draws the dot. */
    icon: string
  }

  /** A teammate: an assignee, a mention, a viewer. */
  export interface DetailTicketAgent {
    /** Full name. */
    name: string
    /** Handle inserted after the at sign. */
    handle: string
    /** Email address. */
    email: string
    /** Whether the agent is reachable now; empty when unknown. */
    presence: AvatarPresence | ''
  }

  /** A saved reply the composer can insert. */
  export interface DetailTicketResponse {
    /** Stable key. */
    key: string
    /** Name shown in the menu. */
    label: string
    /** Markdown inserted into the draft. */
    body: string
  }

  /** What the composer holds. */
  export interface DetailTicketDraft {
    /** Reply to the customer or internal note. */
    mode: DetailTicketReplyMode
    /** Addresses copied on a reply. */
    cc: string[]
    /** Markdown text. */
    body: string
    /** Files attached to the draft. */
    files: File[]
  }

  /** What Send carries. */
  export interface DetailTicketSendPayload extends DetailTicketDraft {
    /** Status to set with the reply; empty keeps the current one. */
    status: '' | 'Pending' | 'Solved'
  }

  /** A property edited in the side column. */
  export interface DetailTicketPropertyChange {
    /** Which property. */
    field: DetailTicketField
    /** Its new value; a list for tags, empty for Unassigned. */
    value: string | string[]
  }

  export interface DetailTicketProps {
    /** The ticket. Left out, the sample renders. */
    ticket?: DetailTicketTicket
    /** The conversation, oldest first. Left out, the sample renders. */
    messages?: DetailTicketMessage[]
    /** The customer who asked. Left out, the sample renders. */
    requester?: DetailTicketRequester
    /** The ticket's activity, newest first. Left out, the sample renders. */
    activity?: DetailTicketActivity[]
    /** Agents to assign, mention and copy. Left out, the sample agents render. */
    agents?: DetailTicketAgent[]
    /** Other agents who have the ticket open now. */
    viewers?: DetailTicketAgent[]
    /** Saved replies Insert response offers. */
    responses?: DetailTicketResponse[]
    /** Groups the ticket can move to. */
    groups?: string[]
    /** Tags offered in the Tags field. */
    tagOptions?: string[]
    /** A fixed moment the SLA countdown and relative times read (a test, a server render). */
    now?: Date
    /** The ticket is loading. */
    loading?: boolean
    /** Why the ticket could not load; a danger alert with Retry replaces the page body. */
    error?: string
    /** The draft is being sent; the composer is busy. */
    sending?: boolean
    /** Why the last send failed; the composer keeps the draft and offers Retry. */
    sendError?: string
  }

  const props = withDefaults(defineProps<DetailTicketProps>(), {
    ticket: undefined,
    messages: undefined,
    requester: undefined,
    activity: undefined,
    agents: undefined,
    viewers: undefined,
    responses: undefined,
    groups: undefined,
    tagOptions: undefined,
    now: undefined,
    loading: false,
    error: '',
    sending: false,
    sendError: ''
  })

  const emit = defineEmits<{
    send: [event: MouseEvent | KeyboardEvent, payload: DetailTicketSendPayload]
    'property-change': [change: DetailTicketPropertyChange]
    'open-customer': [event: MouseEvent, requester: DetailTicketRequester]
    merge: [event: MouseEvent, ticket: DetailTicketTicket]
    'ticket-action': [event: MouseEvent | KeyboardEvent, action: DetailTicketAction]
    reopen: [event: MouseEvent, ticket: DetailTicketTicket]
    retry: [event: MouseEvent]
  }>()

  const draft = defineModel<DetailTicketDraft>('draft', {
    default: () => ({ mode: 'reply', cc: [], body: '', files: [] })
  })

  const blank = computed(() => props.loading || props.error !== '')
  const list = <T,>(value: T[] | undefined, sample: T[]): T[] =>
    value ?? (blank.value ? [] : sample)
  const one = <T,>(value: T | undefined, sample: T): T | undefined =>
    value ?? (blank.value ? undefined : sample)

  const current = computed(() => one(props.ticket, sampleTicket))
  const customer = computed(() => one(props.requester, sampleRequester))
  const thread = computed(() => list(props.messages, sampleMessages))
  const history = computed(() => list(props.activity, sampleActivity))
  const team = computed(() => list(props.agents, sampleAgents))
  const watching = computed(() => list(props.viewers, sampleViewers))
  const saved = computed(() => list(props.responses, sampleResponses))
  const groupList = computed(() => list(props.groups, sampleGroups))
  const tagList = computed(() => list(props.tagOptions, sampleTagOptions))
  const clock = computed(
    () => props.now ?? (props.ticket || props.loading || props.error ? undefined : sampleNow)
  )

  const withTicket =
    <E,>(handler: (event: E, ticket: DetailTicketTicket) => void) =>
    (event: E) => {
      if (current.value) handler(event, current.value)
    }
  const onMerge = withTicket<MouseEvent>((event, ticket) => emit('merge', event, ticket))
  const onReopen = withTicket<MouseEvent>((event, ticket) => emit('reopen', event, ticket))
</script>

<template>
  <ConfigProvider :now="clock">
    <div class="layout-boundary">
      <div class="layout-column flex min-h-full min-w-0 flex-col">
        <PageHeader
          :title="current?.subject ?? 'Ticket'"
          size="small"
        >
          <template #meta>
            <div
              v-if="current"
              class="flex flex-wrap items-center gap-(--spacing-xs)"
            >
              <span
                class="text-body-sm text-(--text-muted)"
                dir="ltr"
                >#{{ current.id }}</span
              >
              <Tag
                :label="current.status"
                :severity="statusSeverity[current.status]"
                size="small"
              />
              <PriorityTag
                :priority="current.priority"
                size="small"
              />
              <Countdown
                v-if="current.status !== 'Solved'"
                :label="current.slaLabel"
                :deadline="current.slaDueAt ?? undefined"
                :paused="slaPaused(current)"
                size="small"
              />
            </div>
            <Skeleton
              v-else-if="loading"
              width="16rem"
              height="1.25rem"
            />
          </template>
          <template
            v-if="current"
            #actions
          >
            <TicketHeaderActions
              :viewers="watching"
              @merge="onMerge"
              @action="(event, action) => emit('ticket-action', event, action)"
            />
          </template>
        </PageHeader>

        <section class="layout-section-start @container/ticket flex min-w-0 flex-col">
          <Alert
            v-if="error"
            severity="danger"
            :label="error"
            action-label="Retry"
            @action="(event: MouseEvent) => emit('retry', event)"
          />
          <div
            v-else
            class="grid min-w-0 grid-cols-1 items-start gap-(--layout-section-gap) @3xl/ticket:grid-cols-[minmax(0,1fr)_var(--container-2xs)]"
          >
            <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
              <TicketConversation
                :messages="thread"
                :ticket-id="current?.id ?? ''"
                :loading="loading"
              />
              <TicketComposer
                v-model:draft="draft"
                :requester="customer"
                :agents="team"
                :responses="saved"
                :solved="current?.status === 'Solved'"
                :disabled="loading"
                :sending="sending"
                :send-error="sendError"
                @send="(event, payload) => emit('send', event, payload)"
                @reopen="onReopen"
              />
            </div>
            <aside
              class="flex min-w-0 flex-col gap-(--layout-group-gap)"
              aria-label="Ticket details"
            >
              <TicketProperties
                :ticket="current"
                :agents="team"
                :groups="groupList"
                :tag-options="tagList"
                :loading="loading"
                @change="(change) => emit('property-change', change)"
              />
              <TicketRequester
                :requester="customer"
                :loading="loading"
                @open="(event, requester) => emit('open-customer', event, requester)"
              />
              <TicketActivity
                :activity="history"
                :loading="loading"
              />
            </aside>
          </div>
        </section>
      </div>
    </div>
  </ConfigProvider>
</template>
