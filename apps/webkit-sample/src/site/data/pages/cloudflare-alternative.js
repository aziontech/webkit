import { quotesLedBy } from '../solutions.js'

const TRUST_MARKS = [
  'global-fashion-group',
  'herospark',
  'itau',
  'madeiramadeira',
  'magalu',
  'nzn',
  'netshoes',
  'caixa',
  'agibank',
  'prime-video',
  'america-movil',
  'gpa',
  'fourbank'
]

const REASONS = [
  {
    icon: 'pi pi-dollar',
    title: 'Three ways to pay',
    description:
      'Cloudflare jumps from $250 a month on Business to around $3,000+ on Enterprise. Azion offers a fixed-fee plan, on-demand pricing with spend limits, or commitment discounts.'
  },
  {
    icon: 'pi pi-lock-open',
    title: 'Every feature, on every plan',
    description:
      'Bot Management and API Shield need a Cloudflare Enterprise contract. Azion includes every product and feature on every plan, with published on-demand prices.'
  },
  {
    icon: 'pi pi-sitemap',
    title: 'Failures stay local',
    description:
      'On Cloudflare, one setting change reaches the whole network in seconds. Azion runs on 100+ data centers inside ISP networks, and each location is its own failure domain.'
  },
  {
    icon: 'pi pi-replay',
    title: "Recovery that doesn't wait on BGP",
    description:
      'Cloudflare announces the same anycast IPs from all its locations, so when one fails, recovery waits for BGP to converge across the internet. On Azion, Edge DNS steers users to healthy locations, with failover on every plan.'
  },
  {
    icon: 'pi pi-comments',
    title: 'Answers in minutes',
    description:
      'Cloudflare Enterprise Premium targets a P1 response in under one hour. Azion Enterprise and Mission-Critical Support run 24×7, with initial responses in minutes for business-critical outages.'
  },
  {
    icon: 'pi pi-chart-line',
    title: 'Real-time data on every plan',
    description:
      'On Cloudflare, logs and features change by tier. On Azion, Real-Time Metrics, Real-Time Events, and Data Stream come with every plan, from the free plan up.'
  }
]

