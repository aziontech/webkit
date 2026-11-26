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
  { id: 'updatedAt', visible: false },
  { id: 'group', visible: false },
  { id: 'channel', visible: false }
]
