import azionHighlight from '@aziontech/webkit/assets/azion-highlight.svg'
import branches from '@aziontech/webkit/assets/branches.svg'
import { clientPhoto, CLIENTS } from '@aziontech/webkit/assets/client-registry'
import forrester from '@aziontech/webkit/assets/forrester-extended-color.svg'
import forresterReversed from '@aziontech/webkit/assets/forrester-extended-reversed.svg'
import frost from '@aziontech/webkit/assets/frost-and-sullivan-extended-color.svg'
import frostReversed from '@aziontech/webkit/assets/frost-and-sullivan-extended-reversed.svg'
import g2 from '@aziontech/webkit/assets/g2-symbol-color.svg'
import gartner from '@aziontech/webkit/assets/gartner-extended-color.svg'
import gartnerReversed from '@aziontech/webkit/assets/gartner-extended-reversed.svg'
import gigaom from '@aziontech/webkit/assets/gigaom-extended-color.svg'
import gigaomReversed from '@aziontech/webkit/assets/gigaom-extended-reversed.svg'
import personalTokens from '@aziontech/webkit/assets/personal-tokens.svg'
import usageChart from '@aziontech/webkit/assets/usage-chart.svg'
import { CLIENT_STRIP } from '@shared/ui/brand/strips.js'

import { PLATFORM_PRIMITIVES } from '../platform-primitives.js'
import { agentsClosing, PLATFORM_DIRECTORY } from '../product-pages.js'
import { EARTH_NETWORK } from '../solutions.js'

export const HOME_REASONS = [
  {
    src: branches,
    title: 'Build at AI speed.',
    description:
      'Go from commit to a live URL in minutes. Test on a preview, promote when you are ready, and roll back without a rebuild.'
  },
  {
    src: personalTokens,
    title: 'Secure by default.',
    description:
      'Every workload in its own isolated environment, with WAF, rate limits, and leading compliance practices, with no configuration required.'
  },
  {
    src: azionHighlight,
    title: 'No ops required.',
    description:
      'A fully autonomous infrastructure on 100+ data centers worldwide, with zero cold starts and instant scale-to-zero, so infrastructure becomes invisible.'
  },
  {
    src: usageChart,
    title: 'Faster and more efficient workloads.',
    description:
      "Compute and security are delivered from the location closest to the request, and Azion's runtime is 30x more efficient than containers."
  }
]

const learnMore = (href) => [
  { label: 'Learn more', href, kind: 'outlined', size: 'medium', trailing: true }
]

export const HOME_SOLUTIONS = [
  {
    title: 'Modern applications',
    description: 'Build static sites, run serverless applications, or modernize legacy systems.',
    href: '/site/solutions/web-apps',
    illustration: 'quick-start-with-templates',
    actions: learnMore('/site/solutions/web-apps')
  },
  {
    title: 'Optimized workloads',
    description:
      'Speed up applications, deliver content through the CDN, and process images on demand.',
    href: '/site/solutions/performance',
    illustration: 'improve-application-performance-and-reliability',
    actions: learnMore('/site/solutions/performance')
  },
  {
    title: 'AI applications',
    description:
      'Build and deploy AI agents and AI-powered applications on a distributed platform, with inference close to users.',
    href: '/site/solutions/ai',
    illustration: 'ai-applications',
    actions: learnMore('/site/solutions/ai')
  },
  {
    title: 'Protected applications and APIs',
    description:
      'Protect web applications and APIs (WAAP), manage bots, and enforce programmable security policies at scale.',
    href: '/site/solutions/security',
    illustration: 'programmable-security',
    actions: learnMore('/site/solutions/security')
  },
  {
    title: 'Media and streaming content',
    description:
      'Stream video and deliver large files at low latency to audiences of any size, with media processed close to viewers.',
    href: '/site/solutions/streaming',
    illustration: 'content-and-media-delivery',
    actions: learnMore('/site/solutions/streaming')
  }
]

export const HOME_SOLUTIONS_BAND = {
  section: 'MediaSplitStack',
  kind: 'solutions',
  bands: HOME_SOLUTIONS
}

