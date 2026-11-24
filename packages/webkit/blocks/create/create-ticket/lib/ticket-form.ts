import type {
  CreateTicketChannel,
  CreateTicketContact,
  CreateTicketPriority,
  CreateTicketType
} from '../create-ticket.vue'

export type TicketFormField =
  'requester' | 'contactName' | 'contactEmail' | 'cc' | 'subject' | 'description'

export interface TicketFormDraft {
  requesterEmail: string
  contactName: string
  contactEmail: string
  subject: string
  description: string
  channel: CreateTicketChannel | ''
  type: CreateTicketType | ''
  priority: CreateTicketPriority | ''
  groupId: string
  assigneeId: string
  tags: string[]
  cc: string[]
}

export const channelOptions: { value: CreateTicketChannel; icon: string }[] = [
  { value: 'Email', icon: 'az az-mail' },
  { value: 'Chat', icon: 'az az-comment' },
  { value: 'Web form', icon: 'az az-globe' },
  { value: 'Phone', icon: 'az az-phone' }
]

export const typeOptions: CreateTicketType[] = ['Question', 'Incident', 'Problem', 'Task']

export const priorityOptions: CreateTicketPriority[] = ['urgent', 'high', 'medium', 'low']

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const isEmail = (value: string) => EMAIL.test(value.trim())

export const contactOf = (name: string, email: string): CreateTicketContact => ({
  id: '',
  name: name.trim(),
  email: email.trim()
})

export const emptyDraft = (): TicketFormDraft => ({
  requesterEmail: '',
  contactName: '',
  contactEmail: '',
  subject: '',
  description: '',
  channel: '',
  type: '',
  priority: '',
  groupId: '',
  assigneeId: '',
  tags: [],
  cc: []
})

export function ticketErrors(
  draft: TicketFormDraft,
  newContact: boolean
): Record<TicketFormField, string> {
  const badCc = draft.cc.find((address) => !isEmail(address))
  return {
    requester:
      !newContact && !draft.requesterEmail
        ? 'Select the customer who asked, or add a new contact.'
        : '',
    contactName: newContact && !draft.contactName.trim() ? 'Enter the contact’s name.' : '',
    contactEmail: !newContact
      ? ''
      : !draft.contactEmail.trim()
        ? 'Enter the contact’s email address.'
        : isEmail(draft.contactEmail)
          ? ''
          : 'Enter an email address such as name@example.com.',
    cc: badCc ? `${badCc} is not an email address. Fix it or remove it.` : '',
    subject: draft.subject.trim() ? '' : 'Enter a subject.',
    description: draft.description.trim() ? '' : 'Describe what the customer needs.'
  }
}
