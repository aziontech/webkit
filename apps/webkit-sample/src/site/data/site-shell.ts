import type { SiteFooterColumn, SiteLink, SiteNavMenu, SiteSocial } from '../ui/sections/types'

const SOLUTIONS: SiteNavMenu = {
  value: 'solutions',
  label: 'Solutions',
  columns: [
    [
      {
        label: 'By Need',
        href: '/site/solutions#needs',
        items: [
          {
            label: 'Build and Run Applications',
            description: 'Ship and scale web apps and APIs',
            href: '/site/solutions/web-apps'
          },
          {
            label: 'Improve Application Performance and Reliability',
            description: 'Faster, always-on delivery',
            href: '/site/solutions/performance'
          },
          {
            label: 'Build and Run AI Workloads',
            description: 'Infrastructure for AI workloads',
            href: '/site/solutions/ai'
          },
          {
            label: 'Secure Applications and Networks',
            description: 'End-to-end security',
            href: '/site/solutions/security'
          },
          {
            label: 'Deliver Media and Streaming Content',
            description: 'Low-latency video and live streams',
            href: '/site/solutions/streaming'
          }
        ]
      }
    ],
    [
      {
        label: 'By Industries',
        href: '/site/solutions#industries',
        items: [
          {
            label: 'Financial Services',
            description: 'Performance and compliance',
            href: '/site/solutions/financial-services'
          },
          {
            label: 'Technology',
            description: 'Scale for digital products',
            href: '/site/solutions/technology'
          },
          {
            label: 'Retail',
            description: 'Shopping experiences you can trust',
            href: '/site/solutions/retail'
          }
        ]
      }
    ]
  ]
}

const PRODUCTS: SiteNavMenu = {
  value: 'products',
  label: 'Products',
  columns: [
    [
      {
        label: 'Build',
        href: '/site/products#build',
        items: [
          {
            label: 'Workloads',
            description: 'Put an application on a hostname, everywhere',
            href: '/site/products/workloads'
          },
          { label: 'Applications', description: 'Deliver and configure web applications' },
          {
            label: 'Functions',
            description: 'Run serverless code at the edge',
            href: '/site/products/functions'
          },
          {
            label: 'Cache',
            description: 'Speed up content delivery',
            href: '/site/products/cache'
          },
          {
            label: 'Application Accelerator',
            description: 'Optimize dynamic applications',
            href: '/site/products/application-accelerator'
          },
          { label: 'Image Processor', description: 'Resize and convert images on the fly' },
          {
            label: 'AI Inference',
            description: 'Run AI models close to the user',
            href: '/site/products/ai-inference'
          },
          { label: 'Orchestrator', description: 'Provision and manage edge nodes' }
        ]
      }
    ],
    [
      {
        label: 'Store',
        href: '/site/products#store',
        items: [
          { label: 'SQL Database', description: 'A distributed SQL database' },
          { label: 'Object Storage', description: 'Store and serve objects at the edge' },
          { label: 'KV Store', description: 'Low-latency key-value store' }
        ]
      }
    ],
    [
      {
        label: 'Protect',
        href: '/site/products#protect',
        items: [
          { label: 'WAF', description: 'Web application firewall' },
          { label: 'Firewall', description: 'Filter traffic before it reaches you' },
          { label: 'DDoS Protection', description: 'Absorb volumetric attacks' },
          { label: 'Bot Manager', description: 'Detect and block malicious bots' },
          { label: 'Network Shield', description: 'Control access by network' },
          { label: 'Edge DNS', description: 'Distributed authoritative DNS' },
          { label: 'Load Balancer', description: 'Global load balancing' }
        ]
      }
    ],
    [
      {
        label: 'Observe',
        href: '/site/products#observe',
        items: [
          { label: 'Data Stream', description: 'Real-time event streaming' },
          { label: 'Real-Time Events', description: 'Query raw request logs' },
          { label: 'Real-Time Metrics', description: 'Live platform metrics' },
          { label: 'Edge Pulse', description: 'Real user experience monitoring' }
        ]
      },
      {
        label: 'Platform',
        href: '/site/products#platform',
        items: [
          {
            label: 'Our Network',
            description: 'The global edge network',
            href: '/site/products/our-network'
          }
        ]
      }
    ]
  ]
}

