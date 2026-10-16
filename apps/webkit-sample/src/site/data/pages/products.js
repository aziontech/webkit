import { CLIENT_STRIP } from '@shared/ui/brand/strips.js'

const PRODUCT_GUARANTEES = [
  {
    title: 'One platform, one bill',
    description:
      'Every product runs on the same network and the same account. Nothing to integrate, nothing to reconcile.'
  },
  {
    title: 'Provisioned in seconds',
    description:
      'A product is a capability you switch on, not infrastructure you size. Capacity follows the traffic.'
  },
  {
    title: 'Programmable end to end',
    description:
      'Every product answers to the same API, the same CLI and the same Terraform provider.'
  }
]

const PRODUCT_REACH = [
  { value: '100', suffix: 'ms', label: 'Median response, worldwide' },
  { value: '24', suffix: '/7', label: 'Support on every plan' },
  { value: '99.99', suffix: '%', label: 'Availability, contractual' }
]

const PRODUCT_GROUPS = [
  {
    key: 'build',
    title: 'Build',
    description: 'Code, media, and inference running at the edge, close to whoever asks.',
    items: [
      {
        illustration: 'build-applications',
        title: 'Functions',
        description: 'Run code at the edge, with no server to maintain.'
      },
      {
        illustration: 'ai-applications',
        title: 'AI Inference',
        description: 'Inference and agents right next to your data.'
      },
      {
        illustration: 'fastest-path-to-live-website',
        title: 'Image Processor',
        description: 'One origin, every format negotiated at delivery.'
      }
    ]
  },
  {
    key: 'store',
    title: 'Store',
    description: 'Data persisted where the request lands, not in a distant region.',
    items: [
      {
        illustration: 'distributed-apis',
        title: 'SQL Database',
        description: 'A distributed relational database, queried at the edge.'
      },
      {
        illustration: 'saas-platforms',
        title: 'Object Storage',
        description: 'Objects served from the point closest to the user.'
      },
      {
        illustration: 'implement-api-gateway-security',
        title: 'Credentials',
        description: 'Per-environment keys, rotated with zero downtime.'
      }
    ]
  },
  {
    key: 'protect',
    title: 'Protect',
    description: 'Traffic inspected before it ever reaches your origin.',
    items: [
      {
        illustration: 'programmable-security',
        title: 'WAF',
        description: 'Rules applied at the edge, ahead of your backend.'
      },
      {
        illustration: 'automate-threat-mitigation',
        title: 'Bot Manager',
        description: 'Bots identified and stopped on the way in.'
      },
      {
        illustration: 'dns-protection',
        title: 'Network Shield',
        description: 'The entire network as your defense perimeter.'
      }
    ]
  },
  {
    key: 'observe',
    title: 'Observe',
    description: 'Every request recorded, every decision traceable.',
    items: [
      {
        illustration: 'live-debugging',
        title: 'Real-Time Metrics',
        description: 'Latency and volume in real time, with no sampling.'
      },
      {
        illustration: 'runtime',
        title: 'Edge Pulse',
        description: 'Perceived quality measured in the real browser.'
      },
      {
        illustration: 'infrastructure-as-code',
        title: 'Deploy Path',
        description: 'From branch to production, with a preview at every step.'
      }
    ]
  }
]

