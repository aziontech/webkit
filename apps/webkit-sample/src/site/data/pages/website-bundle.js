import { BLOG_FEATURED } from '../blog.js'
import { PRODUCT_DOCS } from '../product-pages.js'
import { quotesLedBy } from '../solutions.js'
import { BLOG_PAGE } from './blog.js'
import { blogPostPage } from './blog-post.js'
import { CACHE_PAGE } from './cache.js'
import { CAREERS_HOME_PAGE } from './careers-home.js'
import { CONTACT_PAGE } from './contact.js'
import { FINANCIAL_SERVICES_PAGE } from './financial-services.js'
import { FUNCTIONS_PAGE } from './functions.js'
import { HOME_PAGE } from './home.js'
import { LEARNING_PAGE } from './learning.js'
import { PRICING_PAGE } from './pricing.js'
import { PRODUCTS_PAGE } from './products.js'
import { SOLUTIONS_PAGE } from './solutions.js'
import { SUCCESS_CASES_PAGE } from './success-cases.js'
import { SUPPORT_PAGE } from './support.js'
import { VERCEL_ALTERNATIVE_PAGE } from './vercel-alternative.js'
import { WORKLOADS_PAGE } from './workloads.js'

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
    icon: 'ai ai-image-processor',
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

const CACHE_SETTINGS = `{
  "cache_settings": {
    "name": "api-cache",
    "browser_cache_settings": {
      "ttl": 60
    },
    "cdn_cache_settings": {
      "ttl": 30
    },
    "cache_key": {
      "query_string": "whitelist",
      "query_string_fields": ["user_id", "category"],
      "cookie": "whitelist",
      "cookie_names": ["session_id", "region"]
    },
    "methods": ["GET", "POST", "OPTIONS"],
    "stale_cache": true
  }
}`

const CODE_FILES = [
  {
    label: 'cache-settings.json',
    value: 'cache-settings',
    language: 'json',
    code: CACHE_SETTINGS,
    fileName: 'cache-settings.json',
    fileIcon: 'ai ai-json'
  }
]

const FRAMEWORKS = ['vue', 'react', 'nextjs', 'astro', 'svelte', 'angular', 'nuxt']

const [DAFITI_QUOTE] = quotesLedBy('dafiti')

const pick = (page, section) => {
  const entry = page.find((candidate) => candidate.section === section)
  if (!entry) throw new Error(`website-bundle: no "${section}" section on the source page.`)
  const { gap: _gap, ...rest } = entry
  return rest
}

const BLOG_POST_PAGE = blogPostPage(BLOG_FEATURED.key)

const ARCHITECTURE = {
  section: 'Architectures',
  eyebrow: 'Architecture',
  title: 'One platform for API and AI traffic',
  description:
    'Agents, apps and workflows reach models, tools and APIs through the same gateway, so every call is authenticated, routed and observed in one place.',
  action: {
    label: 'See the architecture',
    href: '/site/docs/ai-inference',
    kind: 'secondary',
    trailing: true
  },
  levels: [
    [
      { icon: 'pi pi-sitemap', role: 'Workflow', title: 'Order pipeline', detail: 'Nightly batch' },
      { icon: 'pi pi-comments', role: 'AI app', title: 'Support chat', detail: 'Web and mobile' },
      { icon: 'pi pi-android', role: 'Agent', title: 'Code reviewer', detail: 'MCP client' }
    ],
    [
      {
        icon: 'pi pi-shield',
        role: 'AI Gateway',
        title: 'Routing and control',
        detail: 'Auth, cache, rate limit, logs',
        lit: true
      }
    ],
    [
      {
        icon: 'pi pi-sparkles',
        role: 'Model',
        title: 'Claude Opus 5.5',
        detail: 'Anthropic',
        tag: { label: 'Primary', severity: 'success' }
      },
      {
        icon: 'pi pi-sparkles',
        role: 'Model',
        title: 'GPT-5.5',
        detail: 'OpenAI',
        tag: { label: 'Fallback', severity: 'secondary' }
      },
      { icon: 'pi pi-wrench', role: 'MCP server', title: 'Internal tools', detail: 'Self-hosted' },
      { icon: 'pi pi-database', role: 'Database', title: 'Customer records', detail: 'Postgres' }
    ]
  ]
}

