import { CLIENTS } from '@aziontech/webkit/assets/client-registry'
import { CLIENT_STRIP } from '@shared/ui/brand/strips.js'

import { AREZZO, AXUR, CONTABILIZEI, CREFISA } from '../clients.js'
import { BUILD_CTA } from '../solutions.js'
import { EARTH_NETWORK } from '../solutions.js'

const byName = (name) => CLIENTS.find((client) => client.name === name)

const wallItem = (client) => ({ alt: client.name, src: client.logo, client })

const STORY_CLIENTS = [
  byName('NZN'),
  AXUR,
  byName('Radware'),
  AREZZO,
  CONTABILIZEI,
  byName('Magalu'),
  byName('Fourbank'),
  CREFISA,
  byName('Netshoes'),
  byName('Dafiti'),
  byName('Global Fashion Group'),
  byName('GPA')
]

const NETWORK_FIGURES = [
  { value: '7', suffix: 'x', label: 'faster pages' },
  { value: '90', suffix: '%', label: 'lower cloud costs' },
  { value: '40', suffix: 'x', label: 'more simultaneous connections' },
  { value: '100', suffix: '%', label: 'OWASP Top 10 mitigation' }
]

const NETWORK_BANDS = [
  {
    title: 'Run closer to users',
    description:
      'Handle requests closer to users instead of sending everything back to a few central regions. That helps cut latency, absorb spikes automatically, and reduce backhaul overhead.',
    illustration: 'fastest-path-to-live-website',
    illustrationLabel: 'Requests served from the location nearest the user'
  },
  {
    title: 'Keep delivery, logic, and data in one place',
    description:
      'Use one platform for delivery, distributed execution, and data workflows. Support APIs and dynamic applications with real-time request handling, origin protection, and state kept close to execution with services like KV Store.',
    illustration: 'runtime',
    illustrationLabel: 'Delivery, execution and data served from one platform'
  },
  {
    title: 'Get better routes and more stable delivery',
    description:
      'Place traffic entry points inside ISP last-mile networks and connect through IXPs, peering, and Tier 1 transit. Reduce hops, improve route quality, and keep delivery stable during traffic spikes, upstream issues, and regional incidents.',
    illustration: 'distributed-apis',
    illustrationLabel: 'Entry points inside ISP networks, connected through IXPs and transit'
  },
  {
    title: 'Stop attack traffic earlier',
    description:
      'Block attack traffic in the delivery path before it reaches your origin. Deploy code and policies while the platform handles scaling, execution, and traffic steering, so your team spends less time managing regions, capacity, scaling rules, and extra layers.',
    illustration: 'automate-threat-mitigation',
    illustrationLabel: 'Attack traffic stopped in the delivery path, before the origin'
  }
]

export const OUR_NETWORK_PAGE = [
  {
    section: 'Heroes',
    kind: 'centered-carousel',
    eyebrow: 'Infrastructure',
    title: 'A global network built for fast applications',
    description:
      'Run closer to users with low-latency delivery, stable routing, and built-in DDoS protection across 100+ data centers and 3.3k directly connected ASNs.',
    actions: [
      { label: 'Start free', href: '/signup', kind: 'secondary' },
      { label: 'Talk to a Specialist', href: '/site/contact', kind: 'outlined', trailing: true }
    ],
    carouselMarks: CLIENT_STRIP
  },
  { section: 'NetworkSection', ...EARTH_NETWORK, kind: 'stats', stats: NETWORK_FIGURES },
  {
    section: 'MediaSplitStack',
    kind: 'alternating',
    eyebrow: 'Managed Infrastructure',
    title: 'Stop managing regions and capacity by hand',
    bands: NETWORK_BANDS
  },
  {
    section: 'LogoWallQuote',
    items: STORY_CLIENTS.map(wallItem),
    quote: {
      text: 'Azion shielded us from sophisticated cyberattacks and empowered us to modernize our infrastructure, reduce costs, and deliver the best shopping experiences to millions of customers across Latin America.',
      name: 'Allan Monteiro',
      jobTitle: 'CISO & Head of Technology',
      client: byName('GPA')
    },
    actions: [{ label: 'Customers', href: '/site/home', kind: 'outlined', trailing: true }]
  },
  {
    section: 'PlatformDirectory',
    eyebrow: 'Platform',
    title: 'Build, run, and protect applications on one platform'
  },
  {
    section: 'ClosingCallToAction',
    kind: 'split',
    eyebrow: BUILD_CTA.eyebrow,
    title: BUILD_CTA.title,
    titleMuted: BUILD_CTA.titleMuted,
    description: BUILD_CTA.description,
    actions: [{ label: 'Start Free', href: '/signup', kind: 'secondary' }],
    aside: { label: 'Talk to our team', href: '/site/contact' }
  }
]
