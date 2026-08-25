// site/data/pricing.js — every word and every number the pricing page states.
//
// The page is a comparison, and a comparison is data: three tiers, nine product
// sections of included usage, eleven answers. Keeping it here rather than inline in
// the components is what lets the page's Vue read as LAYOUT — the cards band, the
// matrix, the FAQ — instead of as 400 lines of copy with markup between it.
//
// Structure and numbers are azion.com/planos, row for row; the wording is English,
// like the rest of this site app (nav, footer, home, docs). A value of `true` is a
// checkmark, `'—'` an em dash (not offered), a string the stated allowance. Nothing
// here is invented: a row that says nothing on the real page says nothing here.

// The two billing periods, as the SegmentedButton above the cards renders them.
export const BILLING_PERIODS = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Annual', value: 'annual' }
]

// One entry per tier, in table order. `price` is keyed by billing period, because the
// toggle changes the amount AND its caveat — Pro drops to $20 on the annual term and
// the line under it stops saying "cancel anytime". `Free` and `Custom` are prices too,
// so they are `value` with the symbol and the unit switched off, rather than a second
// way of typesetting the same row. Both are short on purpose: `Currency` never wraps an
// amount (see currency.vue), so a price standing in as a word has to fit the card's
// 256px measure at 56px — six characters do, thirteen do not.
//
// `highlighted` is the one recommended tier: it carries the `Popular` tag on its card
// and the accent bar over its column in the matrix.
//
// `featuresTitle` is CUMULATIVE, and that is what makes the three lists short: each tier
// names the one below it ("All Hobby features, plus:") instead of restating it, so the
// five lines under the lead-in are only what that tier ADDS. Hobby has nothing below it,
// so its lead-in is the flat claim.
export const PLANS = [
  {
    id: 'hobby',
    name: 'Hobby',
    description: 'Start free for personal projects and experimentation',
    highlighted: false,
    price: {
      monthly: {
        value: 'Free',
        prefix: '',
        suffix: '',
        details: 'Free forever, no card required. Included limits reset every month.'
      },
      annual: {
        value: 'Free',
        prefix: '',
        suffix: '',
        details: 'Free forever, no card required. Included limits reset every month.'
      }
    },
    featuresTitle: 'All Features Included.',
    features: [
      { icon: 'pi pi-globe', label: 'Global infrastructure' },
      { icon: 'ai ai-edge-functions', label: 'Serverless functions' },
      { icon: 'ai ai-edge-storage', label: 'Storage and database' },
      { icon: 'pi pi-image', label: 'Image optimization' },
      { icon: 'ai ai-edge-firewall', label: 'DDoS mitigation and firewall' }
    ],
    action: { label: 'Start for free', kind: 'outlined', to: '/signup' }
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing applications with higher usage demand',
    highlighted: true,
    tagLabel: 'Popular',
    price: {
      monthly: {
        value: '25',
        prefix: '$',
        suffix: '/mo',
        details:
          'Billed monthly, cancel anytime. Usage past the included limits is charged on demand.'
      },
      annual: {
        value: '20',
        prefix: '$',
        suffix: '/mo',
        details: 'Billed annually, save 20%. Usage past the included limits is charged on demand.'
      }
    },
    featuresTitle: 'All Hobby features, plus:',
    features: [
      { icon: 'ai ai-workloads', label: 'Additional workloads' },
      { icon: 'ai ai-edge-application', label: 'Higher application limits' },
      { icon: 'ai ai-store', label: 'More storage capacity' },
      { icon: 'ai ai-waf-rules', label: 'Broader security coverage' },
      { icon: 'pi pi-wallet', label: 'Configurable spend limit' }
    ],
    action: { label: 'Start with Pro', kind: 'primary', to: '/signup' }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Optimize costs with usage or spend commitments',
    highlighted: false,
    price: {
      monthly: {
        value: 'Custom',
        prefix: '',
        suffix: '',
        details: 'Custom terms and payment schedule. Commit up front and save on usage.'
      },
      annual: {
        value: 'Custom',
        prefix: '',
        suffix: '',
        details: 'Custom terms and payment schedule. Commit up front and save on usage.'
      }
    },
    featuresTitle: 'All Pro features, plus:',
    features: [
      { icon: 'pi pi-chart-line', label: 'On-demand pricing' },
      { icon: 'pi pi-arrow-down', label: 'Cut costs with commitments' },
      { icon: 'ai ai-layers', label: 'Capacity Reservation available' },
      { icon: 'pi pi-calendar', label: 'Savings Plan available' },
      { icon: 'ai ai-business-support', label: 'Advanced support available' }
    ],
    action: { label: 'Contact us', kind: 'outlined', to: '#contact' }
  }
]

