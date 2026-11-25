import type { AvatarPresence } from '@aziontech/webkit/avatar'
import { computed, ref } from 'vue'

import {
  sampleAgents as createAgents,
  sampleGroups as createGroups
} from '../blocks/create-ticket.sample'
import type { CreateTicketContact, CreateTicketPayload } from '../blocks/create-ticket.vue'
import { sampleCustomer, sampleNotes, sampleSatisfaction } from '../blocks/detail-customer.sample'
import type {
  DetailCustomerCustomer,
  DetailCustomerEvent,
  DetailCustomerNote,
  DetailCustomerSatisfaction,
  DetailCustomerTicket,
  DetailCustomerTicketStatus
} from '../blocks/detail-customer.vue'
import {
  sampleActivity as ticketActivity,
  sampleMessages as ticketMessages,
  sampleTicket
} from '../blocks/detail-ticket.sample'
import type {
  DetailTicketActivity,
  DetailTicketMessage,
  DetailTicketRequester,
  DetailTicketResponse,
  DetailTicketSendPayload,
  DetailTicketTicket,
  DetailTicketType
} from '../blocks/detail-ticket.vue'
import { sampleResponses } from '../blocks/settings-canned-responses.sample'
import type {
  CannedResponsesResponse,
  CannedResponsesValues
} from '../blocks/settings-canned-responses.vue'
import { sampleAgents as inboxAgents, sampleTicketsOf } from '../blocks/view-ticket-inbox.sample'
import type {
  TicketInboxBulkPayload,
  TicketInboxChannel,
  TicketInboxStatus,
  TicketInboxTicket,
  TicketInboxView
} from '../blocks/view-ticket-inbox.vue'

type Priority = TicketInboxTicket['priority']

export const SUPPORT_NOW = new Date(Date.UTC(2026, 10, 10, 12))
const SUPPORT_AGENT = 'Jane Doe'

const HOUR = 3_600_000

export type SupportTicket = TicketInboxTicket & {
  type: DetailTicketType
  cc: string[]
  messages: DetailTicketMessage[]
  activity: DetailTicketActivity[]
}

export type SupportCustomer = DetailCustomerCustomer & {
  notes: DetailCustomerNote[]
}

let sequence = 0
const nextId = (prefix: string) => `${prefix}-${(sequence += 1)}`

const customerId = (email: string) => email.split('@')[0].replaceAll('.', '-')

const CHANNELS: Record<TicketInboxChannel, DetailTicketMessage['channel']> = {
  Email: 'email',
  Chat: 'chat',
  'Web form': 'web',
  Phone: 'phone'
}

const CHANNEL_NAMES: Record<TicketInboxChannel, string> = {
  Email: 'by email',
  Chat: 'from chat',
  'Web form': 'from the web form',
  Phone: 'by phone'
}

function firstMessage(ticket: TicketInboxTicket, body: string, sentAt: Date): DetailTicketMessage {
  return {
    id: nextId('m'),
    type: 'reply',
    author: ticket.requester,
    from: 'customer',
    channel: CHANNELS[ticket.channel],
    sentAt,
    to: ['support@example.com'],
    cc: [],
    body,
    quoted: '',
    attachments: []
  }
}

function createdActivity(ticket: TicketInboxTicket, time: Date): DetailTicketActivity {
  return {
    id: nextId('a'),
    day: time.getTime() > SUPPORT_NOW.getTime() - 12 * HOUR ? 'Today' : 'Earlier',
    title: `Ticket created ${CHANNEL_NAMES[ticket.channel]}`,
    actor: ticket.requester,
    time,
    severity: 'neutral',
    icon: 'az az-mail'
  }
}

function seedTicket(ticket: TicketInboxTicket): SupportTicket {
  if (ticket.id === sampleTicket.id)
    return {
      ...ticket,
      type: sampleTicket.type,
      cc: [],
      messages: ticketMessages.map((message) => ({ ...message })),
      activity: ticketActivity
        .filter((entry) => entry.actor !== 'SLA policy')
        .map((entry) => ({ ...entry }))
    }
  const opened = new Date(ticket.updatedAt.getTime() - HOUR)
  return {
    ...ticket,
    type: 'Question',
    cc: [],
    messages: [
      firstMessage(
        ticket,
        `${ticket.subject}. Could you take a look when you have a moment?`,
        opened
      )
    ],
    activity: [createdActivity(ticket, opened)]
  }
}

