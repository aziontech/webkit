import { markRaw } from 'vue'

import KvStoreFunctionFragment from '../../ui/mockup/widgets/KvStoreFunctionFragment.vue'
import KvStoreKeyFragment from '../../ui/mockup/widgets/KvStoreKeyFragment.vue'
import KvStoreSecurityListFragment from '../../ui/mockup/widgets/KvStoreSecurityListFragment.vue'
import {
  PLATFORM_DIRECTORY,
  PRODUCT_CLOSING,
  PRODUCT_DOCS,
  PRODUCT_HERO_ACTIONS
} from '../product-pages.js'
import { quotesLedBy } from '../solutions.js'

const PILLARS = [
  {
    icon: 'pi pi-bolt',
    title: 'Low-latency reads worldwide',
    description:
      'Serve sessions, feature flags, configuration, and lookup data close to users, so global applications decide fast.'
  },
  {
    icon: 'pi pi-database',
    title: 'Simple key-value API at scale',
    description:
      'Store application state with a schemaless API. It supports JSON, binary data, streams, metadata, and TTLs.'
  },
  {
    icon: 'pi pi-shield-check',
    title: 'Persistent state beyond cache',
    description:
      'Keep durable key-value data for read-heavy workloads, with no volatile cache entries and no repeated origin lookups.'
  }
]

const USE_CASES = [
  {
    icon: 'pi pi-users',
    title: 'Session management and authentication',
    description:
      'Store user sessions, authentication tokens, and login states close to users. Fast reads validate sessions without round-trips.',
    href: '/site/solutions/web-apps'
  },
  {
    icon: 'pi pi-sliders-h',
    title: 'Feature flags and configuration',
    description:
      'Sync feature flags and application configuration globally with low latency. Roll out features, run A/B tests, and manage settings with TTL.',
    href: '/site/solutions/technology'
  },
  {
    icon: 'pi pi-shield',
    title: 'API rate limiting and quotas',
    description:
      'Implement sliding window rate limits, token quotas, and access rules. Track API usage per IP, user, or token with fast lookups.',
    href: '/site/solutions/security'
  },
  {
    icon: 'pi pi-chart-line',
    title: 'Global counters and analytics',
    description:
      'Count pageviews, inventory levels, and API usage in real time with distributed counters. Aggregate metrics across regions with eventual consistency.',
    href: '/site/solutions/retail'
  }
]

const FAQ = [
  {
    value: 'what-is',
    question: 'What is KV Store?',
    answer:
      'Azion KV Store is a serverless key-value database with global read replicas. It offers low-latency reads across Azion’s distributed infrastructure, automatic replication, native Functions integration, TTL support, and flexible data types (String, JSON, Buffer, Stream). The API is compatible with Cloudflare Workers KV for easy migration. Use it for sessions, feature flags, rate limiting, and configuration.'
  },
  {
    value: 'data-types',
    question: 'What data types does KV Store support?',
    answer:
      'KV Store supports 4 data types natively: String, JSON objects, binary buffers, and streams. Unlike string-only key-value stores, you can store complex objects and binary data without serialization overhead. The schemaless design lets you model data without migrations.'
  },
  {
    value: 'replication',
    question: 'How does replication work?',
    answer:
      'KV Store uses a primary instance for writes and global read replicas. Data synchronizes with eventual consistency, providing high availability and fast reads close to users. This suits reference data, sessions, and configuration that do not need immediate global consistency.'
  },
  {
    value: 'expiration',
    question: 'Can I set expiration on keys?',
    answer:
      'Yes. KV Store supports native TTL (time-to-live) to automatically expire ephemeral keys. This is useful for session tokens, temporary feature flags, cache entries, and time-limited configurations.'
  },
  {
    value: 'functions',
    question: 'How do I access KV Store from Functions?',
    answer:
      'Functions access KV Store through a native JavaScript API in the runtime. There are no extra network hops: your code reads and writes data in the same execution environment.'
  },
  {
    value: 'use-cases',
    question: 'What are common use cases for KV Store?',
    answer:
      'Common use cases include: session management (store user sessions and authentication tokens with TTL), feature flags (manage rollouts and A/B tests globally), rate limiting (implement sliding window limits per IP or user), configuration (store app config with low-latency reads), counters (track pageviews and API usage), and security lists (block bad actors with fast lookups).'
  },
  {
    value: 'limits',
    question: 'What are the storage limits?',
    answer:
      'KV Store supports keys up to 512 bytes and values up to 25 MB. You can attach metadata to each key-value pair for additional context. These limits cover most session, configuration, and feature flag use cases.'
  },
  {
    value: 'workers-kv',
    question: 'Is KV Store compatible with Cloudflare Workers KV?',
    answer:
      'Yes. KV Store provides a compatible API with Cloudflare Workers KV, making migration straightforward. Code written for Cloudflare KV requires minimal changes to run on Azion. This reduces lock-in and lets teams keep familiar patterns.'
  },
  {
    value: 'free-tier',
    question: 'Is there a free tier to test KV Store?',
    answer:
      'Yes. You get $300 in credits valid for 365 days to test KV Store and other Azion products. Start building right away: there is nothing to provision, it is fully serverless, and it scales to zero when idle.'
  },
  {
    value: 'pricing',
    question: 'How does pricing compare to Cloudflare Workers KV?',
    answer:
      'Cloudflare Workers KV charges $5 per 1M writes—10x their read pricing ($0.50/1M reads). For write-heavy workloads like session management, this adds up quickly. Azion uses consumption-based pricing without the write premium. Compare total costs based on your read/write ratio.'
  }
]

