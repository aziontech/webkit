import {
  foldList,
  PRODUCT_CLOSING,
  PRODUCT_CUSTOMERS_ACTION,
  PRODUCT_DIRECTORY,
  PRODUCT_DOCS,
  PRODUCT_HERO_ACTIONS,
  registeredClient,
  withWallClient
} from '../product-pages.js'

const PILLARS = [
  {
    icon: 'pi pi-bolt',
    title: 'Faster dynamic applications',
    description:
      'Accelerate APIs and web apps with protocol optimizations, connection reuse, and cache rules that reduce latency before requests reach your origin.'
  },
  {
    icon: 'pi pi-sliders-h',
    title: 'Fine-grained cache control',
    description:
      'Define how content varies by method, path, query string, cookie, or header so teams can cache dynamic experiences without breaking personalization.'
  },
  {
    icon: 'pi pi-th-large',
    title: 'Global acceleration without replatforming',
    description:
      'Apply acceleration on a distributed architecture in front of existing origins, improving performance without rewriting applications or changing where data lives.'
  }
]

const SURFACES = [
  { icon: 'ai ai-azion', label: 'Console' },
  { icon: 'ai ai-azion-cli', label: 'CLI' },
  { icon: 'ai ai-azion-api', label: 'API' },
  { icon: 'ai ai-terraform', label: 'Terraform' }
]

