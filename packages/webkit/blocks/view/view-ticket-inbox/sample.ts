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
