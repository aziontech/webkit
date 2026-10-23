import { RETAIL_CLIENT_STRIP } from '@shared/ui/brand/strips.js'
import { markRaw } from 'vue'

import { productWidget } from '../../ui/product-widget'
import { BLOG_FEATURED } from '../blog.js'
import { PLATFORM_ARCHITECTURE_BAND } from '../product-architectures.js'
import {
  agentsClosing,
  PRODUCT_CLOSING,
  PRODUCT_DOCS,
  PRODUCT_SECURITY_CLOSING,
  salesClosing
} from '../product-pages.js'
import { NETWORK_TOPICS } from '../solutions.js'
import { WORKLOAD_RECIPE_TABS } from '../workload-recipes.js'
import { ABOUT_PAGE } from './about.js'
import { AI_GATEWAY_PAGE } from './ai-gateway.js'
import { BLOG_CLOSING, BLOG_PAGE } from './blog.js'
import { blogPostPage } from './blog-post.js'
import { CACHE_PAGE } from './cache.js'
import { CAREERS_HOME_PAGE } from './careers-home.js'
import { CAREERS_JOBS_PAGE } from './careers-jobs.js'
import { CONTACT_PAGE } from './contact.js'
import { FINANCIAL_SERVICES_PAGE } from './financial-services.js'
import { FUNCTIONS_PAGE } from './functions.js'
import { HOME_PAGE, HOME_SOLUTIONS_BAND } from './home.js'
import { LEARNING_PAGE } from './learning.js'
import { HERO as PERFORMANCE_HERO } from './performance.js'
import { PRICING_PAGE } from './pricing.js'
import { RECOGNITIONS_PAGE } from './recognitions.js'
import { RESOURCE_HUB_PAGE } from './resource-hub.js'
import { SOLUTIONS_PAGE } from './solutions.js'
import { SUCCESS_CASES_PAGE } from './success-cases.js'
import { SUPPORT_PAGE } from './support.js'
import { TECHNOLOGY_PAGE } from './technology.js'
import { VERCEL_ALTERNATIVE_PAGE } from './vercel-alternative.js'
import { WORKLOAD_ARCHITECTURE_BAND } from './workloads.js'

const WorkloadDeployLogsWidget = productWidget('workload-deploy-logs')
const WorkloadDomainsWidget = productWidget('workload-domains')
const WorkloadRolloutRowsWidget = productWidget('workload-rollout-rows')
const WorkloadsListWidget = productWidget('workloads-list')
const WorkloadTopologyChainWidget = productWidget('workload-topology-chain')

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
    icon: 'ai ai-rules-engine',
    title: 'Rules Engine',
    description:
      'Each request walks your rules in order. Criteria match it, and behaviors send it to a bucket, an origin, a function, or a redirect.'
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
      'Bind a function and run it on the routes that need logic (auth checks, redirects, shaped payloads) before the origin is ever reached.'
  },
  {
    icon: 'pi pi-arrow-right-arrow-left',
    title: 'Response phase',
    description:
      'Rules run on the way out too: add security headers, rewrite cookies, or change what the origin answered before the user sees it.'
  },
  {
    icon: 'ai ai-image-processor',
    title: 'Image Processor',
    description:
      'Keep one source image and derive every variant on demand with an ims query, such as fit-in/400x400. Each variant is cached like any other response.'
  }
]

const sample = (value, label, code) => ({
  label,
  value,
  language: 'javascript',
  code,
  fileName: 'azion.config.js',
  fileIcon: 'ai-cor ai-js'
})

const ANATOMY_SAMPLES = [
  sample('routing', 'Rules Engine', ROUTING_SAMPLE),
  sample('cache', 'Cache', CACHE_SAMPLE),
  sample('functions', 'Functions', FUNCTION_SAMPLE),
  sample('response', 'Response phase', RESPONSE_SAMPLE),
  sample('images', 'Image Processor', IMAGE_SAMPLE)
]