const PRODUCT_DIRECTORY = [
  {
    label: 'Compute',
    items: [
      {
        icon: 'ai ai-workloads',
        title: 'Workloads',
        description: 'Put an application on a hostname, everywhere',
        href: '/site/products/workloads'
      },
      {
        icon: 'ai ai-edge-application',
        title: 'Applications',
        description: 'Decide what happens to every request',
        href: '/site/products/applications'
      },
      {
        icon: 'ai ai-edge-functions',
        title: 'Functions',
        description: 'Run serverless code closer to users',
        href: '/site/products/functions'
      },
      {
        icon: 'ai ai-app-accelerator',
        title: 'Application Accelerator',
        description: 'Tune delivery for dynamic and API traffic',
        href: '/site/products/application-accelerator'
      },
      {
        icon: 'ai ai-tiered-cache',
        title: 'Cache',
        description: 'Hold content at the point closest to the request',
        href: '/site/products/cache'
      },
      {
        icon: 'ai ai-image-processor',
        title: 'Image Processor',
        description: 'Optimize and transform images in real time',
        href: '/site/products/image-processor'
      },
      {
        icon: 'ai ai-load-balancer',
        title: 'Load Balancer',
        description: 'Distribute traffic for performance and availability',
        href: '/site/products/load-balancer'
      }
    ]
  },
  {
    label: 'AI',
    items: [
      {
        icon: 'ai ai-edge-ai',
        title: 'AI Inference',
        description: 'Run AI models closer to users',
        href: 'https://www.azion.com/en/products/ai-inference/'
      },
      {
        icon: 'ai ai-ai-gateway',
        title: 'AI Gateway',
        description: 'Secure, manage, and optimize AI traffic',
        href: '/site/products/ai-gateway'
      }
    ]
  },
  {
    label: 'Data',
    items: [
      {
        icon: 'ai ai-edge-storage',
        title: 'Object Storage',
        description: 'Scalable, durable storage for unstructured data',
        href: '/site/products/object-storage'
      },
      {
        icon: 'ai ai-edge-sql',
        title: 'SQL Database',
        description: 'Query relational data at the edge',
        href: '/site/products/sql-database'
      },
      {
        icon: 'ai ai-edge-kv',
        title: 'KV Store',
        description: 'Globally distributed, low-latency key-value store',
        href: '/site/products/kv-store'
      }
    ]
  },
  {
    label: 'Security',
    items: [
      {
        icon: 'ai ai-waf-rules',
        title: 'WAF',
        description: 'Filter malicious requests before the origin',
        href: '/site/products/web-application-firewall'
      },
      {
        icon: 'ai ai-bot-manager',
        title: 'Bot Management',
        description: 'Detect and stop automated threats instantly',
        href: '/site/products/bot-manager'
      },
      {
        icon: 'ai ai-edge-dns',
        title: 'DNS',
        description: 'Reliably host authoritative DNS zones worldwide',
        href: '/site/products/edge-dns'
      },
      {
        icon: 'ai ai-edge-firewall',
        title: 'Firewall',
        description: 'Filter every request before it reaches your code',
        href: '/site/products/firewall'
      },
      {
        icon: 'ai ai-network-lists',
        title: 'Network Shield',
        description: 'Block threats at the network layer before origin',
        href: '/site/products/network-shield'
      },
      {
        icon: 'pi pi-shield',
        title: 'DDoS Protection',
        description: 'Stop volumetric attacks automatically',
        href: '/site/products/ddos-protection'
      }
    ]
  },
  {
    label: 'Observe',
    items: [
      {
        icon: 'ai ai-data-stream',
        title: 'Data Stream',
        description: 'Send logs and events to your SIEM or data lake',
        href: '/site/products/data-stream'
      },
      {
        icon: 'ai ai-real-time-events',
        title: 'Real-Time Events',
        description: 'Investigate every request in seconds',
        href: '/site/products/real-time-events'
      },
      {
        icon: 'ai ai-real-time-metrics',
        title: 'Real-Time Metrics',
        description: 'Watch traffic, errors and latency as they happen',
        href: '/site/products/real-time-metrics'
      }
    ]
  }
]

export const PRODUCTS_PAGE = [
  {
    section: 'Heroes',
    kind: 'centered-carousel',
    eyebrow: 'Products',
    highlight: 'Everything you need',
    title: 'on one distributed platform',
    description:
      'Compute, storage, security and observability as products you switch on — provisioned in seconds, billed on one account, and running on the same network.',
    actions: [
      { label: 'Start Free', href: '/signup', kind: 'secondary' },
      { label: 'See pricing', href: '/site/pricing', kind: 'outlined', trailing: true }
    ],
    carouselLabel: 'Running in production on these products',
    carouselMarks: CLIENT_STRIP
  },
  { section: 'CapabilityGrid', items: PRODUCT_GUARANTEES },
  { section: 'StatsBand', items: PRODUCT_REACH },
  ...PRODUCT_GROUPS.map((group) => ({
    section: 'FeatureTiles',
    kind: 'illustrated',
    anchor: group.key,
    title: group.title,
    description: group.description,
    tiles: group.items
  })),
  {
    section: 'PlatformDirectory',
    eyebrow: 'Go straight there',
    title: 'Every product, one list',
    ariaLabel: 'Product index',
    groups: PRODUCT_DIRECTORY
  },
  {
    section: 'ClosingCallToAction',
    kind: 'split',
    eyebrow: 'Build',
    title: 'Build once.',
    titleMuted: 'Run everywhere.',
    description: 'Get a faster path to launch, lower latency, and less infrastructure overhead.',
    actions: [{ label: 'Start Free', href: '/signup', kind: 'secondary' }],
    aside: { label: 'Talk to our team', href: '/site/contact' }
  }
]