export const KV_STORE_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    titleLength: 'long',
    eyebrow: 'KV Store',
    title: 'Fast key-value storage built for global applications',
    description:
      'Eventually consistent key-value storage with automatic global replication, for read-heavy workloads and modern applications.',
    actions: PRODUCT_HERO_ACTIONS
  },
  { section: 'CapabilityGrid', gap: false, items: PILLARS },
  {
    section: 'FeatureWidgets',
    anchor: 'built-in',
    eyebrow: 'Built in',
    title: 'Application state in one namespace',
    description:
      'Keys, their expiration and the functions that read them live in the same namespace, replicated globally and read where the request lands.',
    actions: PRODUCT_HERO_ACTIONS,
    columns: 3,
    items: [
      {
        icon: 'ai ai-edge-kv',
        title: 'Keys that expire on their own',
        description:
          'Set a TTL on session tokens and temporary flags, and attach metadata to any key. Keys run up to 512 bytes, values up to 25 MB.',
        scene: { component: markRaw(KvStoreKeyFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'pi pi-ban',
        title: 'Security lists read in real time',
        description:
          'Store IP addresses and threat signatures, block attackers in real time, and query large block lists with low latency.',
        scene: { component: markRaw(KvStoreSecurityListFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'ai ai-edge-functions',
        title: 'From key-value to full application state',
        description:
          'Read, write and count keys from Functions, next to SQL Database and Object Storage, to manage complete application state.',
        scene: { component: markRaw(KvStoreFunctionFragment) },
        href: PRODUCT_DOCS
      }
    ]
  },
  {
    section: 'MediaSplitStack',
    kind: 'solutions',
    bands: [
      {
        title: 'Native JavaScript API for Functions',
        description:
          'Access KV Store directly from Functions to store and retrieve sessions, flags, and counters with no extra network hops. The API is compatible with Cloudflare Workers KV, so migration is easy.',
        href: '/site/products/functions',
        illustration: 'replicated-reads',
        illustrationLabel: 'A function reading a session cache from KV Store across data centers',
        actions: [{ label: 'Functions', href: '/site/products/functions' }]
      },
      {
        title: 'Store any data type, no schema required',
        description:
          'Store JSON objects, binary data, and streams with no rigid schema and no serialization overhead. Attach metadata for extra context.',
        href: PRODUCT_DOCS,
        illustration: 'read-at-the-edge',
        illustrationLabel: 'Code reading keys from KV Store, with text, JSON and blob values',
        actions: [{ label: 'Docs', href: PRODUCT_DOCS }]
      }
    ]
  },
  {
    section: 'UseCases',
    eyebrow: 'Use Cases',
    title: 'What teams use KV Store for',
    description:
      'Put KV Store behind any function and read sessions, flags and counters from Azion’s distributed infrastructure, close to the request. Teams use it to:',
    action: { label: 'View docs', href: PRODUCT_DOCS, trailing: true },
    items: USE_CASES
  },
  { section: 'ClientQuotes', quotes: quotesLedBy('herospark') },
  PLATFORM_DIRECTORY,
  { section: 'FaqSection', items: FAQ },
  PRODUCT_CLOSING
]
