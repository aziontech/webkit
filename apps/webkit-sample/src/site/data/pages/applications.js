import { markRaw } from 'vue'

import ApplicationVersionWidget from '../../ui/mockup/widgets/ApplicationVersionWidget.vue'
import { cliBand } from '../cli-band.js'
import {
  PRODUCT_CLOSING,
  PRODUCT_DIRECTORY,
  PRODUCT_DOCS,
  PRODUCT_GROUPS,
  PRODUCT_HERO_ACTIONS
} from '../product-pages.js'
import { quotesLedBy } from '../solutions.js'

const FIGURES = [
  { value: '200', label: 'Rules per application' },
  { value: '2', label: 'Phases: request and response' },
  { value: '4', label: 'Built-in modules' },
  { value: '100', suffix: '+', label: 'Data centers running them' }
]

const ROUTING_SAMPLE = `export default {
  rules: {
    request: [
      {
        name: 'Deliver Static Assets',
        match: '.(css|js|svg|png|webp|woff2)$',
        behavior: {
          setOrigin: { name: 'origin-storage-default' },
          deliver: true
        }
      },
      {
        name: 'Send the API to Its Origin',
        match: '^/api/',
        behavior: { setOrigin: { name: 'origin-api' } }
      }
    ]
  }
}`

const CACHE_SAMPLE = `export default {
  cache: [
    {
      name: 'api-cache',
      browser: { maxAgeSeconds: 0 },
      edge: { maxAgeSeconds: 60 }
    }
  ],
  rules: {
    request: [
      {
        name: 'Cache Product Listings',
        match: '^/api/products',
        behavior: { setCache: 'api-cache' }
      }
    ]
  }
}`

const FUNCTION_SAMPLE = `export default {
  functions: [
    { name: 'auth-handler', path: './functions/auth.js' }
  ],
  rules: {
    request: [
      {
        name: 'Guard the Account Area',
        match: '^/account',
        behavior: { runFunction: 'auth-handler' }
      }
    ]
  }
}`

const RESPONSE_SAMPLE = `export default {
  rules: {
    response: [
      {
        name: 'Security Headers',
        match: '^\\/',
        behavior: {
          setHeaders: [
            'Strict-Transport-Security: max-age=31536000',
            'X-Frame-Options: DENY'
          ]
        }
      }
    ]
  }
}`

const IMAGE_SAMPLE = `export default {
  rules: {
    request: [
      {
        name: 'Optimize Product Images',
        match: '.(jpg|jpeg|png)$',
        behavior: { optimizeImages: true }
      }
    ]
  }
}`

const ANATOMY = [
  {
    icon: 'pi pi-sitemap',
    title: 'Rules Engine',
    description:
      'Each request walks your rules in order: criteria match it, behaviors decide where it goes — a bucket, an origin, a function, a redirect.'
  },
  {
    icon: 'ai ai-tiered-cache',
    title: 'Cache',
    description:
      'Name a cache policy and apply it by rule, so product listings hold for a minute while checkout never caches at all.'
  },
  {
    icon: 'ai ai-edge-functions',
    title: 'Functions',
    description:
      'Bind a function and run it on the routes that need logic — auth checks, redirects, shaped payloads — before the origin is ever reached.'
  },
  {
    icon: 'pi pi-arrow-right-arrow-left',
    title: 'Response phase',
    description:
      'Rules run on the way out too: add security headers, rewrite cookies, or change what the origin answered before the user sees it.'
  },
  {
    icon: 'ai ai-layers',
    title: 'Image Processor',
    description:
      'Keep one source image and derive every variant on demand with an ims query — fit-in/400x400 — cached like any other response.'
  }
]

const sample = (value, label, code) => ({
  label,
  value,
  language: 'javascript',
  code,
  fileName: 'azion.config.js',
  fileIcon: 'pi pi-code'
})

const ANATOMY_SAMPLES = [
  sample('routing', 'Rules Engine', ROUTING_SAMPLE),
  sample('cache', 'Cache', CACHE_SAMPLE),
  sample('functions', 'Functions', FUNCTION_SAMPLE),
  sample('response', 'Response phase', RESPONSE_SAMPLE),
  sample('images', 'Image Processor', IMAGE_SAMPLE)
]

const CAPABILITIES = [
  {
    icon: 'pi pi-sitemap',
    title: 'Rules in two phases',
    description:
      'Up to 200 rules per application, each with its own criteria and behaviors, running on the request before the origin and on the response after it.'
  },
  {
    icon: 'ai ai-load-balancer',
    title: 'Connectors and origins',
    description:
      'Rules route each path to its own backend — a web server, a cloud service, a bucket — and a load balancer can stand behind any of them.'
  },
  {
    icon: 'ai ai-edge-application',
    title: 'Application Accelerator',
    description:
      'Vary the cache by cookie, query string or device group, cache POST and OPTIONS responses, and hold content for less than a minute when freshness matters.'
  },
  {
    icon: 'pi pi-mobile',
    title: 'Device groups',
    description:
      'Name the devices you care about with User-Agent patterns, then route, cache and render differently for each group.'
  },
  {
    icon: 'pi pi-search',
    title: 'Debug rules',
    description:
      'Turn on rule tracebacks and watch which rules matched each request in Real-Time Events, instead of guessing from the outside.'
  },
  {
    icon: 'pi pi-arrow-right-arrow-left',
    title: 'WebSocket proxy',
    description:
      'Keep long-lived WebSocket connections flowing through the same application that serves the rest of the traffic.'
  }
]