// The comparison matrix, one entry per product section. Each section opens with its own
// eyebrow/title/description band and holds nothing but its rows: the hand-off to the
// per-unit rates is ONE link at the foot of the whole table (ON_DEMAND_LINK below), not a
// row per section. Seven of them down one 105-row table is the same sentence seven times,
// and each one interrupts the comparison the reader is in the middle of making — the one
// place they cannot be interrupted, because a matrix is read by scanning down a column.
//
// A row is either a GROUP row (`group: true` — the product or capability it heads, in
// full contrast) or an item under it (muted, indented). Both kinds can hold values: a
// capability that is simply present, like `Single Origin`, is a group row with three
// checkmarks and no children.
// The table's closing hand-off, stated once. It points at the product pricing index
// rather than at any one section's anchor: a single link that has to answer for the whole
// matrix cannot land the reader inside one product's rates.
export const ON_DEMAND_LINK = {
  label: 'See on-demand pricing',
  href: 'https://www.azion.com/en/documentation/products/pricing/'
}

export const COMPARISON_SECTIONS = [
  {
    eyebrow: 'Managed infrastructure',
    title: 'Azion Platform',
    description: 'Running modern workloads on a global infrastructure.',
    rows: [
      { label: 'Global infrastructure', group: true, values: ['', '', ''] },
      { label: '100+ data centers', values: [true, true, true] },
      {
        label: 'Automatic routing with load balancing and failover',
        values: [true, true, true]
      },
      { label: 'Management', group: true, values: ['', '', ''] },
      {
        label: 'Workspaces (Multi-Org)',
        hint: 'A workspace is an isolated set of resources, users and billing inside your organization.',
        values: ['1 Workspace', '1 Workspace', 'Custom']
      },
      { label: 'Users', values: ['Unlimited', 'Unlimited', 'Unlimited'] },
      { label: 'Access security', group: true, values: ['', '', ''] },
      {
        label: 'Role-Based Access Control (RBAC)',
        hint: 'Gives each user only the permissions their role needs, instead of full account access.',
        values: ['Team level', 'Team level', 'Team and workspace levels']
      },
      {
        label: 'Multi-Factor Authentication (MFA)',
        hint: 'Requires a second factor beyond the password when signing in.',
        values: [true, true, true]
      },
      { label: 'Login OAuth (Google, GitHub)', values: [true, true, true] },
      {
        label: 'SAML Single Sign-On (SSO)',
        hint: 'Lets your team sign in through your own identity provider instead of Azion credentials.',
        values: [true, true, true]
      },
      { label: 'Workloads', group: true, values: ['', '', ''] },
      {
        label: 'Workloads',
        hint: 'A workload is the domain and TLS configuration that exposes an application or firewall to the internet.',
        values: ['10 included', '20 included', 'Custom']
      },
      {
        label: 'Data transfer',
        values: ['1 TB / mo included', '2 TB / mo included', 'Custom']
      },
      {
        label: 'Requests',
        values: ['10M / mo included', '20M / mo included', 'Custom']
      },
      { label: 'TLS encryption', values: [true, true, true] },
      {
        label: 'Mutual TLS (mTLS)',
        hint: 'Requires the client to present a certificate too, not just the server.',
        values: [true, true, true]
      },
      {
        label: 'Certificate Manager',
        hint: 'Where TLS certificates are issued, imported and renewed for your workloads.',
        group: true,
        values: ['', '', '']
      },
      { label: "Let's Encrypt certificate", values: [true, true, true] },
      { label: 'Bring your own certificate', values: [true, true, true] },
      { label: 'Developer tools', group: true, values: ['', '', ''] },
      { label: 'CLI, API, GraphQL API, Terraform', values: [true, true, true] }
    ]
  },
  {
    eyebrow: 'Build',
    title: 'Azion Applications',
    description: 'Build, run and scale applications globally.',
    rows: [
      { label: 'Applications', group: true, values: ['', '', ''] },
      {
        label: 'Rules Engine',
        hint: 'Conditional rules that change how a request is handled, evaluated at request and response time.',
        values: [true, true, true]
      },
      { label: 'Rules per application', values: ['10 included', '20 included', 'Custom'] },
      { label: 'Redirects', values: [true, true, true] },
      {
        label: 'Reverse proxy using Connectors',
        hint: 'Connectors define the origins an application fetches from, including headers and failover.',
        values: [true, true, true]
      },
      { label: 'Functions', group: true, values: ['', '', ''] },
      {
        label: 'Compute time',
        hint: 'The total execution time your functions consume, billed by the hour.',
        values: ['8 hours / mo included', '10 hours / mo included', 'Custom']
      },
      {
        label: 'Requests',
        values: ['3M / mo included', '10M / mo included', 'Custom']
      },
      { label: 'Cache', group: true, values: ['', '', ''] },
      {
        label: 'Purges',
        hint: 'A purge invalidates cached content before its TTL expires.',
        values: ['1,000 / mo included', '2,000 / mo included', 'Custom']
      },
      {
        label: 'Tiered Cache',
        hint: 'Adds a second cache layer between the network and your origin, so fewer requests reach it.',
        values: [true, true, true]
      },
      {
        label: 'Application Accelerator',
        hint: 'Extends caching and routing control to dynamic content and APIs.',
        group: true,
        values: ['', '', '']
      },
      {
        label: 'Data transfer',
        values: ['1 TB / mo included', '2 TB / mo included', 'Custom']
      },
      {
        label: 'Custom Cache Keys',
        hint: 'Choose which parts of a request — query string, cookies, headers — make two responses distinct.',
        values: [true, true, true]
      },
      { label: 'Path Rewrites', values: [true, true, true] },
      {
        label: 'Image Processor',
        hint: 'Resizes, crops and converts images on the fly from a single stored original.',
        group: true,
        values: ['', '', '']
      },
      {
        label: 'Images',
        values: ['5,000 / mo included', '10,000 / mo included', 'Custom']
      },
      {
        label: 'AI Inference',
        hint: 'Runs model inference on the same distributed network, close to the user.',
        group: true,
        tag: 'Preview',
        values: ['', '', '']
      },
      {
        label: 'Preview access',
        values: ['On request (subject to approval)', 'On request (subject to approval)', 'Custom']
      }
    ]
  },
  {
    eyebrow: 'Store',
    title: 'Storage and Database',
    description: 'Reliable performance at scale.',
    rows: [
      {
        label: 'Object Storage',
        hint: 'S3-compatible object storage for static assets and application data.',
        group: true,
        values: ['', '', '']
      },
      {
        label: 'Storage',
        values: ['10 GB / mo included', '20 GB / mo included', 'Custom']
      },
      {
        label: 'Class A operations',
        hint: 'Write and list operations, such as PUT, COPY and LIST.',
        values: ['10,000 / mo included', '20,000 / mo included', 'Custom']
      },
      {
        label: 'Class B operations',
        hint: 'Read operations, such as GET and HEAD.',
        values: ['100,000 / mo included', '200,000 / mo included', 'Custom']
      },
      {
        label: 'Class C operations',
        hint: 'Delete operations, which are never billed.',
        values: [true, true, true]
      },
      {
        label: 'SQL Database',
        hint: 'Distributed SQL database with vector search, queried from your functions.',
        group: true,
        tag: 'Preview',
        values: ['', '', '']
      },
      { label: 'Preview access', values: [true, true, 'Custom'] },
      {
        label: 'Storage',
        values: ['1 GB / mo included', '1 GB / mo included', 'Custom']
      },
      {
        label: 'Rows read',
        values: ['150M / mo included', '150M / mo included', 'Custom']
      },
      {
        label: 'Rows written',
        values: ['20,000 / day included', '20,000 / day included', 'Custom']
      },
      {
        label: 'KV Store',
        hint: 'Low-latency key-value storage for state your functions read on every request.',
        group: true,
        tag: 'Preview',
        values: ['', '', '']
      },
      {
        label: 'Preview access',
        values: ['On request (subject to approval)', 'On request (subject to approval)', 'Custom']
      }
    ]
  },
  {
    eyebrow: 'Protect',
    title: 'Azion Connectors',
    description: 'Reliable connections to any infrastructure.',
    rows: [
      {
        label: 'Single Origin',
        hint: 'One origin address the application fetches from, with no balancing between origins.',
        group: true,
        values: [true, true, true]
      },
      {
        label: 'Load Balancer',
        hint: 'Spreads traffic across multiple origins and takes unhealthy ones out of rotation.',
        group: true,
        values: ['', '', '']
      },
      {
        label: 'Data transfer',
        values: ['15 GB / mo included', '15 GB / mo included', 'Custom']
      },
      {
        label: 'Origin Shield',
        hint: 'Concentrates origin fetches through a single layer, cutting the traffic your origin receives.',
        group: true,
        values: ['', '', '']
      },
      {
        label: 'Shielded Connectors',
        hint: 'How many connectors can sit behind Origin Shield.',
        values: ['1 included', '1 included', 'Custom']
      }
    ]
  },
  {
    eyebrow: 'Protect',
    title: 'Azion Firewall',
    description: 'Always-on defense for your applications.',
    rows: [
      { label: 'Firewall', group: true, values: ['', '', ''] },
      {
        label: 'Requests',
        values: ['10M / mo included', '20M / mo included', 'Custom']
      },
      {
        label: 'Rules Engine',
        hint: 'Conditional rules that inspect a request and decide whether the firewall lets it through.',
        values: [true, true, true]
      },
      { label: 'Rules per firewall', values: ['10 included', '20 included', 'Custom'] },
      { label: 'Regex support', values: [true, true, true] },
      {
        label: 'DDoS Protection',
        hint: 'Always-on mitigation for volumetric and protocol attacks at the network layer.',
        group: true,
        values: [true, true, true]
      },
      {
        label: 'Network Shield',
        hint: 'Blocks traffic by IP, CIDR, country or ASN using reusable network lists.',
        group: true,
        values: [true, true, 'Included with Firewall']
      },
      {
        label: 'Web Application Firewall',
        hint: 'Inspects HTTP and HTTPS requests and blocks the ones that match an attack signature.',
        group: true,
        values: ['', '', '']
      },
      {
        label: 'Azion Managed Rules',
        hint: 'Rule sets maintained by Azion and updated as new threats appear.',
        values: [true, true, true]
      },
      {
        label: 'WAF Attack Score',
        hint: 'Scores every request by how likely it is to be an attack, so you tune sensitivity instead of single rules.',
        values: [true, true, true]
      },
      {
        label: 'Requests',
        values: ['100,000 / mo included', '200,000 / mo included', 'Custom']
      },
      {
        label: 'Custom Rule Sets',
        hint: 'Your own WAF rules, applied alongside the managed ones.',
        values: ['1 included', '2 included', 'Custom']
      },
      {
        label: 'Exceptions per Rule Set',
        hint: 'Allowances that stop a specific rule from matching a request you know is legitimate.',
        values: ['10 included', '20 included', 'Custom']
      },
      {
        label: 'Bot Manager',
        hint: 'Separates real users from automated traffic and decides what each one is allowed to do.',
        group: true,
        values: ['', '', '']
      },
      {
        label: 'Lite',
        hint: 'The entry tier of Bot Manager, with the standard detection rules.',
        values: [true, true, 'Custom']
      }
    ]
  },
  {
    eyebrow: 'Protect',
    title: 'Azion Edge DNS',
    description: 'Security from the foundation of every connection.',
    rows: [
      {
        label: 'Edge DNS',
        hint: 'Authoritative DNS hosting for your zones, answered from the same network as your applications.',
        group: true,
        values: ['', '', '']
      },
      { label: 'Zones', values: ['10 included', '10 included', 'Custom'] },
      { label: 'Queries', values: ['1M / mo included', '1M / mo included', 'Custom'] }
    ]
  },
  {
    eyebrow: 'Observe',
    title: 'Real-Time Observability',
    description: 'See everything. Turn data into insights.',
    rows: [
      {
        label: 'Real-Time Metrics',
        hint: 'Aggregated traffic, performance and security charts, updated as requests arrive.',
        group: true,
        values: [true, true, true]
      },
      {
        label: 'Real-Time Events',
        hint: 'Queryable request-level logs for applications, functions and firewall activity.',
        group: true,
        values: ['', '', '']
      },
      {
        label: 'Storage',
        values: ['1 GB / mo included', '2 GB / mo included', 'Custom']
      },
      {
        label: 'Data Scan',
        hint: 'The volume of stored event data your queries read.',
        values: ['1 GB / mo included', '2 GB / mo included', 'Custom']
      },
      {
        label: 'Data Stream',
        hint: 'Streams your event data to a third-party endpoint as it is produced.',
        group: true,
        values: ['', '', '']
      },
      { label: 'Requests', values: ['1M / mo included', '2M / mo included', 'Custom'] },
      {
        label: 'Data transfer',
        values: ['10 GB / mo included', '20 GB / mo included', 'Custom']
      },
      {
        label: 'Edge Pulse',
        hint: 'Measures real user performance from the browser and reports it back.',
        group: true,
        values: [true, true, true]
      }
    ]
  },
  {
    eyebrow: 'Azion Platform',
    title: 'Compliance',
    description: 'Compliance that protects your business.',
    rows: [
      {
        label: 'PCI DSS 4.0.1 Level 1 Service Provider',
        hint: 'Azion is assessed annually as a Level 1 service provider under PCI DSS 4.0.1.',
        group: true,
        values: ['—', '—', true]
      },
      {
        label: 'SOC 2 Type 2 / SOC 3',
        hint: "Independent audit of Azion's security, availability and confidentiality controls over time.",
        group: true,
        values: ['—', '—', true]
      },
      {
        label: 'FIPS 140-2 Level 3',
        hint: 'Cryptographic keys are held in hardware validated to FIPS 140-2 Level 3.',
        group: true,
        values: ['—', '—', 'Included with Secure Key Store (paid add-on)']
      }
    ]
  },
  {
    eyebrow: 'Contractual commitments',
    title: 'Commit and Save',
    description: 'Commit up front and save more.',
    rows: [
      {
        label: 'Capacity Reservation',
        hint: 'Commit to a usage volume up front in exchange for a lower unit price.',
        group: true,
        values: ['—', '—', 'Available']
      },
      {
        label: 'Savings Plan',
        hint: 'Commit to a spend amount over a 1, 2 or 3 year term in exchange for a lower unit price.',
        group: true,
        values: ['—', '—', 'Available']
      }
    ]
  }
]

