import { markRaw } from 'vue'

import WorkloadTopologyScene from '../../ui/WorkloadTopologyScene.vue'
import { PLANS } from '../pricing.js'
import { BUILD_CTA, quotesLedBy } from '../solutions.js'

const DOCS = '/site/docs'

const BENEFITS = [
  {
    title: 'Pay for what you serve',
    description:
      'You are billed for the requests a workload answers and the compute it runs, not for the hours a hostname sits waiting for traffic.'
  },
  {
    title: 'Close to your users, by default',
    description:
      'One create puts the workload in every Azion location. There is no region to pick, no replica to add, and no traffic manager to keep in step.'
  },
  {
    title: 'No cold starts',
    description:
      'Azion Runtime starts an isolate per request, so there is nothing to pre-warm and no first-request penalty to design around.'
  },
  {
    title: 'Scale without pre-provisioning',
    description:
      'Concurrency is not capacity you buy in advance. A launch day scales the same way an ordinary Tuesday does.'
  },
  {
    title: 'Run it locally first',
    description:
      'The Azion CLI runs your application against the same runtime on your machine, so what you test is what the workload serves.'
  },
  {
    title: 'JavaScript, TypeScript or WebAssembly',
    description:
      'Ship the language you already write, or start from a framework preset and let the build produce the bundle the workload runs.'
  }
]

const USE_CASES = [
  {
    title: 'Serve a web application',
    description:
      'Point a domain at an application and let every location answer it. Static assets, server-rendered pages and API routes all come from the same workload.'
  },
  {
    title: 'Front an origin you already have',
    description:
      'Keep the infrastructure you run today. The workload terminates TLS, applies the rules, caches what it can, and forwards only what it has to.'
  },
  {
    title: 'Split traffic across environments',
    description:
      'Give staging its own hostname on the same application, or point a second workload at a new deployment and move traffic to it when you are ready.'
  },
  {
    title: 'Protect what you expose',
    description:
      'Bind a firewall to the workload and every request that reaches the hostname passes WAF, rate limiting and network lists before anything else runs.'
  }
]

const AZION_CONFIG = `export default {
  build: { preset: 'vue' },
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
        name: 'Redirect to index.html',
        match: '^\\/',
        behavior: { rewrite: '/index.html' }
      }
    ]
  }
}`

const HANDLER = `export default {
  async fetch(request) {
    const url = new URL(request.url)

    if (url.pathname === '/api/status') {
      return Response.json({ region: 'edge', ok: true })
    }

    return fetch(request)
  }
}`

const STORAGE = `export default {
  async fetch(request) {
    const url = new URL(request.url)
    const asset = await fetch(new URL(url.pathname, 'file://assets-prod/'))

    return new Response(asset.body, {
      headers: { 'cache-control': 'public, max-age=86400' }
    })
  }
}`

const CODE_TABS = [
  {
    label: 'azion.config.js',
    value: 'config',
    language: 'javascript',
    code: AZION_CONFIG,
    fileName: 'azion.config.js',
    fileIcon: 'pi pi-code'
  },
  {
    label: 'main.js',
    value: 'handler',
    language: 'javascript',
    code: HANDLER,
    fileName: 'main.js',
    fileIcon: 'pi pi-code'
  },
  {
    label: 'assets.js',
    value: 'storage',
    language: 'javascript',
    code: STORAGE,
    fileName: 'assets.js',
    fileIcon: 'pi pi-code'
  }
]

const RECIPES = [
  {
    title: 'Declare the workload in code',
    description:
      'The hostname, the build preset and the routing live in the repository, so shipping a change is a commit rather than a console session.'
  },
  {
    title: 'Answer the request yourself',
    description:
      'Return a response from the handler when a route needs logic — an auth check, a redirect, a shaped payload — instead of sending it to the origin.'
  },
  {
    title: 'Serve objects from storage',
    description:
      'Bind a bucket to the workload and let it answer with the object directly, with no server in front of it and no egress charge behind it.'
  }
]

const DEPLOY_TABS = [
  {
    label: 'npm',
    value: 'npm',
    language: 'bash',
    code: `npm install -D azion
npx azion deploy`,
    fileName: 'terminal',
    fileIcon: 'pi pi-code'
  },
  {
    label: 'pnpm',
    value: 'pnpm',
    language: 'bash',
    code: `pnpm add -D azion
pnpm azion deploy`,
    fileName: 'terminal',
    fileIcon: 'pi pi-code'
  },
  {
    label: 'yarn',
    value: 'yarn',
    language: 'bash',
    code: `yarn add -D azion
yarn azion deploy`,
    fileName: 'terminal',
    fileIcon: 'pi pi-code'
  }
]

