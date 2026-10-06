import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt, emailOf } from '@shared/lib/people'

export const NETWORK_LIST_TYPES = {
  'ip-cidr': 'IP/CIDR',
  asn: 'ASN',
  countries: 'Countries'
}

export const networkListTypeLabel = (id) => NETWORK_LIST_TYPES[id] ?? id

export const networkListTypeOptions = Object.entries(NETWORK_LIST_TYPES).map(([value, label]) => ({
  value,
  label
}))

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
].map(networkListRow)

export function networkListRow(list, index = 0) {
  const person = authorAt(index)
  return {
    ...list,
    typeLabel: networkListTypeLabel(list.type),
    author: person.name,
    authorEmail: emailOf(person.name),
    authorAvatar: person.avatar,
    lastModified: formatListDate(list.modifiedAt)
  }
}

export const networkListById = (id) => NETWORK_LISTS.find((list) => list.id === String(id))
