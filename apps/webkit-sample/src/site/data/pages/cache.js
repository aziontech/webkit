import {
  CACHE_FAMILY_WALL,
  foldList,
  PRODUCT_CLOSING,
  PRODUCT_CUSTOMERS_ACTION,
  PRODUCT_DIRECTORY,
  PRODUCT_DOCS,
  PRODUCT_HERO_ACTIONS
} from '../product-pages.js'
import { CONTABILIZEI } from '../clients.js'

const PILLARS = [
  {
    icon: 'pi pi-globe',
    title: 'Global content delivery close to users',
    description:
      "Serve cached websites, APIs, and files from Azion's distributed architecture to reduce latency and absorb demand before it reaches your origin."
  },
  {
    icon: 'pi pi-bolt',
    title: 'Faster responses with less origin work',
    description:
      'Improve cache-hit performance while cutting repeated origin requests, infrastructure load, and bandwidth pressure during peak traffic.'
  },
  {
    icon: 'pi pi-sync',
    title: 'Simple control over freshness',
    description:
      'Configure TTLs, cache keys, stale content, and global purges so teams can keep content fast without complex CDN operations.'
  }
]

const SURFACES = [
  { icon: 'ai ai-azion-cli', label: 'Azion CLI' },
  { icon: 'ai ai-azion-api', label: 'REST API' },
  { icon: 'ai ai-azion', label: 'Console UI' },
  { icon: 'ai ai-terraform', label: 'Terraform' }
]

const AVAILABILITY = [
  { icon: 'ai ai-origin-shield', label: 'Stale cache' },
  { icon: 'pi pi-link', label: 'Persistent connections' },
  { icon: 'pi pi-cog', label: 'Protocol optimization' },
  { icon: 'pi pi-check-circle', label: 'High availability' }
]

