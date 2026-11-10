const CLOUDFLARE_GROUPS = [
  {
    title: 'Architecture and resilience',
    rows: [
      {
        capability: 'Unified platform',
        definition:
          'Delivery, compute, storage, and security run on one platform with one configuration model.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'Global network',
        definition: 'How many locations serve traffic close to end users.',
        azion: 'partial',
        competitor: 'full'
      },
      {
        capability: 'Same routing on every plan',
        definition:
          'Whether lower-tier traffic is moved to other locations first when a data center runs short of capacity.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: 'Load balancing and failover',
        definition:
          'Steering traffic away from unhealthy origins or locations, included on every plan.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: 'Instant cache purge',
        definition: 'Removing cached content from every location within seconds.',
        azion: 'full',
        competitor: 'full'
      }
    ]
  },
  {
    title: 'Support and services',
    rows: [
      {
        capability: 'Enterprise response time',
        definition: 'How fast a support engineer answers a critical, production-down ticket.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: '24×7 critical support',
        definition: 'Round-the-clock coverage for business-critical outages.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'Professional services',
        definition: 'Specialists who plan and run migrations and architecture changes.',
        azion: 'full',
        competitor: 'full'
      }
    ]
  },
  {
    title: 'Security',
    rows: [
      {
        capability: 'Web application firewall',
        definition: 'Managed rules that block attacks on applications and APIs.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'DDoS protection',
        definition:
          'Absorbing volumetric and application-layer attacks before they reach the origin.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'Bot management',
        definition:
          'Detecting and blocking automated traffic, available without an Enterprise contract.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: 'Zero Trust (SASE)',
        definition: 'Verifying every user and device before granting access to internal apps.',
        azion: 'full',
        competitor: 'full'
      }
    ]
  },
  {
    title: 'Compute',
    rows: [
      {
        capability: 'Serverless functions',
        definition: 'Running application code at the edge on web standards.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'AI inference',
        definition: 'Running AI models on the provider’s network, close to users.',
        azion: 'full',
        competitor: 'full'
      }
    ]
  },
  {
    title: 'Observability',
    rows: [
      {
        capability: 'Real-time metrics',
        definition: 'Live traffic, performance, and security dashboards.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'Log streaming',
        definition: 'Sending logs in real time to your SIEM or data lake, on every plan.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: 'Ingest, catalog & query',
        definition:
          'Streaming events into storage, organizing them as tables, and querying them with SQL.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'Object storage',
        definition: 'S3-compatible storage for files and objects.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'SQL database',
        definition: 'A relational database replicated close to users.',
        azion: 'full',
        competitor: 'full'
      }
    ]
  },
  {
    title: 'Commercial',
    rows: [
      {
        capability: 'Predictable pricing',
        definition: 'Knowing in advance what a month of traffic and compute will cost.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: 'Committed-use discounts',
        definition: 'Lower rates in exchange for a reserved volume or term.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: 'Every feature on every plan',
        definition: 'No product or feature locked behind an Enterprise contract.',
        azion: 'full',
        competitor: 'partial'
      }
    ]
  }
]