const CACHE_KEY = [
  { icon: 'ai ai-filter-alt', label: 'Query string rules' },
  { icon: 'ai ai-variables', label: 'Cookie variation' },
  { icon: 'ai ai-json', label: 'Header support' },
  { icon: 'ai ai-tiered-cache', label: '64 cache keys' }
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

const USE_CASES = [
  {
    icon: 'ai ai-azion-api',
    title: 'Accelerate REST and GraphQL APIs',
    description:
      'Cache API responses with query string and cookie-based segmentation for faster client applications.',
    href: '/site/home'
  },
  {
    icon: 'pi pi-shopping-cart',
    title: 'Optimize product catalogs',
    description: 'Segment listings by category, region, and user preferences with cache key rules.',
    href: '/site/home'
  },
  {
    icon: 'ai ai-layers',
    title: 'Personalize multi-tenant apps',
    description: 'Serve tenant-specific content with cookie-based cache variation rules.',
    href: PRODUCT_DOCS
  },
  {
    icon: 'ai ai-live-ingest',
    title: 'Stream content faster',
    description: 'Cache playlists and user preferences while serving browsing content efficiently.',
    href: PRODUCT_DOCS
  },
  {
    icon: 'pi pi-bolt',
    title: 'Reduce API latency',
    description: 'Short TTLs for rapidly changing data endpoints and real-time applications.',
    href: PRODUCT_DOCS
  },
  {
    icon: 'pi pi-user',
    title: 'Deliver personalized experiences',
    description:
      'Cache user-specific content with session-based cookie variation for tailored delivery.',
    href: PRODUCT_DOCS
  }
]

const FAQ = [
  {
    value: 'what-is',
    question: 'What is Application Accelerator?',
    answer:
      'Application Accelerator is an Applications module for accelerating web applications and APIs through protocol optimizations and advanced cache rules. It enables protocol optimization for dynamic content, Advanced Cache Key processing with query strings and cookies, POST and OPTIONS request caching, and short TTL support. The module reduces latency and improves throughput for data-intensive applications on Azion Web Platform.'
  },
  {
    value: 'advanced-cache-key',
    question: 'What is Advanced Cache Key?',
    answer:
      'Advanced Cache Key lets you control how content is segmented in cache beyond the URL path. You can configure cache variation rules based on query strings, cookies, and headers—enabling fine-grained control over which parameters differentiate cached objects. This supports up to 64 custom cache keys per edge application.'
  },
  {
    value: 'query-string-fields',
    question: 'Can I vary cached content by query string fields?',
    answer:
      'Yes. You can configure cache variation by specific query string fields using four modes: Whitelist (only listed fields considered), Blocklist (ignores specified fields), All fields (considers all variations), and Query String Sort (order becomes irrelevant). This lets you control exactly which parameters affect cache segmentation.'
  },
  {
    value: 'cookies',
    question: 'Can I vary cached content by cookies?',
    answer:
      'Yes. You can configure cache variation by specific cookie names, which is useful for session-based or personalized content. Modes include: URL-based only, Whitelist (allowed cookies), Blocklist (exceptions), and All cookies. This enables content segmentation by user profiles, browsing sessions, access regions, and targeting needs.'
  },
  {
    value: 'production',
    question: 'How do I apply cache settings in production?',
    answer:
      'Create cache settings in the Applications module, then activate them with Rules Engine rules. You can use request or response phase logic to decide when a cache policy should apply. This allows granular control over caching behavior based on URL patterns, headers, cookies, or other request attributes.'
  },
  {
    value: 'short-ttl',
    question: 'Can I set short cache TTLs?',
    answer:
      'Yes. With Application Accelerator enabled, you can customize short cache TTL values, including immediate expiration. This is ideal for rapidly changing content and real-time applications that require near-instant cache invalidation.'
  },
  {
    value: 'post-options',
    question: 'Can I cache POST or OPTIONS requests?',
    answer:
      'Yes. Application Accelerator enables caching for POST and OPTIONS requests, extending beyond the default GET and HEAD methods. When enabled, the request body becomes part of the cache key, so different payloads are cached separately. This is optimized for frequently accessed or data-intensive API endpoints.'
  },
  {
    value: 'vs-cdn',
    question: 'How does Application Accelerator compare to traditional CDN caching?',
    answer:
      'Traditional CDN caching typically supports only GET and HEAD requests with limited cache key customization. Application Accelerator provides protocol optimization for dynamic content, Advanced Cache Key with query string and cookie support, POST/OPTIONS caching, and short TTLs, all on a distributed architecture without cold starts. This enables caching strategies not possible with standard CDN configurations.'
  },
  {
    value: 'ttl-limits',
    question: 'What are the default TTL limits?',
    answer:
      'Default cache TTL limits include a configurable minimum and maximum range. You can choose values based on your content requirements, with short TTL support available when Application Accelerator is enabled.'
  },
  {
    value: 'costs',
    question: 'Does enabling Application Accelerator affect costs?',
    answer:
      'Application Accelerator is a premium module with usage-based pricing. Advanced cache features require the module to be active, and data transfer may generate additional costs depending on your configuration. Contact Azion support for specific pricing details based on your plan and expected usage.'
  }
]

const ZOOP = registeredClient('Zoop')

export const APPLICATION_ACCELERATOR_PAGE = [
  {
    section: 'Heroes',
    kind: 'centered-carousel',
    eyebrow: 'Application Accelerator',
    title: 'Accelerate dynamic APIs and apps',
    description:
      'Speed up web applications with protocol optimizations and advanced cache rules. Cache POST requests and use short TTLs for real-time data.',
    actions: PRODUCT_HERO_ACTIONS
  },
  { section: 'CapabilityGrid', items: PILLARS },
  {
    section: 'MediaSplitStack',
    kind: 'solutions',
    bands: [
      {
        title: 'Optimize dynamic delivery',
        description: foldList(
          'Define acceleration rules for APIs, personalized content, and dynamic routes without changing your stack. Azion Web Platform helps improve performance, SEO, and reliability across distributed applications.',
          SURFACES
        ),
        href: PRODUCT_DOCS,
        illustration: 'infrastructure-as-code',
        illustrationLabel:
          'An Azion provider declared in Terraform, raising the resources beside it',
        actions: [{ label: 'Docs', href: PRODUCT_DOCS }]
      },
      {
        title: 'Advanced Cache Key for personalized content delivery',
        description: foldList(
          'Control how content is segmented in cache beyond the URL path. Configure cache variation rules based on query strings, cookies, and headers—enabling fine-grained control for personalized experiences.',
          CACHE_KEY
        ),
        href: PRODUCT_DOCS,
        illustration: 'distributed-apis',
        illustrationLabel: 'One request segmented into cache by query string, cookie and header',
        actions: [{ label: 'Learn more', href: PRODUCT_DOCS }]
      }
    ]
  },
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
  { section: 'CapabilityGrid', items: USE_CASES },
  {
    section: 'LogoWallQuote',
    items: withWallClient(ZOOP),
    quote: {
      text: '"Azion delivered the advanced protection and superior performance we needed, with fast implementation and immediate results."',
      name: 'Ismael Aguilar',
      jobTitle: 'Information Security Manager at Zoop',
      client: ZOOP
    },
    actions: [PRODUCT_CUSTOMERS_ACTION]
  },
  PRODUCT_DIRECTORY,
  { section: 'FaqSection', items: FAQ },
  PRODUCT_CLOSING
]