// The eleven answers, verbatim. `value` is the Accordion item's key — a short slug of the
// question, so the open item is legible in the markup instead of being `item-7`.
export const FAQ = [
  {
    value: 'incluido',
    question: 'How do I know what each plan includes?',
    answer:
      "Each plan includes access to every feature checked in the table above, within that plan's included usage and resource limits. Paid add-ons are not included by default."
  },
  {
    value: 'preview',
    question: 'How do Preview features work?',
    answer:
      'Preview features are not enabled by default. Request access through a support ticket before using them.'
  },
  {
    value: 'mensal-anual',
    question: 'What is the difference between monthly and annual billing?',
    answer:
      'With monthly billing you are charged one month at a time. With annual billing you commit to 12 months and pay the full annual amount up front, although the price is shown as its monthly equivalent. Both options renew automatically for the same term until cancelled.'
  },
  {
    value: 'excedente',
    question: 'What happens if I exceed my included usage or resource limits?',
    answer:
      'On the Hobby plan, exceeding the included usage or resource limits may require an upgrade or your account may be restricted. On the Pro and Enterprise plans usage is flexible, and any additional consumption is charged at on-demand pricing, with configurable limits available to control spend.'
  },
  {
    value: 'quando-pro',
    question: 'When should I choose the Pro plan?',
    answer:
      'Pro is designed for growing applications that need more included usage, flexible overages and spend control.'
  },
  {
    value: 'quando-enterprise',
    question: 'When should I choose the Enterprise plan?',
    answer:
      'Enterprise is the right fit when you need maximum pricing flexibility — either paying entirely on-demand with no fixed commitment, or optimizing costs through a Capacity Reservation or a multi-year Savings Plan.'
  },
  {
    value: 'on-demand',
    question: 'How does on-demand pricing work?',
    answer:
      'On-demand pricing is based on actual consumption, using current rates for resources such as requests, data transfer, storage and compute time. On the Pro and Enterprise plans it charges consumption beyond the included amounts, and on Enterprise it can serve as the primary pricing model for those resources with no commitment.'
  },
  {
    value: 'precos-detalhados',
    question: 'Where can I see detailed usage and overage pricing?',
    answer:
      'Detailed on-demand pricing for each product is available through the “See on-demand pricing” link at the foot of the comparison table on this page.'
  },
  {
    value: 'compromissos',
    question: 'What commitment options are available?',
    answer:
      'Enterprise customers can reduce costs with a Capacity Reservation or a Savings Plan. A Capacity Reservation is based on committed usage, while a Savings Plan is based on committed spend over a 1, 2 or 3 year term.'
  },
  {
    value: 'suporte',
    question: 'How are support and professional services offered across the plans?',
    answer:
      'Every plan includes Developer Support by default. Additional support tiers and professional services are available as optional add-ons for Enterprise customers. See the Support page for details.'
  },
  {
    value: 'cancelar',
    question: 'Can I cancel or change my plan at any time?',
    answer:
      'You can upgrade your plan at any time, with changes taking effect immediately. Downgrades and cancellations take effect at the end of your current billing cycle.'
  }
]