const DEVELOPERS: SiteNavMenu = {
  value: 'developers',
  label: 'Developers',
  columns: [
    [
      {
        label: 'Developer Resources',
        href: '/site/docs',
        items: [
          {
            label: 'Documentation',
            description: 'Platform guides and reference',
            href: '/site/docs'
          },
          { label: 'Dev Tools', description: 'CLI, SDKs, and integrations' },
          { label: 'API Reference', description: 'Automate with the Azion API' },
          { label: 'Release Notes', description: 'What is new and recently changed' }
        ]
      }
    ]
  ]
}

const RESOURCES: SiteNavMenu = {
  value: 'resources',
  label: 'Resources',
  columns: [
    [
      {
        label: 'Content',
        href: '#content',
        items: [
          { label: 'Blog', description: 'Technical articles and news' },
          {
            label: 'Learning',
            description: 'Fundamentals, subject by subject',
            href: '/site/learning'
          },
          { label: 'Resource Hub', description: 'E-books, webinars, and whitepapers' },
          { label: 'Marketplace', description: 'Ready-made templates and integrations' },
          {
            label: 'Support',
            description: 'Expert help when you need it',
            href: '/site/support'
          },
          {
            label: 'Professional Services',
            description: 'Guidance to move faster with confidence'
          }
        ]
      }
    ]
  ]
}

export const SITE_NAV: {
  home: string
  menus: SiteNavMenu[]
  links: SiteLink[]
  contact: SiteLink
  login: SiteLink
  cta: SiteLink
} = {
  home: '/site',
  menus: [SOLUTIONS, PRODUCTS, DEVELOPERS, RESOURCES],
  links: [
    { label: 'Customers', href: '#customers' },
    { label: 'Pricing', href: '/site/pricing' }
  ],
  contact: { label: 'Contact', href: '/site/contact' },
  login: { label: 'Login', href: '/login' },
  cta: { label: 'Start for Free', href: '/signup' }
}

const links = (labels: Array<string | SiteLink>): SiteLink[] =>
  labels.map((entry) => (typeof entry === 'string' ? { label: entry, href: '#' } : entry))

const COLUMNS: SiteFooterColumn[] = [
  {
    title: 'Products',
    links: links([
      'Functions',
      'Cache',
      'Object Storage',
      'SQL Database',
      'WAF',
      'Edge DNS',
      'Data Stream'
    ])
  },
  {
    title: 'Solutions',
    links: links([
      'Web Apps',
      'AI',
      'Application Security',
      'Financial Services',
      'Retail',
      'Technology'
    ])
  },
  {
    title: 'Developers',
    links: links([
      'Documentation',
      'API Reference',
      'Dev Tools',
      'Release Notes',
      'Marketplace',
      'Status'
    ])
  },
  {
    title: 'Company',
    links: links([
      'About',
      'Customers',
      'Partners',
      { label: 'Careers', href: '/site/careers' },
      'Blog',
      'Contact'
    ])
  }
]

const SOCIALS: SiteSocial[] = [
  { icon: 'pi pi-github', label: 'Azion on GitHub', href: 'https://github.com/aziontech' },
  {
    icon: 'pi pi-linkedin',
    label: 'Azion on LinkedIn',
    href: 'https://www.linkedin.com/company/aziontech'
  },
  { icon: 'pi pi-youtube', label: 'Azion on YouTube', href: 'https://www.youtube.com/aziontech' },
  { icon: 'ai ai-x', label: 'Azion on X', href: 'https://x.com/aziontech' },
  {
    icon: 'pi pi-instagram',
    label: 'Azion on Instagram',
    href: 'https://www.instagram.com/aziontech'
  },
  { icon: 'pi pi-discord', label: 'Azion on Discord', href: 'https://discord.gg/azion' },
  { icon: 'pi pi-reddit', label: 'Azion on Reddit', href: 'https://www.reddit.com/r/aziontech' }
]

export const SITE_FOOTER: {
  home: string
  columns: SiteFooterColumn[]
  socials: SiteSocial[]
  status: string
  languages: string[]
} = {
  home: '/site',
  columns: COLUMNS,
  socials: SOCIALS,
  status: 'All Systems Operational',
  languages: ['EN', 'PT-BR', 'ES']
}
