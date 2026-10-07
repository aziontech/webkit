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
import azionHighlight from '@aziontech/webkit/assets/azion-highlight.svg'
import branches from '@aziontech/webkit/assets/branches.svg'
import personalTokens from '@aziontech/webkit/assets/personal-tokens.svg'
import quickStartWithTemplates from '@aziontech/webkit/assets/quick-start-with-templates.svg'
import usageChart from '@aziontech/webkit/assets/usage-chart.svg'
import { CLIENT_STRIP } from '@shared/ui/brand/strips.js'

import { NETWORK_OUTCOMES } from '../solutions.js'

export const HOME_NETWORK = {
  eyebrow: 'Region: Earth.',
  title: 'One distributed infrastructure to build, secure and scale workloads anywhere.',
  lead: 'Built around your users. Distributed around your data.',
  claims: [
    '100+ data centers',
    '100+ Tbps network capacity',
    '30 ms median latency',
    '100% availability'
  ],
  outcomes: NETWORK_OUTCOMES
}

export const HOME_REASONS = [
  {
    src: branches,
    title: 'Faster to publish.',
    description:
      'Go from commit to a live URL in minutes. Test on a preview, promote when you are ready, and roll back without a rebuild.'
  },
  {
    src: personalTokens,
    title: 'Secure by default.',
    description:
      'Every endpoint carries its own keys, rate limits and instant revocation, managed from a single console.'
  },
  {
    src: azionHighlight,
    title: 'Simpler to operate.',
    description:
      'Deploys, gateways and observability sit on one platform, so there is no second console to reconcile when something breaks.'
  },
  {
    src: usageChart,
    title: 'Faster applications.',
    description:
      'Caching and image processing run at the edge, so every response is served from the location closest to the request.'
  }
]

const learnMore = (href) => [
  { label: 'Learn more', href, kind: 'outlined', size: 'medium', trailing: true }
]

export const HOME_SOLUTIONS = [
  {
    title: 'Build and Run Applications',
    description:
      'Deploy applications and static sites straight from Git, and run them on a distributed network with no servers to manage.',
    href: '/site/solutions/web-apps',
    image: { src: quickStartWithTemplates, alt: '', width: 360, height: 165 },
    actions: learnMore('/site/solutions/web-apps')
  },
  {
    title: 'Improve Application Performance and Reliability',
    description:
      'Cache, route and optimize every request close to your users, so applications stay fast and available under any load.',
    href: '/site/solutions/performance',
    illustration: 'improve-application-performance-and-reliability',
    actions: learnMore('/site/solutions/performance')
  },
  {
    title: 'Build and Run AI Workloads',
    description:
      'Run inference, vector search and AI agents on distributed infrastructure, close to the data and the users that need them.',
    href: '/site/solutions/ai',
    illustration: 'ai-applications',
    actions: learnMore('/site/solutions/ai')
  },
  {
    title: 'Secure Applications and Networks',
    description:
      'Stop DDoS attacks, bots and exploits before they reach your origin, with WAF and network rules managed from one console.',
    href: '/site/solutions/security',
    illustration: 'automate-threat-mitigation',
    actions: learnMore('/site/solutions/security')
  },
  {
    title: 'Deliver Media and Streaming Content',
    description:
      'Stream video and deliver large files at low latency to audiences of any size, with media processed at the edge.',
    href: '/site/solutions/streaming',
    illustration: 'low-latency',
    actions: learnMore('/site/solutions/streaming')
  }
]

const FIRMS = {
  gigaom: { name: 'GigaOm', logo: gigaomReversed, logoLight: gigaom },
  forrester: { name: 'Forrester', logo: forresterReversed, logoLight: forrester },
  gartner: { name: 'Gartner', logo: gartnerReversed, logoLight: gartner },
  frost: { name: 'Frost & Sullivan', logo: frostReversed, logoLight: frost },
  g2: { name: 'G2', logo: g2, logoLight: g2 }
}

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
    text: 'Recognized as a Leader in CDN and a High Performer in Web Security, DDoS Protection, WAF, Bot Detection and Mitigation, SSL & TLS Certificate Tools, and DNS Security Solution.',
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
    highlight: 'Invisible Infrastructure',
    title: 'for the Speed of AI',
    description:
      'Compute, AI, data, security, and observability primitives that run autonomously and scale instantly on 100+ data centers worldwide. One platform, from idea to mission-critical.',
    actions: [
      { label: 'Start Free', href: '/signup', kind: 'secondary' },
      { label: 'Talk to a Specialist', href: '#contact', kind: 'outlined', trailing: true }
    ],
    carouselLabel: 'Trusted by mission-critical workloads',
    carouselMarks: CLIENT_STRIP
  },
  {
    section: 'PlatformDirectory',
    title: 'Serverless AI-Native Primitives for Autonomous Workloads',
    ariaLabel: 'Platform primitives'
  },
  { section: 'NetworkSection', ...HOME_NETWORK },
  {
    section: 'FeatureTiles',
    kind: 'artwork',
    eyebrow: 'Why Azion',
    title: 'From commit to observability, on one platform',
    description:
      'Build, ship and run an application on the same platform that serves it — one place to deploy from, one place to watch it from.',
    tiles: HOME_REASONS
  },
  { section: 'MediaSplitStack', kind: 'solutions', bands: HOME_SOLUTIONS },
  {
    section: 'RecognitionMarquee',
    title: 'Recognized as a Market Leader',
    items: HOME_RECOGNITIONS
  },
  { section: 'ClientMosaic', cells: HOME_CLIENT_CELLS },
  {
    section: 'ClosingCallToAction',
    kind: 'split',
    eyebrow: 'Build',
    title: 'Build, run, and protect applications.',
    titleMuted: 'Everywhere.',
    description:
      'Get faster launches, lower latency, and less infrastructure overhead from day one.',
    actions: [{ label: 'Start Free', href: '/signup', kind: 'secondary' }],
    aside: { label: 'Talk to our team', href: '/site/contact' }
  }
]