const tickets = ref<SupportTicket[]>(sampleTicketsOf('').map(seedTicket))

const sampleCustomerName = 'Alex Morgan'

const seedCustomer = (name: string, email: string): SupportCustomer => {
  const id = customerId(email)
  if (name === sampleCustomerName)
    return {
      ...sampleCustomer,
      id,
      name,
      email,
      notes: sampleNotes.slice(0, 1).map((note) => ({ ...note }))
    }
  return {
    id,
    name,
    email,
    phone: '',
    timeZone: 'America/New_York',
    language: 'English (United States)',
    organization: sampleCustomer.organization,
    organizationHref: sampleCustomer.organizationHref,
    tags: [],
    customerSince: '2025-06-02T15:00:00Z',
    avatarSrc: '',
    notes: []
  }
}

const people = new Map<string, string>()
for (const ticket of tickets.value) people.set(ticket.requesterEmail, ticket.requester)
const customers = ref<SupportCustomer[]>(
  [...people].map(([email, name]) => seedCustomer(name, email))
)

export const responses = ref<CannedResponsesResponse[]>(
  sampleResponses.map((response) => ({ ...response }))
)

export const agents = inboxAgents
export const createTicketAgents = createAgents
export const createTicketGroups = createGroups

const presenceOf = (name: string): AvatarPresence | '' =>
  agents.find((agent) => agent.name === name)?.presence ?? ''

const OPEN: TicketInboxStatus[] = ['New', 'Open', 'Pending', 'On hold']

const VIEWS: Array<[string, string, (ticket: TicketInboxTicket) => boolean]> = [
  ['my-open', 'My open tickets', (t) => t.assignee === SUPPORT_AGENT && OPEN.includes(t.status)],
  ['unassigned', 'Unassigned', (t) => t.assignee === '' && OPEN.includes(t.status)],
  [
    'overdue',
    'Overdue',
    (t) =>
      (t.status === 'New' || t.status === 'Open') &&
      t.slaDueAt !== null &&
      t.slaDueAt.getTime() <= SUPPORT_NOW.getTime()
  ],
  ['all-open', 'All open', (t) => OPEN.includes(t.status)],
  ['solved', 'Solved', (t) => t.status === 'Solved']
]

export const views = computed<TicketInboxView[]>(() =>
  VIEWS.map(([key, label, match]) => ({
    key,
    label,
    count: tickets.value.filter(match).length,
    urgent: key === 'overdue'
  }))
)

export function ticketsOf(viewKey: string): TicketInboxTicket[] {
  const match = VIEWS.find(([key]) => key === viewKey)?.[2] ?? (() => true)
  return tickets.value.filter(match)
}

export function findTicket(id: unknown): SupportTicket | undefined {
  return tickets.value.find((ticket) => ticket.id === String(id))
}

export function findCustomer(id: unknown): SupportCustomer | undefined {
  const key = String(id)
  return customers.value.find(
    (customer) =>
      customer.id === key || (key === sampleCustomer.id && customer.name === sampleCustomerName)
  )
}

export function customerOf(ticket: TicketInboxTicket): SupportCustomer | undefined {
  return customers.value.find((customer) => customer.email === ticket.requesterEmail)
}

function patchTicket(id: string, patch: (ticket: SupportTicket) => Partial<SupportTicket>) {
  tickets.value = tickets.value.map((ticket) =>
    ticket.id === id ? { ...ticket, ...patch(ticket), updatedAt: SUPPORT_NOW } : ticket
  )
}

function activity(title: string, icon = ''): DetailTicketActivity {
  return {
    id: nextId('a'),
    day: 'Today',
    title,
    actor: SUPPORT_AGENT,
    time: SUPPORT_NOW,
    severity: 'neutral',
    icon
  }
}

function event(body: string): DetailTicketMessage {
  return {
    id: nextId('m'),
    type: 'event',
    author: '',
    from: 'agent',
    channel: '',
    sentAt: SUPPORT_NOW,
    to: [],
    cc: [],
    body,
    quoted: '',
    attachments: []
  }
}

