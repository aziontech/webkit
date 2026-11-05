const RESOURCES = [
  {
    href: 'https://www.azion.com/en/lp/security-applications-apis-ai-agents/',
    image: 'https://www.azion.com/assets/content/blog/uploads/Rich%20contentsdark.png',
    meta: 'E-books • OCT 15, 2026',
    title: 'Security for applications, APIs, and AI agents',
    description:
      'Learn how to bring security policies into deployment, automate protection, and monitor traffic across applications, APIs, and AI agents.'
  },
  {
    href: 'https://www.azion.com/en/blog/azion-mcp-servers-generally-available/',
    image: 'https://www.azion.com/assets/content/blog/uploads/mcp-ga/Azion-MCP.svg',
    meta: 'Blog • OCT 14, 2026',
    title: 'Azion MCP servers: Connect Your Coding Agent to Azion',
    description:
      'Azion MCP servers connect Claude Code, Cursor, and other coding agents to the Azion documentation and API, with a dry_run preview before each write.'
  },
  {
    href: 'https://www.azion.com/en/lp/cloudflare-to-azion-alternative-guide/',
    image: 'https://www.azion.com/assets/content/lp/uploads/og-image/og-img-cf-to-azion.png',
    meta: 'Comparisons • OCT 3, 2026',
    title: 'Cloudflare Alternative Comparison: Azion vs Cloudflare',
    description:
      'Azion vs Cloudflare: the same platform on every plan, more than one way to recover from failures, and Enterprise support that answers in minutes.'
  },
  {
    href: 'https://www.azion.com/en/lp/f5-to-azion-alternative-guide/',
    image: 'https://www.azion.com/assets/content/lp/uploads/og-image/og-img-f5-to-azion.png',
    meta: 'Comparisons • OCT 3, 2026',
    title: 'F5 Alternative Comparison: Azion vs F5',
    description:
      'Azion vs F5: one managed platform for every application. No appliances, no licensing matrix, and a path off BIG-IP one app at a time.'
  }
]

const slugOf = (href) => href.split('/').filter(Boolean).pop()

const prefixOf = (meta) => meta.split(' • ')[0]

export const SITE_SECTION = {
  _id: 'article-index-resource-hub',
  props: {
    anchor: 'resources',
    title: 'Explore all resources',
    items: RESOURCES.map((resource) => ({
      key: slugOf(resource.href),
      ...resource,
      facets: { contentType: [prefixOf(resource.meta)] }
    })),
    facets: [
      {
        key: 'contentType',
        label: 'Content type',
        allLabel: 'All content types',
        options: ['E-books', 'Blog', 'Comparisons', 'Success stories']
      },
      {
        key: 'category',
        label: 'Category',
        allLabel: 'All categories',
        options: [
          'Developers',
          'Security',
          'Company news',
          'Market trends',
          'Routing',
          'Serverless',
          'Caching',
          'Orchestration',
          'Observability',
          'Routing and networking'
        ]
      },
      {
        key: 'industry',
        label: 'Industry',
        allLabel: 'All industries',
        options: ['Financial', 'Fintech', 'EdTech', 'Retail', 'Tech', 'Education', 'Media']
      }
    ],
    rowLabel: 'Read article',
    moreLabel: 'Load more',
    ariaLabel: 'Resources'
  }
}
