// The Azion documentation navigation, transcribed from the live docs sidebar: the
// same eight sections, the same collapsible groups, the same rows, in the same
// order.
//
// Shape: each entry is a docs SECTION — `{ label, items }`, which is `Menu`'s
// `MenuGroupNode` verbatim: a SEGMENT, a title over its rows. Within `items`, a node
// with `children` renders as an inline sub-menu — the CONDENSED row the docs use for
// product groups (`Migrate`, `Modules`, `Guides`, `Reference`), which expands in place
// behind a chevron and a rail, nesting four more levels deep inside its segment.
//
// THE SECTIONS ARE SEGMENTED, NOT DRILLED. The eight used to be drill LEVELS: the rail's
// root was the eight pillars and choosing one replaced the whole rail with that pillar's
// own menu behind a Back row. They are segment headers again — one column, eight labels,
// the condensed rows doing the folding — which is the shape the live docs sidebar has
// (azion.com/en/documentation/: `Start`, `Build`, `Store`, `Secure`, `Observe`,
// `Resources`, `Manage`, `Updates and Policies` as headers over their rows). A level that
// replaces the rail hides seven pillars to show one; a segment that titles its rows hides
// nothing, and the condensed row is what keeps the column short enough for that to work.
//
// ONE ROW IS A DRILL, and it is `Functions` (search `kind: 'drill'` below) — a product
// promoted out of `Applications › Modules` to sit BESIDE `Applications` in the `Build`
// segment, where it owns a whole menu rather than a fifth level of indent. Not a second
// opinion about the sections: a segment titles rows without hiding any, and this one row
// is where a level that replaces the column earns what it costs. It is also the working
// example of the pattern in this prototype: `DocsLayout` wires the stack (`v-model:path`)
// and the `Menu.Back` row that returns from it, and everything else stays condensed.
//
// Most rows carry no `href`: the prototype is self-contained, so activating one moves
// the selection rather than leaving the app. Ids derive from the docs path each row
// points at, which is what keeps them unique and stable across 275 links.
//
// The rows whose page ACTUALLY EXISTS in the sample do carry one, so the tree is how a
// reader reaches them — a page nobody can navigate to is a URL, not a page. `href` (not
// a router `to`) because a documentation row is a link: it must be middle-clickable,
// ⌘-clickable and copyable like every other link in the docs. `DocsLayout` intercepts
// the plain left click and routes it in-app, so the SPA stays an SPA and the modified
// click stays the browser's.
import { menuLeaves, menuPath } from '@shared/lib/menu-tree.js'

import { agentHref, AGENTS } from './docs-agent-setup.js'

/**
 * The Agent Setup segment's rows, GENERATED from the same list the pages render.
 *
 * The section is a container with an overview row and one row per tool — the shape every
 * product group in this tree already has (`Applications` over `About Applications` and its
 * modules). Typed out, these eight rows would be a second copy of `AGENTS` free to drift
 * from the seven the index actually offers, and it would drift in the two places nobody
 * checks: the rail's ordering, and the previous/next pair `docs-pages.js` derives from it.
 */
const agentSetupRows = [
  { id: 'agent-setup-overview', label: 'About Agent Setup', href: '/site/docs/agent-setup' },
  ...AGENTS.map((agent) => ({
    id: `agent-setup-${agent.slug}`,
    label: agent.name,
    href: agentHref(agent)
  }))
]