const PRIORITY_LABELS: Record<Priority, string> = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  none: 'None'
}

export function markRead(id: string) {
  tickets.value = tickets.value.map((ticket) =>
    ticket.id === id && ticket.unread ? { ...ticket, unread: false } : ticket
  )
}

const slaFor = (status: TicketInboxStatus, current: Date | null) =>
  status === 'Solved' ? null : (current ?? new Date(SUPPORT_NOW.getTime() + 4 * HOUR))

export function setStatus(id: string, status: TicketInboxStatus) {
  patchTicket(id, (ticket) =>
    ticket.status === status
      ? {}
      : {
          status,
          slaDueAt: slaFor(status, ticket.slaDueAt),
          messages: [...ticket.messages, event(`${SUPPORT_AGENT} changed the status to ${status}`)],
          activity: [activity(`Status changed to ${status}`), ...ticket.activity]
        }
  )
}

function setAssignee(id: string, assignee: string) {
  patchTicket(id, (ticket) =>
    ticket.assignee === assignee
      ? {}
      : {
          assignee,
          assigneePresence: presenceOf(assignee),
          activity: [
            activity(assignee ? `Assigned to ${assignee}` : 'Unassigned', 'az az-user'),
            ...ticket.activity
          ]
        }
  )
}

export function setProperty(id: string, field: string, value: string | string[]) {
  if (field === 'status') return setStatus(id, value as TicketInboxStatus)
  if (field === 'assignee') return setAssignee(id, String(value))
  if (field === 'tags') return patchTicket(id, () => ({ tags: [...(value as string[])] }))
  if (field === 'priority')
    return patchTicket(id, (ticket) => ({
      priority: value as Priority,
      activity: [
        activity(`Priority set to ${PRIORITY_LABELS[value as Priority]}`),
        ...ticket.activity
      ]
    }))
  if (field === 'type') return patchTicket(id, () => ({ type: value as DetailTicketType }))
  if (field === 'group')
    return patchTicket(id, (ticket) => ({
      group: String(value),
      activity: [activity(`Moved to ${String(value)}`), ...ticket.activity]
    }))
}

export function sendMessage(id: string, payload: DetailTicketSendPayload) {
  const note = payload.mode === 'note'
  const before = findTicket(id)
  patchTicket(id, (ticket) => ({
    unread: false,
    messages: [
      ...ticket.messages,
      {
        id: nextId('m'),
        type: note ? 'note' : 'reply',
        author: SUPPORT_AGENT,
        from: 'agent',
        channel: note ? '' : 'email',
        sentAt: SUPPORT_NOW,
        to: note ? [] : [ticket.requesterEmail],
        cc: note ? [] : [...payload.cc],
        body: payload.body,
        quoted: '',
        attachments: payload.files.map((file) => ({ name: file.name, size: file.size }))
      }
    ],
    activity: [
      activity(note ? 'Internal note added' : 'Replied to the requester', 'az az-mail'),
      ...ticket.activity
    ]
  }))
  if (payload.status) setStatus(id, payload.status)
  else if (!note && before?.status === 'New') setStatus(id, 'Open')
}

export function deleteTickets(ids: string[]) {
  tickets.value = tickets.value.filter((ticket) => !ids.includes(ticket.id))
}

function mergeTickets(targetId: string, sourceIds: string[]) {
  const sources = tickets.value.filter((ticket) => sourceIds.includes(ticket.id))
  patchTicket(targetId, (ticket) => ({
    tags: [...new Set([...ticket.tags, ...sources.flatMap((source) => source.tags)])],
    messages: [
      ...ticket.messages,
      ...sources.map((source) => event(`${SUPPORT_AGENT} merged #${source.id} into this ticket`))
    ],
    activity: [
      ...sources.map((source) => activity(`Ticket #${source.id} merged`)),
      ...ticket.activity
    ]
  }))
  deleteTickets(sourceIds)
}

const countOf = (count: number) => (count === 1 ? '1 ticket' : `${count} tickets`)

