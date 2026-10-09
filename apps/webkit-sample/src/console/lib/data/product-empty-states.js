import { frameworkBoilerplates } from './frameworks'

export const AGENT_PROMO = {
  title: 'Set up Azion with your agent',
  description: 'Give your editor a prompt that teaches it to build and deploy here.'
}

export const productEmptyStates = [
  {
    id: 'functions',
    label: 'Functions',
    icon: 'ai ai-edge-functions',
    headline: 'Deploy your first function',
    lead: 'Write an edge function to run serverless code close to your users.',
    unit: 'function',
    methods: [
      {
        id: 'editor',
        title: 'Via Editor',
        description: 'Write it in JavaScript and publish without leaving the Console.',
        action: 'Open editor',
        icon: 'pi pi-code',
        route: { path: '/functions/new' }
      },
      {
        id: 'cli',
        title: 'Via CLI',
        description: 'Develop locally and deploy from your own repository.',
        command: 'azion create edge-function --name my-function',
        icon: 'pi pi-desktop'
      },
      {
        id: 'cli-import',
        title: 'From a repository',
        description: 'Bring a function you already have in Git and deploy it.',
        action: 'Import',
        primary: true,
        icon: 'pi pi-github',
        route: { path: '/create' }
      }
    ],
    startFast: {
      title: 'Start from a Marketplace function',
      description:
        'Install a ready-made edge function and get a working response before writing any code.',
      route: { path: '/marketplace', query: { tab: 'integrations' } },
      learnMore: {
        label: 'Learn more',
        href: 'https://www.azion.com/en/documentation/products/marketplace/'
      },
      items: [
        {
          id: 'hello-world',
          title: 'Hello World',
          description: 'A minimal edge function that returns a message, to see the edge run.',
          icon: 'pi pi-code',
          action: 'Create',
          route: { path: '/marketplace', query: { tab: 'integrations', q: 'Hello World' } }
        },
        {
          id: 'ab-tests',
          title: 'A/B Tests',
          description: 'Split traffic at the edge to validate a page, an interface or a flow.',
          icon: 'pi pi-chart-bar',
          action: 'Create',
          route: { path: '/marketplace', query: { tab: 'integrations', q: 'A/B Tests' } }
        },
        {
          id: 'content-targeting',
          title: 'Content Targeting',
          description: 'Manipulate cookies and headers to build content-targeting logic.',
          icon: 'pi pi-users',
          action: 'Create',
          route: { path: '/marketplace', query: { tab: 'integrations', q: 'Content Targeting' } }
        },
        {
          id: 'send-to-queue',
          title: 'Send Messages to a Queue',
          description: 'Queue messages for asynchronous processing between your systems.',
          icon: 'pi pi-inbox',
          action: 'Create',
          route: { path: '/marketplace', query: { tab: 'integrations', q: 'Send Messages' } }
        }
      ]
    },
    learnMore: {
      label: 'How Functions work on Azion',
      href: 'https://www.azion.com/en/documentation/products/build/edge-application/edge-functions/'
    }
  },
  {
    id: 'applications',
    label: 'Applications',
    icon: 'ai ai-edge-application',
    headline: 'Deploy your first application',
    lead: 'Deploy a static site or a full-stack app, with compute, AI, storage and media on the same build.',
    unit: 'application',
    methods: [
      {
        id: 'github',
        title: 'From GitHub',
        description: 'Import a repository and Azion deploys it on every push.',
        action: 'Import',
        primary: true,
        icon: 'pi pi-github',
        route: { path: '/create' }
      },
      {
        id: 'cli',
        title: 'Via CLI',
        description: 'Run azion deploy and ship the branch you are on.',
        command: 'azion deploy',
        icon: 'pi pi-desktop'
      },
      {
        id: 'scratch',
        title: 'Create an application',
        description: 'Configure the build, the runtime and the cache.',
        action: 'Create',
        icon: 'pi pi-file',
        route: { path: '/applications/new' }
      }
    ],
    startFast: {
      title: 'Start from a Marketplace template',
      description:
        'Clone a framework starter and Azion builds and deploys it. Nothing to configure first.',
      route: { path: '/marketplace', query: { tab: 'templates' } },
      learnMore: {
        label: 'Learn more',
        href: 'https://www.azion.com/en/documentation/products/marketplace/'
      },
      items: frameworkBoilerplates()
    },
    learnMore: {
      label: 'How Applications work on Azion',
      href: 'https://www.azion.com/en/documentation/products/build/edge-application/'
    }
  },
  {
    id: 'workloads',
    label: 'Workloads',
    icon: 'ai ai-workloads',
    headline: 'Deploy your first workload',
    lead: 'Create your first deploy starting from scratch, a template or importing your code.',
    unit: 'workload',
    methods: [
      {
        id: 'github',
        title: 'From GitHub',
        description: 'Import a repository and Azion deploys it on every push.',
        action: 'Import',
        primary: true,
        icon: 'pi pi-github',
        route: { path: '/create' }
      },
      {
        id: 'cli',
        title: 'Via CLI',
        description: 'Run azion deploy and ship the branch you are on.',
        command: 'azion deploy',
        icon: 'pi pi-desktop'
      },
      {
        id: 'scratch',
        title: 'From scratch',
        description: 'Point a domain at an application you already have.',
        action: 'Create',
        icon: 'pi pi-globe',
        route: { path: '/workloads/new' }
      }
    ],
    startFast: {
      title: 'Start from a Marketplace template',
      description: 'Deploy a framework starter and the workload that serves it, in one step.',
      route: { path: '/marketplace', query: { tab: 'templates' } },
      learnMore: {
        label: 'Learn more',
        href: 'https://www.azion.com/en/documentation/products/marketplace/'
      },
      items: frameworkBoilerplates()
    },
    learnMore: {
      label: 'How Workloads work on Azion',
      href: 'https://www.azion.com/en/documentation/products/build/edge-application/workloads/'
    }
  },
  {
    id: 'deployments',
    label: 'Deployments',
    icon: 'ai ai-deploy-pillar',
    headline: 'Ship your first deploy',
    lead: 'Every build, release and rollback lands here. Deploy an application and the history starts.',
    unit: 'deployment',
    methods: [
      {
        id: 'github',
        title: 'From GitHub',
        description: 'Import a repository and Azion deploys it on every push.',
        action: 'Import',
        primary: true,
        icon: 'pi pi-github',
        route: { path: '/create' }
      },
      {
        id: 'cli',
        title: 'Via CLI',
        description: 'Run azion deploy and watch the run appear here.',
        command: 'azion deploy --auto',
        icon: 'pi pi-desktop'
      }
    ],
    startFast: {
      title: 'Start from a Marketplace boilerplate',
      description: 'Deploy a framework starter and watch the run land in this list.',
      route: { path: '/marketplace', query: { tab: 'templates' } },
      learnMore: {
        label: 'Learn more',
        href: 'https://www.azion.com/en/documentation/products/marketplace/'
      },
      items: frameworkBoilerplates()
    },
    learnMore: {
      label: 'How deploying works on Azion',
      href: 'https://www.azion.com/en/documentation/products/deploy/'
    }
  },
  {
    id: 'edge-dns',
    label: 'Edge DNS',
    icon: 'ai ai-edge-dns',
    headline: 'Create your first DNS zone',
    lead: 'Add a zone to manage records and route traffic through Azion Edge DNS.',
    unit: 'DNS zone',
    methods: [
      {
        id: 'create',
        title: 'New zone',
        description: 'Declare the zone, then point your registrar at Azion.',
        action: 'Create',
        icon: 'pi pi-plus',
        route: { path: '/edge-dns/new' }
      },
      {
        id: 'import',
        title: 'Import a zone file',
        description: 'Bring every record over from a BIND export in one step.',
        action: 'Import',
        primary: true,
        icon: 'pi pi-upload',
        route: { path: '/edge-dns/new' }
      },
      {
        id: 'api',
        title: 'Via CLI or API',
        description: 'Manage zones and records as code, from your own pipeline.',
        command: 'azion create dns-zone --domain example.com',
        icon: 'pi pi-desktop'
      }
    ],
    learnMore: {
      label: 'How Edge DNS works on Azion',
      href: 'https://www.azion.com/en/documentation/products/secure/edge-dns/'
    }
  },
  {
    id: 'object-storage',
    label: 'Object Storage',
    icon: 'ai ai-edge-storage',
    headline: 'Create your first bucket',
    lead: 'Create a bucket to store and serve static assets from the edge.',
    unit: 'bucket',
    methods: [
      {
        id: 'create',
        title: 'New bucket',
        description: 'Name it, pick the access level and start uploading.',
        action: 'Create',
        icon: 'pi pi-plus',
        route: { path: '/object-storage/new' }
      },
      {
        id: 'cli',
        title: 'Via CLI',
        description: 'Sync a local folder with the Azion CLI, in your own pipeline.',
        command: 'azion storage sync ./dist --bucket my-bucket',
        icon: 'pi pi-desktop'
      },
      {
        id: 's3',
        title: 'S3-compatible client',
        description: 'Point a client you already use at Azion.',
        action: 'View credentials',
        icon: 'pi pi-key'
      }
    ],
    learnMore: {
      label: 'How Object Storage works on Azion',
      href: 'https://www.azion.com/en/documentation/products/store/edge-storage/'
    }
  },
  {
    id: 'sql-database',
    label: 'SQL Database',
    icon: 'ai ai-edge-sql',
    headline: 'Create your first database',
    lead: 'Store relational and vector data at the edge, close to the code that reads it.',
    unit: 'database',
    methods: [
      {
        id: 'create',
        title: 'New database',
        description: 'Name it and start writing tables from the Console.',
        action: 'Create',
        primary: true,
        icon: 'pi pi-plus',
        route: { path: '/sql-database/new' }
      },
      {
        id: 'function',
        title: 'From a Function',
        description: 'Query it with the SQL client inside an edge function.',
        action: 'Open editor',
        icon: 'pi pi-code',
        route: { path: '/functions/new' }
      },
      {
        id: 'api',
        title: 'Via CLI or API',
        description: 'Create databases and run migrations from your own pipeline.',
        command: 'azion sql create my-db',
        icon: 'pi pi-desktop'
      }
    ],
    learnMore: {
      label: 'How SQL Database works on Azion',
      href: 'https://www.azion.com/en/documentation/products/store/edge-sql/'
    }
  },
  {
    id: 'variables',
    label: 'Variables',
    icon: 'ai ai-variables',
    headline: 'Add your first variable',
    lead: 'Keep configuration and secrets out of your code and scoped per environment.',
    unit: 'variable',
    methods: [
      {
        id: 'create',
        title: 'New variable',
        description: 'Add a key and value, and pick the environments it applies to.',
        action: 'Create',
        icon: 'pi pi-plus',
        route: { path: '/variables', query: { create: 'variable' } }
      },
      {
        id: 'import',
        title: 'Import a .env',
        description: 'Bring every key over from a file, or paste its contents.',
        action: 'Import',
        primary: true,
        icon: 'pi pi-upload',
        route: { path: '/variables', query: { create: 'variable' } }
      },
      {
        id: 'cli',
        title: 'Via CLI or API',
        description: 'Set variables from your own pipeline, per environment.',
        command: 'azion create variables --key API_TOKEN',
        icon: 'pi pi-desktop'
      }
    ],
    learnMore: {
      label: 'How Variables work on Azion',
      href: 'https://www.azion.com/en/documentation/devtools/cli/'
    }
  },
  {
    id: 'connectors',
    label: 'Connectors',
    icon: 'ai ai-edge-connectors',
    headline: 'Add your first connector',
    lead: 'Add a connector so your applications have somewhere to fetch from on a cache miss.',
    unit: 'connector',
    methods: [
      {
        id: 'http',
        title: 'An HTTP origin',
        description: 'Point at a host you already run, with TLS and load balancing.',
        action: 'Create',
        primary: true,
        icon: 'pi pi-globe',
        route: { path: '/connectors/new' }
      },
      {
        id: 'storage',
        title: 'From an Object Storage bucket',
        description: 'Create the bucket first, then point a connector at it.',
        action: 'New bucket',
        icon: 'ai ai-edge-storage',
        route: { path: '/object-storage/new' }
      },
      {
        id: 'api',
        title: 'Via CLI or API',
        description: 'Declare connectors as code, alongside the application.',
        command: 'azion create connector --name my-connector',
        icon: 'pi pi-desktop'
      }
    ],
    learnMore: {
      label: 'How Connectors work on Azion',
      href: 'https://www.azion.com/en/documentation/products/build/edge-application/'
    }
  },
  {
    id: 'custom-pages',
    label: 'Custom Pages',
    icon: 'ai ai-custom-pages',
    headline: 'Create your first custom page',
    lead: 'Create a custom page so an error or a maintenance window still looks like your product.',
    unit: 'custom page',
    methods: [
      {
        id: 'create',
        title: 'New page set',
        description: 'Map a status code to a page you serve from your own origin.',
        action: 'Create',
        primary: true,
        icon: 'pi pi-plus',
        route: { path: '/custom-pages/new' }
      },
      {
        id: 'connector',
        title: 'From a connector',
        description: 'Create the connector that serves the pages you author.',
        action: 'New connector',
        icon: 'ai ai-edge-connectors',
        route: { path: '/connectors/new' }
      },
      {
        id: 'api',
        title: 'Via CLI or API',
        description: 'Ship the page set with the rest of your configuration.',
        command: 'azion create custom-page --status-code 404',
        icon: 'pi pi-desktop'
      }
    ],
    learnMore: {
      label: 'How Custom Pages work on Azion',
      href: 'https://www.azion.com/en/documentation/products/build/edge-application/'
    }
  },
  {
    id: 'firewall',
    label: 'Firewall',
    icon: 'ai ai-edge-firewall',
    headline: 'Create your first firewall',
    lead: 'Create a firewall to put DDoS protection, WAF and bot management in front of an application.',
    unit: 'firewall',
    methods: [
      {
        id: 'create',
        title: 'New firewall',
        description: 'Pick the modules to run and attach it to a workload.',
        action: 'Create',
        primary: true,
        icon: 'pi pi-plus',
        route: { path: '/firewall/new' }
      },
      {
        id: 'waf',
        title: 'With a WAF rule set',
        description: 'Create the rule set first, then run it inside the firewall.',
        action: 'New rule set',
        icon: 'ai ai-waf-rules',
        route: { path: '/waf-rules/new' }
      },
      {
        id: 'api',
        title: 'Via CLI or API',
        description: 'Declare firewalls and rules as code, from your own pipeline.',
        command: 'azion create firewall --name my-firewall',
        icon: 'pi pi-desktop'
      }
    ],
    startFast: {
      title: 'Start from a Marketplace function',
      description: 'Install bot management, a captcha or credential protection and run it here.',
      route: { path: '/marketplace', query: { tab: 'integrations' } },
      learnMore: {
        label: 'Learn more',
        href: 'https://www.azion.com/en/documentation/products/marketplace/'
      },
      items: [
        {
          id: 'bot-manager-lite',
          title: 'Azion Bot Manager Lite',
          description: 'Score incoming requests on rules and behaviour, and block bad bots.',
          icon: 'pi pi-shield',
          action: 'Create',
          route: { path: '/marketplace', query: { tab: 'integrations', q: 'Bot Manager' } }
        },
        {
          id: 'recaptcha',
          title: 'reCAPTCHA',
          description: 'Challenge suspicious traffic and watch it from the Google dashboard.',
          icon: 'pi pi-verified',
          action: 'Create',
          route: { path: '/marketplace', query: { tab: 'integrations', q: 'reCAPTCHA' } }
        },
        {
          id: 'axur-leakstream',
          title: 'Axur Leakstream',
          description: 'Watch for leaked credentials and stop checker attacks.',
          icon: 'pi pi-key',
          action: 'Create',
          route: { path: '/marketplace', query: { tab: 'integrations', q: 'Leakstream' } }
        },
        {
          id: 'send-event-endpoint',
          title: 'Send Event to Endpoint',
          description: 'Stream request data to an endpoint of your own from the edge.',
          icon: 'pi pi-send',
          action: 'Create',
          route: { path: '/marketplace', query: { tab: 'integrations', q: 'Send Event' } }
        }
      ]
    },
    learnMore: {
      label: 'How Firewall works on Azion',
      href: 'https://www.azion.com/en/documentation/products/secure/edge-firewall/'
    }
  },
  {
    id: 'waf-rules',
    label: 'WAF Rules',
    icon: 'ai ai-waf-rules',
    headline: 'Create your first rule set',
    lead: 'Create a rule set to inspect traffic for injection, scripting and file-inclusion attempts.',
    unit: 'rule set',
    methods: [
      {
        id: 'create',
        title: 'New rule set',
        description: 'Set a sensitivity per threat family and start in learning mode.',
        action: 'Create',
        primary: true,
        icon: 'pi pi-plus',
        route: { path: '/waf-rules/new' }
      },
      {
        id: 'firewall',
        title: 'Inside a firewall',
        description: 'Create the firewall that will run the rule set on a workload.',
        action: 'New firewall',
        icon: 'ai ai-edge-firewall',
        route: { path: '/firewall/new' }
      },
      {
        id: 'api',
        title: 'Via CLI or API',
        description: 'Version the rule set with the rest of your security config.',
        command: 'azion create waf-rule-set --name my-rule-set',
        icon: 'pi pi-desktop'
      }
    ],
    learnMore: {
      label: 'How WAF works on Azion',
      href: 'https://www.azion.com/en/documentation/products/secure/edge-firewall/web-application-firewall/'
    }
  },
  {
    id: 'certificates',
    label: 'Certificate Manager',
    icon: 'ai ai-digital-certificates',
    headline: 'Add your first certificate',
    lead: "Upload a certificate or request one from Let's Encrypt to serve your domains over TLS.",
    unit: 'certificate',
    methods: [
      {
        id: 'letsencrypt',
        title: "Request from Let's Encrypt",
        description: 'Azion validates the domain and renews the certificate for you.',
        action: 'Create',
        primary: true,
        icon: 'pi pi-verified',
        route: { path: '/certificates/new' }
      },
      {
        id: 'upload',
        title: 'Upload a certificate',
        description: 'Paste the PEM and its private key for a certificate you own.',
        action: 'Upload',
        icon: 'pi pi-upload',
        route: { path: '/certificates/new' }
      },
      {
        id: 'api',
        title: 'Via CLI or API',
        description: 'Rotate certificates from the pipeline that issues them.',
        command: 'azion create certificate --crt ./fullchain.pem',
        icon: 'pi pi-desktop'
      }
    ],
    learnMore: {
      label: 'How Digital Certificates work on Azion',
      href: 'https://www.azion.com/en/documentation/products/secure/edge-firewall/digital-certificates/'
    }
  },
  {
    id: 'network-lists',
    label: 'Network Lists',
    icon: 'ai ai-network-lists',
    headline: 'Create your first network list',
    lead: 'Create a network list to allow or deny traffic by IP range, autonomous system or country.',
    unit: 'network list',
    methods: [
      {
        id: 'create',
        title: 'New list',
        description: 'Paste the IP ranges, ASNs or countries the list holds.',
        action: 'Create',
        primary: true,
        icon: 'pi pi-plus',
        route: { path: '/network-lists/new' }
      },
      {
        id: 'firewall',
        title: 'Inside a firewall rule',
        description: 'Create the firewall whose rules will match against the list.',
        action: 'New firewall',
        icon: 'ai ai-edge-firewall',
        route: { path: '/firewall/new' }
      },
      {
        id: 'api',
        title: 'Via CLI or API',
        description: 'Keep the list in sync with the source that generates it.',
        command: 'azion create network-list --type ip_cidr',
        icon: 'pi pi-desktop'
      }
    ],
    learnMore: {
      label: 'How Network Lists work on Azion',
      href: 'https://www.azion.com/en/documentation/products/secure/edge-firewall/network-lists/'
    }
  },
  {
    id: 'data-stream',
    label: 'Data Stream',
    icon: 'ai ai-data-stream',
    headline: 'Create your first stream',
    lead: 'Create a stream to ship edge events to your own observability or storage platform.',
    unit: 'stream',
    methods: [
      {
        id: 'create',
        title: 'New stream',
        description: 'Pick the events, the destination and how they are batched.',
        action: 'Create',
        primary: true,
        icon: 'pi pi-plus',
        route: { path: '/data-stream/new' }
      },
      {
        id: 'storage',
        title: 'To Object Storage',
        description: 'Create the bucket the events land in, then point a stream at it.',
        action: 'New bucket',
        icon: 'ai ai-edge-storage',
        route: { path: '/object-storage/new' }
      },
      {
        id: 'api',
        title: 'Via CLI or API',
        description: 'Declare the stream and its endpoint alongside your services.',
        command: 'azion create data-stream --template http',
        icon: 'pi pi-desktop'
      }
    ],
    learnMore: {
      label: 'How Data Stream works on Azion',
      href: 'https://www.azion.com/en/documentation/products/observe/data-stream/'
    }
  }
]

export const productFirstUse = (id) => productEmptyStates.find((product) => product.id === id)

export const productOptions = productEmptyStates.map(({ id, label, icon }) => ({
  value: id,
  label,
  icon
}))
