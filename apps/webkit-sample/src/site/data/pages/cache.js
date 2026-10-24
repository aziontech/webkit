import { markRaw } from 'vue'

import { productWidget } from '../../ui/product-widget'
import {
  PRODUCT_CLOSING,
  PRODUCT_DOCS,
  PRODUCT_DOCS_ACTIONS,
  PRODUCT_HERO_ACTIONS
} from '../product-pages.js'
import { quotesLedBy } from '../solutions.js'

const ApplicationCacheFragment = productWidget('application-cache')
const ApplicationFunctionFragment = productWidget('application-function')
const ApplicationRuleFragment = productWidget('application-rule')

const PILLARS = [
  {
    icon: 'ai ai-content-delivery',
    title: 'Global content delivery close to users',
    description:
      "Serve cached websites, APIs, and files from Azion's distributed architecture. Latency drops, and demand is absorbed before it reaches your origin."
  },
  {
    icon: 'ai ai-origin-accelerator',
    title: 'Faster responses with less origin work',
    description:
      'Get faster cache hits and fewer repeated origin requests. Infrastructure load and bandwidth pressure stay low during peak traffic.'
  },
  {
    icon: 'pi pi-sync',
    title: 'Simple control over freshness',
    description:
      'Set TTLs, cache keys, stale content, and global purges to keep content fresh and fast, without complex CDN operations.'
  }
]

const USE_CASES = [
  {
    icon: 'ai ai-app-accelerator',
    title: 'Stay fast through flash sales',
    description:
      'Serve catalog and static pages from cache while checkout stays dynamic. Origin traffic drops by up to 90% during peak campaigns, as MadeiraMadeira saw.',
    href: PRODUCT_DOCS
  },
  {
    icon: 'ai ai-live-ingest',
    title: 'Deliver large files and video',
    description:
      'Large file optimization fragments objects and caches them on demand, so downloads and video segments start sooner and origin bandwidth stays flat.',
    href: PRODUCT_DOCS
  },
  {
    icon: 'ai ai-azion-api',
    title: 'Cache API responses',
    description:
      'Cache repeated GET responses with cache keys built from the URL, query string, cookies and device group. Mobiauto improved delivery performance by 70%.',
    href: PRODUCT_DOCS
  },
  {
    icon: 'ai ai-origin-shield',
    title: 'Survive an origin outage',
    description:
      'Stale cache keeps serving the last good copy when the origin returns 5xx errors, times out or is unreachable, so users never see the failure.',
    href: PRODUCT_DOCS
  }
]

const FAQ = [
  {
    value: 'what-is',
    question: 'What is Azion Cache?',
    answer:
      'Azion Cache is a distributed cache for websites and APIs. It lowers origin traffic, returns cache hits fast, and supports tiered caching, stale-while-revalidate, and large file optimization. It improves Core Web Vitals and steadies latency during traffic spikes.'
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
      'Azion Cache is part of the Azion Web Platform, so you manage caching, security, and compute in one place. Unlike standalone CDNs, it works with Functions to change cache behavior in code, WAF to protect cached content, and Application Accelerator for advanced TTL control.'
  },
  {
    value: 'integrations',
    question: 'How does Cache integrate with other Azion products?',
    answer:
      'Cache works with Rules Engine for conditional caching policies, Application Accelerator for short TTLs, Image Processor for optimized image caching, and Functions for programmatic cache key changes. One platform means fewer moving parts than a multi-vendor setup.'
  }
]

export const CACHE_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    titleLength: 'short',
    eyebrow: 'Cache',
    title: 'Deliver content fast, worldwide',
    description:
      'Serve cached content close to users. Cut origin load and keep applications fast during traffic spikes.',
    actions: PRODUCT_HERO_ACTIONS
  },
  { section: 'CapabilityGrid', gap: false, items: PILLARS },
  {
    section: 'FeatureWidgets',
    anchor: 'built-in',
    eyebrow: 'Built in',
    title: 'Every cache control in one application',
    description:
      'Cache settings, the rules that apply them and the functions that shape responses live inside the application, versioned and deployed with it.',
    actions: PRODUCT_DOCS_ACTIONS,
    columns: 3,
    items: [
      {
        icon: 'ai ai-tiered-cache',
        title: 'Cache settings you reuse',
        description:
          'Set the CDN TTL, stale cache and large file optimization once, then reuse the setting wherever the application needs it.',
        scene: { component: markRaw(ApplicationCacheFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'ai ai-rules-engine',
        title: 'Rules that decide what is cached',
        description:
          'Match a path, a method or a header, and attach a cache setting to just that traffic.',
        scene: { component: markRaw(ApplicationRuleFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'ai ai-edge-functions',
        title: 'Functions for the cases rules miss',
        description:
          'Rewrite cache headers on the response in a few lines of JavaScript, running in every data center before the response leaves.',
        scene: { component: markRaw(ApplicationFunctionFragment) },
        href: PRODUCT_DOCS
      }
    ]
  },
  {
    section: 'UseCases',
    eyebrow: 'Use Cases',
    title: 'What teams use Cache for',
    description:
      'Put Cache in front of any origin and serve repeat traffic from Azion’s distributed infrastructure, with the TTLs, cache keys and stale behavior you set. Teams use it to:',
    action: { label: 'Docs', href: PRODUCT_DOCS, trailing: true },
    items: USE_CASES
  },
  { section: 'ClientQuotes', quotes: quotesLedBy('contabilizei') },
  { section: 'FaqSection', items: FAQ },
  PRODUCT_CLOSING
]
