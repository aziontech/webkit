import type {
  DetailTicketActivity,
  DetailTicketAgent,
  DetailTicketMessage,
  DetailTicketRequester,
  DetailTicketResponse,
  DetailTicketTicket
} from './detail-ticket.vue'

const MINUTE = 60_000
const HOUR = 60 * MINUTE

export const sampleNow = new Date(Date.UTC(2026, 10, 10, 12))
const ago = (ms: number) => new Date(sampleNow.getTime() - ms)
const ahead = (ms: number) => new Date(sampleNow.getTime() + ms)

export const sampleAgents: DetailTicketAgent[] = [
  { name: 'Jane Doe', handle: 'jane.doe', email: 'jane.doe@example.com', presence: 'online' },
  { name: 'John Smith', handle: 'john.smith', email: 'john.smith@example.com', presence: 'away' },
  {
    name: 'Priya Patel',
    handle: 'priya.patel',
    email: 'priya.patel@example.com',
    presence: 'busy'
  },
  { name: 'Sam Lee', handle: 'sam.lee', email: 'sam.lee@example.com', presence: 'online' }
]

export const sampleViewers: DetailTicketAgent[] = sampleAgents.filter(
  (agent) => agent.name === 'Sam Lee'
)

export const sampleTicket: DetailTicketTicket = {
  id: '4812',
  subject: 'Custom domain returns a certificate error',
  status: 'Open',
  priority: 'urgent',
  type: 'Incident',
  group: 'Technical',
  assignee: 'Jane Doe',
  tags: ['certificates', 'domains'],
  slaLabel: 'Next reply',
  slaDueAt: ahead(25 * MINUTE)
}

export const sampleRequester: DetailTicketRequester = {
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  organization: 'Acme Inc.',
  otherTickets: 4
}

const customer = { author: 'Alex Morgan', from: 'customer' as const }
const jane = { author: 'Jane Doe', from: 'agent' as const }
const reply = { type: 'reply' as const, quoted: '', attachments: [] }
const toSupport = { to: ['support@example.com'], cc: [] }
const toAlex = { to: ['alex.morgan@example.com'], cc: [] }
const event = (id: string, body: string, sentAt: Date): DetailTicketMessage => ({
  id,
  type: 'event',
  author: '',
  from: 'agent',
  channel: '',
  sentAt,
  to: [],
  cc: [],
  body,
  quoted: '',
  attachments: []
})

export const sampleMessages: DetailTicketMessage[] = [
  {
    ...reply,
    ...customer,
    ...toSupport,
    id: 'm1',
    channel: 'email',
    sentAt: ago(26 * HOUR),
    cc: ['sam.lee@example.com'],
    body: 'Since this morning shop.example.com shows a certificate error in every browser. The certificate looks expired, but it should renew on its own.\n\nThe screenshot from Chrome is attached.',
    attachments: [{ name: 'certificate-error.png', size: 248_000 }]
  },
  event('m2', 'Jane Doe assigned the ticket to herself', ago(25 * HOUR)),
  {
    ...reply,
    ...jane,
    ...toAlex,
    id: 'm3',
    channel: 'email',
    sentAt: ago(24 * HOUR),
    body: 'Thanks, Alex. I can see the certificate for shop.example.com expired yesterday. Can you confirm the domain still points to Acme through the CNAME record?',
    quoted:
      'On Nov 9, Alex Morgan wrote: Since this morning shop.example.com shows a certificate error in every browser.'
  },
  {
    ...reply,
    ...customer,
    ...toSupport,
    id: 'm4',
    channel: 'email',
    sentAt: ago(22 * HOUR),
    body: 'Yes, the CNAME still points to acme-store.example.net. Nothing changed on our side.'
  },
  {
    ...reply,
    ...jane,
    id: 'm5',
    type: 'note',
    channel: '',
    to: [],
    cc: [],
    sentAt: ago(21 * HOUR),
    body: 'The renewal failed because the DNS check timed out. @sam.lee can you look at the validation logs for this zone?'
  },
  event('m6', 'Jane Doe changed the status to Pending', ago(21 * HOUR)),
  {
    ...reply,
    ...customer,
    ...toSupport,
    id: 'm7',
    channel: 'email',
    sentAt: ago(3 * HOUR),
    body: 'Any update? Customers are still seeing the warning at checkout.'
  },
  event('m8', 'The status changed to Open when Alex Morgan replied', ago(3 * HOUR)),
  {
    ...reply,
    author: 'Sam Lee',
    from: 'agent',
    id: 'm9',
    type: 'note',
    channel: '',
    to: [],
    cc: [],
    sentAt: ago(2 * HOUR),
    body: 'Validation retried and passed. The new certificate is issued and should reach every edge location within the hour.'
  },
  {
    ...reply,
    ...customer,
    ...toSupport,
    id: 'm10',
    channel: 'email',
    sentAt: ago(40 * MINUTE),
    body: 'It works in Chrome now, but Safari still shows the old certificate. Is that expected?'
  }
]

export const sampleActivity: DetailTicketActivity[] = [
  {
    id: 'a1',
    day: 'Today',
    title: 'Next reply due in 25 minutes',
    actor: 'SLA policy',
    time: ago(40 * MINUTE),
    severity: 'warning',
    icon: 'az az-clock'
  },
  {
    id: 'a2',
    day: 'Today',
    title: 'Status changed to Open',
    actor: 'Alex Morgan',
    time: ago(3 * HOUR),
    severity: 'info',
    icon: ''
  },
  {
    id: 'a3',
    day: 'Yesterday',
    title: 'Status changed to Pending',
    actor: 'Jane Doe',
    time: ago(21 * HOUR),
    severity: 'neutral',
    icon: ''
  },
  {
    id: 'a4',
    day: 'Yesterday',
    title: 'Priority set to Urgent',
    actor: 'Jane Doe',
    time: ago(25 * HOUR),
    severity: 'danger',
    icon: ''
  },
  {
    id: 'a5',
    day: 'Yesterday',
    title: 'Assigned to Jane Doe',
    actor: 'Jane Doe',
    time: ago(25 * HOUR),
    severity: 'neutral',
    icon: 'az az-user'
  },
  {
    id: 'a6',
    day: 'Yesterday',
    title: 'Ticket created by email',
    actor: 'Alex Morgan',
    time: ago(26 * HOUR),
    severity: 'neutral',
    icon: 'az az-mail'
  }
]

export const sampleResponses: DetailTicketResponse[] = [
  {
    key: 'certificate-renewed',
    label: 'Certificate renewed',
    body: 'The certificate for your domain was renewed. Browsers may keep the old one for a few minutes; a hard refresh picks up the new one.'
  },
  {
    key: 'need-details',
    label: 'Ask for details',
    body: 'Could you send the full URL, the time it happened and a screenshot of the error?'
  },
  {
    key: 'closing',
    label: 'Closing the ticket',
    body: 'I will mark this ticket as solved. Reply to this email if anything comes up and it reopens.'
  }
]

export const sampleGroups = ['Accounts', 'Billing', 'Technical']

export const sampleTagOptions = ['certificates', 'cache', 'dns', 'domains', 'firewall', 'invoice']