const FIRMS = {
  gigaom: { name: 'GigaOm', logo: gigaomReversed, logoLight: gigaom },
  forrester: { name: 'Forrester', logo: forresterReversed, logoLight: forrester },
  gartner: { name: 'Gartner', logo: gartnerReversed, logoLight: gartner },
  frost: { name: 'Frost & Sullivan', logo: frostReversed, logoLight: frost },
  g2: { name: 'G2', logo: g2, logoLight: g2 }
}

export const MARKET_RECOGNITIONS = [
  {
    text: 'Recognized as a Leader in CDN, Web Security, and DDoS Protection, and a High Performer in Cloud Security, WAF, Bot Detection and Mitigation, SSL & TLS Certificate Tools, and API Security Tools.',
    name: 'G2 Spring 2026 Reports',
    jobTitle: '',
    firm: FIRMS.g2
  },
  {
    text: 'Recognized as a Leader in CDN and a High Performer in Web Security, DDoS Protection, WAF, Bot Detection and Mitigation, SSL & TLS Certificate Tools, and DNS Security Solutions.',
    name: 'G2 Winter 2026 Reports',
    jobTitle: '',
    firm: FIRMS.g2
  },
  {
    text: 'Named a Leader, and the only vendor whose capabilities meet every key criterion in the report.',
    name: 'GigaOm Radar for Edge Platforms',
    jobTitle: '',
    firm: FIRMS.gigaom
  },
  {
    text: "Awarded in the Edge Serverless Computing category and recognized for consistently exceeding its customers' performance expectations.",
    name: '2023 North American New Product Innovation Award',
    jobTitle: '',
    firm: FIRMS.frost
  }
]

const PRIMITIVE_GROUP_LABELS = ['Compute', 'AI', 'Data', 'Security']

const PRIMITIVE_TITLES = { 'Bot Management': 'Bot Manager' }

const HOME_PRIMITIVE_GROUPS = PLATFORM_PRIMITIVES.map((group, index) => ({
  ...group,
  label: PRIMITIVE_GROUP_LABELS[index] ?? group.label,
  items: group.items.map((item) => ({ ...item, title: PRIMITIVE_TITLES[item.title] ?? item.title }))
}))

export const HOME_RECOGNITIONS = [
  {
    text: 'Named a Leader and Fast Mover, and the only vendor whose platform meets every key criterion the report sets for a full-stack edge deployment.',
    name: 'GigaOm Radar for Full-Stack Edge Deployments v3',
    jobTitle: 'May 2026',
    firm: FIRMS.gigaom
  },
  {
    text: 'Evaluated as a Strong Performer among the edge development platforms that matter most.',
    name: 'The Forrester Wave™: Edge Development Platforms',
    jobTitle: 'March 2026',
    firm: FIRMS.forrester
  },
  {
    text: 'Covered as a vendor in the market guide that defines the edge distribution platform category, in two consecutive editions.',
    name: 'Gartner Market Guide for Edge Distribution Platforms',
    jobTitle: 'November 2025',
    firm: FIRMS.gartner
  },
  {
    text: 'Recognized as Latin America Company of the Year in the edge distribution platform industry, after being profiled among the Companies to Action on the Frost Radar™.',
    name: 'Frost & Sullivan Latin America Company of the Year',
    jobTitle: 'June 2026',
    firm: FIRMS.frost
  },
  {
    text: 'Positioned as a Challenger and Fast Mover, with the application and API security stack evaluated as one platform rather than a set of bolt-ons.',
    name: 'GigaOm Radar for Application and API Security v5',
    jobTitle: 'March 2026',
    firm: FIRMS.gigaom
  },
  {
    text: 'Recognized as a Leader in CDN, Web Security, and DDoS Protection, and a High Performer in Cloud Security, WAF, Bot Detection and Mitigation, SSL & TLS Certificate Tools, and API Security Tools.',
    name: 'G2 Reports',
    jobTitle: 'March 2026',
    firm: FIRMS.g2
  },
  {
    text: 'Recognized as a Leader in CDN and a High Performer in Web Security, DDoS Protection, WAF, Bot Detection and Mitigation, SSL & TLS Certificate Tools, and DNS Security Solutions.',
    name: 'G2 Reports',
    jobTitle: 'December 2025',
    firm: FIRMS.g2
  }
]