const PLATFORM_DIRECTORY_BAND = {
  section: 'PlatformDirectory',
  title: 'Everything you need to build and run applications',
  ariaLabel: 'Azion products',
  groups: [
    {
      label: 'Build',
      items: [
        {
          icon: 'ai ai-edge-functions',
          title: 'Functions',
          description: 'Run code globally with no cold starts',
          href: '/site/products/functions'
        },
        {
          icon: 'ai ai-rules-engine',
          title: 'Rules Engine',
          description: 'Automate request handling with rules',
          href: 'https://www.azion.com/en/documentation/products/build/applications/rules-engine/'
        },
        {
          icon: 'ai ai-image-processor',
          title: 'Image Processor',
          description: 'Resize and convert images on demand',
          href: 'https://www.azion.com/en/products/image-processor/'
        },
        {
          icon: 'ai ai-tiered-cache',
          title: 'Cache',
          description: 'Speed up content delivery and reduce origin load',
          href: 'https://www.azion.com/en/products/cache/'
        },
        {
          icon: 'ai ai-edge-ai',
          title: 'AI Inference',
          description: 'Run models close to the user',
          href: 'https://www.azion.com/en/products/ai-inference/'
        },
        {
          icon: 'ai ai-ai-gateway',
          title: 'AI Gateway',
          description: 'Route, secure and log every model call',
          href: 'https://www.azion.com/en/solutions#ai'
        }
      ]
    },
    {
      label: 'Store',
      items: [
        {
          icon: 'ai ai-edge-storage',
          title: 'Object Storage',
          description: 'Store and serve objects close to users',
          href: 'https://www.azion.com/en/products/object-storage/'
        },
        {
          icon: 'ai ai-edge-sql',
          title: 'SQL Database',
          description: 'Run SQL on a distributed database',
          href: 'https://www.azion.com/en/products/sql-database/'
        },
        {
          icon: 'ai ai-edge-kv',
          title: 'KV Store',
          description: 'Store key-value data with low latency',
          href: 'https://www.azion.com/en/products/kv-store/'
        }
      ]
    },
    {
      label: 'Secure',
      items: [
        {
          icon: 'ai ai-waf-rules',
          title: 'WAF',
          description: 'Block common attacks close to traffic',
          href: 'https://www.azion.com/en/products/web-application-firewall/'
        },
        {
          icon: 'ai ai-azion-api',
          title: 'API Gateway',
          description: 'Secure, manage, and scale API traffic',
          href: 'https://www.azion.com/en/solutions/api-gateway/'
        },
        {
          icon: 'ai ai-bot-manager',
          title: 'Bot Manager',
          description: 'Detect and stop automated traffic',
          href: 'https://www.azion.com/en/products/bot-manager/'
        },
        {
          icon: 'ai ai-edge-dns',
          title: 'Edge DNS',
          description: 'Authoritative DNS, distributed globally',
          href: 'https://www.azion.com/en/products/edge-dns/'
        },
        {
          icon: 'ai ai-load-balancer',
          title: 'Load Balancer',
          description: 'Spread traffic across origins for availability',
          href: 'https://www.azion.com/en/products/load-balancer/'
        }
      ]
    },
    {
      label: 'Observe',
      items: [
        {
          icon: 'ai ai-real-time-metrics',
          title: 'Real-Time Metrics',
          description: 'Watch traffic, errors and latency as they happen',
          href: 'https://www.azion.com/en/documentation/platform/real-time-metrics/'
        }
      ]
    }
  ]
}

const FRAMEWORKS = ['vue', 'react', 'nextjs', 'astro', 'svelte', 'angular', 'nuxt']

const pick = (page, section) => {
  const entry = page.find((candidate) => candidate.section === section)
  if (!entry) throw new Error(`website-bundle: no "${section}" section on the source page.`)
  const { gap: _gap, ...rest } = entry
  return rest
}

const BARE_WIDGET = { kind: 'bare', chrome: false, width: 600 }