const CACHE_SETTINGS = `{
  "browser_cache_settings": {
    "ttl": 3600,
    "honor_origin_headers": true
  },
  "cdn_cache_settings": {
    "ttl": 86400,
    "stale_cache_enabled": true,
    "tiered_cache_enabled": true
  },
  "cache_key_settings": {
    "query_strings": "all",
    "cookies": []
  },
  "large_file_optimization": {
    "enabled": true,
    "fragment_size_kb": 1024
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
    icon: 'pi pi-shopping-cart',
    title: 'Speed up checkout during flash sales',
    description:
      'Handle traffic spikes with intelligent caching that keeps checkout fast under load. E-commerce sites maintain conversion rates during peak events.',
    href: '/site/home'
  },
  {
    icon: 'ai ai-live-ingest',
    title: 'Stream content without buffering',
    description:
      'Deliver video and large files efficiently with large file optimization. Media companies reduce playback interruptions and improve viewer experience.',
    href: '/site/home'
  },
  {
    icon: 'ai ai-azion-api',
    title: 'Accelerate API responses',
    description:
      'Cache API responses on a distributed architecture to reduce latency and origin load. SaaS applications deliver consistent performance for repeated queries.',
    href: PRODUCT_DOCS
  },
  {
    icon: 'pi pi-sliders-h',
    title: 'Configure cache policies',
    description:
      'Set TTL, enable stale cache, and control cache keys for optimal performance. Fine-tune caching behavior for your specific content types.',
    href: PRODUCT_DOCS
  },
  {
    icon: 'pi pi-clock',
    title: 'Micro-cache dynamic content',
    description:
      'Use short TTLs to cache personalized content while maintaining freshness. Reduce origin load for semi-dynamic pages without sacrificing personalization.',
    href: '/site/home'
  },
  {
    icon: 'ai ai-layers',
    title: 'Scale multi-tenant applications',
    description:
      'Reduce infrastructure costs with tiered cache for static assets. SaaS platforms serve shared assets efficiently across multiple tenants.',
    href: PRODUCT_DOCS
  }
]

const FAQ = [
  {
    value: 'what-is',
    question: 'What is Azion Cache?',
    answer:
      'Azion Cache is a distributed caching solution for accelerating websites and APIs. Key features include: lower origin traffic, fast cache-hit response times, tiered cache architecture, stale-while-revalidate support, and large file optimization. It improves Core Web Vitals and stabilizes latency during traffic spikes.'
  },
  {
    value: 'browser-vs-cdn',
    question: "What's the difference between Browser Cache Settings and CDN Cache Settings?",
    answer:
      "Browser Cache Settings controls how long content is cached in the user's browser. CDN Cache Settings controls how long content is cached in the Azion Web Platform. You can honor origin headers or override TTLs for each layer."
  },
  {
    value: 'origin-headers',
    question: 'Can Cache honor Cache-Control and Expires headers from my origin?',
    answer:
      'Yes. You can configure both Browser Cache Settings and CDN Cache Settings to honor cache definitions sent by your origin through HTTP headers (Cache-Control and Expires).'
  },
  {
    value: 'short-ttl',
    question: 'How can I set short cache TTLs?',
    answer: 'To set short CDN cache TTL values, you must enable the Application Accelerator module.'
  },
  {
    value: 'cache-key',
    question: 'How do I control what defines the cache key (cookies and query strings)?',
    answer:
      'Use Advanced Cache Key to customize caching behavior based on cookies and query strings. This helps you cache personalized or segmented content while keeping cache efficiency high.'
  },
  {
    value: 'purge',
    question: 'How do I purge or invalidate cached content?',
    answer:
      'Use Real-Time Purge to expire cached content by URL, cache key, or wildcard. Purges are queued for execution and may take time to propagate across the distributed infrastructure.'
  },
  {
    value: 'origin-down',
    question: 'What happens if my origin is slow or unavailable?',
    answer:
      'Enable Stale Cache to serve stale content when there is a problem with your origin servers, improving availability for end users during incidents.'
  },
  {
    value: 'large-files',
    question: 'How does Cache handle large files?',
    answer:
      'Large File Optimization splits large files into fragments with a default fragment size of 1024 kB. This improves delivery of large assets and allows caching of file segments.'
  },
  {
    value: 'post-options',
    question: 'Can I cache POST or OPTIONS requests?',
    answer:
      'By default, Cache caches GET and HEAD. You can enable caching for POST and OPTIONS, but these cache options require the request body to be part of the cache key and depend on Application Accelerator.'
  },
  {
    value: 'tiered-cache',
    question: 'How do I keep long-lived assets cached longer with an additional cache layer?',
    answer:
      'Azion offers an additional cache layer called Tiered Cache designed for assets that can remain cached for long periods. It can be enabled on cache policies with a Maximum TTL in Tiered Cache of 2,592,000 seconds (default TTL 60 seconds).'
  },
  {
    value: 'vs-cdn',
    question: 'What is the difference between Azion Cache and standard CDNs?',
    answer:
      'Azion Cache is integrated with the Azion Web Platform, providing unified management for caching, security, and compute. Unlike standalone CDNs, it works with Functions for dynamic cache manipulation, WAF for protected caching, and Application Accelerator for advanced TTL control.'
  },
  {
    value: 'integrations',
    question: 'How does Cache integrate with other Azion products?',
    answer:
      'Cache integrates with Rules Engine for conditional caching policies, Application Accelerator for short TTLs, Image Processor for optimized image caching, and Functions for programmatic cache key manipulation. This unified approach reduces complexity compared to multi-vendor solutions.'
  }
]

export const CACHE_PAGE = [
  {
    section: 'Heroes',
    kind: 'centered-carousel',
    eyebrow: 'Cache',
    title: 'Accelerate content delivery globally',
    description:
      'Serve cached content with fast response times. Reduce origin load and keep applications fast during traffic spikes.',
    actions: PRODUCT_HERO_ACTIONS
  },
  { section: 'CapabilityGrid', items: PILLARS },
  {
    section: 'MediaSplitStack',
    kind: 'solutions',
    bands: [
      {
        title: 'Configure smarter cache policies',
        description: foldList(
          'Set browser and edge TTLs, enable tiered cache, and keep content fresh with stale revalidation. Azion Web Platform helps improve hit ratio, lower latency, and reduce origin bandwidth.',
          SURFACES
        ),
        href: PRODUCT_DOCS,
        illustration: 'fastest-path-to-live-website',
        illustrationLabel: 'A request served from cache, with the origin behind it',
        actions: [{ label: 'Docs', href: PRODUCT_DOCS }]
      },
      {
        title: 'High-availability caching for critical traffic',
        description: foldList(
          'Use protocol optimizations, persistent connections, and stale cache to keep serving the latest cached responses during origin failures or revalidation, so websites and APIs stay fast.',
          AVAILABILITY
        ),
        href: '/signup',
        illustration: 'distributed-apis',
        illustrationLabel: "One request fanning into the cache layer's content types",
        actions: [{ label: 'Start Free', href: '/signup' }]
      }
    ]
  },
  {
    section: 'CodeSplit',
    kind: 'default',
    title: 'Fine-tune cache policies for your content',
    description: 'Configure caching policies that match your content strategy.',
    files: CODE_FILES,
    defaultFile: 'cache-settings',
    copyAriaLabel: 'Copy the cache settings sample',
    actions: [{ label: 'Learn More', href: PRODUCT_DOCS }]
  },
  { section: 'CapabilityGrid', items: USE_CASES },
  {
    section: 'LogoWallQuote',
    items: CACHE_FAMILY_WALL,
    quote: {
      text: '"I really like the depth of cache rules that I can apply at the edge. There are things that we would not be able to do using solutions from other vendors. In terms of performance, compliance to Contabilizei\'s rules and delivery standards, we are very satisfied with Azion\'s performance."',
      name: 'Marcelo Pacheco',
      jobTitle: 'DevOps Specialist at Contabilizei',
      client: CONTABILIZEI
    },
    actions: [PRODUCT_CUSTOMERS_ACTION]
  },
  PRODUCT_DIRECTORY,
  { section: 'FaqSection', items: FAQ },
  PRODUCT_CLOSING
]