export const docsNavSections = [
  {
    // `Getting Started` titles the SEGMENT and `Overview` is the page inside it — the docs
    // home. It used to be the other way round: the segment was `Start` and its first row
    // was called `Getting Started`, which is the home, so the rail said "Getting Started"
    // about a page that is a directory of the whole site and had no word left for the
    // section. The live docs make the same split (a `Start` header over `Agent Setup`,
    // `First deploy`, …), and it is what keeps the home one thing and the getting-started
    // route another.
    label: 'Getting Started',
    items: [
      { id: 'overview', label: 'Overview', href: '/site/docs' },
      { id: 'agent-setup', label: 'Agent Setup', children: agentSetupRows },
      { id: 'get-started-first-deploy', label: 'First deploy', href: '/site/docs/first-deploy' },
      {
        id: 'migrate',
        label: 'Migrate',
        children: [
          { id: 'get-started-migrate', label: 'About migration' },
          { id: 'get-started-migrate-akamai', label: 'Migrate from Akamai to Azion' },
          { id: 'get-started-migrate-aws', label: 'Migrate from AWS to Azion' },
          { id: 'get-started-migrate-cloudflare', label: 'Migrate from Cloudflare to Azion' },
          { id: 'get-started-migrate-fastly', label: 'Migrate from Fastly to Azion' },
          { id: 'get-started-migrate-vercel', label: 'Migrate from Vercel to Azion' }
        ]
      },
      { id: 'get-started-production-checklist', label: 'Go live' }
    ]
  },
  {
    label: 'Build',
    items: [
      { id: 'build-overview', label: 'About Build' },
      {
        id: 'ai-inference',
        label: 'AI Inference',
        children: [
          { id: 'build-ai-inference', label: 'About AI Inference' },
          {
            id: 'reference',
            label: 'Reference',
            children: [{ id: 'build-ai-inference-reference-models', label: 'Models' }]
          }
        ]
      },
      {
        id: 'applications',
        label: 'Applications',
        children: [
          {
            id: 'build-applications',
            label: 'About Applications',
            href: '/site/docs/applications'
          },
          { id: 'get-started-journeys-launch', label: 'Build an application' },
          {
            id: 'modules',
            label: 'Modules',
            children: [
              {
                id: 'build-applications-application-accelerator',
                label: 'Application Accelerator'
              },
              {
                id: 'cache',
                label: 'Cache',
                children: [
                  {
                    id: 'build-applications-cache',
                    label: 'About Cache',
                    href: '/site/docs/cache'
                  },
                  {
                    id: 'guides',
                    label: 'Guides',
                    children: [
                      {
                        id: 'build-applications-cache-guides-advanced-cache-key',
                        label: 'How to configure Advanced Cache Key for Applications'
                      },
                      {
                        id: 'build-applications-cache-guides-cache-settings',
                        label: 'How to configure cache policies for Applications'
                      },
                      {
                        id: 'build-applications-cache-guides-check-page-cache-time',
                        label: 'Verify Cache Indicators with ModHeader'
                      },
                      {
                        id: 'build-applications-cache-guides-enforce-hls-cache',
                        label: 'How to enforce HLS cache for live streaming delivery'
                      },
                      {
                        id: 'build-applications-cache-guides-tune-cache-settings',
                        label: 'How to tune your cache settings'
                      }
                    ]
                  },
                  {
                    id: 'reference-2',
                    label: 'Reference',
                    children: [
                      {
                        id: 'build-applications-reference-cache-settings',
                        label: 'Cache Settings'
                      },
                      {
                        id: 'build-applications-reference-real-time-purge',
                        label: 'Real-Time Purge'
                      }
                    ]
                  },
                  { id: 'build-applications-cache-tiered-cache', label: 'Tiered Cache' }
                ]
              },
              {
                id: 'image-processor',
                label: 'Image Processor',
                children: [
                  { id: 'build-applications-image-processor', label: 'About Image Processor' },
                  { id: 'build-applications-image-processor-first-steps', label: 'First steps' },
                  {
                    id: 'guides-3',
                    label: 'Guides',
                    children: [
                      {
                        id: 'build-applications-image-processor-guides-process-images',
                        label: 'How to optimize image processing at the edge'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 'guides-4',
            label: 'Guides',
            children: [
              {
                id: 'build-applications-guides-configure-main-settings',
                label: 'How to configure main settings'
              },
              {
                id: 'build-applications-guides-create-device-groups',
                label: 'How to create device groups'
              },
              {
                id: 'build-applications-guides-debug-rules',
                label: 'How to debug rules created with Rules Engine'
              },
              {
                id: 'build-applications-guides-gzip-compression',
                label: 'How to enable gzip compression for Applications'
              },
              {
                id: 'build-applications-guides-how-to-generate-a-lets-encrypt-cer',
                label: "Generate a Let's Encrypt Cert for Your Domain"
              },
              {
                id: 'build-applications-guides-stage-applications-through-hosts-f',
                label: 'How to stage an application through the hosts file'
              },
              {
                id: 'build-applications-guides-work-with-origins',
                label: 'How to define a new origin for your application'
              },
              {
                id: 'build-applications-guides-work-with-rules-engine',
                label: 'Automate Behaviors with Rules Engine'
              }
            ]
          },
          {
            id: 'reference-3',
            label: 'Reference',
            children: [
              { id: 'build-applications-reference-device-groups', label: 'Device Groups' },
              { id: 'build-applications-reference-domains', label: 'Domains' },
              {
                id: 'build-applications-reference-domains-mtls',
                label: 'Support for mTLS for Build'
              },
              {
                id: 'build-applications-reference-main-settings',
                label: 'Applications Main Settings'
              },
              { id: 'build-applications-reference-origins', label: 'Origins' },
              {
                id: 'build-applications-reference-rules-engine',
                label: 'Rules Engine for Applications'
              }
            ]
          }
        ]
      },
      // THE ONE DRILL ROW IN THE TREE. Every other container here is CONDENSED — it
      // opens its rows in place behind a chevron and the indent rail — and this one
      // REPLACES the column with the Functions menu behind a Back row.
      //
      // It sits BESIDE `Applications`, not inside its `Modules` list. Functions is its
      // own product, so listing it as a module of Applications put a peer one level under
      // the row it is a peer of — and made `Build › Applications › Modules › Functions ›
      // Guides` a fifth level of indent to reach a guide, past the three
      // `.specs/menu.md` allows ("past that the indent eats the rail's readable width;
      // restructure with a drill row instead"). Promoted to the segment it is one row from
      // the top, and its eleven pages are then exactly what a drill is for: a peer row
      // that unfolded eleven rows in place would bury the segment's other products under
      // one of them, so the level takes the whole column and hands it back on Back.
      //
      // `groups`, not `children`: a drilled level is a MENU, described by the same shape
      // the root takes — so `Guides` becomes a section title inside it instead of one more
      // row to unfold. Nothing condenses in here. A second level is already a narrowed
      // context, so asking for another decision to reach a guide is exactly the cost the
      // drill was taken to remove.
      //
      // No icon, unlike the console's `Settings` drill: a drill row carries one because it
      // reads as one of the destinations it is listed among, and in this tree none of them
      // have one.
      {
        id: 'functions',
        label: 'Functions',
        kind: 'drill',
        groups: [
          {
            // Untitled first block: `About Functions` is the level's LANDING row —
            // activating `Functions` opens the level and lands here in one action —
            // and a title over the product's own three pages would only repeat the
            // name the Back row already carries.
            items: [
              {
                id: 'build-applications-functions',
                label: 'About Functions',
                href: '/site/docs/functions'
              },
              {
                id: 'build-applications-reference-functions-instances',
                label: 'Functions Instances'
              },
              { id: 'runtime-overview', label: 'Azion Runtime' }
            ]
          },
          {
            label: 'Guides',
            items: [
              { id: 'get-started-frameworks-javascript', label: 'How to build functions' },
              {
                id: 'build-functions-guides-altcha',
                label: 'How to Use the ALTCHA Function'
              },
              {
                id: 'build-functions-guides-api-builder',
                label: 'How to build an API with Functions and ChatGPT'
              },
              {
                id: 'build-functions-guides-browserless-functions',
                label: 'How to build a browserless application with Functions'
              },
              {
                id: 'build-functions-guides-debugging-functions-graphql',
                label: 'How to debug functions using GraphQL API'
              },
              {
                id: 'build-functions-guides-firewall',
                label: 'Create and Configure a Function on Firewall'
              },
              {
                id: 'build-functions-guides-paywall-function-jwt',
                label: 'How to set up a paywall with Azion JWT solution'
              },
              {
                id: 'build-functions-guides-serverless-functions',
                label: 'How to run serverless functions on Azion'
              }
            ]
          }
        ]
      },
      {
        id: 'develop-with-azion',
        label: 'Develop with Azion',
        children: [
          { id: 'get-started-frameworks-cli', label: 'Develop with Azion CLI' },
          { id: 'get-started-frameworks-code-editor', label: 'Functions Code Editor Overview' },
          {
            id: 'get-started-frameworks-environment-variables',
            label: 'Build with Environment Variables'
          },
          { id: 'get-started-frameworks-go', label: 'Build with Azion Go SDK' },
          { id: 'get-started-frameworks-local-dev', label: 'Local development' },
          { id: 'get-started-frameworks-runtime-apis', label: 'Build with Azion Runtime' },
          {
            id: 'get-started-frameworks-terraform-provider',
            label: 'Build with Azion Terraform Provider'
          }
        ]
      }
    ]
  },
  {
    label: 'Store',
    items: [
      { id: 'store-overview', label: 'About Store', href: '/site/docs/store' },
      {
        id: 'kv-store',
        label: 'KV Store',
        children: [
          { id: 'store-kv-store', label: 'About KV Store' },
          {
            id: 'guides-5',
            label: 'Guides',
            children: [
              {
                id: 'store-kv-store-guides-manage-with-functions',
                label: 'How to manage KV Store with Functions'
              },
              {
                id: 'store-kv-store-guides-redis-compatibility',
                label: 'How to use KV Store with Redis-compatible SDK'
              }
            ]
          }
        ]
      },
      {
        id: 'object-storage',
        label: 'Object Storage',
        children: [
          { id: 'store-object-storage', label: 'About Object Storage' },
          {
            id: 'guides-6',
            label: 'Guides',
            children: [
              {
                id: 'store-object-storage-guides-create-bucket',
                label: 'How to create an Object Storage bucket'
              },
              {
                id: 'store-object-storage-guides-delete-buckets',
                label: 'How to delete an Object Storage bucket'
              },
              {
                id: 'store-object-storage-guides-delete-object',
                label: 'How to delete an object from an Object Storage bucket'
              },
              {
                id: 'store-object-storage-guides-list-buckets',
                label: 'How to list Object Storage buckets'
              },
              {
                id: 'store-object-storage-guides-s3-protocol-for-object-storage',
                label: 'Set up S3 credentials for Object Storage'
              },
              {
                id: 'store-object-storage-guides-use-bucket-as-origin',
                label: 'Use an Object Storage Bucket as Origin'
              }
            ]
          }
        ]
      },
      {
        id: 'sql-database',
        label: 'SQL Database',
        children: [
          { id: 'store-sql-database', label: 'About SQL Database' },
          {
            id: 'guides-7',
            label: 'Guides',
            children: [
              {
                id: 'store-sql-database-guides-create-database',
                label: 'How to create an SQL Database database'
              },
              {
                id: 'store-sql-database-guides-create-tables-sql-database',
                label: 'How to create and query data on SQL Database'
              },
              {
                id: 'store-sql-database-guides-import-data-sql-database',
                label: 'How to import data to SQL Database'
              },
              {
                id: 'store-sql-database-guides-install-edge-sql-shell',
                label: 'How to install SQL Database Shell'
              },
              {
                id: 'store-sql-database-guides-list-databases',
                label: 'How to list SQL Database databases'
              },
              {
                id: 'store-sql-database-guides-sql-database-shell-commands',
                label: 'How to use SQL Database Shell commands'
              },
              {
                id: 'store-sql-database-guides-sql-database-vector-search',
                label: 'How to implement SQL Database Vector Search'
              }
            ]
          },
          {
            id: 'reference-4',
            label: 'Reference',
            children: [
              {
                id: 'store-sql-database-reference-vector-search',
                label: 'SQL Database Vector Search'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    label: 'Secure',
    items: [
      { id: 'secure-overview', label: 'About Secure', href: '/site/docs/secure' },
      {
        id: 'secure-an-application',
        label: 'Secure an application',
        children: [
          { id: 'get-started-journeys-protect', label: 'About this journey' },
          { id: 'get-started-journeys-protect-dns', label: 'Secure DNS' },
          { id: 'get-started-journeys-protect-infrastructure', label: 'Secure an infrastructure' }
        ]
      },
      {
        id: 'firewall',
        label: 'Firewall',
        children: [
          { id: 'secure-firewall', label: 'About Firewall' },
          {
            id: 'modules-2',
            label: 'Modules',
            children: [
              {
                id: 'ddos-protection',
                label: 'DDoS Protection',
                children: [
                  { id: 'secure-ddos-protection', label: 'About DDoS Protection' },
                  {
                    id: 'reference-5',
                    label: 'Reference',
                    children: [
                      {
                        id: 'secure-ddos-protection-reference-ddos-mitigation',
                        label: 'DDoS Mitigation'
                      }
                    ]
                  }
                ]
              },
              {
                id: 'network-shield',
                label: 'Network Shield',
                children: [
                  { id: 'secure-network-shield', label: 'About Network Shield' },
                  {
                    id: 'guides-8',
                    label: 'Guides',
                    children: [
                      {
                        id: 'secure-firewall-guides-block-tor-networks',
                        label: 'How to block Tor exit node IP addresses'
                      },
                      {
                        id: 'secure-network-shield-guides-blocklists-ip-addresses-edge',
                        label: 'Create IP, ASN and Geo Blocklists'
                      }
                    ]
                  },
                  {
                    id: 'reference-6',
                    label: 'Reference',
                    children: [
                      {
                        id: 'secure-firewall-reference-network-shield-network-lists',
                        label: 'Network Lists'
                      }
                    ]
                  }
                ]
              },
              {
                id: 'waf',
                label: 'WAF',
                children: [
                  { id: 'secure-waf', label: 'About WAF' },
                  {
                    id: 'guides-9',
                    label: 'Guides',
                    children: [
                      {
                        id: 'secure-waf-guides-configure-waf-allowed-rules',
                        label: 'How to configure a WAF Custom Allowed Rule'
                      },
                      {
                        id: 'secure-firewall-guides-create-waf-rule-set',
                        label: 'How to create a WAF rule set'
                      },
                      {
                        id: 'secure-waf-guides-how-to-check-your-waf-mode',
                        label: 'How to check your WAF mode'
                      },
                      {
                        id: 'secure-waf-guides-how-to-find-waf-score',
                        label: 'How to find the score of WAF blocked requests'
                      },
                      {
                        id: 'secure-waf-guides-mitigate-cve-2025-29927-nextjs',
                        label: 'Mitigating CVE-2025-29927: Next.js Middleware Authorization Bypass'
                      },
                      {
                        id: 'secure-waf-guides-waf-rules-for-specific-cookie',
                        label: 'Configure WAF Rules for a Specific Cookie'
                      }
                    ]
                  },
                  {
                    id: 'reference-7',
                    label: 'Reference',
                    children: [
                      { id: 'secure-waf-reference-custom-allowed-rules', label: 'WAF Exceptions' },
                      { id: 'secure-waf-reference-rules-set', label: 'WAF Rule Sets' }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 'guides-10',
            label: 'Guides',
            children: [
              {
                id: 'secure-firewall-guides-firewall-configure-main-settings',
                label: 'How to configure Firewall main settings'
              },
              {
                id: 'secure-firewall-guides-work-with-rules-engine',
                label: 'Create Firewall Rules with Rules Engine'
              }
            ]
          },
          {
            id: 'reference-8',
            label: 'Reference',
            children: [
              { id: 'secure-firewall-reference-functions', label: 'Functions for Firewall' },
              {
                id: 'secure-firewall-reference-functions-instances',
                label: 'Functions Instances for Firewall'
              },
              { id: 'secure-firewall-reference-rules-engine', label: 'Rules Engine for Firewall' }
            ]
          }
        ]
      },
      {
        id: 'edge-dns',
        label: 'Edge DNS',
        children: [
          { id: 'secure-edge-dns', label: 'About Edge DNS' },
          {
            id: 'guides-11',
            label: 'Guides',
            children: [
              {
                id: 'secure-firewall-guides-edge-dns-configure-main-settings',
                label: 'How to configure Edge DNS main settings'
              },
              { id: 'secure-firewall-guides-add-records', label: 'How to add records' },
              {
                id: 'secure-edge-dns-guides-run-the-dig-command',
                label: 'How to look up DNS servers with Dig command'
              },
              {
                id: 'secure-edge-dns-guides-run-the-traceroute-command',
                label: 'Diagnose Issues with the Traceroute Command'
              }
            ]
          },
          {
            id: 'reference-9',
            label: 'Reference',
            children: [
              {
                id: 'secure-edge-dns-reference-dnssec-compatibility',
                label: 'DNSSEC Compatibility'
              }
            ]
          }
        ]
      },
      {
        id: 'workloads',
        label: 'Workloads',
        children: [
          { id: 'secure-workloads', label: 'About Workloads' },
          {
            id: 'guides-12',
            label: 'Guides',
            children: [
              {
                id: 'secure-workloads-guides-configure-a-domain',
                label: 'How to configure a domain'
              },
              {
                id: 'secure-workloads-guides-create-a-digital-certificate',
                label: 'How to create a digital certificate'
              },
              {
                id: 'secure-workloads-guides-create-azion-custom-domain',
                label: 'How to Create an Azion Custom Domain'
              },
              {
                id: 'secure-workloads-guides-migrate-ns-to-azion',
                label: 'How to migrate nameservers to Azion'
              },
              {
                id: 'secure-workloads-guides-point-domain-to-azion',
                label: 'How to point a domain to Azion'
              }
            ]
          }
        ]
      },
      {
        id: 'certificate-manager',
        label: 'Certificate Manager',
        children: [
          { id: 'secure-certificate-manager', label: 'About Certificate Manager' },
          {
            id: 'guides-13',
            label: 'Guides',
            children: [
              {
                id: 'secure-firewall-guides-certificate-manager',
                label: 'Acquire and Register a Digital Certificate'
              },
              { id: 'secure-certificate-manager-guides-mtls', label: 'How to configure mTLS' }
            ]
          },
          {
            id: 'reference-10',
            label: 'Reference',
            children: [
              {
                id: 'secure-certificate-manager-reference-mtls',
                label: 'Support for mTLS for Secure'
              }
            ]
          }
        ]
      },
      {
        id: 'connectors',
        label: 'Connectors',
        children: [
          { id: 'secure-connectors', label: 'About Connectors' },
          {
            id: 'reference-11',
            label: 'Reference',
            children: [
              { id: 'secure-connectors-reference-load-balancer', label: 'Load Balancer' },
              { id: 'secure-connectors-reference-origin-shield', label: 'Origin Shield' }
            ]
          }
        ]
      },
      { id: 'secure-custom-pages', label: 'Custom Pages' },
      {
        id: 'bot-manager',
        label: 'Bot Manager',
        children: [
          { id: 'secure-bot-manager', label: 'About Bot Manager' },
          {
            id: 'guides-14',
            label: 'Guides',
            children: [{ id: 'secure-firewall-guides-manage-bots', label: 'How to manage bots' }]
          },
          {
            id: 'reference-12',
            label: 'Reference',
            children: [{ id: 'secure-bot-manager-reference-lite', label: 'Azion Bot Manager Lite' }]
          }
        ]
      }
    ]
  },
  {
    label: 'Observe',
    items: [
      { id: 'observe-overview', label: 'About Observe', href: '/site/docs/observe' },
      {
        id: 'data-stream',
        label: 'Data Stream',
        children: [
          { id: 'observe-data-stream', label: 'About Data Stream' },
          { id: 'observe-data-stream-quickstart', label: 'Data Stream quickstart' },
          {
            id: 'guides-15',
            label: 'Guides',
            children: [
              {
                id: 'observe-data-stream-guides-add-filters-metrics',
                label: 'How to add filters on Real-Time Metrics'
              },
              {
                id: 'observe-data-stream-guides-analyze-metrics',
                label: 'How to analyze metrics on Real-Time Metrics'
              },
              {
                id: 'observe-data-stream-guides-configure-sampling',
                label: 'How to configure sampling on Data Stream'
              },
              {
                id: 'observe-data-stream-guides-data-stream-associate-domains',
                label: 'How to associate domains on Data Stream'
              },
              {
                id: 'observe-data-stream-guides-data-stream-select-variables',
                label: 'How to select variables on Data Stream'
              },
              {
                id: 'observe-data-stream-guides-endpoint-amazon-s3',
                label: 'How to use Amazon S3 to receive data from Data Stream'
              },
              {
                id: 'observe-data-stream-guides-understand-logs',
                label: 'How to understand Real-Time Events logs'
              },
              {
                id: 'observe-data-stream-guides-use-data-stream',
                label: 'How to configure Data Stream main settings'
              }
            ]
          }
        ]
      },
      {
        id: 'edge-pulse',
        label: 'Edge Pulse',
        children: [
          { id: 'observe-edge-pulse', label: 'About Edge Pulse' },
          { id: 'observe-edge-pulse-quickstart', label: 'Edge Pulse first steps' }
        ]
      },
      {
        id: 'real-time-events',
        label: 'Real Time Events',
        children: [
          { id: 'observe-real-time-events', label: 'About Real Time Events' },
          { id: 'observe-real-time-events-quickstart', label: 'Real-Time Events first steps' }
        ]
      },
      {
        id: 'real-time-metrics',
        label: 'Real Time Metrics',
        children: [
          { id: 'observe-real-time-metrics', label: 'About Real Time Metrics' },
          { id: 'observe-real-time-metrics-quickstart', label: 'Real-Time Metrics first steps' },
          {
            id: 'guides-16',
            label: 'Guides',
            children: [
              {
                id: 'observe-real-time-metrics-guides-azion-plugin-grafana-custom',
                label: 'Customize a Grafana Dashboard with Azion Plugin'
              },
              {
                id: 'observe-real-time-metrics-guides-azion-plugin-grafana-custom-2',
                label: 'Customize a Log Table with Azion Plugin'
              },
              {
                id: 'observe-real-time-metrics-guides-azion-plugin-grafana-pre-bu',
                label: 'Use a Pre-Built Grafana Dashboard with Azion'
              },
              {
                id: 'observe-real-time-metrics-guides-best-practices-grafana',
                label: 'How to use Grafana with best practices'
              },
              {
                id: 'observe-real-time-metrics-guides-data-transferred-dash',
                label: 'Data Transferred dashboard on Grafana JSON example'
              },
              {
                id: 'observe-real-time-metrics-guides-integrate-grafana',
                label: 'How to integrate Azion with Grafana'
              },
              {
                id: 'observe-real-time-metrics-guides-metrics-dash',
                label: 'Real-Time Metrics GraphQL Dashboard for Grafana'
              },
              {
                id: 'observe-real-time-metrics-guides-use-real-time-metrics',
                label: 'How to use Real-Time Metrics'
              }
            ]
          },
          {
            id: 'reference-13',
            label: 'Reference',
            children: [
              {
                id: 'observe-real-time-metrics-reference-historical-real-time-met',
                label: 'Historical Real-Time Metrics'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    label: 'Resources',
    items: [
      { id: 'guides-17', label: 'Guides' },
      {
        id: 'architectures',
        label: 'Architectures',
        children: [
          { id: 'architectures-2', label: 'About Architectures' },
          {
            id: 'api-gateways',
            label: 'API Gateways',
            children: [
              {
                id: 'architectures-api-gateways-implement-api-gateways-security',
                label: 'Secure Your API Gateway with a Perimeter'
              }
            ]
          },
          {
            id: 'applications-2',
            label: 'Applications',
            children: [
              {
                id: 'architectures-applications-application-acceleration',
                label: 'Accelerate Applications and APIs with Edge Computing'
              },
              {
                id: 'architectures-applications-application-modernization',
                label: 'Accelerate Application Modernization at the Edge'
              },
              {
                id: 'architectures-applications-content-delivery',
                label: 'Boost Content Delivery Speed at the Edge'
              },
              {
                id: 'architectures-applications-edge-enhanced-applications',
                label: 'Enhance Applications with Edge Computing'
              },
              {
                id: 'architectures-applications-edge-native-applications',
                label: 'Develop edge-native applications with Azion'
              },
              {
                id: 'architectures-applications-image-processing',
                label: 'Optimize and process images with Azion Web Platform'
              },
              {
                id: 'architectures-applications-microservices-applications',
                label: 'Build Microservices Apps with Functions'
              },
              {
                id: 'architectures-applications-serverless-applications',
                label: 'Implement Serverless Architecture with Azion'
              }
            ]
          },
          {
            id: 'artificial-intelligence',
            label: 'Artificial Intelligence',
            children: [
              {
                id: 'architectures-artificial-intelligence-ai-agent-copilot-assis',
                label: 'Build a Copilot Assistant with a ReAct AI Agent'
              },
              {
                id: 'architectures-artificial-intelligence-ai-agent-third-party-l',
                label: 'AI Agents Configuration for Third Party LLM Providers'
              },
              {
                id: 'architectures-artificial-intelligence-ai-inference-architect',
                label: 'Implement AI Inference in your applications'
              },
              {
                id: 'architectures-artificial-intelligence-autonomous-security-ai',
                label: 'AI Inference for Threat Protection in Uploads'
              }
            ]
          },
          {
            id: 'bot-management',
            label: 'Bot Management',
            children: [
              {
                id: 'architectures-bot-management-protect-your-applications-with-',
                label: 'Protect Your Apps with Bot Management'
              }
            ]
          },
          {
            id: 'by-solution',
            label: 'By solution',
            children: [
              {
                id: 'architectures-by-solution-application-and-infrastructure-aut',
                label: 'Application and Infrastructure Automation'
              },
              {
                id: 'architectures-by-solution-application-and-network-security',
                label: 'Application and Network Security'
              },
              {
                id: 'architectures-by-solution-application-development',
                label: 'Application Development'
              },
              {
                id: 'architectures-by-solution-artificial-intelligence',
                label: 'Artificial Intelligence (AI)'
              },
              {
                id: 'architectures-by-solution-service-performance-and-reliabilit',
                label: 'Service Performance and Reliability'
              }
            ]
          },
          {
            id: 'deploy',
            label: 'Deploy',
            children: [
              {
                id: 'architectures-deploy-application-delivery',
                label: 'Streamline App Delivery with Orchestrator'
              },
              {
                id: 'architectures-deploy-infrastructure-orchestration',
                label: 'Automate Infrastructure with Azion Orchestrator'
              }
            ]
          },
          {
            id: 'firewall-2',
            label: 'Firewall',
            children: [
              {
                id: 'architectures-firewall-online-fraud-prevention',
                label: 'Reinforce Online Fraud Prevention'
              },
              {
                id: 'architectures-firewall-web-application-and-api-protection-wa',
                label: 'Enhance Cybersecurity with Azion WAAP'
              }
            ]
          },
          {
            id: 'jamstack',
            label: 'Jamstack',
            children: [
              {
                id: 'architectures-jamstack-deploy-jamstack-applications',
                label: 'Deploy Jamstack Websites at the Edge'
              }
            ]
          },
          {
            id: 'live-streaming-delivery',
            label: 'Live Streaming Delivery',
            children: [
              {
                id: 'architectures-live-streaming-delivery-live-streaming-deliver',
                label: 'Optimize Video Delivery with Live Streaming'
              }
            ]
          },
          {
            id: 'security-automation',
            label: 'Security Automation',
            children: [
              {
                id: 'architectures-security-automation-security-automation-with-e',
                label: 'Protect Your Business with Security Automation'
              }
            ]
          },
          {
            id: 'security-modernization',
            label: 'Security Modernization',
            children: [
              {
                id: 'architectures-security-modernization-security-modernization-',
                label: 'Accelerate security modernization with edge computing'
              }
            ]
          }
        ]
      },
      {
        id: 'marketplace',
        label: 'Marketplace',
        children: [
          {
            id: 'guides-18',
            label: 'Guides',
            children: [
              {
                id: 'marketplace-guides-install-an-integration',
                label: 'How to install an integration'
              },
              {
                id: 'marketplace-guides-update-an-integration',
                label: 'How to update an integration'
              }
            ]
          },
          {
            id: 'reference-14',
            label: 'Reference',
            children: [
              { id: 'marketplace-reference-first-steps', label: 'Azion Marketplace first steps' },
              { id: 'marketplace-reference-integrations', label: 'Azion Integrations' },
              {
                id: 'marketplace-reference-isv-signup',
                label: 'Become an ISV on Azion Marketplace'
              },
              { id: 'marketplace-reference-marketplace', label: 'Azion Marketplace' },
              {
                id: 'marketplace-reference-marketplace-seller-guide',
                label: 'Marketplace Seller Guide'
              },
              {
                id: 'marketplace-reference-permissions-marketplace',
                label: "Azion Marketplace's permissions"
              },
              { id: 'marketplace-reference-templates', label: 'Azion Templates' },
              {
                id: 'marketplace-reference-templates-and-integrations-overview',
                label: 'Templates and Integrations'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    label: 'Manage',
    items: [
      {
        id: 'platform',
        label: 'Platform',
        children: [
          {
            id: 'platform-overview',
            label: 'About the Platform',
            href: '/site/docs/platform-overview'
          },
          {
            id: 'compliance',
            label: 'Compliance',
            children: [
              {
                id: 'platform-compliance-governance-risk-compliance',
                label: 'Strengthen Governance, Risk and Compliance'
              },
              { id: 'platform-compliance-pci-dss-certification', label: 'PCI Compliance' },
              { id: 'platform-compliance-soc', label: 'SOC Compliance' }
            ]
          },
          { id: 'platform-network-program', label: 'Azion Network Program' },
          { id: 'platform-pricing', label: 'Pricing' },
          { id: 'platform-shared-responsibility', label: 'Shared Responsibility Model' }
        ]
      },
      {
        id: 'accounts',
        label: 'Accounts',
        children: [
          { id: 'account', label: 'About Accounts' },
          {
            id: 'guides-19',
            label: 'Guides',
            children: [
              {
                id: 'account-guides-account-lockout-policy-logs',
                label: 'How to check Account Lockout Policy logs'
              },
              {
                id: 'account-guides-configure-account-lockout-policy',
                label: 'How to configure Account Lockout Policy'
              },
              {
                id: 'account-guides-configure-user-session-timeout',
                label: 'How to configure User Session Timeout'
              },
              {
                id: 'account-guides-how-to-access-azion-console',
                label: 'How to access Azion Console'
              },
              {
                id: 'account-guides-microsoft-entra-automated-user-provisioning',
                label: 'Enable Microsoft Entra User Provisioning (SCIM)'
              },
              { id: 'account-guides-personal-tokens', label: 'How to manage a personal token' },
              {
                id: 'account-guides-sso-microsoft-entra-saml',
                label: 'Use Microsoft Entra SAML as an IdP'
              },
              {
                id: 'account-guides-verify-account-migration',
                label: 'Verify Your Account Migration to API v4'
              }
            ]
          },
          {
            id: 'reference-15',
            label: 'Reference',
            children: [
              { id: 'account-reference-account-lockout-policy', label: 'Account Lockout Policy' },
              { id: 'account-reference-activity-history', label: 'Activity History' },
              { id: 'account-reference-billing-and-subscriptions', label: 'Billing' },
              {
                id: 'account-reference-creating-account',
                label: 'How to create an account on Azion'
              },
              {
                id: 'account-reference-multi-factor-authentication',
                label: 'Multi-Factor Authentication'
              },
              { id: 'account-reference-personal-tokens', label: 'Personal Tokens' },
              { id: 'account-reference-teams-permissions', label: 'Teams Permissions' },
              { id: 'account-reference-user-session-timeout', label: 'User Session Timeout' }
            ]
          }
        ]
      },
      { id: 'deploy-overview', label: 'Deploy' },
      {
        id: 'orchestrator',
        label: 'Orchestrator',
        children: [
          { id: 'deploy-orchestrator', label: 'About Orchestrator' },
          {
            id: 'guides-20',
            label: 'Guides',
            children: [
              {
                id: 'deploy-orchestrator-guides-authorize-an-edge-node',
                label: 'How to authorize an edge node'
              },
              {
                id: 'deploy-orchestrator-guides-bind-service-node',
                label: 'How to bind an edge service to an edge node'
              },
              {
                id: 'deploy-orchestrator-guides-create-edge-service',
                label: 'How to create an edge service'
              },
              {
                id: 'deploy-orchestrator-guides-edge-node-first-steps',
                label: 'Edge Node first steps'
              },
              {
                id: 'deploy-orchestrator-guides-edge-services-first-steps',
                label: 'Creating an Edge Service'
              },
              {
                id: 'deploy-orchestrator-guides-install-orchestrator-agent',
                label: 'How to install Orchestrator Agent'
              },
              {
                id: 'deploy-orchestrator-guides-watch-logs',
                label: 'How to watch Orchestrator logs'
              },
              {
                id: 'deploy-orchestrator-guides-work-with-variables',
                label: 'How to work with variables'
              }
            ]
          },
          {
            id: 'reference-16',
            label: 'Reference',
            children: [
              { id: 'deploy-orchestrator-reference-edge-node', label: 'Azion Edge Node' },
              { id: 'deploy-orchestrator-reference-edge-services', label: 'Azion Edge Services' }
            ]
          }
        ]
      },
      {
        id: 'services',
        label: 'Services',
        children: [
          { id: 'services-best-practices-review', label: 'Best Practices Review' },
          { id: 'services-business-events-support', label: 'Business Events Support' },
          { id: 'services-instructor-led-training', label: 'Instructor-Led Training' },
          { id: 'services-integration-services', label: 'Integration Services' },
          { id: 'services-managed-configurations', label: 'Managed Configurations' },
          { id: 'services-security-response-team', label: 'Security Response Team' },
          { id: 'services-slack-channel', label: 'Slack Channel' },
          {
            id: 'support',
            label: 'Support',
            children: [
              { id: 'services-support', label: 'About Support' },
              { id: 'services-support-guides-open-ticket', label: 'How to open a Support Ticket' },
              { id: 'services-support-get-help', label: 'Get help' },
              {
                id: 'services-support-http-error-status-codes',
                label: 'Azion HTTP Error Status Codes'
              }
            ]
          },
          { id: 'services-technical-account-manager', label: 'Technical Account Manager' }
        ]
      }
    ]
  },
  {
    label: 'Updates and Policies',
    items: [
      {
        id: 'changelog',
        label: 'Changelog',
        children: [
          { id: 'changelog-2', label: 'Latest updates' },
          { id: 'changelog-archive', label: 'Changelog previous years' }
        ]
      },
      {
        id: 'agreements-policies',
        label: 'Agreements and Policies',
        children: [
          { id: 'agreements', label: 'All agreements' },
          { id: 'agreements-acceptable-use-policy', label: 'Acceptable Use Policy' },
          {
            id: 'agreements-azion-affiliate-program-terms',
            label: 'Azion Affiliate Program Terms'
          },
          {
            id: 'agreements-azion-incentive-credits-terms-and-conditions',
            label: 'Terms and Conditions of Azion Incentive Credits'
          },
          {
            id: 'agreements-azion-plans-terms-and-conditions',
            label: 'Terms and Conditions of Azion Plans'
          },
          {
            id: 'customer-agreement',
            label: 'Customer Agreement',
            children: [{ id: 'agreements-customer-agreement', label: 'Current version' }]
          },
          { id: 'agreements-faq-azion-customers', label: 'Data Privacy FAQ – Customers' },
          { id: 'agreements-faq-end-users', label: 'Data Privacy FAQ – End Users' },
          { id: 'agreements-faqs', label: 'Data Privacy FAQs' },
          {
            id: 'marketplace-2',
            label: 'Marketplace',
            children: [
              {
                id: 'agreements-marketplace-marketplace-agreement',
                label: 'Azion Marketplace Agreement'
              }
            ]
          },
          { id: 'agreements-privacy-policy', label: 'Privacy Policy' },
          {
            id: 'agreements-savings-plan-terms-and-conditions',
            label: 'Savings Plan Terms and Conditions'
          },
          {
            id: 'agreements-savings-plan-terms-and-conditions-10-july-2025',
            label: 'Savings Plan Terms and Conditions - July 10, 2025'
          },
          {
            id: 'sla',
            label: 'SLA',
            children: [{ id: 'agreements-sla', label: 'Current version' }]
          },
          {
            id: 'agreements-terms-and-conditions-of-reserved-capacity',
            label: 'Terms and Conditions of Reserved Capacity'
          },
          {
            id: 'terms-of-service',
            label: 'Terms of Service',
            children: [
              { id: 'agreements-tos', label: 'Current version' },
              {
                id: 'agreements-tos-10-november-2016',
                label: 'Terms of Service - November 10, 2016'
              },
              {
                id: 'agreements-tos-10-november-2020',
                label: 'Terms of Service - November 10, 2020'
              },
              { id: 'agreements-tos-15-march-2024', label: 'Terms of Service - March 15, 2024' },
              { id: 'agreements-tos-15-may-2019', label: 'Terms of Service - May 15, 2019' },
              {
                id: 'agreements-tos-18-september-2023',
                label: 'Terms of Service - September 18, 2023'
              },
              {
                id: 'agreements-tos-21-february-2024',
                label: 'Terms of Service - February 21, 2024'
              },
              {
                id: 'agreements-tos-23-september-2022',
                label: 'Terms of Service - September 23, 2022'
              },
              { id: 'agreements-tos-24-may-2024', label: 'Terms of Service - May 24, 2024' },
              {
                id: 'agreements-tos-25-october-2017',
                label: 'Terms of Service - 25 de Outubro de 2017'
              },
              { id: 'agreements-tos-29-august-2024', label: 'Terms of Service - August 29, 2024' },
              { id: 'agreements-tos-29-august-2025', label: 'Terms of Service - August 29, 2025' },
              { id: 'agreements-tos-3-march-2023', label: 'Terms of Service - March 3, 2023' },
              { id: 'agreements-tos-30-march-2023', label: 'Terms of Service - March 30, 2023' },
              {
                id: 'agreements-tos-8-november-2024',
                label: 'Terms of Service - November 8, 2024'
              },
              { id: 'agreements-tos-9-july-2025', label: 'Terms of Service - July 9, 2025' }
            ]
          }
        ]
      },
      { id: 'status-azion-com', label: 'System Status' }
    ]
  }
]

/** The row the docs home renders as current. */
export const DOCS_HOME_ID = 'overview'

/**
 * The rail, as `Menu` takes it: the eight sections ARE the eight groups.
 *
 * There is nothing to map — a section is already `{ label, items }`, which is exactly
 * `MenuGroupNode` — so this is an alias rather than a projection, and the two can never
 * disagree about what the rail contains. It stays a separate export because that is the
 * name the shell binds to (`:groups`), and because the projection was real while the
 * sections were drill levels.
 *
 * No glyphs on the group labels. The live docs put one on each (a bolt on `Start`, the
 * pillar marks on `Build` / `Store` / `Secure` / `Observe`), but `Menu.Group`'s label is
 * a title, not a row: it has no icon column to sit in, and adding one would need the
 * label to grow an anatomy it deliberately does not have. The eight labels are unambiguous
 * on their own.
 */
export const docsNavGroups = docsNavSections

/**
 * Every row that has a real page, as `href` → row id.
 *
 * The rail's selection follows the ROUTE, not only the click that caused it: arriving at
 * a page by the palette, by a link in the prose, or by pasting the URL must all light the
 * same row and open the levels above it. Built from the tree itself so the two can never
 * disagree about which row a page is.
 */
export const docsIdByRoute = new Map(
  menuLeaves(docsNavSections.flatMap((section) => section.items))
    .filter((item) => item.href)
    .map((item) => [item.href, item.id])
)

/**
 * Every container on the way down to a page, so a jump can open them.
 *
 * Segments never fold, so they never appear here — an ancestor chain is containers only.
 * It is not one model, though: a condensed ancestor belongs to `expanded` and a DRILL
 * ancestor (`Functions`) belongs to the stack, so the consumer splits this list by kind
 * rather than handing it to one model (see `DocsLayout`'s `drillIds`). Returned as one
 * list because it is one fact — the path down — and only the shell knows which of the two
 * models each step feeds.
 */
export const docsParentsOf = (id) =>
  menuPath(
    docsNavSections.flatMap((section) => section.items),
    id
  ) ?? []