// The platform primitives, grouped by capability — the same set the homepage's band
// carries, in the pt-BR wording this page uses. One NavColumn per group, one NavItem per
// primitive; `href` points at the sample's own page where it has one.
export const PRIMITIVE_GROUPS = [
  {
    label: 'Compute',
    items: [
      {
        icon: 'ai ai-edge-functions',
        title: 'Functions',
        description: 'Run code globally, low latency',
        href: '/site/functions'
      },
      { icon: 'pi pi-sitemap', title: 'Rules', description: 'Control traffic routing' },
      {
        icon: 'ai ai-load-balancer',
        title: 'Load Balancer',
        description: 'High availability across origins'
      },
      {
        icon: 'pi pi-image',
        title: 'Image Processor',
        description: 'Optimize and modify images'
      }
    ]
  },
  {
    label: 'AI',
    items: [
      {
        icon: 'ai ai-edge-ai',
        title: 'AI Inference',
        description: 'Low-latency distributed inference'
      },
      {
        icon: 'ai ai-gateway',
        title: 'AI Gateway',
        description: 'Govern and route LLMs'
      }
    ]
  },
  {
    label: 'Data',
    items: [
      {
        icon: 'ai ai-edge-storage',
        title: 'Object Storage',
        description: 'Store and deliver globally'
      },
      {
        icon: 'ai ai-edge-sql',
        title: 'SQL Database',
        description: 'Distributed SQL with low latency'
      },
      {
        icon: 'ai ai-edge-kv',
        title: 'KV Store',
        description: 'Keep state close, fast'
      },
      {
        icon: 'ai ai-tiered-cache',
        title: 'Cache',
        description: 'Accelerate delivery, boost reliability'
      }
    ]
  },
  {
    label: 'Security',
    items: [
      {
        icon: 'ai ai-waf-rules',
        title: 'Web Application Firewall (WAF)',
        description: 'Smart way to block threats'
      },
      {
        icon: 'ai ai-azion-api',
        title: 'API Gateway',
        description: 'Authenticate and protect APIs'
      },
      {
        icon: 'pi pi-android',
        title: 'Bot Management',
        description: 'Stop bots, prevent abuse'
      },
      {
        icon: 'ai ai-edge-dns',
        title: 'DNS',
        description: 'Resilient DNS with performance'
      }
    ]
  }
]
