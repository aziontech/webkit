import type { AccountHierarchyResource, AccountHierarchyRoleBinding } from './account-hierarchy.vue'

export const sampleResources: AccountHierarchyResource[] = [
  {
    id: 'org-1001',
    name: 'Acme Inc.',
    type: 'organization',
    parentId: null,
    labels: ['primary']
  },
  { id: 'org-1002', name: 'Acme Partners', type: 'organization', parentId: null },
  { id: 'grp-2101', name: 'Retail and marketplace', type: 'group', parentId: 'org-1001' },
  { id: 'grp-2102', name: 'Digital services', type: 'group', parentId: 'org-1001' },
  { id: 'grp-2201', name: 'Resellers', type: 'group', parentId: 'org-1002' },
  {
    id: 'ws-30418',
    name: 'Storefront',
    type: 'workspace',
    parentId: 'grp-2101',
    lastAccessed: '2026-11-10T10:00:00Z',
    status: 'Active',
    charges: 1284,
    labels: ['retail', 'production']
  },
  {
    id: 'ws-30422',
    name: 'Checkout',
    type: 'workspace',
    parentId: 'grp-2101',
    lastAccessed: 'Yesterday',
    status: 'Active',
    charges: 612.4,
    labels: ['production']
  },
  {
    id: 'ws-30437',
    name: 'Loyalty program',
    type: 'workspace',
    parentId: 'grp-2101',
    lastAccessed: '2026-11-07T12:00:00Z',
    status: 'Pending',
    charges: 42.1
  },
  {
    id: 'ws-30455',
    name: 'Media library',
    type: 'workspace',
    parentId: 'grp-2102',
    lastAccessed: '2026-11-03T12:00:00Z',
    status: 'Active',
    charges: 3910.75,
    labels: ['media']
  },
  {
    id: 'ws-30461',
    name: 'Status page',
    type: 'workspace',
    parentId: 'grp-2102',
    status: 'Suspended',
    labels: ['staging']
  },
  {
    id: 'ws-30470',
    name: 'Partner portal',
    type: 'workspace',
    parentId: 'grp-2201',
    lastAccessed: '2026-10-11T12:00:00Z',
    status: 'Active',
    charges: 220
  }
]

export const sampleCurrentId = 'ws-30418'

export const sampleRoleBindings: AccountHierarchyRoleBinding[] = [
  { role: 'Owner', members: 2 },
  { role: 'Editor', members: 5 },
  { role: 'Viewer', members: 11 }
]