const WORKLOAD_FEATURES = [
  {
    title: 'Every workload on one list',
    description:
      'See each workload with its domain, status and last deployment, so what is live is never a question.',
    action: { label: 'Docs', href: PRODUCT_DOCS, trailing: true },
    scene: {
      component: markRaw(WorkloadsListWidget),
      props: { ...BARE_WIDGET, width: 680 }
    }
  },
  {
    title: 'Read the deployment topology',
    description:
      'The domains, the application and the firewall a workload serves, drawn as one chain.',
    action: { label: 'Docs', href: PRODUCT_DOCS, trailing: true },
    scene: { component: markRaw(WorkloadTopologyChainWidget), props: BARE_WIDGET }
  },
  {
    title: 'Domains and TLS, handled',
    description:
      'Add a domain, get its certificate issued and renewed, and set the TLS floor without leaving the page.',
    action: { label: 'Docs', href: PRODUCT_DOCS, trailing: true },
    scene: { component: markRaw(WorkloadDomainsWidget), props: BARE_WIDGET }
  },
  {
    title: 'Ship a version in seconds',
    description:
      'Build, upload, propagate and warm the cache, every step streamed as it happens until the version is live everywhere.',
    action: { label: 'Docs', href: PRODUCT_DOCS, trailing: true },
    scene: { component: markRaw(WorkloadDeployLogsWidget), props: BARE_WIDGET }
  },
  {
    title: 'Gradual rollouts and instant rollback',
    description:
      'Send a share of traffic to a new version, promote it to every data center once it holds, or roll back to the last one without a redeploy.',
    action: { label: 'Docs', href: PRODUCT_DOCS, trailing: true },
    scene: { component: markRaw(WorkloadRolloutRowsWidget), props: BARE_WIDGET }
  }
]

const CLOSING_PANEL = {
  section: 'ClosingCallToAction',
  kind: 'panel',
  title: 'Ready to join us?',
  description: 'Explore our open positions and find the right fit for you.',
  actions: [
    {
      label: 'See all roles',
      href: '/site/careers/jobs',
      kind: 'secondary',
      trailing: true
    }
  ]
}

const CLOSING_SPLIT = salesClosing({
  eyebrow: 'Protect',
  title: 'Protected by default.',
  titleMuted: 'Always on.',
  description: 'Stronger protection, less attack exposure, less operational drag.'
})

const BLOG_POST_PAGE = blogPostPage(BLOG_FEATURED.key)

const FINANCIAL_RESOURCES = pick(FINANCIAL_SERVICES_PAGE, 'ResourceGrid')
const TECHNOLOGY_RESOURCES = pick(TECHNOLOGY_PAGE, 'ResourceGrid')
const SCROLLING_RESOURCES = {
  ...TECHNOLOGY_RESOURCES,
  items: [...TECHNOLOGY_RESOURCES.items, ...FINANCIAL_RESOURCES.items.slice(2)]
}

