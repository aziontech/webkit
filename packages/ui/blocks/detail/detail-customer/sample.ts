import type {
  DetailCustomerCustomer,
  DetailCustomerEvent,
  DetailCustomerNote,
  DetailCustomerSatisfaction,
  DetailCustomerTicket
} from './detail-customer.vue'

export const sampleNow = '2026-11-24T14:45:00Z'

export const sampleCustomer: DetailCustomerCustomer = {
  id: 'cus_1042',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  phone: '+1 555-0142',
  timeZone: 'America/New_York',
  language: 'English (United States)',
  organization: 'Acme Inc.',
  organizationHref: '/organizations/acme',
  tags: ['enterprise', 'billing', 'priority-support'],
  customerSince: '2024-03-12T15:00:00Z',
  avatarSrc: ''
}

export const sampleSatisfaction: DetailCustomerSatisfaction = {
  average: 4.5,
  surveys: 12
}

export const sampleTickets: DetailCustomerTicket[] = [
  {
    id: '4812',
    subject: 'Custom domain returns a certificate error',
    status: 'open',
    priority: 'urgent',
    dueAt: '2026-11-24T15:30:00Z',
    updatedAt: '2026-11-24T13:52:00Z'
  },
  {
    id: '4790',
    subject: 'Invoice shows the wrong billing address',
    status: 'pending',
    priority: 'medium',
    dueAt: '2026-11-25T18:00:00Z',
    updatedAt: '2026-11-23T16:10:00Z'
  },
  {
    id: '4755',
    subject: 'Add a teammate to the Acme account',
    status: 'solved',
    priority: 'low',
    dueAt: '',
    updatedAt: '2026-11-20T11:05:00Z'
  },
  {
    id: '4701',
    subject: 'Cache purge does not reach every location',
    status: 'closed',
    priority: 'high',
    dueAt: '',
    updatedAt: '2026-11-12T09:40:00Z'
  }
]

export const sampleActivity: DetailCustomerEvent[] = [
  {
    id: 'evt_6',
    type: 'created',
    title: 'Opened ticket #4812',
    description: 'Custom domain returns a certificate error',
    actor: 'Jane Doe',
    at: '2026-11-24T13:40:00Z'
  },
  {
    id: 'evt_5',
    type: 'replied',
    title: 'Replied on ticket #4790',
    description: 'Sent the corrected billing address.',
    actor: 'Jane Doe',
    at: '2026-11-23T16:10:00Z'
  },
  {
    id: 'evt_4',
    type: 'merged',
    title: 'Ticket #4793 merged into #4790',
    description: 'Both tickets asked about the same invoice.',
    actor: 'Sam Lee',
    at: '2026-11-23T15:20:00Z'
  },
  {
    id: 'evt_3',
    type: 'rated',
    title: 'Rated ticket #4755 with 5 out of 5',
    description: 'Quick and clear, thank you.',
    actor: 'Jane Doe',
    at: '2026-11-20T12:30:00Z'
  },
  {
    id: 'evt_2',
    type: 'solved',
    title: 'Ticket #4755 solved',
    description: '',
    actor: 'Priya Patel',
    at: '2026-11-20T11:05:00Z'
  }
]

export const sampleNotes: DetailCustomerNote[] = [
  {
    id: 'note_1',
    author: 'Priya Patel',
    at: '2026-11-02T14:00:00Z',
    body: 'Prefers email over phone. Available 9 AM to 5 PM Eastern.'
  },
  {
    id: 'note_2',
    author: 'Sam Lee',
    at: '2026-11-23T15:25:00Z',
    body: 'Jane is the billing contact for Acme. Send invoice questions to her, not the account owner.'
  }
]

export const sampleNewCustomer: DetailCustomerCustomer = {
  id: 'cus_1187',
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  phone: '',
  timeZone: 'America/Los_Angeles',
  language: 'English (United States)',
  organization: 'Acme Inc.',
  organizationHref: '/organizations/acme',
  tags: [],
  customerSince: '2026-11-24T09:30:00Z',
  avatarSrc: ''
}

export const sampleNewCustomerActivity: DetailCustomerEvent[] = [
  {
    id: 'evt_1',
    type: 'joined',
    title: 'Customer created',
    description: 'Added from the Acme Inc. organization.',
    actor: 'Sam Lee',
    at: '2026-11-24T09:30:00Z'
  }
]
