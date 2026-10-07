// One entry per product page rendered by LandingProduct through SolutionPage. The key is
// the URL slug under /site/products/, so the route, the mega-menu and the catalogue all
// point at the same page. Products with a hand-built page (Workloads, Functions, Cache,
// Application Accelerator, AI Inference) are not here.

const DOCS = 'https://www.azion.com/en/documentation/'

const NETWORK_BAND = {
  eyebrow: 'Region: Earth.',
  title: 'One distributed infrastructure to build, secure and scale workloads anywhere.',
  lead: 'Built around your users. Distributed around your data.',
  claims: [
    '100+ data centers',
    '100+ Tbps network capacity',
    '30 ms median latency',
    '100% availability'
  ]
}

const cta = (title) => ({
  eyebrow: 'Get Started',
  title,
  titleMuted: 'Start free, scale when you need to.',
  description:
    'Create an account and ship to production in minutes, or talk to our team about your architecture.'
})

const SQL_SAMPLE = `import { Database } from 'azion:sql'

export default {
  async fetch(request) {
    const conn = await Database.open('catalog')
    const rows = await conn.query(
      'SELECT id, name, price FROM products ORDER BY name LIMIT 20'
    )

    const products = []
    let row = await rows.next()
    while (row) {
      products.push({
        id: row.getValue('id'),
        name: row.getValue('name'),
        price: row.getValue('price')
      })
      row = await rows.next()
    }

    return Response.json(products)
  }
}`

const STORAGE_SAMPLE = `import Storage from 'azion:storage'

const bucket = new Storage('assets')

export default {
  async fetch(request) {
    const key = new URL(request.url).pathname.slice(1)
    const object = await bucket.get(key)

    return new Response(await object.arrayBuffer(), {
      headers: { 'content-type': object.contentType }
    })
  }
}`

