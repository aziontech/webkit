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
import quickStartWithTemplates from '@aziontech/webkit/assets/quick-start-with-templates.svg'
import usageChart from '@aziontech/webkit/assets/usage-chart.svg'
import { CLIENT_STRIP } from '@shared/ui/brand/strips.js'

import { PLATFORM_DIRECTORY } from '../product-pages.js'
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
    description:
      'Build static sites, develop serverless applications, or modernize your legacy systems.',
    href: '/site/solutions/web-apps',
    image: { src: quickStartWithTemplates, alt: '', width: 360, height: 165 },
    actions: learnMore('/site/solutions/web-apps')
  },
  {
    title: 'Optimized workloads',
    description:
      'Accelerate applications, optimize content delivery (CDN), and process images on demand efficiently.',
    href: '/site/solutions/performance',
    illustration: 'improve-application-performance-and-reliability',
    actions: learnMore('/site/solutions/performance')
  },
  {
    title: 'AI applications',
    description:
      'Build and deploy AI agents and AI-powered applications on a distributed platform that delivers the best value on the market.',
    href: '/site/solutions/ai',
    illustration: 'ai-applications',
    actions: learnMore('/site/solutions/ai')
  },
  {
    title: 'Protected applications and APIs',
    description:
      'Protect web applications and APIs (WAAP), manage bots, and modernize your security in a programmable and scalable way.',
    href: '/site/solutions/security',
    illustration: 'automate-threat-mitigation',
    actions: learnMore('/site/solutions/security')
  },
  {
    title: 'Media and streaming content',
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
      { label: 'Start free', href: '/signup', kind: 'secondary' },
      { label: 'Talk to a specialist', href: '#contact', kind: 'outlined', trailing: true }
    ],
    carouselLabel: 'Proven on mission-critical workloads',
    carouselMarks: CLIENT_STRIP
  },
  PLATFORM_DIRECTORY,
  { section: 'NetworkSection', ...EARTH_NETWORK },
  {
    section: 'FeatureTiles',
    kind: 'artwork',
    eyebrow: 'Why Azion',
    title: 'From commit to observability, on one platform',
    description:
      'Build, ship, and run an application on the same platform that serves it — one place to deploy from, one place to watch it from.',
    tiles: HOME_REASONS
  },
  { section: 'MediaSplitStack', kind: 'solutions', bands: HOME_SOLUTIONS },
  {
    section: 'RecognitionMarquee',
    title: 'Recognized as a market leader',
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
    actions: [{ label: 'Start free', href: '/signup', kind: 'secondary' }],
    aside: { label: 'Talk to our team', href: '/site/contact' }
  }
]