const CAPABILITY_GROUPS = [
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

const FAQ = [
  {
    value: 'main-difference',
    question: 'What is the main difference between Azion and Cloudflare?',
    answer:
      'Both run delivery, compute, storage, and security on one platform. The difference is how you buy and run it. Azion includes every product and feature on every plan and publishes its usage rates. Cloudflare keeps Bot Management, API Shield, and Logpush behind an Enterprise contract, so the features a production app needs often decide the plan you pay for.'
  },
  {
    value: 'when-cloudflare-fits',
    question: 'When is Cloudflare the better choice?',
    answer:
      "Cloudflare covers more ground in a few areas. It runs in 348 cities, and Workers comes with containers, sandboxes, queues, and agent tooling that Azion doesn't offer. If your project depends on those, Cloudflare fits better today. Azion fits teams that want delivery, security, and serverless applications on one platform, with pricing they can model and support they can reach."
  },
  {
    value: 'plan-routing',
    question: 'Does my plan change how Cloudflare routes my traffic?',
    answer:
      "It can. When a Cloudflare data center runs short of capacity, Traffic Manager moves Free traffic to other locations first, then Pro, then Business, and Enterprise last, according to Cloudflare's own engineering blog. On Azion, every plan runs on the same global distributed infrastructure and the same routing."
  },
  {
    value: 'data-center-failure',
    question: 'How does Azion keep applications online when a data center fails?',
    answer:
      "Azion doesn't rely on a single routing layer. Edge DNS steers users away from data centers that become unavailable. Load balancing and failover reroute traffic on every plan, and stale cache keeps serving content when your origin is down. Cloudflare also reroutes around failures, using Anycast and its Traffic Manager."
  },
  {
    value: 'support-response',
    question: 'How fast does Azion support respond?',
    answer:
      'Enterprise and Mission-Critical support run 24×7, with a first response in under 15 minutes for business-critical outages and direct access to Azion R&D engineers during business hours. Service plans start at Developer, so you can add support before you need an Enterprise contract. Cloudflare offers phone support only on Enterprise.'
  },
  {
    value: 'bot-management',
    question: 'Do I need an Enterprise contract for bot management on Azion?',
    answer:
      'No. WAF, Bot Manager, and always-on DDoS protection are available on every Azion plan, at published usage rates. On Cloudflare, Bot Management for Enterprise, API Shield, and AI Security for Apps are Enterprise add-ons, and the Free, Pro, and Business plans get lighter bot controls.'
  },
  {
    value: 'workers-kv-r2',
    question: 'Can I move Workers, KV, and R2 to Azion without rewriting my code?',
    answer:
      'Mostly. Functions runs JavaScript and TypeScript on web-standard APIs, so most Workers code moves with small changes. KV Store follows the Workers KV API, and Object Storage is S3-compatible, so R2 buckets sync with standard S3 tools. Plan to rewrite Workers bindings, Durable Objects, and Wrangler configuration.'
  },
  {
    value: 'd1-alternative',
    question: 'Is there an Azion alternative to Cloudflare D1?',
    answer:
      "Yes, SQL Database. It uses SQLite's SQL dialect, writes to a main instance with ACID guarantees, serves reads from replicas, and includes vector search. Cloudflare D1 caps each database at 10 GB and runs it on a single thread. Check your data size and write load against both before you choose."
  },
  {
    value: 'event-data',
    question: 'How do I ingest, catalog, and query event data on Azion?',
    answer:
      'With Real-Time Events. It ingests logs and application events, organizes them as tables, and lets you query them with SQL, with no Kafka or Flink cluster to run. Request, response, and security events show up in under a minute in most cases. Data Stream sends the same events to your SIEM or data lake, such as Splunk or Datadog.'
  },
  {
    value: 'pricing',
    question: "How does Azion pricing compare with Cloudflare's?",
    answer:
      "Cloudflare sells plans: Free, Pro from $20 a month, Business from $200 a month, and custom Enterprise contracts, with advanced security sold as Enterprise add-ons. Its budget alerts send email but don't cap spend. Azion charges by usage for every product on every plan, and offers lower rates for 1-, 2-, or 3-year commitments."
  },
  {
    value: 'evaluate',
    question: 'How can I evaluate Azion before committing?',
    answer:
      "Start free with $300 in credit, valid for 12 months, with no upfront commitment. Most teams move one workload first, compare latency and cost in their own markets, and then expand. Azion's team can help you scope the test and plan the migration."
  },
  {
    value: 'run-in-parallel',
    question: 'Can I run Azion and Cloudflare at the same time?',
    answer:
      'Yes. You can run both side by side and shift traffic in stages with DNS, one hostname or workload at a time. That lets you validate performance, security rules, and logs on Azion before you move production traffic, and roll back if a test fails.'
  }
]

export const CLOUDFLARE_ALTERNATIVE_PAGE = [
  {
    section: 'Heroes',
    kind: 'copy-beside-art',
    eyebrow: 'Cloudflare alternative comparison',
    eyebrowPrefix: '//',
    title: 'On Cloudflare, what you get depends on the plan you pay for.',
    description:
      "Routing priority, features, logs, and support all change by tier. Azion's platform is the same on every plan. Every product and feature, routing and failover, and real-time data, from the free plan up.",
    actions: [{ label: 'Talk to a specialist', href: '/site/contact', kind: 'secondary' }],
    art: {
      name: 'azion-to-cloudflare',
      alt: 'The Azion mark and the Cloudflare mark, one laid over the other'
    },
    carouselLabel: 'Trusted by mission-critical workloads',
    carouselMarks: TRUST_MARKS
  },
  {
    section: 'CapabilityGrid',
    title: 'Azion gives you more than one way to recover',
    items: REASONS
  },
  { section: 'ClientQuotes', quotes: quotesLedBy('dafiti') },
  {
    section: 'CompareCompetitors',
    eyebrow: 'Comparison',
    title: 'How Azion compares with Cloudflare',
    competitor: { name: 'Cloudflare' },
    groups: CAPABILITY_GROUPS,
    caption: 'How Azion compares with Cloudflare'
  },
  {
    section: 'MediaSplitBand',
    title: 'Switch without rewriting your code',
    description:
      'Workers code runs on Functions with minimal changes, KV maps to KV Store, and R2 buckets sync to Object Storage over S3-compatible APIs. WAF rules and DDoS settings map to WAF, DDoS Protection, and Firewall.',
    illustration: 'build-applications',
    illustrationLabel: 'Framework projects mapped through the platform to what each one serves',
    actions: [{ label: 'Complete technical guide', href: '/site/docs' }]
  },
  { section: 'FaqSection', items: FAQ },
  {
    section: 'ClosingCallToAction',
    kind: 'split',
    title: 'Build, run, and protect applications.',
    titleMuted: 'Everywhere.',
    description:
      'Get faster launches, lower latency, and less infrastructure overhead from day one.',
    actions: [{ label: 'Start free', href: '/signup', kind: 'secondary' }],
    aside: { label: 'Talk to a specialist', href: '/site/contact' }
  }
]
