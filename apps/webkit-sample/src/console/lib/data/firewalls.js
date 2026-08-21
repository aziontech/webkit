// The firewalls the sample is seeded with — the Secure → Firewall module.
//
// A FIREWALL is a set of enabled MODULES (DDoS Protection, WAF, Network Shield, Bot
// Manager, Functions) plus the rules that run inside it. What people narrow by
// is which modules a firewall actually has on, so `modules` is a list per row — a
// COLUMN, not a field, for the same reason a custom page's statuses are: "has any of
// these" is a different question from the membership every other field asks. The
// enumerable columns are Status and Environment.
import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt, emailOf } from '@shared/lib/people'

/** Firewall module → the label every surface shows for it. */
export const FIREWALL_MODULES = {
  ddos: 'DDoS Protection',
  waf: 'WAF',
  'network-shield': 'Network Shield',
  'bot-manager': 'Bot Manager',
  functions: 'Functions'
}

/** The label for a firewall module id, falling back to the id itself. */
export const firewallModuleLabel = (id) => FIREWALL_MODULES[id] ?? id

/**
 * The modules as SETTINGS — the shape a form needs: what each one does, and whether it
 * is a decision at all. Titles come from FIREWALL_MODULES above, so a module's name
 * exists once and the list column and the settings rows can never disagree.
 *
 * `locked` is DDoS Protection: it is not a switch anywhere on the platform, so it is
 * shown as on with the reason on hover rather than as a control that refuses to move.
 */
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

/**
 * What a firewall created alongside an application starts with: the protection nobody
 * would decline. The other three cost either a network list, a subscription, or a
 * function to exist first, so they start off and are switched on deliberately.
 */
export const defaultFirewallModuleState = () => ({
  ddos: true,
  waf: true,
  'network-shield': false,
  'bot-manager': false,
  functions: false
})

/**
 * THE PROTECTION ANSWER, as one object — the shape both creates hold and pass around.
 *
 * A firewall is a RESOURCE, and there are only three things a create can do about one:
 * go without, bind one that already exists, or make a new one. That is `enabled` plus a
 * `mode`, and it is deliberately ONE object rather than four loose fields: the flows that
 * hold it (the application create and the workload create) then read the same keys, and
 * the projection back out — which firewall is bound, by name — has a single definition
 * below instead of one per flow.
 *
 * OFF by default. The two branches inside it are only reachable once the reader says yes,
 * so `mode` starts on the cheaper of the two: binding a firewall that already exists costs
 * nothing, creating one spends a resource.
 */
export const defaultFirewallProtection = (overrides = {}) => ({
  enabled: false,
  mode: 'existing',
  // Which existing firewall, when `mode` is `existing`. The name, not the id — it is what
  // every surface that binds a firewall shows.
  firewall: '',
  // The new firewall's name, when `mode` is `new`.
  name: '',
  modules: defaultFirewallModuleState(),
  ...overrides
})

/**
 * The firewall a protection answer names, or `''` when there is none. One derivation, so
 * the wizard's summary, its provisioning log and the created chain can never disagree
 * about which firewall the reader picked.
 */
export const firewallBindingName = (protection) => {
  if (!protection?.enabled) return ''
  return protection.mode === 'new'
    ? String(protection.name ?? '').trim()
    : String(protection.firewall ?? '')
}

/** Whether a protection answer BINDS an existing firewall rather than creating one. */
export const firewallIsBound = (protection) =>
  Boolean(protection?.enabled) && protection.mode !== 'new'

/** The enabled modules of a settings map, as the labels every surface shows. */
export const enabledFirewallModules = (state) =>
  FIREWALL_MODULE_FIELDS.filter((field) => state?.[field.key]).map((field) => field.title)

