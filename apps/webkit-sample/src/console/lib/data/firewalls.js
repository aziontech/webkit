import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt, emailOf } from '@shared/lib/people'

import { createdRowsFor } from '../state/created-resources'

export const FIREWALL_MODULES = {
  ddos: 'DDoS Protection',
  waf: 'WAF',
  'network-shield': 'Network Shield',
  'bot-manager': 'Bot Manager',
  functions: 'Functions'
}

export const firewallModuleLabel = (id) => FIREWALL_MODULES[id] ?? id

export const FIREWALL_MODULE_FIELDS = [
  {
    key: 'ddos',
    title: FIREWALL_MODULES.ddos,
    description: 'Absorbs volumetric attacks at the network layer.',
    locked: true
  },
  {
    key: 'waf',
    title: FIREWALL_MODULES.waf,
    description: 'Inspects each request and blocks the OWASP Top 10 attack classes.'
  },
  {
    key: 'network-shield',
    title: FIREWALL_MODULES['network-shield'],
    description: 'Blocks traffic by country, ASN or IP range using network lists.'
  },
  {
    key: 'bot-manager',
    title: FIREWALL_MODULES['bot-manager'],
    description: 'Scores automated traffic and challenges the requests that fail.'
  },
  {
    key: 'functions',
    title: FIREWALL_MODULES.functions,
    description: 'Runs functions inside the firewall, before the request reaches the application.'
  }
]

export const defaultFirewallModuleState = () => ({
  ddos: true,
  waf: true,
  'network-shield': false,
  'bot-manager': false,
  functions: false
})

export const defaultFirewallProtection = (overrides = {}) => ({
  enabled: false,
  mode: 'existing',
  firewall: '',
  name: '',
  modules: defaultFirewallModuleState(),
  ...overrides
})

export const firewallBindingName = (protection) => {
  if (!protection?.enabled) return ''
  return protection.mode === 'new'
    ? String(protection.name ?? '').trim()
    : String(protection.firewall ?? '')
}

export const firewallIsBound = (protection) =>
  Boolean(protection?.enabled) && protection.mode !== 'new'

export const enabledFirewallModules = (state) =>
  FIREWALL_MODULE_FIELDS.filter((field) => state?.[field.key]).map((field) => field.title)

export const FIREWALLS = [
  {
    id: '5540117',
    name: 'edgeflow-production',
    application: 'edgeflow-site',
    modules: ['ddos', 'waf', 'network-shield', 'bot-manager'],
    rules: 14,
    environment: 'Production',
    status: 'Active',
    modifiedAt: daysAgo(6)
  },
  {
    id: '5540118',
    name: 'edgeflow-staging',
    application: 'edgeflow-site',
    modules: ['ddos', 'waf'],
    rules: 6,
    environment: 'Staging',
    status: 'Active',
    modifiedAt: daysAgo(19)
  },
  {
    id: '5540119',
    name: 'api-hardening',
    application: 'legacy-api',
    modules: ['ddos', 'waf', 'functions'],
    rules: 22,
    environment: 'Production',
    status: 'Active',
    modifiedAt: daysAgo(2)
  },
  {
    id: '5540120',
    name: 'checkout-shield',
    application: 'ecommerce-v2',
    modules: ['ddos', 'bot-manager'],
    rules: 9,
    environment: 'Production',
    status: 'Inactive',
    modifiedAt: daysAgo(64)
  },
  {
    id: '5540121',
    name: 'dev-sandbox',
    modules: ['ddos'],
    rules: 1,
    environment: 'Development',
    status: 'Inactive',
    modifiedAt: daysAgo(140)
  },
  {
    id: '5540122',
    name: 'marketing-site',
    application: 'marketing-site',
    modules: ['ddos', 'waf', 'bot-manager'],
    rules: 4,
    environment: 'Production',
    status: 'Active',
    modifiedAt: daysAgo(31)
  },
  {
    id: '5540123',
    name: 'payments-api',
    application: 'ecommerce-v2',
    modules: ['ddos', 'waf', 'bot-manager', 'functions'],
    rules: 31,
    environment: 'Production',
    status: 'Active',
    modifiedAt: daysAgo(1)
  },
  {
    id: '5540124',
    name: 'partner-gateway',
    application: 'legacy-api',
    modules: ['ddos', 'waf', 'network-shield'],
    rules: 17,
    environment: 'Production',
    status: 'Active',
    modifiedAt: daysAgo(4)
  },
  {
    id: '5540125',
    name: 'admin-allowlist',
    application: 'status-page',
    modules: ['ddos', 'network-shield'],
    rules: 8,
    environment: 'Production',
    status: 'Active',
    modifiedAt: daysAgo(11)
  },
  {
    id: '5540126',
    name: 'media-delivery',
    application: 'blog-platform',
    modules: ['ddos', 'waf'],
    rules: 5,
    environment: 'Production',
    status: 'Active',
    modifiedAt: daysAgo(23)
  },
  {
    id: '5540127',
    name: 'edgeflow-canary',
    application: 'edgeflow-docs',
    modules: ['ddos', 'waf', 'functions'],
    rules: 12,
    environment: 'Staging',
    status: 'Active',
    modifiedAt: daysAgo(9)
  },
  {
    id: '5540128',
    name: 'search-api-shield',
    application: 'ecommerce-storefront',
    modules: ['ddos', 'waf', 'bot-manager'],
    rules: 19,
    environment: 'Production',
    status: 'Active',
    modifiedAt: daysAgo(16)
  },
  {
    id: '5540129',
    name: 'legacy-storefront',
    application: 'ecommerce-storefront',
    modules: ['ddos', 'waf'],
    rules: 26,
    environment: 'Production',
    status: 'Inactive',
    modifiedAt: daysAgo(96)
  },
  {
    id: '5540130',
    name: 'qa-sandbox',
    modules: ['ddos'],
    rules: 2,
    environment: 'Development',
    status: 'Inactive',
    modifiedAt: daysAgo(58)
  }
].map(firewallRow)

export function firewallRow(firewall, index = 0) {
  const person = authorAt(index)
  return {
    ...firewall,
    moduleLabels: firewall.modules.map(firewallModuleLabel),
    author: person.name,
    authorEmail: emailOf(person.name),
    authorAvatar: person.avatar,
    lastModified: formatListDate(firewall.modifiedAt)
  }
}

export const allFirewalls = () => [...createdRowsFor('firewall'), ...FIREWALLS]

export const firewallById = (id) => allFirewalls().find((firewall) => firewall.id === String(id))

export const existingFirewallOptions = () =>
  allFirewalls()
    .sort((a, b) => b.modifiedAt - a.modifiedAt)
    .map((firewall) => ({
      value: firewall.name,
      label: firewall.name,
      id: firewall.id,
      description: `${firewall.rules} ${firewall.rules === 1 ? 'rule' : 'rules'} · ${firewall.moduleLabels.join(', ')}`
    }))

export const firewallIdByName = (name) => allFirewalls().find((f) => f.name === name)?.id ?? ''

export const firewallModuleLabelsByName = (name) =>
  allFirewalls().find((f) => f.name === name)?.moduleLabels ?? []
