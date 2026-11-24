import type {
  CreateTicketAgent,
  CreateTicketContact,
  CreateTicketGroup,
  CreateTicketValues
} from './create-ticket.vue'

export const sampleContacts: CreateTicketContact[] = [
  { id: 'contact-alex-morgan', name: 'Alex Morgan', email: 'alex.morgan@example.com' },
  { id: 'contact-chris-taylor', name: 'Chris Taylor', email: 'chris.taylor@example.com' },
  { id: 'contact-morgan-lee', name: 'Morgan Lee', email: 'morgan.lee@example.com' },
  { id: 'contact-taylor-kim', name: 'Taylor Kim', email: 'taylor.kim@example.com' },
  { id: 'contact-jordan-rivera', name: 'Jordan Rivera', email: 'jordan.rivera@example.org' },
  { id: 'contact-casey-brooks', name: 'Casey Brooks', email: 'casey.brooks@example.net' }
]

export const sampleGroups: CreateTicketGroup[] = [
  { id: 'technical', name: 'Technical' },
  { id: 'billing', name: 'Billing' },
  { id: 'accounts', name: 'Accounts' }
]

export const sampleAgents: CreateTicketAgent[] = [
  {
    id: 'agent-jane-doe',
    name: 'Jane Doe',
    presence: 'online',
    groupIds: ['technical', 'accounts']
  },
  { id: 'agent-john-smith', name: 'John Smith', presence: 'away', groupIds: ['technical'] },
  { id: 'agent-priya-patel', name: 'Priya Patel', presence: 'busy', groupIds: ['billing'] },
  { id: 'agent-sam-lee', name: 'Sam Lee', presence: 'offline', groupIds: ['billing', 'accounts'] }
]

export const sampleTagOptions: string[] = [
  'certificates',
  'domains',
  'cache',
  'invoice',
  'access',
  'functions',
  'firewall'
]

export const sampleValues: Partial<CreateTicketValues> = {
  requester: sampleContacts[0],
  subject: 'Custom domain returns a certificate error',
  description:
    'Alex called about **shop.example.com**: browsers show a certificate warning since this morning. The certificate was renewed yesterday.',
  channel: 'Phone',
  type: 'Incident',
  priority: 'high',
  groupId: 'technical',
  assigneeId: 'agent-jane-doe',
  tags: ['certificates', 'domains'],
  cc: ['morgan.lee@example.com']
}

export const sampleCreated = { id: '4840', subject: 'Custom domain returns a certificate error' }
