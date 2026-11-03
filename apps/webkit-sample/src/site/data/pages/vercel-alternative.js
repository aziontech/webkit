import { agentsClosing } from '../product-pages.js'
import { quotesLedBy } from '../solutions.js'

const TRUST_MARKS = [
  'global-fashion-group',
  'herospark',
  'itau',
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
    title: 'Bills you can forecast',
    description:
      'Usage-based bandwidth and invocation pricing makes spend hard to predict as traffic grows. Azion publishes a price per unit for delivery, compute, storage, and security, with no egress charges between services.'
  },
  {
    icon: 'pi pi-code',
    title: 'The same build and preview workflow',
    description:
      'Git-connected builds, preview URLs, custom domains, and automatic certificates map to Applications, Azion CLI, Preview Deployment, Domains, and Certificate Manager. Your team keeps the release loop it already uses.'
  },
  {
    icon: 'pi pi-globe',
    title: 'Sit in front of any origin',
    description:
      'Vercel accelerates what runs on Vercel. Azion fronts origins on AWS, GCP, on-premises, or another provider, so you put delivery, caching, and security in place before you move the application.'
  },
  {
    icon: 'pi pi-shield',
    title: 'Protection below the application layer',
    description:
      'Vercel Firewall works on application rules. Azion adds DDoS Protection, Network Shield, and Network Lists at the network layer, underneath WAF and Bot Manager.'
  },
  {
    icon: 'pi pi-bolt',
    title: 'Cold-start-free scale',
    description:
      "Fluid Compute reduces cold starts. Functions removes them: execution begins on arrival at Azion's distributed infrastructure, including under bursty traffic."
  },
  {
    icon: 'pi pi-sync',
    title: 'Move one project at a time',
    description:
      'Rebuild a single project on Azion, compare routes and function behavior against production, then move the domain. Vercel keeps serving until you cut over.'
  }
]

const CAPABILITY_GROUPS = [
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

const FAQ = [
  {
    value: 'good-vercel-alternative',
    question: 'Is Azion a good Vercel alternative?',
    answer:
      'Yes. Azion fits teams that want application delivery, distributed functions, object storage, key-value data, security, DNS, analytics, and observability on the Azion Web Platform, with cold-start-free scale.'
  },
  {
    value: 'projects-map',
    question: 'How do Vercel projects map to Azion?',
    answer:
      'Vercel projects and production deployments map to Azion Applications and Functions. CDN cache behavior, redirects, rewrites, headers, and routing can be rebuilt with Applications, Cache, and Rules Engine.'
  },
  {
    value: 'preview-deployments',
    question: 'What replaces Vercel Preview Deployments?',
    answer:
      'Preview workflows can be rebuilt with Azion Preview Deployment and Azion CLI. Use them to validate non-production URLs, application behavior, functions, and configuration before promotion.'
  },
  {
    value: 'functions-fluid-compute',
    question: 'What is the equivalent of Vercel Functions and Fluid Compute?',
    answer:
      'Vercel Functions and Fluid Compute workloads map to Azion Functions. Teams can translate server-side logic, API routes, environment variables, and backend integrations into Functions and validate behavior before domain cutover.'
  },
  {
    value: 'blob-edge-config',
    question: 'How do Vercel Blob and Edge Config map to Azion?',
    answer:
      'Vercel Blob maps to Azion Object Storage for application files, uploads, documents, images, and videos. Edge Config maps to KV Store for low-latency reads such as feature flags, experiments, redirects, and configuration.'
  },
  {
    value: 'ai-workloads',
    question: 'How do Vercel AI workloads map to Azion?',
    answer:
      'AI SDK and AI Gateway patterns map to AI Inference, Azion AI Client, Azion Lib, and Functions depending on the application architecture, model routing, streaming behavior, and observability requirements.'
  },
  {
    value: 'security-features',
    question: 'How do Vercel security features map to Azion?',
    answer:
      'Vercel Firewall maps to Azion Firewall and Rules Engine. Web Application Firewall maps to Azion Web Application Firewall, bot controls map to Bot Manager, deployment protection can use Firewall and Network Lists, and DDoS posture maps to DDoS Protection and Network Shield.'
  },
  {
    value: 'domains-dns-certificates',
    question: 'How do Vercel domains, DNS, and certificates map to Azion?',
    answer:
      'Custom domains, DNS records, nameservers, and certificate workflows can be rebuilt with Azion Domains, Edge DNS, and Certificate Manager. Validate certificate issuance and routing before moving production traffic.'
  },
  {
    value: 'observability-analytics',
    question: 'What replaces Vercel Observability, Speed Insights, and Web Analytics?',
    answer:
      'Vercel Observability maps to Real-Time Metrics, Real-Time Events, and Data Stream. Speed Insights and Web Analytics map to Edge Pulse and Real-Time Metrics for user experience and traffic visibility.'
  },
  {
    value: 'run-in-parallel',
    question: 'Can I run Vercel and Azion in parallel?',
    answer:
      'Yes. You can rebuild delivery, functions, storage, security, DNS, TLS, and observability on Azion while keeping Vercel active, then shift production domains in stages after validation.'
  }
]

export const VERCEL_ALTERNATIVE_PAGE = [
  {
    section: 'Heroes',
    kind: 'copy-beside-art',
    eyebrow: 'Alternative Guide',
    eyebrowPrefix: '//',
    title: 'Vercel alternative guide: moving to Azion',
    description:
      'Map Vercel projects, preview deployments, Functions, Blob, Edge Config, Firewall, and Web Analytics to Azion. Keep your Git-based build and preview workflow, run functions without cold starts, and move one project at a time before you switch the domain.',
    actions: [
      { label: 'Start for free', href: '/signup', kind: 'secondary' },
      { label: 'Talk to sales', href: '/site/contact', kind: 'outlined', trailing: true }
    ],
    art: {
      name: 'azion-to-vercel',
      alt: 'The Azion mark and the Vercel mark, one laid over the other'
    },
    carouselMarks: TRUST_MARKS
  },
  { section: 'CapabilityGrid', items: REASONS },
  { section: 'ClientQuotes', quotes: quotesLedBy('contabilizei') },
  {
    section: 'CompareCompetitors',
    eyebrow: 'Comparison',
    title: 'How Azion compares with Vercel',
    competitor: { name: 'Vercel' },
    groups: CAPABILITY_GROUPS,
    caption: 'Capability-by-capability comparison of Azion and Vercel.'
  },
  {
    section: 'MediaSplitBand',
    title: 'Move application delivery without disrupting releases',
    description:
      'Translate Vercel projects into Azion equivalents while keeping validation workflows predictable. Rebuild CDN behavior, redirects, rewrites, image optimization, Functions, AI integrations, storage, security rules, DNS, certificates, and observability before shifting production domains.',
    illustration: 'build-applications',
    illustrationLabel: 'Framework projects mapped through the platform to what each one serves',
    actions: [{ label: 'Read the guide', href: '/site/docs' }]
  },
  { section: 'FaqSection', items: FAQ },
  agentsClosing('Build once. Run everywhere.')
]