export function applyBulk({ action, value, tickets: selected }: TicketInboxBulkPayload): string {
  const ids = selected.map((ticket) => ticket.id)
  const count = countOf(ids.length)
  if (action === 'assign') {
    for (const id of ids) setAssignee(id, value)
    return value ? `${count} assigned to ${value}.` : `${count} unassigned.`
  }
  if (action === 'status') {
    for (const id of ids) setStatus(id, value as TicketInboxStatus)
    return `${count} set to ${value}.`
  }
  if (action === 'close') {
    for (const id of ids) setStatus(id, 'Solved')
    return `${count} closed.`
  }
  const [target, ...rest] = [...selected].sort((a, b) => Number(a.id) - Number(b.id))
  mergeTickets(
    target.id,
    rest.map((ticket) => ticket.id)
  )
  return `${countOf(rest.length)} merged into #${target.id}.`
}

function ensureCustomer(contact: CreateTicketContact): SupportCustomer {
  const found = customers.value.find((customer) => customer.email === contact.email)
  if (found) return found
  const created: SupportCustomer = {
    ...seedCustomer(contact.name || contact.email, contact.email),
    customerSince: SUPPORT_NOW.toISOString()
  }
  customers.value = [...customers.value, created]
  return created
}

export function contactsOf(): CreateTicketContact[] {
  return customers.value.map((customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email
  }))
}

export function createTicket({ ticket: values }: CreateTicketPayload): SupportTicket {
  const customer = ensureCustomer(values.requester)
  const id = String(Math.max(...tickets.value.map((ticket) => Number(ticket.id)), 4839) + 1)
  const assignee = createAgents.find((agent) => agent.id === values.assigneeId)?.name ?? ''
  const group = createGroups.find((item) => item.id === values.groupId)?.name ?? ''
  const channel: TicketInboxChannel = values.channel || 'Email'
  const base: TicketInboxTicket = {
    id,
    subject: values.subject,
    requester: customer.name,
    requesterEmail: customer.email,
    unread: false,
    status: assignee ? 'Open' : 'New',
    priority: values.priority || 'none',
    assignee,
    assigneePresence: presenceOf(assignee),
    group,
    channel,
    tags: [...values.tags],
    slaDueAt: new Date(SUPPORT_NOW.getTime() + 4 * HOUR),
    updatedAt: SUPPORT_NOW
  }
  const created: SupportTicket = {
    ...base,
    type: values.type || 'Question',
    cc: [...values.cc],
    messages: [
      {
        ...firstMessage(base, values.description, SUPPORT_NOW),
        cc: [...values.cc],
        attachments: values.attachments.map((file) => ({ name: file.name, size: file.size }))
      }
    ],
    activity: [
      {
        ...createdActivity(base, SUPPORT_NOW),
        title: `Ticket created by ${SUPPORT_AGENT}`,
        actor: SUPPORT_AGENT
      }
    ]
  }
  tickets.value = [created, ...tickets.value]
  return created
}

export function detailTicketOf(ticket: SupportTicket): DetailTicketTicket {
  return {
    id: ticket.id,
    subject: ticket.subject,
    status: ticket.status,
    priority: ticket.priority,
    type: ticket.type,
    group: ticket.group,
    assignee: ticket.assignee,
    tags: ticket.tags,
    slaLabel: 'Next reply',
    slaDueAt: ticket.slaDueAt
  }
}

export function requesterOf(ticket: SupportTicket): DetailTicketRequester {
  return {
    name: ticket.requester,
    email: ticket.requesterEmail,
    organization: customerOf(ticket)?.organization ?? '',
    otherTickets: tickets.value.filter(
      (other) => other.requesterEmail === ticket.requesterEmail && other.id !== ticket.id
    ).length
  }
}

const CUSTOMER_STATUS: Record<TicketInboxStatus, DetailCustomerTicketStatus> = {
  New: 'open',
  Open: 'open',
  Pending: 'pending',
  'On hold': 'pending',
  Solved: 'solved'
}

const ticketsFrom = (customer: SupportCustomer) =>
  tickets.value.filter((ticket) => ticket.requesterEmail === customer.email)

export function customerTicketsOf(customer: SupportCustomer): DetailCustomerTicket[] {
  return ticketsFrom(customer)
    .map((ticket) => ({
      id: ticket.id,
      subject: ticket.subject,
      status: CUSTOMER_STATUS[ticket.status],
      priority: ticket.priority,
      dueAt: ticket.slaDueAt?.toISOString() ?? '',
      updatedAt: ticket.updatedAt.toISOString()
    }))
    .sort((a, b) => Number(a.status === 'solved') - Number(b.status === 'solved'))
}

