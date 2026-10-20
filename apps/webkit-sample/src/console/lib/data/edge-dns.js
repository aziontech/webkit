import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt } from '@shared/lib/people'

export const DNS_ZONES = [
  {
    id: '6442',
    name: 'test',
    domain: 'edgeflow.com',
    status: 'Active',
    dnssec: false,
    modifiedAt: daysAgo(10)
  },
  {
    id: '6463',
    name: 'Azion Design',
    domain: 'azion.design',
    status: 'Active',
    dnssec: true,
    modifiedAt: daysAgo(18)
  }
].map((zone, index) => {
  const person = authorAt(index)
  return {
    ...zone,
    lastModified: formatListDate(zone.modifiedAt),
    author: person.name,
    authorAvatar: person.avatar
  }
})

export const NAMESERVERS = ['ns1.aziondns.net', 'ns2.aziondns.com', 'ns3.aziondns.org']

export const RECORD_TYPES = [
  {
    value: 'A',
    label: 'A - IPv4 Address',
    placeholder: '192.0.2.1',
    valueHelper: 'Accepts an IPv4 address.'
  },
  {
    value: 'AAAA',
    label: 'AAAA - IPv6 Address',
    placeholder: '2001:db8::1',
    valueHelper: 'Accepts an IPv6 address.'
  },
  {
    value: 'CNAME',
    label: 'CNAME - Canonical Name',
    placeholder: 'example.com',
    valueHelper: 'Accepts a single hostname.'
  },
  {
    value: 'MX',
    label: 'MX - Mail Exchange',
    placeholder: '10 mail.example.com',
    valueHelper: 'Accepts a priority and a mail server, e.g. 10 mail.example.com.'
  },
  {
    value: 'TXT',
    label: 'TXT - Text',
    placeholder: 'v=spf1 include:example.com ~all',
    valueHelper: 'Accepts free-form text.'
  },
  {
    value: 'NS',
    label: 'NS - Nameserver',
    placeholder: 'ns1.example.com',
    valueHelper: 'Accepts a nameserver hostname.'
  }
]

export const recordType = (value) =>
  RECORD_TYPES.find((type) => type.value === value) ?? RECORD_TYPES[0]

export const POLICY_TYPES = [
  { value: 'simple', label: 'Simple' },
  { value: 'weighted', label: 'Weighted' }
]

export const policyLabel = (value) =>
  POLICY_TYPES.find((policy) => policy.value === value)?.label ?? ''
