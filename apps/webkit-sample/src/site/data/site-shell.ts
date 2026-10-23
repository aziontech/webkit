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
            label: 'Application Development',
            description: 'Build and run applications',
            href: '/site/solutions/web-apps'
          },
          {
            label: 'Performance and Reliability',
            description: 'Improve application performance and reliability',
            href: '/site/solutions/performance'
          },
          {
            label: 'Artificial Intelligence (AI)',
            description: 'Build and run AI workloads',
            href: '/site/solutions/ai'
          },
          {
            label: 'Application Security',
            description: 'Secure applications and networks',
            href: '/site/solutions/security'
          },
          {
            label: 'Media and Streaming',
            description: 'Deliver media and streaming content',
            href: '/site/solutions/streaming'
          }
        ]
      }
    ],
    [
      {
        label: 'By Industry',
        href: '/site/solutions#industries',
        items: [
          {
            label: 'Financial Services',
            description: 'Speed up digital financial services',
            href: '/site/solutions/financial-services'
          },
          {
            label: 'Technology',
            description: 'Build high-performance applications',
            href: '/site/solutions/technology'
          },
          {
            label: 'Retail',
            description: 'Build high-performance shopping experiences',
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
            description: 'Serve an application on your domain, globally',
            href: '/site/products/workloads'
          },
          {
            label: 'Functions',
            description: 'Run code globally with low latency and no cold starts',
            href: '/site/products/functions'
          },
          {
            label: 'Cache',
            description: 'Speed up delivery and reduce origin load',
            href: '/site/products/cache'
          },
          {
            label: 'Application Accelerator',
            description: 'Speed up dynamic content and APIs',
            href: '/site/products/application-accelerator'
          },
          {
            label: 'Image Processor',
            description: 'Resize, crop, and convert images on the fly',
            href: '/site/products/image-processor'
          },
          {
            label: 'AI Inference',
            description: 'Run AI inference close to users',
            href: '/site/products/ai-inference'
          },
          { label: 'Durable Objects', description: 'Run stateful code worldwide' },
          { label: 'Orchestrator', description: 'Deploy, manage, monitor and automate workloads' }
        ]
      }
    ],
    [
      {
        label: 'Store',
        href: '/site/products#store',
        items: [
          {
            label: 'SQL Database',
            description: 'Store relational and structured data',
            href: '/site/products/sql-database'
          },
          {
            label: 'Object Storage',
            description: 'Store and deliver data globally',
            href: '/site/products/object-storage'
          },
          {
            label: 'KV Store',
            description: 'Store key-value data with low latency',
            href: '/site/products/kv-store'
          }
        ]
      }
    ],
    [
      {
        label: 'Secure',
        href: '/site/products#protect',
        items: [
          {
            label: 'Web Application Firewall (WAF)',
            description: 'Block common attacks, enforce policies',
            href: '/site/products/web-application-firewall'
          },
          {
            label: 'Bot Manager',
            description: 'Block bots and protect traffic',
            href: '/site/products/bot-manager'
          },
          {
            label: 'Network Shield',
            description: 'Stop network attacks before they reach you',
            href: '/site/products/network-shield'
          },
          {
            label: 'Edge DNS',
            description: 'Resolve DNS quickly and securely',
            href: '/site/products/edge-dns'
          },
          {
            label: 'Load Balancer',
            description: 'Spread traffic across origins and drop unhealthy ones',
            href: '/site/products/load-balancer'
          },
          { label: 'Secure Internet Access', description: 'Protect user access to the web' },
          {
            label: 'AI Gateway',
            description: 'Secure, manage, and optimize AI traffic',
            href: '/site/products/ai-gateway'
          }
        ]
      }
    ],
    [
      {
        label: 'Observe',
        href: '/site/products#observe',
        items: [
          {
            label: 'Data Stream',
            description: 'Stream event data to your tools as it happens',
            href: '/site/products/data-stream'
          },
          {
            label: 'Real-Time Events',
            description: 'Query request-level logs in real time',
            href: '/site/products/real-time-events'
          },
          { label: 'Edge Pulse', description: 'Measure real user performance in the browser' }
        ]
      },
      {
        label: 'Platform',
        href: '/site/products#platform',
        items: [
          {
            label: 'Our Network',
            description: 'Global delivery across 100+ data centers',
            href: '/site/products/our-network'
          }
        ]
      }
    ]
  ]
}

const DEVELOPER: SiteNavMenu = {
  value: 'developer',
  label: 'Developer',
  columns: [
    [
      {
        label: 'Docs',
        href: '/site/docs',
        items: [
          {
            label: 'Azion Docs',
            description: 'Documentation and technical references',
            href: '/site/docs'
          },
          { label: 'Guides', description: 'Practical, step-by-step guides' },
          { label: 'Dev Tools', description: 'CLI, API, and Terraform tools' },
          { label: 'Release Notes', description: 'Product updates and new features' }
        ]
      }
    ],
    [
      {
        label: 'API',
        items: [
          {
            label: 'API Reference',
            description: 'Automate Azion with the API',
            href: 'https://api.azion.com/v4'
          }
        ]
      },
      {
        label: 'Community',
        items: [
          {
            label: 'Join our community',
            description: 'Developers and the Azion team on Discord',
            href: 'https://discord.com/invite/pM8ANzztuB',
            icon: 'ai-cor ai-discord'
          }
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
          { label: 'Blog', description: 'Insights and industry trends', href: '/site/blog' },
          {
            label: 'Learning',
            description: 'Fundamentals, subject by subject',
            href: '/site/learning'
          },
          { label: 'Resource Hub', description: 'Useful materials in one place' },
          {
            label: 'Success Stories',
            description: 'Real results from our customers',
            href: '/site/success-cases'
          },
          { label: 'Partners', description: 'Let’s build together', href: '/site/partners' },
          { label: 'Marketplace', description: 'Ready-made apps and solutions' }
        ]
      }
    ],
    [
      {
        label: 'Services',
        items: [
          {
            label: 'Support',
            description: 'Expert help when you need it',
            href: '/site/support'
          },
          {
            label: 'Professional Services',
            description: 'Specialist guidance to move faster'
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
  menus: [SOLUTIONS, PRODUCTS, DEVELOPER, RESOURCES],
  links: [{ label: 'Pricing', href: '/site/pricing' }],
  contact: { label: 'Contact', href: '/site/contact' },
  login: { label: 'Login', href: '/login' },
  cta: { label: 'Start for free', href: '/signup' }
}

const links = (labels: Array<string | SiteLink>): SiteLink[] =>
  labels.map((entry) => (typeof entry === 'string' ? { label: entry, href: '#' } : entry))

const COLUMNS: SiteFooterColumn[] = [
  {
    title: 'Products',
    links: links([
      { label: 'Functions', href: '/site/products/functions' },
      { label: 'Cache', href: '/site/products/cache' },
      { label: 'Object Storage', href: '/site/products/object-storage' },
      { label: 'SQL Database', href: '/site/products/sql-database' },
      { label: 'WAF', href: '/site/products/web-application-firewall' },
      { label: 'Edge DNS', href: '/site/products/edge-dns' },
      { label: 'Data Stream', href: '/site/products/data-stream' }
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
      'Docs',
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
      { label: 'Customers', href: '/site/success-cases' },
      { label: 'Partners', href: '/site/partners' },
      { label: 'Careers', href: '/site/careers' },
      { label: 'Blog', href: '/site/blog' },
      { label: 'Contact', href: '/site/contact' }
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
