import { CLIENTS } from '@aziontech/webkit/assets/client-registry'

import { AREZZO, AXUR, CONTABILIZEI, CREFISA } from './clients.js'

export const PRODUCT_DOCS = '/site/docs'

export const PRODUCT_HERO_ACTIONS = [
  { label: 'Start free', href: '/signup', kind: 'secondary' },
  { label: 'Docs', href: PRODUCT_DOCS, kind: 'outlined', trailing: true }
]

export const PRODUCT_DIRECTORY = {
  section: 'PlatformDirectory',
  eyebrow: 'Complete, not complex',
  title: 'A full-stack platform that scales instantly'
}

export const PRODUCT_CLOSING = {
  section: 'ClosingCallToAction',
  kind: 'split',
  eyebrow: 'Build',
  title: 'Build once.',
  titleMuted: 'Run everywhere.',
  description: 'Get a faster path to launch, lower latency, and less infrastructure overhead.',
  actions: [{ label: 'Start Free', href: '/signup', kind: 'secondary' }],
  aside: { label: 'Talk to our team', href: '#' }
}

export const PRODUCT_CUSTOMERS_ACTION = {
  label: 'Customers',
  href: '/site/home',
  kind: 'outlined',
  trailing: true
}

export const registeredClient = (name) => CLIENTS.find((client) => client.name === name) ?? { name }

const wallItem = (client) => ({ alt: client.name, src: client.logo ?? '', client })

export const CACHE_FAMILY_WALL = [
  registeredClient('NZN'),
  AXUR,
  registeredClient('Radware'),
  AREZZO,
  CONTABILIZEI,
  registeredClient('Magalu'),
  registeredClient('Fourbank'),
  CREFISA,
  registeredClient('Netshoes'),
  registeredClient('Dafiti'),
  registeredClient('Global Fashion Group')
].map(wallItem)

export const withWallClient = (client) => [...CACHE_FAMILY_WALL, wallItem(client)]

export const foldList = (description, items) =>
  `${description} ${items.map((item) => item.label).join(', ')}.`