const PRODUCT_GROUPS = [
  {
    label: 'Compute',
    items: [
      {
        icon: 'ai ai-edge-application',
        title: 'Applications',
        description: 'The code and rules a workload serves'
      },
      {
        icon: 'ai ai-edge-functions',
        title: 'Functions',
        description: 'Run serverless code closer to users',
        href: '/site/products/functions'
      },
      {
        icon: 'ai ai-edge-orchestrator',
        title: 'Rules Engine',
        description: 'Automate request handling with programmable rules'
      },
      {
        icon: 'ai ai-load-balancer',
        title: 'Load Balancer',
        description: 'Distribute traffic for performance and availability'
      }
    ]
  },
  {
    label: 'Deliver',
    items: [
      {
        icon: 'ai ai-tiered-cache',
        title: 'Cache',
        description: 'Speed up content delivery',
        href: '/site/products/cache'
      },
      {
        icon: 'ai ai-edge-application',
        title: 'Application Accelerator',
        description: 'Optimize dynamic applications',
        href: '/site/products/application-accelerator'
      },
      {
        icon: 'ai ai-edge-dns',
        title: 'Edge DNS',
        description: 'Distributed authoritative DNS'
      },
      {
        icon: 'ai ai-layers',
        title: 'Image Processor',
        description: 'Optimize and transform images in real time'
      }
    ]
  },
  {
    label: 'Store',
    items: [
      {
        icon: 'ai ai-edge-storage',
        title: 'Object Storage',
        description: 'Store and serve objects at the edge'
      },
      {
        icon: 'ai ai-edge-sql',
        title: 'SQL Database',
        description: 'A distributed SQL database'
      },
      {
        icon: 'ai ai-edge-kv',
        title: 'KV Store',
        description: 'Low-latency key-value store'
      }
    ]
  },
  {
    label: 'Secure',
    items: [
      {
        icon: 'ai ai-edge-firewall',
        title: 'Edge Firewall',
        description: 'Filter every request before it reaches your code'
      },
      {
        icon: 'ai ai-waf-rules',
        title: 'WAF',
        description: 'Web application firewall'
      },
      {
        icon: 'ai ai-network-lists',
        title: 'Network Shield',
        description: 'Network and DDoS protection'
      },
      {
        icon: 'ai ai-real-time-metrics',
        title: 'Real-Time Metrics',
        description: 'Watch traffic, errors and latency as they happen'
      }
    ]
  }
]

const [HEROSPARK_QUOTE] = quotesLedBy('herospark')

export const WORKLOADS_PAGE = [
  {
    section: 'Heroes',
    kind: 'copy-on-top-art',
    eyebrow: 'Workloads',
    title: 'Put your application on the edge in seconds',
    description:
      'A workload is the hostname, the certificate and the routing that make an application reachable. Create one and it is live in every Azion location — no servers to size, no regions to pick.',
    actions: [
      { label: 'Start free', href: '/signup', kind: 'secondary' },
      { label: 'Docs', href: DOCS, kind: 'outlined', trailing: true }
    ],
    scene: { component: markRaw(WorkloadTopologyScene) },
    scenePlacement: 'top'
  },
  { section: 'CapabilityGrid', items: BENEFITS },
  {
    section: 'MediaSplitBand',
    kind: 'two-actions',
    eyebrow: 'Architecture',
    title: 'Serverless from the ground up: isolates, not containers',
    description:
      'A workload does not reserve a container per deployment. Azion Runtime runs your code in an isolate — a sandbox measured in kilobytes rather than gigabytes — so one location holds thousands of them and starts another the moment a request arrives.',
    illustration: 'runtime',
    illustrationLabel: 'One request reaching a workload, which starts an isolate per request',
    actions: [{ label: 'Read the architecture', href: DOCS, kind: 'secondary', trailing: true }]
  },
  { section: 'UseCaseLinks', title: 'You can use workloads to:', items: USE_CASES },
  {
    section: 'CodeSplit',
    kind: 'recipes',
    title: 'From a hostname to a full stack, on one platform',
    description:
      'Go past hello world: storage, a database, a firewall and a cache policy all bind to the same workload — each one a binding, not another deployment to operate.',
    files: CODE_TABS,
    defaultFile: 'config',
    copyAriaLabel: 'Copy the workload sample',
    recipes: RECIPES
  },
  {
    section: 'CodeSplit',
    kind: 'default',
    title: 'Deploy with confidence, even on Fridays',
    description:
      'Go from localhost to every location with one command. The CLI builds the application, creates the workload the first time, and updates it after that.',
    files: DEPLOY_TABS,
    defaultFile: 'npm',
    copyAriaLabel: 'Copy the deploy command'
  },
  {
    section: 'MediaSplitStack',
    kind: 'solutions',
    bands: [
      {
        title: 'Go fast, or slow',
        description:
          'Promote a deployment to every location at once, or move a share of traffic to it and watch the metrics first. If errors rise, roll back to the deployment that was serving before — from the same screen that shipped it.',
        href: DOCS,
        illustration: 'preview',
        illustrationLabel:
          'Traffic split between the deployment that is live and the one being rolled out',
        actions: [{ label: 'Deployment strategies', href: DOCS, trailing: true }]
      }
    ]
  },
  {
    section: 'QuoteBand',
    kind: 'signed',
    text: HEROSPARK_QUOTE.text,
    name: HEROSPARK_QUOTE.name,
    jobTitle: HEROSPARK_QUOTE.jobTitle,
    client: HEROSPARK_QUOTE.clientName,
    actions: [
      {
        label: 'View success story',
        href: 'https://www.azion.com/en/success-case/herospark-30-percent-performance-azion/',
        kind: 'outlined',
        trailing: true,
        external: true
      }
    ]
  },
  {
    section: 'StatsBand',
    items: PLANS.map((plan) => ({
      value: plan.price.monthly.value,
      prefix: plan.price.monthly.prefix,
      suffix: plan.price.monthly.suffix,
      label: plan.name
    }))
  },
  {
    section: 'PlatformDirectory',
    eyebrow: 'Complete, not complex',
    title: 'Powerful primitives, seamlessly integrated',
    description:
      'A workload is the way in. Everything it binds to runs on the same platform, under the same account, billed on the same invoice.',
    groups: PRODUCT_GROUPS
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