export const WEBSITE_BUNDLE_PAGE = [
  pick(SOLUTIONS_PAGE, 'HeroWithOpening'),
  pick(HOME_PAGE, 'Heroes'),
  {
    section: 'Heroes',
    kind: 'copy-beside-art',
    ...PERFORMANCE_HERO,
    actions: [
      { label: 'Start for free', href: '/signup', kind: 'secondary' },
      { label: 'Talk to a specialist', href: '/site/contact', kind: 'outlined', trailing: true }
    ],
    art: {
      name: 'improve-application-performance-and-reliability',
      alt: 'A website served through Azion, scoring 99 on performance'
    },
    carouselMarks: RETAIL_CLIENT_STRIP
  },
  pick(VERCEL_ALTERNATIVE_PAGE, 'Heroes'),
  pick(CACHE_PAGE, 'Heroes'),
  pick(SUPPORT_PAGE, 'Heroes'),
  pick(ABOUT_PAGE, 'Heroes'),
  pick(RECOGNITIONS_PAGE, 'Heroes'),
  pick(CONTACT_PAGE, 'HeroForm'),

  pick(FUNCTIONS_PAGE, 'ClientQuotes'),
  pick(SOLUTIONS_PAGE, 'LogoWallQuote'),
  pick(HOME_PAGE, 'RecognitionMarquee'),
  pick(HOME_PAGE, 'ClientMosaic'),
  pick(FINANCIAL_SERVICES_PAGE, 'ComplianceBadges'),
  pick(ABOUT_PAGE, 'InvestorMarks'),

  pick(HOME_PAGE, 'NetworkSection'),
  { ...pick(HOME_PAGE, 'NetworkSection'), kind: 'benefits', benefits: NETWORK_TOPICS },

  HOME_SOLUTIONS_BAND,
  pick(CAREERS_HOME_PAGE, 'PhotoMarquee'),
  pick(HOME_PAGE, 'FeatureTiles'),
  {
    section: 'FeatureScroll',
    eyebrow: 'Workloads',
    title: 'Everything a workload does, one screen at a time',
    description:
      'Scroll through the console a workload is run from: the list, the topology, the domains, the deploy and the rollout.',
    items: WORKLOAD_FEATURES
  },
  pick(CACHE_PAGE, 'FeatureWidgets'),
  {
    section: 'StickyScrollCode',
    eyebrow: 'Anatomy',
    title: 'Configured in code, applied everywhere',
    description:
      'Everything an application does is a rule in azion.config.js, so the routing, the cache, and the functions ship with the repository, not with a console session.',
    items: ANATOMY.map((item) => ({
      ...item,
      action: { label: 'Docs', href: PRODUCT_DOCS, trailing: true }
    })),
    samples: ANATOMY_SAMPLES
  },
  pick(AI_GATEWAY_PAGE, 'CodeSplit'),
  pick(FUNCTIONS_PAGE, 'CliTerminal'),
  {
    section: 'FeatureTabs',
    title: 'From a hostname to a full stack, on one platform',
    description:
      'Storage, a database, a firewall and a cache policy all bind to the same workload. Each one is a binding, not another deployment to run.',
    tabs: WORKLOAD_RECIPE_TABS,
    copyAriaLabel: 'Copy the workload sample',
    action: { label: 'Docs', href: PRODUCT_DOCS }
  },
  WORKLOAD_ARCHITECTURE_BAND,
  PLATFORM_ARCHITECTURE_BAND,
  pick(VERCEL_ALTERNATIVE_PAGE, 'MediaSplitBand'),
  {
    section: 'TemplateGallery',
    title: 'Quick start with templates',
    description:
      'Build faster with pre-built applications and starter kits for common use cases. Deploy complete projects in seconds with popular frameworks.',
    stackLabel: 'Compatible with your stack',
    stackMarks: FRAMEWORKS
  },
  PLATFORM_DIRECTORY_BAND,
  pick(CACHE_PAGE, 'UseCases'),
  FINANCIAL_RESOURCES,
  SCROLLING_RESOURCES,
  pick(LEARNING_PAGE, 'SubjectLibrary'),
  pick(CAREERS_HOME_PAGE, 'ListingTable'),
  pick(CAREERS_JOBS_PAGE, 'ListingBrowser'),
  pick(SUCCESS_CASES_PAGE, 'StoryLibrary'),
  pick(VERCEL_ALTERNATIVE_PAGE, 'CompareCompetitors'),
  pick(SUPPORT_PAGE, 'CompareSupportTiers'),
  pick(BLOG_PAGE, 'ArticleHighlight'),
  pick(BLOG_PAGE, 'ArticleIndex'),
  pick(RESOURCE_HUB_PAGE, 'ArticleIndex'),

  pick(PRICING_PAGE, 'PricingPlans'),
  pick(PRICING_PAGE, 'ComparePlans'),
  pick(PRICING_PAGE, 'FaqSection'),

  pick(BLOG_POST_PAGE, 'ArticleBody'),
  pick(BLOG_POST_PAGE, 'ArticleCards'),
  { ...PRODUCT_CLOSING, anchor: '' },
  { ...PRODUCT_SECURITY_CLOSING, anchor: '' },
  { ...CLOSING_SPLIT, anchor: '' },
  { ...CLOSING_PANEL, anchor: '' },
  { ...BLOG_CLOSING, anchor: '' },
  agentsClosing('Built by you, or your agents.')
]
