import type { CreateWizardListType } from '../types'

export interface ListField {
  label: string
  placeholder: string
  helper: string
}

export const types = [
  {
    value: 'asn',
    label: 'ASN',
    description: 'Identify networks by Autonomous System Number. Suited to grouping traffic.'
  },
  {
    value: 'ip_cidr',
    label: 'IP/CIDR',
    description:
      'Specific IP addresses or ranges in CIDR notation, for precise traffic segmentation.'
  },
  {
    value: 'countries',
    label: 'Countries',
    description: 'Group traffic by country, for location-based rules.'
  }
]
export const listFields: Record<CreateWizardListType, ListField> = {
  asn: {
    label: 'List',
    placeholder: '13335\n53331',
    helper:
      'One ASN per line, such as 13335. Public ASNs run from 1 to 64511, private ones from 64512 to 65535. Duplicate entries are removed.'
  },
  ip_cidr: {
    label: 'List',
    placeholder: '192.0.2.10\n198.51.100.24\n203.0.113.7 #comment',
    helper:
      'One address or range per line. Add a comment after #, and a date with --LT. Duplicate entries are removed.'
  },
  countries: {
    label: 'Countries',
    placeholder: 'US\nCA',
    helper: 'One or more countries, one two-letter ISO 3166-1 code per line, such as US.'
  }
}

export const PREVIEW = 5

export const consumers = [
  {
    by: 'Policy rules',
    path: 'rules[].criteria[].argument',
    as: 'Network list'
  },
  {
    by: 'Rule sets',
    path: 'rule_sets[].match.network_list',
    as: 'Network list'
  }
]
