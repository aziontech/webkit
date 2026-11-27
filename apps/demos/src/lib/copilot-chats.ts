import type {
  ConversationHistoryItem,
  ConversationHistoryProject
} from '@aziontech/ui/conversation-history'
import { ref } from 'vue'

export const copilotHistoryNow = '2026-11-19T12:00:00Z'

const projects: ConversationHistoryProject[] = [
  { id: 'storefront', title: 'storefront' },
  { id: 'docs-site', title: 'docs-site' },
  { id: 'security-review', title: 'Security review' }
]

const history: ConversationHistoryItem[] = [
  {
    id: 'h1',
    title: 'Why does storefront return 502 errors?',
    updatedAt: '2026-11-19T11:02:00Z',
    projectId: 'storefront',
    tag: 'Bug',
    description: 'fix/checkout-timeout'
  },
  {
    id: 'h2',
    title: 'Purge the cache after a deploy',
    updatedAt: '2026-11-19T09:40:00Z',
    pinned: true
  },
  {
    id: 'h3',
    title: 'A WAF rule for login attempts',
    updatedAt: '2026-11-18T17:15:00Z',
    projectId: 'security-review',
    status: 'error'
  },
  {
    id: 'h4',
    title: 'Top orders query for acme-store',
    updatedAt: '2026-11-16T10:20:00Z',
    projectId: 'storefront',
    description: 'acme-store',
    status: 'success'
  },
  { id: 'h5', title: 'Move DNS records to Azion', updatedAt: '2026-11-04T14:05:00Z' },
  {
    id: 'h6',
    title: 'Image optimization for docs-site',
    updatedAt: '2026-09-28T08:30:00Z',
    projectId: 'docs-site'
  },
  { id: 'h7', title: 'Set up a custom domain', updatedAt: '2026-11-12T15:30:00Z' },
  {
    id: 'h8',
    title: 'Migrate acme-store to the new runtime',
    updatedAt: '2026-11-19T11:50:00Z',
    status: 'running',
    description: 'feat/runtime-upgrade'
  },
  {
    id: 'h9',
    title: 'Write the cache tests',
    updatedAt: '2026-11-19T11:40:00Z',
    status: 'running',
    description: 'test/cache'
  },
  {
    id: 'h10',
    title: 'Draft the docs-site navigation',
    updatedAt: '2026-11-02T09:30:00Z',
    archived: true
  }
]

export const copilotChats = ref<ConversationHistoryItem[]>(history.map((item) => ({ ...item })))

export const copilotProjects = ref<ConversationHistoryProject[]>(
  projects.map((project) => ({ ...project }))
)

export const copilotOpenKeys = ref<string[]>(['storefront'])
