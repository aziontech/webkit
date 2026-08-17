// The firewalls the sample is seeded with — the Secure → Firewall module.
//
// A FIREWALL is a set of enabled MODULES (DDoS Protection, WAF, Network Shield, Bot
// Manager, Edge Functions) plus the rules that run inside it. What people narrow by
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
