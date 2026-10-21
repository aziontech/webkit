import { CLIENT_STRIP } from '@shared/ui/brand/strips.js'

import { salesClosing } from '../product-pages.js'
import { BUILD_CTA, EARTH_NETWORK, quotesLedBy } from '../solutions.js'

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
      'Handle requests close to users instead of sending everything back to a few central regions. That cuts latency, absorbs spikes automatically, and reduces backhaul.',
    illustration: 'fastest-path-to-live-website',
    illustrationLabel: 'Requests served from the data center nearest the user',
    actions: [{ label: 'Learn more', href: '/site/products/application-accelerator' }]
  },
  {
    title: 'Keep delivery, logic, and data in one place',
    description:
      'Run delivery, execution, and data on one platform. APIs and dynamic applications get real-time request handling, origin protection, and state kept next to the code with KV Store.',
    illustration: 'runtime',
    illustrationLabel: 'Delivery, execution and data served from one platform',
    actions: [{ label: 'Learn more', href: '/site/products/kv-store' }]
  },
  {
    title: 'Get better routes and more stable delivery',
    description:
      'Traffic enters inside ISP last-mile networks and connects through IXPs, peering, and Tier 1 transit. Fewer hops mean better routes and stable delivery during traffic spikes, upstream issues, and regional incidents.',
    illustration: 'distributed-apis',
    illustrationLabel: 'Entry points inside ISP networks, connected through IXPs and transit',
    actions: [{ label: 'Learn more', href: '/site/products/load-balancer' }]
  },
  {
    title: 'Stop attack traffic earlier',
    description:
      'Block attack traffic in the delivery path, before it reaches your origin. Deploy code and policies and let the platform handle scaling, execution, and traffic steering. Your team manages fewer regions, less capacity, and fewer scaling rules.',
    illustration: 'automate-threat-mitigation',
    illustrationLabel: 'Attack traffic stopped in the delivery path, before the origin',
    actions: [{ label: 'Learn more', href: '/site/products/ddos-protection' }]
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
      { label: 'Talk to an expert', href: '/site/contact', kind: 'outlined', trailing: true }
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
  { section: 'ClientQuotes', quotes: quotesLedBy('magalu') },

  {
    section: 'PlatformDirectory',
    eyebrow: 'Platform',
    title: 'Build, run, and protect applications on one platform'
  },
  salesClosing(BUILD_CTA)
]