export const WEBSITE_BUNDLE_PAGE = [
  pick(HOME_PAGE, 'Heroes'),

  pick(FUNCTIONS_PAGE, 'ClientQuotes'),
  {
    section: 'QuoteBand',
    kind: 'signed',
    text: DAFITI_QUOTE.text,
    name: DAFITI_QUOTE.name,
    jobTitle: DAFITI_QUOTE.jobTitle,
    client: DAFITI_QUOTE.clientName
  },
  pick(SOLUTIONS_PAGE, 'LogoWallQuote'),
  pick(HOME_PAGE, 'RecognitionMarquee'),
  pick(HOME_PAGE, 'ClientMosaic'),
  pick(FINANCIAL_SERVICES_PAGE, 'ComplianceBadges'),

  pick(HOME_PAGE, 'NetworkSection'),
  pick(PRODUCTS_PAGE, 'StatsBand'),

  pick(HOME_PAGE, 'MediaSplitStack'),
  pick(WORKLOADS_PAGE, 'MediaSplitBand'),
  pick(CAREERS_HOME_PAGE, 'PhotoMarquee'),
  pick(HOME_PAGE, 'FeatureTiles'),
  {
    section: 'CodeSplit',
    kind: 'default',
    title: 'From basic caching to advanced acceleration',
    description:
      'Application Accelerator extends Cache with protocol optimizations and advanced cache rules for dynamic content.',
    files: CODE_FILES,
    defaultFile: 'cache-settings',
    copyAriaLabel: 'Copy the cache settings sample',
    actions: [{ label: 'Learn More', href: PRODUCT_DOCS }]
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
  pick(WORKLOADS_PAGE, 'FeatureTabs'),
  {
    section: 'TemplateGallery',
    eyebrow: '',
    title: 'Quick start with templates',
    description:
      'Build faster with pre-built applications and starter kits for common use cases. Deploy complete projects in seconds with popular frameworks.',
    actions: [{ label: 'Deploy now', href: '/signup', kind: 'secondary', trailing: true }],
    stackLabel: 'Compatible with your stack',
    stackMarks: FRAMEWORKS
  },
  pick(FUNCTIONS_PAGE, 'WidgetGrid'),
  pick(WORKLOADS_PAGE, 'ConsolePanel'),

  ARCHITECTURE,
  pick(PRODUCTS_PAGE, 'CapabilityGrid'),
  pick(PRODUCTS_PAGE, 'PlatformDirectory'),
  pick(CACHE_PAGE, 'UseCases'),
  pick(FUNCTIONS_PAGE, 'IntegrationCode'),
  pick(FINANCIAL_SERVICES_PAGE, 'ResourceGrid'),
  pick(LEARNING_PAGE, 'SubjectLibrary'),
  pick(CAREERS_HOME_PAGE, 'ListingTable'),
  pick(SUCCESS_CASES_PAGE, 'ListingBrowser'),
  pick(VERCEL_ALTERNATIVE_PAGE, 'ComparisonTable'),
  pick(SUPPORT_PAGE, 'CompareSupportTiers'),
  pick(BLOG_PAGE, 'ArticleHighlight'),
  pick(BLOG_PAGE, 'ArticleIndex'),

  pick(PRICING_PAGE, 'PricingPlans'),
  pick(PRICING_PAGE, 'ComparePlans'),
  pick(PRICING_PAGE, 'FaqSection'),

  pick(CONTACT_PAGE, 'HeroForm'),

  pick(BLOG_POST_PAGE, 'ArticleBody'),
  pick(BLOG_POST_PAGE, 'ArticleCards'),
  pick(HOME_PAGE, 'ClosingCallToAction')
]