const STORIES = [
  {
    name: 'Netshoes',
    span: '2',
    rows: '2',
    fill: 'surface',
    story: 'Netshoes automatically blocks more than 4 million threats in six months',
    href: 'https://www.azion.com/en/success-case/netshoes/'
  },
  {
    name: 'Dafiti',
    fill: 'white',
    href: 'https://www.azion.com/en/success-case/dafiti/dafiti-accelerates-its-e-commerce-by-86-and-saves-45-on-data-transfer-costs-using-azion-edge-application/'
  },
  { name: 'Agibank', href: 'https://www.azion.com/en/success-case/agibank/' },
  { name: 'Renner', href: 'https://www.azion.com/en/success-case/renner/' },
  {
    name: 'GPA',
    stacked: true,
    rows: '2',
    fill: 'surface',
    story: 'Grupo Pão de Açúcar (GPA) stops a cyberattack and reduces costs by 30%',
    href: 'https://www.azion.com/en/success-case/gpa-solved-cyberattack/'
  },
  { name: 'Fourbank', fill: 'primary', href: 'https://www.azion.com/en/success-case/fourbank/' },
  { name: 'Exame', href: 'https://www.azion.com/en/success-case/exame/' },
  {
    name: 'NZN',
    fill: 'primary',
    href: 'https://www.azion.com/en/success-case/nzn/nzn-creates-more-than-100-edge-applications-and-reduces-their-websites-loading-time-by-50-using-the-azion-platform/'
  }
]

export const HOME_CLIENT_CELLS = STORIES.map((entry) => {
  const client = CLIENTS.find((candidate) => candidate.name === entry.name)
  const photo = entry.story ? clientPhoto(client) : ''
  return { ...entry, logo: client?.logo ?? '', ...(photo ? { photo } : {}) }
})

export const HOME_PAGE = [
  {
    section: 'Heroes',
    kind: 'centered-carousel',
    highlight: 'Invisible infrastructure',
    title: 'for the speed of AI',
    description:
      'Compute, AI, data, security, and observability primitives that run autonomously and scale instantly on 100+ data centers worldwide. One platform, from idea to mission-critical.',
    actions: [
      { label: 'Start for free', href: '/signup', kind: 'secondary' },
      { label: 'Talk to sales', href: '/site/contact/sales', kind: 'outlined', trailing: true }
    ],
    carouselLabel: 'Proven on mission-critical workloads',
    carouselMarks: CLIENT_STRIP
  },
  {
    ...PLATFORM_DIRECTORY,
    title: 'Serverless AI-native primitives for autonomous workloads',
    ariaLabel: 'Platform primitives',
    groups: HOME_PRIMITIVE_GROUPS
  },
  {
    section: 'NetworkSection',
    ...EARTH_NETWORK,
    title: 'Distributed infrastructure that stays up when others go down',
    claims: [
      '100+ data centers',
      '100+ Tbps throughput',
      { label: 'Instant scale, automatic routing & failover', mobile: false },
      '30 ms median latency',
      'Always-on DDoS protection'
    ]
  },
  {
    section: 'FeatureTiles',
    kind: 'artwork',
    eyebrow: 'Why Azion',
    title: 'From commit to observability, on one platform',
    description:
      'Build, ship, and run an application on the same platform that serves it — one place to deploy from, one place to watch it from.',
    tiles: HOME_REASONS
  },
  HOME_SOLUTIONS_BAND,
  {
    section: 'RecognitionMarquee',
    title: 'Recognized as a market leader',
    items: MARKET_RECOGNITIONS
  },
  { section: 'ClientMosaic', cells: HOME_CLIENT_CELLS },
  agentsClosing('Built by you, or your agents.')
]
