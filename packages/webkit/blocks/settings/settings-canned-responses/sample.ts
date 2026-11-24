import type {
  CannedResponsesPlaceholder,
  CannedResponsesResponse
} from './settings-canned-responses.vue'

const DAY = 86_400_000
const referenceTime = Date.UTC(2026, 10, 10, 12)
const daysFrom = (days: number) => new Date(referenceTime + days * DAY)

export const sampleNow = new Date(referenceTime)

export const sampleResponses: CannedResponsesResponse[] = [
  {
    id: 'cr-welcome',
    title: 'Welcome and first reply',
    folder: 'Getting started',
    visibility: 'everyone',
    body: 'Hi {{ticket.requester.first_name}},\n\nThanks for contacting Acme support. We received your request **#{{ticket.id}}** and an agent will reply within one business day.\n\n{{agent.signature}}',
    status: 'Open',
    lastUsedAt: daysFrom(-0.05),
    usageCount: 412
  },
  {
    id: 'cr-request-id',
    title: 'Ask for the request ID',
    folder: 'Troubleshooting',
    visibility: 'team',
    body: 'Hi {{ticket.requester.first_name}},\n\nTo trace the failing call, send us the value of the `x-request-id` response header and the time it happened, in UTC.\n\n{{agent.signature}}',
    status: 'Pending',
    lastUsedAt: daysFrom(-0.4),
    usageCount: 188
  },
  {
    id: 'cr-certificate',
    title: 'Certificate is still being issued',
    folder: 'Domains',
    visibility: 'everyone',
    body: 'Hi {{ticket.requester.first_name}},\n\nThe certificate for your domain is still being issued. This usually takes up to 30 minutes after the DNS records point to us.\n\n{{agent.signature}}',
    status: null,
    lastUsedAt: daysFrom(-2),
    usageCount: 96
  },
  {
    id: 'cr-refund',
    title: 'Refund confirmed',
    folder: 'Billing',
    visibility: 'team',
    body: 'Hi {{ticket.requester.first_name}},\n\nWe refunded the last invoice of {{account.name}}. The amount reaches your card in 5 to 10 business days.\n\n{{agent.signature}}',
    status: 'Solved',
    lastUsedAt: daysFrom(-6),
    usageCount: 41
  },
  {
    id: 'cr-escalated',
    title: 'Escalated to engineering',
    folder: 'Troubleshooting',
    visibility: 'team',
    body: 'Hi {{ticket.requester.first_name}},\n\nWe passed **{{ticket.subject}}** to our engineering team. We will update this ticket as soon as we hear back.\n\n{{agent.signature}}',
    status: 'On hold',
    lastUsedAt: daysFrom(-11),
    usageCount: 27
  },
  {
    id: 'cr-sign-off',
    title: 'Short sign-off',
    folder: '',
    visibility: 'personal',
    body: 'Let me know if there is anything else I can help with.\n\n{{agent.name}}',
    status: null,
    lastUsedAt: null,
    usageCount: 0
  }
]

export const samplePlaceholders: CannedResponsesPlaceholder[] = [
  { value: 'ticket.id', label: 'Ticket number', group: 'Ticket' },
  { value: 'ticket.subject', label: 'Ticket subject', group: 'Ticket' },
  { value: 'ticket.status', label: 'Ticket status', group: 'Ticket' },
  { value: 'ticket.requester.name', label: 'Requester name', group: 'Requester' },
  { value: 'ticket.requester.first_name', label: 'Requester first name', group: 'Requester' },
  { value: 'ticket.requester.email', label: 'Requester email', group: 'Requester' },
  { value: 'agent.name', label: 'Agent name', group: 'Agent' },
  { value: 'agent.signature', label: 'Agent signature', group: 'Agent' },
  { value: 'account.name', label: 'Account name', group: 'Account' }
]
