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
            description: 'Accelerate digital financial services',
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
            description: 'Put an application on a hostname, everywhere',
            href: '/site/products/workloads'
          },
          {
            label: 'Applications',
            description: 'Deliver and configure web applications',
            href: '/site/products/applications'
          },
          {
            label: 'Functions',
            description: 'Implement serverless functions and scalable applications',
            href: '/site/products/functions'
          },
          {
            label: 'Cache',
            description: 'Accelerate, optimize content delivery',
            href: '/site/products/cache'
          },
          {
            label: 'Application Accelerator',
            description: 'Boost performance, enhance delivery',
            href: '/site/products/application-accelerator'
          },
          { label: 'Image Processor', description: 'Optimize, transform images instantly' },
          {
            label: 'AI Inference',
            description: 'Perform AI inference globally',
            href: '/site/products/ai-inference'
          },
          { label: 'Durable Objects', description: 'Run stateful compute worldwide' },
          { label: 'Orchestrator', description: 'Deploy, manage, monitor and automate workloads' }
        ]
      }
    ],
    [
      {
        label: 'Store',
        href: '/site/products#store',
        items: [
          { label: 'SQL Database', description: 'Store relational and structured data' },
          {
            label: 'Object Storage',
            description: 'Store unstructured data in a scalable way',
            href: '/site/products/object-storage'
          },
          { label: 'KV Store', description: 'Store key-value data instantly' }
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
            description: 'Protect apps, block vulnerabilities',
            href: '/site/products/web-application-firewall'
          },
          { label: 'Bot Manager', description: 'Block bots and protect traffic' },
          { label: 'Network Shield', description: 'Defend, prevent network-level attacks' },
          { label: 'Edge DNS', description: 'Resolve DNS quickly and securely' },
          {
            label: 'Load Balancer',
            description: 'Distribute loads across servers with security and high performance'
          }
        ]
      }
    ],
    [
      {
        label: 'Observe',
        href: '/site/products#observe',
        items: [
          { label: 'Data Stream', description: 'Stream data for real-time analysis' },
          { label: 'Real-Time Events', description: 'Track events, gain operational clarity' },
          {
            label: 'Real-Time Metrics',
            description: 'Gain instant insights and operational visibility'
          },
          { label: 'Edge Pulse', description: 'Monitor, optimize edge performance' }
        ]
      },
      {
        label: 'Platform',
        href: '/site/products#platform',
        items: [
          {
            label: 'Our Network',
            description: 'Global delivery, speed, reliability',
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
            description: 'Documentation, technical support',
            href: '/site/docs'
          },
          { label: 'Guides', description: 'Practical guides, step-by-step' },
          { label: 'Dev Tools', description: 'Tools, developer support' },
          { label: 'Release Notes', description: 'Updates, new features' }
        ]
      }
    ],
    [
      {
        label: 'API',
        items: [
          {
            label: 'API Reference',
            description: 'API, advanced integration',
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
          { label: 'Blog', description: 'Insights, industry trends', href: '/site/blog' },
          {
            label: 'Learning',
            description: 'Fundamentals, subject by subject',
            href: '/site/learning'
          },
          { label: 'Resource Hub', description: 'Resources, useful materials' },
          {
            label: 'Success Stories',
            description: 'Real results from our customers',
            href: '/site/success-cases'
          },
          { label: 'Partners', description: 'Let’s build together', href: '/site/partners' },
          { label: 'Marketplace', description: 'Apps, ready-made solutions' }
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
      'Functions',
      'Cache',
      'Object Storage',
      'SQL Database',
      { label: 'WAF', href: '/site/products/web-application-firewall' },
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
