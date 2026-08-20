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