function ticketEvents(customer: SupportCustomer, ticket: SupportTicket): DetailCustomerEvent[] {
  const opened = ticket.messages[0]
  const lastReply = ticket.messages
    .filter((message) => message.type === 'reply' && message.from === 'agent')
    .at(-1)
  const events: DetailCustomerEvent[] = [
    {
      id: `${ticket.id}-created`,
      type: 'created',
      title: `Opened ticket #${ticket.id}`,
      description: ticket.subject,
      actor: customer.name,
      at: (opened?.sentAt ?? ticket.updatedAt).toISOString()
    }
  ]
  if (lastReply)
    events.push({
      id: `${ticket.id}-replied`,
      type: 'replied',
      title: `Replied on ticket #${ticket.id}`,
      description: lastReply.body.split('\n')[0],
      actor: lastReply.author,
      at: lastReply.sentAt.toISOString()
    })
  if (ticket.status === 'Solved')
    events.push({
      id: `${ticket.id}-solved`,
      type: 'solved',
      title: `Ticket #${ticket.id} solved`,
      description: '',
      actor: ticket.assignee,
      at: ticket.updatedAt.toISOString()
    })
  return events
}

export function customerActivityOf(customer: SupportCustomer): DetailCustomerEvent[] {
  return ticketsFrom(customer)
    .flatMap((ticket) => ticketEvents(customer, ticket))
    .sort((a, b) => b.at.localeCompare(a.at))
}

export function satisfactionOf(customer: SupportCustomer): DetailCustomerSatisfaction {
  if (customer.name === sampleCustomerName) return sampleSatisfaction
  const surveys = ticketsFrom(customer).filter((ticket) => ticket.status === 'Solved').length
  return { average: surveys ? 4 : 0, surveys }
}

export function addCustomerNote(id: string, body: string) {
  customers.value = customers.value.map((customer) =>
    customer.id === id
      ? {
          ...customer,
          notes: [
            ...customer.notes,
            { id: nextId('note'), author: SUPPORT_AGENT, at: SUPPORT_NOW.toISOString(), body }
          ]
        }
      : customer
  )
}

const firstName = (name: string) => name.split(' ')[0] ?? name

export function responsesFor(ticket: SupportTicket): DetailTicketResponse[] {
  const values: Record<string, string> = {
    'ticket.id': ticket.id,
    'ticket.subject': ticket.subject,
    'ticket.status': ticket.status,
    'ticket.requester.name': ticket.requester,
    'ticket.requester.first_name': firstName(ticket.requester),
    'ticket.requester.email': ticket.requesterEmail,
    'agent.name': SUPPORT_AGENT,
    'agent.signature': `${SUPPORT_AGENT}\nAcme support`,
    'account.name': 'Acme Inc.'
  }
  return responses.value.map((response) => ({
    key: response.id,
    label: response.title,
    body: response.body.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, key: string) =>
      key in values ? values[key] : match
    )
  }))
}

export function createResponse(values: CannedResponsesValues): CannedResponsesResponse {
  const response: CannedResponsesResponse = {
    ...values,
    id: nextId('cr'),
    lastUsedAt: null,
    usageCount: 0
  }
  responses.value = [response, ...responses.value]
  return response
}

export function updateResponse(id: string, values: CannedResponsesValues) {
  responses.value = responses.value.map((response) =>
    response.id === id ? { ...response, ...values } : response
  )
}

export function duplicateResponse(id: string): CannedResponsesResponse | undefined {
  const source = responses.value.find((response) => response.id === id)
  if (!source) return undefined
  const copy: CannedResponsesResponse = {
    ...source,
    id: nextId('cr'),
    title: `${source.title} (copy)`,
    lastUsedAt: null,
    usageCount: 0
  }
  const index = responses.value.indexOf(source)
  responses.value = [
    ...responses.value.slice(0, index + 1),
    copy,
    ...responses.value.slice(index + 1)
  ]
  return copy
}

export function removeResponse(id: string) {
  responses.value = responses.value.filter((response) => response.id !== id)
}