/** The seeded firewalls, in list order. */
export const FIREWALLS = [
  {
    id: '5540117',
    name: 'edgeflow-production',
    modules: ['ddos', 'waf', 'network-shield', 'bot-manager'],
    rules: 14,
    environment: 'Production',
    status: 'Active',
    modifiedAt: daysAgo(6)
  },
  {
    id: '5540118',
    name: 'edgeflow-staging',
    modules: ['ddos', 'waf'],
    rules: 6,
    environment: 'Staging',
    status: 'Active',
    modifiedAt: daysAgo(19)
  },
  {
    id: '5540119',
    name: 'api-hardening',
    modules: ['ddos', 'waf', 'functions'],
    rules: 22,
    environment: 'Production',
    status: 'Active',
    modifiedAt: daysAgo(2)
  },
  {
    id: '5540120',
    name: 'checkout-shield',
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
    modules: ['ddos', 'waf', 'bot-manager'],
    rules: 4,
    environment: 'Production',
    status: 'Active',
    modifiedAt: daysAgo(31)
  },
  {
    id: '5540123',
    name: 'payments-api',
    modules: ['ddos', 'waf', 'bot-manager', 'functions'],
    rules: 31,
    environment: 'Production',
    status: 'Active',
    modifiedAt: daysAgo(1)
  },
  {
    id: '5540124',
    name: 'partner-gateway',
    modules: ['ddos', 'waf', 'network-shield'],
    rules: 17,
    environment: 'Production',
    status: 'Active',
    modifiedAt: daysAgo(4)
  },
  {
    id: '5540125',
    name: 'admin-allowlist',
    modules: ['ddos', 'network-shield'],
    rules: 8,
    environment: 'Production',
    status: 'Active',
    modifiedAt: daysAgo(11)
  },
  {
    id: '5540126',
    name: 'media-delivery',
    modules: ['ddos', 'waf'],
    rules: 5,
    environment: 'Production',
    status: 'Active',
    modifiedAt: daysAgo(23)
  },
  {
    id: '5540127',
    name: 'edgeflow-canary',
    modules: ['ddos', 'waf', 'functions'],
    rules: 12,
    environment: 'Staging',
    status: 'Active',
    modifiedAt: daysAgo(9)
  },
  {
    id: '5540128',
    name: 'search-api-shield',
    modules: ['ddos', 'waf', 'bot-manager'],
    rules: 19,
    environment: 'Production',
    status: 'Active',
    modifiedAt: daysAgo(16)
  },
  {
    id: '5540129',
    name: 'legacy-storefront',
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
].map((firewall, index) => {
  const person = authorAt(index)
  return {
    ...firewall,
    moduleLabels: firewall.modules.map(firewallModuleLabel),
    author: person.name,
    authorEmail: emailOf(person.name),
    authorAvatar: person.avatar,
    lastModified: formatListDate(firewall.modifiedAt)
  }
})

/** A seeded firewall by id, or `undefined`. */
export const firewallById = (id) => FIREWALLS.find((firewall) => firewall.id === String(id))

/**
 * The seeded firewalls as SELECTABLE ROWS — what a create offers under "use an existing
 * firewall". The description is the difference a reader needs to choose between them,
 * which a bare name does not give: how many rules it runs and what it inspects.
 */
export const existingFirewallOptions = () =>
  // MOST RECENTLY TOUCHED FIRST. A create shows only the first few, so their order is
  // what decides whether the reader finds theirs without searching — and insertion order
  // decides nothing. Activity is the proxy this data actually has: the firewall someone
  // changed this week is the one they are about to bind, and a rule count says how big a
  // firewall is, not how current it is.
  [...FIREWALLS]
    .sort((a, b) => b.modifiedAt - a.modifiedAt)
    .map((firewall) => ({
      value: firewall.name,
      label: firewall.name,
      id: firewall.id,
      description: `${firewall.rules} ${firewall.rules === 1 ? 'rule' : 'rules'} · ${firewall.moduleLabels.join(', ')}`
    }))

/** The id of a seeded firewall by NAME, or `''`. */
export const firewallIdByName = (name) => FIREWALLS.find((f) => f.name === name)?.id ?? ''

/** The module LABELS a seeded firewall already has on, by name. Empty when unknown. */
export const firewallModuleLabelsByName = (name) =>
  FIREWALLS.find((f) => f.name === name)?.moduleLabels ?? []
