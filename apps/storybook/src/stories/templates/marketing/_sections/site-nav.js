const MEGA_MENUS = [
  {
    value: 'solutions',
    label: 'Solutions',
    columns: [
      [
        {
          label: 'By Need',
          items: [
            { label: 'Application Development', description: 'Build and run applications' },
            {
              label: 'Performance and Reliability',
              description: 'Improve application performance and reliability'
            },
            { label: 'Artificial Intelligence (AI)', description: 'Build and run AI workloads' },
            { label: 'Application Security', description: 'Secure applications and networks' },
            { label: 'Media and Streaming', description: 'Deliver media and streaming content' }
          ]
        }
      ],
      [
        {
          label: 'By Industry',
          items: [
            { label: 'Financial Services', description: 'Speed up digital financial services' },
            { label: 'Technology', description: 'Build high-performance applications' },
            { label: 'Retail', description: 'Build high-performance shopping experiences' }
          ]
        }
      ]
    ]
  },
  {
    value: 'products',
    label: 'Products',
    columns: [
      [
        {
          label: 'Build',
          items: [
            { label: 'Workloads', description: 'Serve an application on your domain, globally' },
            { label: 'Applications', description: 'Deliver and configure web applications' },
            {
              label: 'Functions',
              description: 'Run code globally with low latency and no cold starts'
            },
            { label: 'Cache', description: 'Speed up delivery and reduce origin load' },
            {
              label: 'Application Accelerator',
              description: 'Speed up dynamic content and APIs'
            },
            {
              label: 'Image Processor',
              description: 'Resize, crop, and convert images on the fly'
            },
            { label: 'AI Inference', description: 'Run AI inference close to users' },
            { label: 'AI Gateway', description: 'Route, secure and log every model call' },
            { label: 'Durable Objects', description: 'Run stateful code worldwide' },
            { label: 'Orchestrator', description: 'Deploy, manage, monitor and automate workloads' }
          ]
        }
      ],
      [
        {
          label: 'Store',
          items: [
            { label: 'SQL Database', description: 'Store relational and structured data' },
            { label: 'Object Storage', description: 'Store and deliver data globally' },
            { label: 'KV Store', description: 'Store key-value data with low latency' }
          ]
        }
      ],
      [
        {
          label: 'Secure',
          items: [
            {
              label: 'Web Application Firewall (WAF)',
              description: 'Block common attacks, enforce policies'
            },
            {
              label: 'Firewall',
              description: 'Filter every request before it reaches your code'
            },
            { label: 'DDoS Protection', description: 'Stop volumetric attacks automatically' },
            { label: 'Bot Manager', description: 'Block bots and protect traffic' },
            { label: 'Network Shield', description: 'Stop network attacks before they reach you' },
            { label: 'Edge DNS', description: 'Resolve DNS quickly and securely' },
            {
              label: 'Load Balancer',
              description: 'Spread traffic across origins and drop unhealthy ones'
            }
          ]
        }
      ],
      [
        {
          label: 'Observe',
          items: [
            { label: 'Data Stream', description: 'Stream event data to your tools as it happens' },
            { label: 'Real-Time Events', description: 'Query request-level logs in real time' },
            {
              label: 'Real-Time Metrics',
              description: 'See traffic and performance as they happen'
            },
            { label: 'Edge Pulse', description: 'Measure real user performance in the browser' }
          ]
        },
        {
          label: 'Platform',
          items: [{ label: 'Our Network', description: 'Global delivery across 100+ data centers' }]
        }
      ]
    ]
  },
  {
    value: 'developer',
    label: 'Developer',
    columns: [
      [
        {
          label: 'Docs',
          items: [
            { label: 'Azion Docs', description: 'Documentation and technical references' },
            { label: 'Guides', description: 'Practical, step-by-step guides' },
            { label: 'Dev Tools', description: 'CLI, API, and Terraform tools' },
            { label: 'Release Notes', description: 'Product updates and new features' }
          ]
        }
      ],
      [
        {
          label: 'API',
          items: [{ label: 'API Reference', description: 'Automate Azion with the API' }]
        },
        {
          label: 'Community',
          items: [
            {
              label: 'Join our community',
              description: 'Developers and the Azion team on Discord',
              icon: 'ai-cor ai-discord'
            }
          ]
        }
      ]
    ]
  },
  {
    value: 'resources',
    label: 'Resources',
    columns: [
      [
        {
          label: 'Content',
          items: [
            { label: 'Blog', description: 'Insights and industry trends' },
            { label: 'Learning', description: 'Fundamentals, subject by subject' },
            { label: 'Resource Hub', description: 'Useful materials in one place' },
            { label: 'Success Stories', description: 'Real results from our customers' },
            { label: 'Partners', description: 'Let’s build together' },
            { label: 'Marketplace', description: 'Ready-made apps and solutions' }
          ]
        }
      ],
      [
        {
          label: 'Services',
          items: [
            { label: 'Support', description: 'Expert help when you need it' },
            {
              label: 'Professional Services',
              description: 'Specialist guidance to move faster'
            }
          ]
        }
      ]
    ]
  }
]

export const SITE_SECTION = {
  _id: 'site-nav',
  props: {
    home: '#',
    menus: MEGA_MENUS,
    links: [{ label: 'Pricing', href: '#' }],
    contact: { label: 'Contact', href: '#' },
    primaryAction: { label: 'Start for free', href: '#' },
    secondaryAction: { label: 'Login', href: '#' }
  }
}
