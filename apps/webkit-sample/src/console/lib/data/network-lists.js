// The network lists the sample is seeded with — the Secure → Network Lists module.
//
// A NETWORK LIST is a named set of network identifiers a firewall rule matches
// against. Its TYPE decides what the entries even are — IP/CIDR ranges, autonomous
// system numbers, or ISO country codes — so it is the column that leads and the
// field that matters: "show me the country lists" is the question this module is
// browsed with.
import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt, emailOf } from '@shared/lib/people'

/** Network list type → the label every surface shows. */
export const NETWORK_LIST_TYPES = {
  'ip-cidr': 'IP/CIDR',
  asn: 'ASN',
  countries: 'Countries'
}

/** The label for a network list type id, falling back to the id itself. */
export const networkListTypeLabel = (id) => NETWORK_LIST_TYPES[id] ?? id

/** The type list a filter field offers. */
export const networkListTypeOptions = Object.entries(NETWORK_LIST_TYPES).map(([value, label]) => ({
  value,
  label
}))

/** The seeded network lists, in list order. */
export const NETWORK_LISTS = [
  {
    id: 'nl-3301',
    name: 'Office egress',
    type: 'ip-cidr',
    entries: 6,
    status: 'Active',
    modifiedAt: daysAgo(12)
  },
  {
    id: 'nl-3302',
    name: 'Known scrapers',
    type: 'asn',
    entries: 34,
    status: 'Active',
    modifiedAt: daysAgo(2)
  },
  {
    id: 'nl-3303',
    name: 'Embargoed countries',
    type: 'countries',
    entries: 9,
    status: 'Active',
    modifiedAt: daysAgo(88)
  },
  {
    id: 'nl-3304',
    name: 'Partner allowlist',
    type: 'ip-cidr',
    entries: 21,
    status: 'Active',
    modifiedAt: daysAgo(30)
  },
  {
    id: 'nl-3305',
    name: 'Cloud provider ranges',
    type: 'asn',
    entries: 112,
    status: 'Inactive',
    modifiedAt: daysAgo(176)
  },
  {
    id: 'nl-3306',
    name: 'LATAM rollout',
    type: 'countries',
    entries: 14,
    status: 'Active',
    modifiedAt: daysAgo(5)
  },
  {
    id: 'nl-3307',
    name: 'CI runners',
    type: 'ip-cidr',
    entries: 3,
    status: 'Active',
    modifiedAt: daysAgo(41)
  }
].map((list, index) => {
  const person = authorAt(index)
  return {
    ...list,
    typeLabel: networkListTypeLabel(list.type),
    author: person.name,
    authorEmail: emailOf(person.name),
    authorAvatar: person.avatar,
    lastModified: formatListDate(list.modifiedAt)
  }
})

/** A seeded network list by id, or `undefined`. */
export const networkListById = (id) => NETWORK_LISTS.find((list) => list.id === String(id))
