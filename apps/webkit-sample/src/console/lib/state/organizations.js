import { computed, ref } from 'vue'

import { azionPlans } from '../data/plans.js'
import { useSampleMode } from './sample-mode.js'
import { presetPlanName } from './sample-preset.js'

const { accountEmpty } = useSampleMode()

export const orgAccents = [
  {
    value: 'orange',
    label: 'Orange',
    colors: ['var(--color-orange-200)', 'var(--color-orange-700)', 'var(--color-yellow-400)']
  },
  {
    value: 'yellow',
    label: 'Yellow',
    colors: ['var(--color-yellow-200)', 'var(--color-orange-600)', 'var(--color-yellow-600)']
  },
  {
    value: 'red',
    label: 'Red',
    colors: ['var(--color-red-200)', 'var(--color-red-700)', 'var(--color-orange-500)']
  },
  {
    value: 'green',
    label: 'Green',
    colors: ['var(--color-green-200)', 'var(--color-green-700)', 'var(--color-blue-500)']
  },
  {
    value: 'blue',
    label: 'Blue',
    colors: ['var(--color-blue-200)', 'var(--color-blue-700)', 'var(--color-violet-500)']
  },
  {
    value: 'violet',
    label: 'Violet',
    colors: ['var(--color-violet-200)', 'var(--color-violet-700)', 'var(--color-blue-500)']
  },
  {
    value: 'gray',
    label: 'Gray',
    colors: ['var(--color-gray-200)', 'var(--color-gray-700)', 'var(--color-slate-500)']
  }
]

export const accentOf = (value) =>
  orgAccents.find((accent) => accent.value === value) ?? orgAccents[0]

export const orgStatuses = [
  {
    value: 'active',
    label: 'Active',
    severity: 'success',
    services: true,
    access: "Full access, according to each user's roles."
  },
  {
    value: 'default_suspense',
    label: 'Payment pending',
    severity: 'warning',
    services: true,
    access: 'Services keep running; users reach only support and payments.'
  },
  {
    value: 'default_block',
    label: 'Payment blocked',
    severity: 'danger',
    services: false,
    access: 'Services are off the air; users reach only support and payments.'
  },
  {
    value: 'abuse_block',
    label: 'Abuse block',
    severity: 'danger',
    services: false,
    access: 'Suspended for policy violations; users reach only support.'
  },
  {
    value: 'temporary_suspense',
    label: 'Temporarily suspended',
    severity: 'warning',
    services: true,
    access: 'Administrative or security hold; users reach only support.'
  },
  {
    value: 'canceled',
    label: 'Canceled',
    severity: 'secondary',
    services: false,
    access: 'The account is closed; users have no access.'
  }
]

export const statusOf = (value) =>
  orgStatuses.find((status) => status.value === value) ?? orgStatuses[0]

export const additionalDataKeys = [
  {
    key: 'company_size',
    label: 'Company size',
    values: [
      { value: '1-10', label: '1–10 people' },
      { value: '11-50', label: '11–50 people' },
      { value: '51-200', label: '51–200 people' },
      { value: '201-1000', label: '201–1,000 people' },
      { value: '1000+', label: 'More than 1,000 people' }
    ]
  },
  {
    key: 'industry',
    label: 'Industry',
    values: [
      { value: 'ecommerce', label: 'Ecommerce & Retail' },
      { value: 'financial_services', label: 'Financial Services' },
      { value: 'media', label: 'Media & Streaming' },
      { value: 'saas', label: 'SaaS & Technology' },
      { value: 'gaming', label: 'Gaming' },
      { value: 'public_sector', label: 'Public Sector' },
      { value: 'other', label: 'Other' }
    ]
  }
]

export const DEFAULT_WORKSPACE_NAME = 'My Workspace'

const seedOrganizations = [
  {
    id: 'azion',
    name: 'Azion',
    accent: 'orange',
    plan: 'Enterprise',
    accounts: 12,
    status: 'active'
  },
  { id: 'nebula', name: 'Nebula Labs', accent: 'blue', plan: 'Pro', accounts: 4, status: 'active' },
  {
    id: 'northwind',
    name: 'Northwind Retail',
    accent: 'yellow',
    plan: 'Pro',
    accounts: 7,
    status: 'active'
  }
]

export const FIRST_ORGANIZATION_ID = 'azion'

const allOrganizations = ref(seedOrganizations)
const currentOrganizationId = ref(FIRST_ORGANIZATION_ID)

const organizations = computed(() => {
  if (!accountEmpty.value) return allOrganizations.value
  const [first] = allOrganizations.value
  return first ? [{ ...first, accounts: 1, plan: presetPlanName() }] : []
})

const currentOrganization = computed(
  () =>
    organizations.value.find((org) => org.id === currentOrganizationId.value) ??
    organizations.value[0]
)

const switchOrganization = (organization) => {
  const changed = organization.id !== currentOrganizationId.value
  currentOrganizationId.value = organization.id
  return changed
}

const idFor = (name) => {
  const base =
    String(name ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'organization'
  if (!allOrganizations.value.some((org) => org.id === base)) return base
  let suffix = 2
  while (allOrganizations.value.some((org) => org.id === `${base}-${suffix}`)) suffix += 1
  return `${base}-${suffix}`
}

export const createOrganization = ({
  name,
  accent = orgAccents[0].value,
  workspace = DEFAULT_WORKSPACE_NAME,
  plan = azionPlans[0].name,
  additionalData = {},
  owner = {}
}) => {
  const id = idFor(name)
  const organization = {
    id,
    name: String(name ?? '').trim(),
    accent,
    plan,
    accounts: 1,
    status: 'active',
    groups: [],
    workspaces: [{ id: `${id}-primary`, name: String(workspace ?? '').trim(), workloads: 0 }],
    additionalData: { ...additionalData },
    owner: { ...owner, role: 'owner', organizationUser: true }
  }
  allOrganizations.value = [organization, ...allOrganizations.value]
  currentOrganizationId.value = organization.id
  return organization
}

export function useOrganizations() {
  return { organizations, currentOrganization, currentOrganizationId, switchOrganization }
}
