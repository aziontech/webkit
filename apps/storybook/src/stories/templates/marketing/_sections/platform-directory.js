const GROUPS = [
  {
    title: 'Build',
    items: [
      {
        icon: 'ai ai-edge-functions',
        title: 'Functions',
        description: 'Run code globally with no cold starts',
        href: '/products/functions'
      },
      {
        icon: 'ai ai-rules-engine',
        title: 'Rules Engine',
        description: 'Automate request handling with rules',
        href: 'https://www.azion.com/en/documentation/products/build/applications/rules-engine/'
      },
      {
        icon: 'ai ai-image-processor',
        title: 'Image Processor',
        description: 'Resize and convert images on demand',
        href: 'https://www.azion.com/en/products/image-processor/'
      },
      {
        icon: 'ai ai-tiered-cache',
        title: 'Cache',
        description: 'Speed up content delivery and reduce origin load',
        href: 'https://www.azion.com/en/products/cache/'
      },
      {
        icon: 'ai ai-edge-ai',
        title: 'AI Inference',
        description: 'Run models close to the user',
        href: 'https://www.azion.com/en/products/ai-inference/'
      },
      {
        icon: 'ai ai-ai-gateway',
        title: 'AI Gateway',
        description: 'Route, secure and log every model call',
        href: 'https://www.azion.com/en/solutions#ai'
      }
    ]
  },
  {
    title: 'Store',
    items: [
      {
        icon: 'ai ai-edge-storage',
        title: 'Object Storage',
        description: 'Store and serve objects close to users',
        href: 'https://www.azion.com/en/products/object-storage/'
      },
      {
        icon: 'ai ai-edge-sql',
        title: 'SQL Database',
        description: 'Run SQL on a distributed database',
        href: 'https://www.azion.com/en/products/sql-database/'
      },
      {
        icon: 'ai ai-edge-kv',
        title: 'KV Store',
        description: 'Store key-value data with low latency',
        href: 'https://www.azion.com/en/products/kv-store/'
      }
    ]
  },
  {
    title: 'Secure',
    items: [
      {
        icon: 'ai ai-waf-rules',
        title: 'WAF',
        description: 'Block common attacks close to traffic',
        href: 'https://www.azion.com/en/products/web-application-firewall/'
      },
      {
        icon: 'ai ai-azion-api',
        title: 'API Gateway',
        description: 'Secure, manage, and scale API traffic',
        href: 'https://www.azion.com/en/solutions/api-gateway/'
      },
      {
        icon: 'ai ai-bot-manager',
        title: 'Bot Manager',
        description: 'Detect and stop automated traffic',
        href: 'https://www.azion.com/en/products/bot-manager/'
      },
      {
        icon: 'ai ai-edge-dns',
        title: 'Edge DNS',
        description: 'Authoritative DNS, distributed globally',
        href: 'https://www.azion.com/en/products/edge-dns/'
      },
      {
        icon: 'ai ai-load-balancer',
        title: 'Load Balancer',
        description: 'Spread traffic across origins for availability',
        href: 'https://www.azion.com/en/products/load-balancer/'
      }
    ]
  },
  {
    title: 'Observe',
    items: [
      {
        icon: 'ai ai-real-time-metrics',
        title: 'Real-Time Metrics',
        description: 'Watch traffic, errors and latency as they happen',
        href: 'https://www.azion.com/en/products/real-time-metrics/'
      }
    ]
  }
]

export const SITE_SECTION = {
  _id: 'platform-directory',
  props: {
    title: 'Everything you need to build and run applications',
    ariaLabel: 'Azion products',
    groups: GROUPS
  }
}