const FAQ = [
  {
    value: 'what-is',
    question: 'What is an Application?',
    answer:
      'An application is the delivery logic that runs on Azion in place of your servers: it receives each request, walks your rules, and decides what happens — answer from cache, run a function, rewrite the path, or pass it to an origin. A workload gives it a hostname.'
  },
  {
    value: 'vs-workload',
    question: 'How does an application relate to a workload?',
    answer:
      'The workload owns the domains, certificates and protocols; the application owns what happens to each request. A workload deployment names the application that serves it, so several workloads — production, staging, a second brand — can point at the same application.'
  },
  {
    value: 'rules',
    question: 'How do rules work?',
    answer:
      'Rules run in two phases, request and response. Each rule tests criteria — path, scheme, header, cookie, device group — and executes behaviors when they match. An application holds up to 200 rules, and each rule carries up to five condition groups and ten behaviors.'
  },
  {
    value: 'modules',
    question: 'Which modules does an application include?',
    answer:
      'Cache and Functions are enabled on every new application. Application Accelerator adds cache keys on cookies and query strings, POST and OPTIONS caching, and sub-minute TTLs. Image Processor derives image variants on demand with ims query parameters.'
  },
  {
    value: 'origins',
    question: 'Where does the content come from?',
    answer:
      'From connectors. A rule routes each path to a connector, and the connector holds the address — a web server, a cloud service, an Object Storage bucket. Different paths can reach different backends, and a load balancer can distribute one connector across many origins.'
  },
  {
    value: 'create',
    question: 'How do I create one?',
    answer:
      'In the Console, with azion create application in the CLI, through the API, or declared in azion.config.js and shipped by azion deploy — the same file carries the rules, the cache policies and the functions, so the configuration lives in the repository.'
  },
  {
    value: 'observability',
    question: 'How do I see what the rules decided?',
    answer:
      'Enable debug rules and every traceback lands in Real-Time Events, showing which rules matched each request. Metrics for cache hits, status codes and latency stream through Real-Time Metrics and Data Stream.'
  },
  {
    value: 'limits',
    question: 'How many applications can I have?',
    answer:
      'Developer plans hold 10 applications, Business 50, Enterprise 200, and Mission-Critical is sized with you. Each one serves as many workloads as point at it.'
  }
]

const [DAFITI_QUOTE] = quotesLedBy('dafiti')

export const APPLICATIONS_PAGE = [
  {
    section: 'Heroes',
    kind: 'centered-band',
    eyebrow: 'Applications',
    title: 'Decide what happens to every request',
    description:
      'An application is the delivery logic a workload serves: rules that route, cache, transform and run code — written once, applied in every Azion location at the same time.',
    actions: PRODUCT_HERO_ACTIONS
  },
  { section: 'StatsBand', items: FIGURES },
  {
    section: 'ConsolePanel',
    anchor: 'console',
    eyebrow: 'Console',
    title: 'Everything an application runs with, in one version',
    description:
      'The settings, cache, device groups, functions and rules of an application, kept together in a version you can review before it goes live.',
    scene: { component: markRaw(ApplicationVersionWidget) },
    tabs: [
      { value: 'main-settings', title: 'Main settings' },
      { value: 'cache-settings', title: 'Cache settings' },
      { value: 'device-groups', title: 'Device groups' },
      { value: 'functions', title: 'Functions' },
      { value: 'rules-engine', title: 'Rules engine' }
    ],
    action: { label: 'Open the console', href: '/signup' }
  },
  {
    section: 'StickyScrollCode',
    eyebrow: 'Anatomy',
    title: 'Configured in code, applied everywhere',
    description:
      'Everything an application does is a rule in azion.config.js — so the routing, the cache and the functions ship with the repository, not with a console session.',
    items: ANATOMY,
    samples: ANATOMY_SAMPLES,
    action: { label: 'Explore the Rules Engine', href: PRODUCT_DOCS }
  },
  { section: 'CapabilityGrid', items: CAPABILITIES },
  {
    section: 'QuoteBand',
    kind: 'signed',
    text: DAFITI_QUOTE.text,
    name: DAFITI_QUOTE.name,
    jobTitle: DAFITI_QUOTE.jobTitle,
    client: DAFITI_QUOTE.clientName
  },
  { ...PRODUCT_DIRECTORY, groups: PRODUCT_GROUPS },
  { section: 'FaqSection', items: FAQ },
  cliBand({
    script: 'deployApplication',
    title: 'Deploy your first application in two commands',
    description:
      'Link a project, deploy it, and curl the domain the CLI hands back. The first deploy creates the application and its workload; every one after that updates them.'
  }),
  PRODUCT_CLOSING
]
