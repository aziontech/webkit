const ROWS = [
  {
    href: '/blog/ship-portfolio-two-commands-azion-cli',
    image: '/media/blog/ship-portfolio-two-commands.png',
    meta: 'Developers • SEP 25, 2026',
    title: 'How I Shipped My Portfolio in Just Two Commands',
    description:
      "See how a portfolio site went from template to live URL with just azion init and azion deploy, running free on Azion's Hobby plan.",
    authors: ['Patrick Menoti'],
    byline: 'Patrick Menoti · 9 min read'
  },
  {
    href: '/blog/how-to-reduce-ai-agent-latency',
    image: '/media/blog/reduce-ai-agent-latency.png',
    meta: 'Serverless • SEP 23, 2026',
    title: 'How Do You Reduce AI Agent Latency?',
    description:
      'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state with distributed architecture, caching, and observability.',
    authors: ['Marilia Bafutto Costa'],
    byline: 'Marilia Bafutto Costa · 8 min read'
  },
  {
    href: '/blog/cloudflare-alternatives-and-competitors',
    image: '/media/blog/best-cloudflare-alternatives.png',
    meta: 'Security • SEP 22, 2026',
    title: 'Best Cloudflare Alternatives and Competitors',
    description:
      'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting. Assess trade-offs, operating costs, and migration paths with Azion.',
    authors: ['Vitor Eltz'],
    byline: 'Vitor Eltz · 13 min read'
  },
  {
    href: '/blog/which-azion-plan-is-right-for-your-project',
    image: '/media/blog/which-azion-plan.png',
    meta: 'Company news • SEP 22, 2026',
    title: 'Which Azion Plan Is Right for Your Project?',
    description:
      'Compare Azion’s Hobby, Pro, and Enterprise plans for personal projects, production applications, and operations that need customized terms.',
    authors: ['Marilia Bafutto Costa'],
    byline: 'Marilia Bafutto Costa · 7 min read'
  }
]

const slugOf = (href) => href.split('/').filter(Boolean).pop()

const prefixOf = (meta) => meta.split(' • ')[0]

export const SITE_SECTION = {
  _id: 'article-index-blog',
  props: {
    anchor: 'posts',
    items: ROWS.map(({ authors, ...row }) => ({
      key: slugOf(row.href),
      ...row,
      authors: authors.map((name) => ({ name })),
      categories: [prefixOf(row.meta)]
    })),
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Serverless',
      'Caching',
      'Observability',
      'Routing and networking'
    ],
    allLabel: 'All articles',
    categoryLabel: 'Category',
    search: { placeholder: 'Search articles', label: 'Search articles' },
    rowLabel: 'Read article',
    moreLabel: 'Load more',
    ariaLabel: 'Articles'
  }
}
