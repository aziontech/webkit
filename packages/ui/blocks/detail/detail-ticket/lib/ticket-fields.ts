import type { TagSeverity } from '@aziontech/webkit/tag'

import type {
  DetailTicketActivity,
  DetailTicketStatus,
  DetailTicketTicket,
  DetailTicketType
} from '../detail-ticket.vue'

export const TICKET_STATUSES: DetailTicketStatus[] = ['New', 'Open', 'Pending', 'On hold', 'Solved']

export const TICKET_TYPES: DetailTicketType[] = ['Question', 'Incident', 'Problem', 'Task']

export const statusSeverity: Record<DetailTicketStatus, TagSeverity> = {
  New: 'warning',
  Open: 'info',
  Pending: 'neutral',
  'On hold': 'neutral',
  Solved: 'success'
}

export const priorityOptions = [
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
  { value: 'none', label: 'No priority' }
] as const

export const slaPaused = (ticket: DetailTicketTicket) =>
  ticket.status === 'Pending' || ticket.status === 'On hold'

export const activityDays = (items: DetailTicketActivity[]) => {
  const days = new Map<string, DetailTicketActivity[]>()
  for (const item of items) days.set(item.day, [...(days.get(item.day) ?? []), item])
  return [...days].map(([label, entries]) => ({ label, items: entries }))
}