export const PRODUCT_PAGES = {
  'sql-database': {
    hero: {
      eyebrow: 'SQL Database',
      title: 'A distributed SQL database that lives next to your code',
      description:
        'Run SQLite-compatible databases across the Azion network. Reads are served close to the user, and there are no servers or replicas to manage.'
    },
    capabilities: [
      {
        icon: 'ai ai-edge-sql',
        title: 'SQLite-compatible',
        description:
          'Use the SQL you already know. Bring schemas, migrations and tools without a rewrite.'
      },
      {
        icon: 'ai ai-edge-nodes',
        title: 'Reads close to users',
        description: 'Replicas sit across the network, so queries answer from the nearest location.'
      },
      {
        icon: 'ai ai-edge-functions',
        title: 'Native to Functions',
        description:
          'Open a connection from a Function with one import. No drivers, no connection pools.'
      },
      {
        icon: 'pi pi-search',
        title: 'Vector search built in',
        description:
          'Store embeddings next to your rows and run similarity search for RAG and AI agents.'
      },
      {
        icon: 'pi pi-server',
        title: 'Nothing to operate',
        description:
          'No instances to size, patch or fail over. Replication and backups are handled for you.'
      },
      {
        icon: 'pi pi-code',
        title: 'API, CLI and Console',
        description:
          'Create databases and run queries from the Console, the Azion CLI or the REST API.'
      }
    ],
    code: {
      title: 'Query from a Function in a few lines',
      description:
        'Open the database by name and run SQL. The connection is resolved by the runtime, so there are no credentials in your code.',
      href: DOCS,
      tabs: [
        {
          label: 'Query rows',
          value: 'query',
          language: 'javascript',
          code: SQL_SAMPLE,
          fileName: 'main.js',
          fileIcon: 'pi pi-file'
        }
      ]
    },
    useCases: {
      title: 'Data where your application runs',
      items: [
        {
          illustration: 'distributed-apis',
          title: 'Distributed APIs',
          description:
            'Back serverless APIs with a database that is already close to every request.'
        },
        {
          illustration: 'ai-applications',
          title: 'AI and RAG',
          description:
            'Keep embeddings and source records together and retrieve context at low latency.'
        },
        {
          illustration: 'saas-platforms',
          title: 'Multi-tenant SaaS',
          description:
            'Give each tenant its own database and keep data isolated without extra infrastructure.'
        }
      ]
    },
    primitivesTitle: 'Pair SQL Database with the rest of the platform',
    network: NETWORK_BAND,
    faq: [
      {
        value: 'q1',
        question: 'Is SQL Database compatible with SQLite?',
        answer:
          'Yes. SQL Database uses the SQLite dialect, so existing schemas, queries and most tooling work as they are.'
      },
      {
        value: 'q2',
        question: 'How do I connect from my application?',
        answer:
          'From a Function, import the SQL module and open the database by name. From anywhere else, use the REST API or the Azion CLI.'
      },
      {
        value: 'q3',
        question: 'Does it support vector search?',
        answer:
          'Yes. You can store vector embeddings in tables and query them by similarity, which makes it a fit for RAG pipelines.'
      }
    ],
    cta: cta('Create your first database.')
  },

  'object-storage': {
    hero: {
      eyebrow: 'Object Storage',
      title: 'Store and serve objects from the edge of the network',
      description:
        'S3-compatible storage for static assets, media and application data, served through the same network that runs your applications.'
    },
    capabilities: [
      {
        icon: 'ai ai-edge-storage',
        title: 'S3-compatible API',
        description: 'Use the SDKs and tools you already have to upload, list and manage objects.'
      },
      {
        icon: 'ai ai-edge-nodes',
        title: 'Served from the edge',
        description:
          'Objects are delivered through the Azion network, close to the people requesting them.'
      },
      {
        icon: 'ai ai-tiered-cache',
        title: 'Works with Cache',
        description:
          'Put Cache in front of a bucket and offload repeat requests without extra setup.'
      },
      {
        icon: 'ai ai-edge-functions',
        title: 'Read from Functions',
        description:
          'Fetch and write objects from a Function with a single import, no keys in your code.'
      },
      {
        icon: 'pi pi-lock',
        title: 'Private by default',
        description: 'Buckets stay private until you choose what to expose and how.'
      },
      {
        icon: 'pi pi-wallet',
        title: 'Pay for what you store',
        description: 'No capacity to reserve up front. Storage and transfer scale with your usage.'
      }
    ],
    code: {
      title: 'Serve a bucket from a Function',
      description:
        'Open a bucket by name, read the object for the request path and stream it back with its content type.',
      href: DOCS,
      tabs: [
        {
          label: 'Serve objects',
          value: 'serve',
          language: 'javascript',
          code: STORAGE_SAMPLE,
          fileName: 'main.js',
          fileIcon: 'pi pi-file'
        }
      ]
    },
    useCases: {
      title: 'One place for the files your applications need',
      items: [
        {
          illustration: 'modern-frontends',
          title: 'Static sites and frontends',
          description:
            'Host build output and assets, then deliver them through the network with Cache.'
        },
        {
          illustration: 'global-network',
          title: 'Media delivery',
          description: 'Store images, video and downloads once and serve them to users everywhere.'
        },
        {
          illustration: 'ai-applications',
          title: 'AI datasets and artifacts',
          description: 'Keep models, documents and datasets next to the inference that uses them.'
        }
      ]
    },
    primitivesTitle: 'Pair Object Storage with the rest of the platform',
    network: NETWORK_BAND,
    faq: [
      {
        value: 'q1',
        question: 'Can I use my existing S3 tools?',
        answer:
          'Yes. Object Storage exposes an S3-compatible API, so most S3 SDKs and CLIs work after you point them at Azion and set credentials.'
      },
      {
        value: 'q2',
        question: 'Can I serve a bucket as a website?',
        answer:
          'Yes. Connect the bucket to an application and add Cache in front of it to deliver static sites and assets.'
      },
      {
        value: 'q3',
        question: 'Are buckets public?',
        answer: 'No. Buckets are private by default and you decide what is exposed.'
      }
    ],
    cta: cta('Create your first bucket.')
  },

  'kv-store': {
    hero: {
      eyebrow: 'KV Store',
      title: 'A low-latency key-value store for global applications',
      description:
        'Keep sessions, flags and configuration close to every request. Read and write from Functions with no database to run.'
    },
    capabilities: [
      {
        icon: 'ai ai-edge-kv',
        title: 'Fast reads everywhere',
        description:
          'Keys are read from the nearest location, so lookups add little to request time.'
      },
      {
        icon: 'ai ai-edge-functions',
        title: 'Built for Functions',
        description:
          'Get, put and delete keys from a Function without drivers or connection handling.'
      },
      {
        icon: 'pi pi-clock',
        title: 'Expiration per key',
        description: 'Set a time to live on a key and let short-lived data clean itself up.'
      },
      {
        icon: 'pi pi-sliders-h',
        title: 'Flags and configuration',
        description: 'Change behavior at the edge without redeploying your application.'
      },
      {
        icon: 'pi pi-server',
        title: 'Nothing to operate',
        description: 'No clusters, no capacity planning. The store scales with your traffic.'
      },
      {
        icon: 'pi pi-code',
        title: 'API, CLI and Console',
        description: 'Manage namespaces and keys from the Console, the Azion CLI or the REST API.'
      }
    ],
    useCases: {
      title: 'State for applications that run everywhere',
      items: [
        {
          illustration: 'low-latency',
          title: 'Sessions and personalization',
          description:
            'Look up session and user preferences on every request without a round trip to origin.'
        },
        {
          illustration: 'stay-in-control',
          title: 'Feature flags',
          description:
            'Turn features on and off, or route traffic, by changing a key instead of shipping code.'
        },
        {
          illustration: 'saas-platforms',
          title: 'Tenant configuration',
          description: 'Resolve hostnames and settings per tenant at the edge in a single read.'
        }
      ]
    },
    primitivesTitle: 'Pair KV Store with the rest of the platform',
    network: NETWORK_BAND,
    faq: [
      {
        value: 'q1',
        question: 'When should I use KV Store instead of SQL Database?',
        answer:
          'Use KV Store for simple lookups by key, like sessions, flags and configuration. Use SQL Database when you need queries, joins or relational structure.'
      },
      {
        value: 'q2',
        question: 'Can keys expire?',
        answer: 'Yes. You can set an expiration on a key and it is removed automatically.'
      }
    ],
    cta: cta('Create your first KV namespace.')
  },

  waf: {
    hero: {
      eyebrow: 'Web Application Firewall',
      title: 'Stop attacks before they reach your application',
      description:
        'Block injection, cross-site scripting and OWASP Top 10 threats at the edge, with rules you can tune per application and per path.'
    },
    capabilities: [
      {
        icon: 'ai ai-waf-rules',
        title: 'OWASP Top 10 coverage',
        description:
          'Managed protection against SQL injection, XSS, file inclusion and other common attacks.'
      },
      {
        icon: 'pi pi-sliders-h',
        title: 'Tunable sensitivity',
        description:
          'Adjust sensitivity per threat family and add exceptions where your application needs them.'
      },
      {
        icon: 'pi pi-eye',
        title: 'Learning mode',
        description:
          'Watch what would be blocked before you enforce, and avoid false positives in production.'
      },
      {
        icon: 'ai ai-edge-nodes',
        title: 'Enforced at the edge',
        description: 'Malicious requests are dropped near their source instead of at your origin.'
      },
      {
        icon: 'pi pi-sitemap',
        title: 'Programmable with Functions',
        description: 'Add your own logic when a managed rule is not enough.'
      },
      {
        icon: 'pi pi-chart-bar',
        title: 'Full visibility',
        description:
          'Every blocked request is logged and available in Real-Time Metrics and Data Stream.'
      }
    ],
    useCases: {
      title: 'Protection for every kind of application',
      items: [
        {
          illustration: 'programmable-security',
          title: 'Programmable security',
          description:
            'Combine managed rules with your own logic to fit how your application really works.'
        },
        {
          illustration: 'implement-api-gateway-security',
          title: 'API protection',
          description:
            'Inspect API traffic and block malformed or malicious payloads before they hit your backend.'
        },
        {
          illustration: 'protect-financial-applications',
          title: 'Regulated workloads',
          description:
            'Help meet PCI DSS and similar requirements for applications that handle sensitive data.'
        }
      ]
    },
    primitivesTitle: 'Pair WAF with the rest of the platform',
    network: NETWORK_BAND,
    compliance: true,
    faq: [
      {
        value: 'q1',
        question: 'Can I test rules before blocking traffic?',
        answer:
          'Yes. Run the WAF in learning mode to log what would be blocked, review it, and then switch to blocking.'
      },
      {
        value: 'q2',
        question: 'How do I handle false positives?',
        answer:
          'Lower the sensitivity for a threat family or add an exception for a specific path, header or argument.'
      }
    ],
    cta: cta('Put a WAF in front of your application.')
  },

  'network-shield': {
    hero: {
      eyebrow: 'Network Shield',
      title: 'Network and DDoS protection at the edge',
      description:
        'Absorb volumetric attacks across the Azion network and control who reaches your applications with network lists by IP, ASN and country.'
    },
    capabilities: [
      {
        icon: 'ai ai-network-lists',
        title: 'Network lists',
        description: 'Allow or deny traffic by IP address, CIDR, ASN or country.'
      },
      {
        icon: 'pi pi-shield',
        title: 'Always-on DDoS protection',
        description:
          'Layer 3, 4 and 7 attacks are mitigated across the network without manual action.'
      },
      {
        icon: 'ai ai-edge-nodes',
        title: 'Distributed capacity',
        description: 'Attack traffic is spread across 100+ locations instead of landing on one.'
      },
      {
        icon: 'pi pi-stopwatch',
        title: 'Rate limiting',
        description: 'Cap requests per client to slow down abuse, scraping and brute force.'
      },
      {
        icon: 'pi pi-sitemap',
        title: 'Rules you control',
        description: 'Decide what happens to each request: allow, deny, drop or redirect.'
      },
      {
        icon: 'pi pi-chart-bar',
        title: 'Attack visibility',
        description:
          'See mitigated traffic in Real-Time Metrics and export events with Data Stream.'
      }
    ],
    useCases: {
      title: 'Keep applications online under pressure',
      items: [
        {
          illustration: 'automate-threat-mitigation',
          title: 'Automated mitigation',
          description:
            'Detect and absorb attacks as they happen, without waiting on a manual response.'
        },
        {
          illustration: 'global-network',
          title: 'Geo and network control',
          description: 'Limit access by region or network to match where your users really are.'
        },
        {
          illustration: 'stay-in-control',
          title: 'Origin shielding',
          description:
            'Only clean traffic reaches your infrastructure, so it stays sized for real demand.'
        }
      ]
    },
    primitivesTitle: 'Pair Network Shield with the rest of the platform',
    network: NETWORK_BAND,
    compliance: true,
    faq: [
      {
        value: 'q1',
        question: 'Is DDoS protection on by default?',
        answer:
          'Yes. Traffic that passes through the Azion network is protected against volumetric attacks.'
      },
      {
        value: 'q2',
        question: 'What can a network list match?',
        answer:
          'IP addresses and CIDR ranges, ASNs and countries. You can use them to allow or deny traffic.'
      }
    ],
    cta: cta('Protect your applications at the network edge.')
  },

  'edge-dns': {
    hero: {
      eyebrow: 'Edge DNS',
      title: 'Authoritative DNS that answers from everywhere',
      description:
        'Host your zones on the Azion network for fast, resilient resolution, with DNSSEC and records you can manage from the Console, CLI or API.'
    },
    capabilities: [
      {
        icon: 'ai ai-edge-dns',
        title: 'Anycast resolution',
        description:
          'Queries are answered by the nearest location, which keeps lookups fast for users.'
      },
      {
        icon: 'pi pi-shield',
        title: 'DNSSEC',
        description: 'Sign your zones and protect users from spoofed answers.'
      },
      {
        icon: 'pi pi-server',
        title: 'Resilient by design',
        description:
          'Zones are served from many locations, so one failure does not take your domain down.'
      },
      {
        icon: 'pi pi-list',
        title: 'Every common record type',
        description: 'A, AAAA, CNAME, MX, TXT, CAA, NS and more, with ANAME support at the apex.'
      },
      {
        icon: 'pi pi-code',
        title: 'Infrastructure as code',
        description:
          'Manage records through the API, the CLI or Terraform alongside the rest of your stack.'
      },
      {
        icon: 'pi pi-link',
        title: 'Connected to your workloads',
        description: 'Point a domain at a workload and the records are created for you.'
      }
    ],
    useCases: {
      title: 'The first hop of every request',
      items: [
        {
          illustration: 'dns-protection',
          title: 'Protected DNS',
          description: 'Keep resolution available during attacks and protect it with DNSSEC.'
        },
        {
          illustration: 'global-network',
          title: 'Fast global lookups',
          description: 'Cut the time users spend resolving your domain, wherever they are.'
        },
        {
          illustration: 'infrastructure-as-code',
          title: 'DNS as code',
          description:
            'Version your zones and ship record changes through the same pipeline as your code.'
        }
      ]
    },
    primitivesTitle: 'Pair Edge DNS with the rest of the platform',
    network: NETWORK_BAND,
    faq: [
      {
        value: 'q1',
        question: 'Can I move my existing zone to Edge DNS?',
        answer:
          'Yes. Recreate or import your records, then update the nameservers at your registrar.'
      },
      {
        value: 'q2',
        question: 'Does Edge DNS support DNSSEC?',
        answer: 'Yes. You can enable DNSSEC per zone and publish the DS record at your registrar.'
      }
    ],
    cta: cta('Move your zones to Edge DNS.')
  },

  'load-balancer': {
    hero: {
      eyebrow: 'Load Balancer',
      title: 'Global load balancing across every origin you run',
      description:
        'Distribute traffic between clouds, data centers and regions, with health checks and failover that happen at the edge.'
    },
    capabilities: [
      {
        icon: 'ai ai-load-balancer',
        title: 'Multiple algorithms',
        description: 'Round robin, weighted and least connections, chosen per origin group.'
      },
      {
        icon: 'pi pi-heart',
        title: 'Health checks',
        description: 'Unhealthy origins are taken out of rotation until they recover.'
      },
      {
        icon: 'pi pi-refresh',
        title: 'Automatic failover',
        description: 'Traffic moves to a healthy origin without DNS changes or manual action.'
      },
      {
        icon: 'pi pi-cloud',
        title: 'Hybrid and multi-cloud',
        description: 'Balance across any mix of clouds and on-premises origins.'
      },
      {
        icon: 'ai ai-edge-nodes',
        title: 'Decided at the edge',
        description: 'Routing happens close to the user, before the request travels to an origin.'
      },
      {
        icon: 'pi pi-chart-bar',
        title: 'Observable',
        description: 'Follow origin health and distribution in Real-Time Metrics.'
      }
    ],
    useCases: {
      title: 'Keep every request on a healthy path',
      items: [
        {
          illustration: 'improve-application-performance-and-reliability',
          title: 'High availability',
          description: 'Survive an origin or region failure without your users noticing.'
        },
        {
          illustration: 'distributed-apis',
          title: 'Multi-region APIs',
          description:
            'Spread API traffic across regions and send users to the closest healthy backend.'
        },
        {
          illustration: 'global-network',
          title: 'Cloud migrations',
          description:
            'Shift traffic gradually between providers with weights instead of a hard cutover.'
        }
      ]
    },
    primitivesTitle: 'Pair Load Balancer with the rest of the platform',
    network: NETWORK_BAND,
    faq: [
      {
        value: 'q1',
        question: 'Which origins can I balance between?',
        answer: 'Any reachable HTTP origin: public clouds, data centers, or a mix of both.'
      },
      {
        value: 'q2',
        question: 'How does failover work?',
        answer:
          'Health checks run continuously. When an origin fails them, it is removed from rotation and traffic goes to the remaining healthy origins.'
      }
    ],
    cta: cta('Balance traffic across your origins.')
  },

  'data-stream': {
    hero: {
      eyebrow: 'Data Stream',
      title: 'Stream every request to the tools you already use',
      description:
        'Send logs and events from your applications, functions and firewall to your SIEM, data lake or observability stack in real time.'
    },
    capabilities: [
      {
        icon: 'ai ai-data-stream',
        title: 'Real-time delivery',
        description: 'Events leave the edge seconds after the request, not in hourly batches.'
      },
      {
        icon: 'pi pi-send',
        title: 'Many destinations',
        description:
          'Send to S3-compatible storage, Kafka, Splunk, Datadog, Elasticsearch and HTTP endpoints.'
      },
      {
        icon: 'pi pi-filter',
        title: 'Choose your fields',
        description: 'Pick a template or define exactly which variables go into each event.'
      },
      {
        icon: 'pi pi-sitemap',
        title: 'Every data source',
        description: 'Applications, Functions, WAF and Activity History, from one place.'
      },
      {
        icon: 'pi pi-percentage',
        title: 'Sampling',
        description: 'Send a share of traffic when full volume is more than you need.'
      },
      {
        icon: 'pi pi-shield',
        title: 'Security analytics',
        description: 'Feed WAF events into your SIEM to correlate threats across your stack.'
      }
    ],
    useCases: {
      title: 'Your edge data, in your stack',
      items: [
        {
          illustration: 'live-debugging',
          title: 'Debugging and troubleshooting',
          description:
            'Follow requests as they happen and find the cause of an error without guessing.'
        },
        {
          illustration: 'automate-threat-mitigation',
          title: 'Security monitoring',
          description:
            'Ship firewall events to your SIEM and act on threats with the tools your team knows.'
        },
        {
          illustration: 'stay-in-control',
          title: 'Analytics and retention',
          description: 'Keep raw events in your own data lake for reporting, audits and compliance.'
        }
      ]
    },
    primitivesTitle: 'Pair Data Stream with the rest of the platform',
    network: NETWORK_BAND,
    faq: [
      {
        value: 'q1',
        question: 'Which destinations are supported?',
        answer:
          'S3-compatible storage, Apache Kafka, Splunk, Datadog, Elasticsearch, Google BigQuery, Azure services and generic HTTP endpoints, among others.'
      },
      {
        value: 'q2',
        question: 'Can I control which fields are sent?',
        answer: 'Yes. Start from a template or define a custom set of variables for each stream.'
      }
    ],
    cta: cta('Start streaming your edge data.')
  },

  'real-time-metrics': {
    hero: {
      eyebrow: 'Real-Time Metrics',
      title: 'See what your applications are doing right now',
      description:
        'Live dashboards for traffic, performance, cache and security across every application, function and firewall you run on Azion.'
    },
    capabilities: [
      {
        icon: 'ai ai-real-time-metrics',
        title: 'Live dashboards',
        description: 'Requests, bandwidth, status codes and latency, updated as traffic arrives.'
      },
      {
        icon: 'ai ai-tiered-cache',
        title: 'Cache performance',
        description: 'Follow hit ratio and offload to see how much work your origin is spared.'
      },
      {
        icon: 'ai ai-waf-rules',
        title: 'Security insights',
        description: 'Spot WAF and bot activity as it happens and see what was blocked.'
      },
      {
        icon: 'pi pi-filter',
        title: 'Filter and drill down',
        description: 'Slice data by application, domain, country, status and more.'
      },
      {
        icon: 'pi pi-code',
        title: 'GraphQL API',
        description: 'Query the same data from your own dashboards and automation.'
      },
      {
        icon: 'pi pi-server',
        title: 'Included with the platform',
        description: 'No agents to install and no pipeline to build.'
      }
    ],
    useCases: {
      title: 'Answers in seconds, not after the incident',
      items: [
        {
          illustration: 'live-debugging',
          title: 'Incident response',
          description:
            'See an error spike or traffic drop the moment it starts and narrow down the cause.'
        },
        {
          illustration: 'improve-application-performance-and-reliability',
          title: 'Performance tuning',
          description:
            'Find slow paths and low cache hit ratios, change a rule, and watch the effect.'
        },
        {
          illustration: 'white-gloves-when-it-matters',
          title: 'Launch monitoring',
          description: 'Watch a release or campaign live and react before users feel a problem.'
        }
      ]
    },
    primitivesTitle: 'Pair Real-Time Metrics with the rest of the platform',
    network: NETWORK_BAND,
    faq: [
      {
        value: 'q1',
        question: 'Do I need to install anything?',
        answer:
          'No. Metrics are collected for every product you run on Azion and are available in the Console.'
      },
      {
        value: 'q2',
        question: 'Can I query the data programmatically?',
        answer: 'Yes. The same data is available through the GraphQL API.'
      }
    ],
    cta: cta('See your traffic in real time.')
  },

  'edge-pulse': {
    hero: {
      eyebrow: 'Edge Pulse',
      title: 'Measure the experience your users actually get',
      description:
        'Real user monitoring that collects performance data from real browsers, so you see how your application behaves for real users, not only in the lab.'
    },
    capabilities: [
      {
        icon: 'ai ai-edge-pulse',
        title: 'Real user data',
        description: 'Measurements come from real visitors, on their own devices and networks.'
      },
      {
        icon: 'pi pi-bolt',
        title: 'Lightweight tag',
        description: 'A small, asynchronous script that does not slow down your pages.'
      },
      {
        icon: 'pi pi-globe',
        title: 'Coverage by region',
        description: 'Compare latency and throughput across countries and networks.'
      },
      {
        icon: 'pi pi-chart-line',
        title: 'Before and after',
        description: 'See how a migration or configuration change shifts real-world performance.'
      },
      {
        icon: 'ai ai-edge-nodes',
        title: 'Network benchmarking',
        description: 'Measure how the Azion network performs for your audience.'
      },
      {
        icon: 'ai ai-real-time-metrics',
        title: 'Results in Real-Time Metrics',
        description: 'Read the data alongside the rest of your platform metrics.'
      }
    ],
    useCases: {
      title: 'Performance from the user side',
      items: [
        {
          illustration: 'low-latency',
          title: 'Latency by audience',
          description: 'Find out where users wait the longest and what is slowing them down.'
        },
        {
          illustration: 'retail-application-modernization',
          title: 'Commerce and conversion',
          description: 'Tie real-world speed to the pages and regions that drive revenue.'
        },
        {
          illustration: 'improve-application-performance-and-reliability',
          title: 'Validate changes',
          description:
            'Confirm that a new provider or configuration made things faster for real users.'
        }
      ]
    },
    primitivesTitle: 'Pair Edge Pulse with the rest of the platform',
    network: NETWORK_BAND,
    faq: [
      {
        value: 'q1',
        question: 'How do I start collecting data?',
        answer:
          'Add the Edge Pulse tag to your pages. Data starts arriving as soon as users visit them.'
      },
      {
        value: 'q2',
        question: 'Does the tag affect page performance?',
        answer:
          'The tag loads asynchronously after the page and is designed to have no visible impact on users.'
      }
    ],
    cta: cta('Start measuring real user experience.')
  }
}
