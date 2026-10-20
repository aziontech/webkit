import { computed, ref } from 'vue'

import { useSampleMode } from './sample-mode.js'

const { accountEmpty } = useSampleMode()

export const accountTypes = [
  {
    value: 'organizations',
    label: 'Organizations',
    singular: 'organization',
    typeLabel: 'Organization',
    icon: 'pi pi-building',
    severity: 'accent'
  },
  {
    value: 'groups',
    label: 'Groups',
    singular: 'group',
    typeLabel: 'Group',
    icon: 'pi pi-users',
    severity: 'info'
  },
  {
    value: 'workspaces',
    label: 'Workspaces',
    singular: 'workspace',
    typeLabel: 'Workspace',
    icon: 'pi pi-th-large',
    severity: 'secondary'
  }
]

export const accountTypeOf = (type) =>
  accountTypes.find((entry) => entry.singular === type) ?? accountTypes[2]

export const accountInitials = (name) => {
  const words = String(name ?? '')
    .trim()
    .split(/\s+/)
    .filter((word) => /^[\p{L}\p{N}]/u.test(word))
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase()
  return (words[0] ?? '').slice(0, 2).toUpperCase()
}

export const BOOT_ACCOUNT_ID = 28836

const seedAccounts = [
  {
    id: 1,
    name: 'Azion',
    clientId: '0001b',
    type: 'organization',
    parentId: null,
    labels: ['primary']
  },
  { id: 812, name: 'Nebula Partners', clientId: '0204c', type: 'organization', parentId: null },

  { id: 9032, name: 'Retail & Marketplace', clientId: '4500p', type: 'group', parentId: 1 },
  { id: 9088, name: 'Digital Commerce', clientId: '4710q', type: 'group', parentId: 1 },
  { id: 9140, name: 'Enterprise Accounts', clientId: '4881r', type: 'group', parentId: 1 },

  {
    id: 6,
    name: 'Magalu',
    clientId: '0001a',
    type: 'workspace',
    parentId: 9032,
    lastAccessed: '2 hours ago',
    status: 'active',
    charges: '1,284.00',
    labels: ['retail', 'prod']
  },
  {
    id: 33024,
    name: 'Madeira Madeira',
    clientId: '1860h',
    type: 'workspace',
    parentId: 9032,
    lastAccessed: 'Yesterday',
    status: 'active',
    charges: '612.40'
  },
  {
    id: 29025,
    name: 'Tray',
    clientId: '4797u',
    type: 'workspace',
    parentId: 9088,
    lastAccessed: '3 days ago',
    status: 'active',
    charges: '42.10'
  },
  { id: 5791, name: 'LWSA', clientId: '4151o', type: 'workspace', parentId: 9088, status: 'active' },
  {
    id: 31204,
    name: 'iFood',
    clientId: '4206r',
    type: 'workspace',
    parentId: 9140,
    lastAccessed: '1 week ago',
    status: 'active',
    labels: ['delivery']
  },
  {
    id: BOOT_ACCOUNT_ID,
    name: 'Caixa Econômica Federal',
    clientId: '3493x',
    type: 'workspace',
    parentId: 9140,
    lastAccessed: '1 month ago',
    status: 'active',
    charges: '3,910.75'
  },

  { id: 21447, name: 'GPA', clientId: '2298k', type: 'workspace', parentId: 9032, status: 'active' },
  {
    id: 18932,
    name: 'Renner',
    clientId: '3120m',
    type: 'workspace',
    parentId: 9032,
    status: 'active'
  },
  {
    id: 40118,
    name: 'HeroSpark',
    clientId: '4880t',
    type: 'workspace',
    parentId: 9088,
    status: 'active'
  },
  { id: 12903, name: 'Itaú', clientId: '1075n', type: 'workspace', parentId: 9140, status: 'active' }
]

const allAccounts = ref(seedAccounts)
const currentAccountId = ref(BOOT_ACCOUNT_ID)

const accounts = computed(() => {
  if (!accountEmpty.value) return allAccounts.value
  const own =
    allAccounts.value.find((account) => account.id === BOOT_ACCOUNT_ID) ?? allAccounts.value[0]
  return own ? [{ ...own, parentId: null }] : []
})

const currentAccount = computed(
  () => accounts.value.find((account) => account.id === currentAccountId.value) ?? accounts.value[0]
)

const switchAccount = (account) => {
  const changed = account.id !== currentAccountId.value
  currentAccountId.value = account.id
  return changed
}

export const accountChildren = (parentId) =>
  accounts.value.filter((account) => (account.parentId ?? null) === parentId)

export function accountTreeRows(list, { expandedIds = new Set(), search = '' } = {}) {
  const needle = String(search).trim().toLowerCase()
  const ids = new Set(list.map((account) => account.id))

  const childrenOf = new Map()
  for (const account of list) {
    const parent = account.parentId != null && ids.has(account.parentId) ? account.parentId : null
    if (!childrenOf.has(parent)) childrenOf.set(parent, [])
    childrenOf.get(parent).push(account)
  }

  const matches = (account) =>
    !needle ||
    `${account.name} ${account.id} ${account.clientId}`.toLowerCase().includes(needle)

  const walk = (parentId, depth) => {
    const out = []
    for (const account of childrenOf.get(parentId) ?? []) {
      const children = childrenOf.get(account.id) ?? []
      const subtree = walk(account.id, depth + 1)
      if (needle && !matches(account) && subtree.length === 0) continue

      const type = accountTypeOf(account.type)
      const expanded = needle ? true : expandedIds.has(account.id)
      out.push({
        ...account,
        depth,
        hasChildren: children.length > 0,
        expanded,
        typeLabel: type.typeLabel,
        icon: type.icon
      })
      if (expanded) out.push(...subtree)
    }
    return out
  }

  return walk(null, 0)
}

export const expandableAccountIds = (list) => {
  const parents = new Set()
  for (const account of list) {
    if (account.parentId != null) parents.add(account.parentId)
  }
  return parents
}

export function flattenTree(expandedIds) {
  return accountTreeRows(accounts.value, { expandedIds })
}

const ROSTER_LATENCY_MS = 420

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function listAccountTree() {
  await wait(ROSTER_LATENCY_MS)
  return { results: accounts.value.map((account) => ({ ...account })) }
}

export function useAccounts() {
  return { accounts, currentAccount, currentAccountId, switchAccount }
}
