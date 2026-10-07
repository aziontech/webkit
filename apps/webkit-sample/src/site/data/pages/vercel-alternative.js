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

const CAPABILITIES = [
  {
    capability: 'Delivery, compute, storage, and security on one platform',
    azion: 'full',
    rival: 'partial'
  },
  { capability: 'Git-connected builds and preview deployments', azion: 'full', rival: 'full' },
  {
    capability: 'Delivery rules changed without redeploying the application',
    azion: 'full',
    rival: 'partial'
  },
  { capability: 'JavaScript and WebAssembly runtime', azion: 'full', rival: 'full' },
  { capability: 'Cold-start-free function execution', azion: 'full', rival: 'partial' },
  { capability: 'AI inference on the platform', azion: 'full', rival: 'partial' },
  { capability: 'Distributed key-value store', azion: 'full', rival: 'partial' },
  { capability: 'S3-compatible object storage', azion: 'full', rival: 'partial' },
  { capability: 'Distributed SQL database with vector search', azion: 'full', rival: 'none' },
  { capability: 'Managed WAF for applications and APIs', azion: 'full', rival: 'full' },
  { capability: 'API discovery and protection', azion: 'full', rival: 'partial' },
  { capability: 'Bot management', azion: 'full', rival: 'full' },
  { capability: 'DDoS protection included with delivery', azion: 'full', rival: 'full' },
  { capability: 'Network-layer firewall', azion: 'full', rival: 'none' },
  { capability: 'Tiered caching and origin offload', azion: 'full', rival: 'partial' },
  { capability: 'Image and video optimization', azion: 'full', rival: 'partial' },
  { capability: 'Authoritative DNS', azion: 'full', rival: 'full' },
  { capability: 'Load balancing across multi-cloud origins', azion: 'full', rival: 'none' },
  {
    capability: 'Accelerate and protect origins hosted elsewhere',
    azion: 'full',
    rival: 'none'
  },
  { capability: 'Real-time metrics and event search', azion: 'full', rival: 'full' },
  { capability: 'Log streaming to third-party tools', azion: 'full', rival: 'full' },
  { capability: 'Real-user monitoring', azion: 'full', rival: 'full' },
  { capability: 'Published pay-as-you-go pricing', azion: 'full', rival: 'full' }
]

const FAQ = [
  {
    value: 'good-vercel-alternative',
    question: 'Is Azion a good Vercel alternative?',
    answer:
      'Yes. Azion is a strong Vercel alternative for teams that want application delivery, distributed functions, object storage, key-value data, security, DNS, analytics, and observability on Azion Web Platform with cold-start-free scale.'
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
    title: 'Vercel Alternative Guide: Moving to Azion',
    description:
      'Map Vercel projects, preview deployments, Functions, Blob, Edge Config, Firewall, and Web Analytics to Azion. Keep your Git-based build and preview workflow, run functions without cold starts, and move one project at a time before you switch the domain.',
    actions: [
      { label: 'Start Free', href: '/signup', kind: 'secondary' },
      { label: 'Talk to a Specialist', href: '#contact', kind: 'outlined', trailing: true }
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
    section: 'ComparisonTable',
    eyebrow: 'Comparison',
    title: 'How Azion compares with Vercel',
    rival: 'Vercel',
    rows: CAPABILITIES,
    caption: 'Capability-by-capability comparison of Azion and Vercel.'
  },
  {
    section: 'MediaSplitBand',
    kind: 'guide',
    title: 'Move application delivery without disrupting releases',
    description:
      'Translate Vercel projects into Azion equivalents while keeping validation workflows predictable. Rebuild CDN behavior, redirects, rewrites, image optimization, Functions, AI integrations, storage, security rules, DNS, certificates, and observability before shifting production domains.',
    illustration: 'build-applications',
    illustrationLabel: 'Framework projects mapped through the platform to what each one serves',
    actions: [
      {
        label: 'See the guide',
        href: '/site/docs',
        kind: 'outlined',
        size: 'medium',
        trailing: true
      }
    ]
  },
  { section: 'FaqSection', items: FAQ },
  {
    section: 'ClosingCallToAction',
    kind: 'split',
    eyebrow: 'Secure',
    title: 'Protected by default.',
    titleMuted: 'Always on.',
    description: 'Get stronger protection, less attack exposure, and less operational overhead.',
    actions: [{ label: 'Start Free', href: '/signup', kind: 'secondary' }],
    aside: { label: 'Talk to our team', href: '/site/contact' }
  }
]
