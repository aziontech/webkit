import { markRaw } from 'vue'

import { productWidget } from '../../ui/product-widget'
import {
  PRODUCT_CLOSING,
  PRODUCT_DOCS,
  PRODUCT_DOCS_ACTIONS,
  PRODUCT_HERO_ACTIONS
} from '../product-pages.js'
import { quotesLedBy } from '../solutions.js'

const ApplicationAcceleratorCookieFragment = productWidget('application-accelerator-cookie')
const ApplicationAcceleratorMethodFragment = productWidget('application-accelerator-method')
const ApplicationAcceleratorQueryStringFragment = productWidget(
  'application-accelerator-query-string'
)

const PILLARS = [
  {
    icon: 'pi pi-bolt',
    title: 'Faster dynamic applications',
    description:
      'Accelerate APIs and web apps with protocol optimizations, connection reuse, and cache rules that reduce latency before requests reach your origin.'
  },
  {
    icon: 'pi pi-cog',
    title: 'Fine-grained cache control',
    description:
      'Define how content varies by method, path, query string, cookie, or header so teams can cache dynamic experiences without breaking personalization.'
  },
  {
    icon: 'pi pi-table',
    title: 'Global acceleration without replatforming',
    description:
      'Apply acceleration on a distributed architecture in front of existing origins, improving performance without rewriting applications or changing where data lives.'
  }
]

const USE_CASES = [
  {
    icon: 'pi pi-code',
    title: 'Accelerate REST and GraphQL APIs',
    description:
      'Cache API responses with query string and cookie-based segmentation for faster client applications.',
    href: '/site/solutions/web-apps'
  },
  {
    icon: 'pi pi-shopping-cart',
    title: 'Optimize product catalogs',
    description: 'Segment listings by category, region, and user preferences with cache key rules.',
    href: '/site/solutions/retail'
  },
  {
    icon: 'pi pi-cloud',
    title: 'Personalize multi-tenant apps',
    description: 'Serve tenant-specific content with cookie-based cache variation rules.',
    href: '/site/solutions/technology'
  },
  {
    icon: 'pi pi-play-circle',
    title: 'Stream content faster',
    description: 'Cache playlists and user preferences while serving browsing content efficiently.',
    href: '/site/solutions/streaming'
  }
]

const FAQ = [
  {
    value: 'what-is',
    question: 'What is Application Accelerator?',
    answer:
      'Application Accelerator is an Applications module that speeds up web applications and APIs with protocol optimizations and advanced cache rules. It optimizes the protocol for dynamic content, processes Advanced Cache Key with query strings and cookies, caches POST and OPTIONS requests, and supports short TTLs. The module lowers latency and raises throughput for data-intensive applications on the Azion Web Platform.'
  },
  {
    value: 'advanced-cache-key',
    question: 'What is Advanced Cache Key?',
    answer:
      'Advanced Cache Key lets you control how content is segmented in cache beyond the URL path. You can configure cache variation rules based on query strings, cookies, and headers—enabling fine-grained control over which parameters differentiate cached objects. This supports up to 64 custom cache keys per application.'
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
      'Traditional CDN caching usually supports only GET and HEAD requests, with limited cache key options. Application Accelerator adds protocol optimization for dynamic content, Advanced Cache Key with query string and cookie support, POST and OPTIONS caching, and short TTLs, all on a distributed architecture with no cold starts. That makes caching strategies possible that standard CDN setups cannot do.'
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

export const APPLICATION_ACCELERATOR_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    titleLength: 'short',
    eyebrow: 'Application Accelerator',
    title: 'Accelerate dynamic APIs and apps',
    description:
      'Speed up web applications with protocol optimizations and advanced cache rules. Cache POST requests and use short TTLs for real-time data.',
    actions: PRODUCT_HERO_ACTIONS
  },
  { section: 'CapabilityGrid', gap: false, items: PILLARS },
  {
    section: 'FeatureWidgets',
    anchor: 'built-in',
    eyebrow: 'Built in',
    title: 'Advanced Cache Key in every cache setting',
    description:
      'Method, query string and cookie variation live in the cache setting the module unlocks, versioned and deployed with the application.',
    actions: PRODUCT_DOCS_ACTIONS,
    columns: 3,
    items: [
      {
        icon: 'ai ai-azion-api',
        title: 'Cache POST and OPTIONS requests',
        description:
          'Extend caching beyond GET and HEAD. The request body becomes part of the cache key, so different payloads are cached separately.',
        scene: { component: markRaw(ApplicationAcceleratorMethodFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'ai ai-filter-alt',
        title: 'Vary cache by query string',
        description:
          'Choose which query string fields segment the cache, and sort them so parameter order never splits it.',
        scene: { component: markRaw(ApplicationAcceleratorQueryStringFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'ai ai-variables',
        title: 'Vary cache by cookie',
        description:
          'Name the cookies that segment session-based and personalized content, by user profile, browsing session or access region.',
        scene: { component: markRaw(ApplicationAcceleratorCookieFragment) },
        href: PRODUCT_DOCS
      }
    ]
  },
  {
    section: 'UseCases',
    eyebrow: 'Use Cases',
    title: 'What teams use Application Accelerator for',
    description:
      'Put Application Accelerator in front of dynamic APIs and apps and cache what standard CDN caching cannot, with the methods, query strings and cookies you choose. Teams use it to:',
    action: { label: 'Docs', href: PRODUCT_DOCS, trailing: true },
    items: USE_CASES
  },
  { section: 'ClientQuotes', quotes: quotesLedBy('zoop') },
  { section: 'FaqSection', items: FAQ },
  PRODUCT_CLOSING
]