const VERCEL_GROUPS = [
  {
    title: 'Platform',
    rows: [
      {
        capability: 'Delivery, compute, storage, and security on one platform',
        definition:
          'Delivery, compute, storage, and security run on one platform with one configuration model.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: 'Git-connected builds and preview deployments',
        definition: 'Building from a Git push, with a preview URL for each branch before release.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'Delivery rules changed without redeploying the application',
        definition: 'Changing cache, routing, and header rules without shipping a new build.',
        azion: 'full',
        competitor: 'partial'
      }
    ]
  },
  {
    title: 'Compute',
    rows: [
      {
        capability: 'JavaScript and WebAssembly runtime',
        definition: 'Running application code close to users on web-standard APIs.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'Cold-start-free function execution',
        definition: 'Functions that answer the first request without a startup delay.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: 'AI inference on the platform',
        definition: 'Running AI models on the provider’s network, close to users.',
        azion: 'full',
        competitor: 'partial'
      }
    ]
  },
  {
    title: 'Storage',
    rows: [
      {
        capability: 'Distributed key-value store',
        definition:
          'Low-latency reads for configuration, flags, and sessions replicated close to users.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: 'S3-compatible object storage',
        definition: 'S3-compatible storage for files and objects.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: 'Distributed SQL database with vector search',
        definition:
          'A relational database replicated close to users, with similarity search for AI applications.',
        azion: 'full',
        competitor: 'none'
      }
    ]
  },
  {
    title: 'Security',
    rows: [
      {
        capability: 'Managed WAF for applications and APIs',
        definition: 'Managed rules that block attacks on applications and APIs.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'API discovery and protection',
        definition: 'Finding the APIs you expose and applying security rules to each one.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: 'Bot management',
        definition: 'Detecting and blocking automated traffic before it reaches the application.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'DDoS protection included with delivery',
        definition:
          'Absorbing volumetric and application-layer attacks without buying a separate product.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'Network-layer firewall',
        definition: 'Filtering traffic by IP, network, and location below the application layer.',
        azion: 'full',
        competitor: 'none'
      }
    ]
  },
  {
    title: 'Delivery and networking',
    rows: [
      {
        capability: 'Tiered caching and origin offload',
        definition: 'Intermediate cache layers that cut the requests reaching your origin.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: 'Image and video optimization',
        definition:
          'Resizing, compressing, and converting media on delivery instead of at the origin.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: 'Authoritative DNS',
        definition: 'Hosting and answering the DNS records of your domains.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'Load balancing across multi-cloud origins',
        definition: 'Spreading traffic across origins on different cloud providers or on premises.',
        azion: 'full',
        competitor: 'none'
      },
      {
        capability: 'Accelerate and protect origins hosted elsewhere',
        definition:
          'Putting delivery, caching, and security in front of an application that runs on another provider.',
        azion: 'full',
        competitor: 'none'
      }
    ]
  },
  {
    title: 'Observability',
    rows: [
      {
        capability: 'Real-time metrics and event search',
        definition:
          'Live traffic, performance, and security dashboards, with a query over the events of each request.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'Log streaming to third-party tools',
        definition: 'Sending logs in real time to your SIEM or data lake.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'Real-user monitoring',
        definition: 'Measuring the performance users experience in the browser.',
        azion: 'full',
        competitor: 'full'
      }
    ]
  },
  {
    title: 'Commercial',
    rows: [
      {
        capability: 'Published pay-as-you-go pricing',
        definition: 'Per-unit prices published up front, so you know what a month will cost.',
        azion: 'full',
        competitor: 'full'
      }
    ]
  }
]

export const CLOUDFLARE_SECTION = {
  _id: 'comparison-table',
  props: {
    eyebrow: 'Comparison',
    title: 'How Azion compares with Cloudflare',
    caption: 'How Azion compares with Cloudflare',
    columnLabel: 'Capability',
    fullLabel: 'Full support',
    partialLabel: 'Partial support',
    noneLabel: 'Not available',
    competitor: {
      name: 'Cloudflare',
      logo: '/marketing-components/competitors/cloudflare-extended-reversed.svg',
      logoLight: '/marketing-components/competitors/cloudflare-extended-color.svg'
    },
    groups: CLOUDFLARE_GROUPS
  }
}

export const VERCEL_SECTION = {
  _id: 'comparison-table',
  props: {
    eyebrow: 'Comparison',
    title: 'How Azion compares with Vercel',
    caption: 'How Azion compares with Vercel',
    columnLabel: 'Capability',
    fullLabel: 'Full support',
    partialLabel: 'Partial support',
    noneLabel: 'Not available',
    competitor: {
      name: 'Vercel',
      logo: '/marketing-components/competitors/vercel-extended-reversed.svg',
      logoLight: '/marketing-components/competitors/vercel-extended-mono.svg'
    },
    groups: VERCEL_GROUPS
  }
}
