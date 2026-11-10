export const SITE_SECTION = {
  _id: 'article-highlight',
  props: {
    anchor: 'articles',
    items: [
      {
        key: 'ship-portfolio-two-commands-azion-cli',
        href: '/blog/ship-portfolio-two-commands-azion-cli',
        image: '/media/blog/ship-portfolio-two-commands.png',
        highlightImage: '/media/blog/ship-portfolio-two-commands-highlight.png',
        meta: 'Developers • SEP 25, 2026',
        title: 'How I Shipped My Portfolio in Just Two Commands',
        description:
          "See how a portfolio site went from template to live URL with just azion init and azion deploy, running free on Azion's Hobby plan.",
        readTime: '9 min read'
      },
      {
        key: 'how-to-reduce-ai-agent-latency',
        href: '/blog/how-to-reduce-ai-agent-latency',
        image: '/media/blog/reduce-ai-agent-latency.png',
        highlightImage: '/media/blog/reduce-ai-agent-latency-highlight.png',
        meta: 'Serverless • SEP 23, 2026',
        title: 'How Do You Reduce AI Agent Latency?',
        description:
          'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state with distributed architecture, caching, and observability.',
        readTime: '8 min read'
      },
      {
        key: 'cloudflare-alternatives-and-competitors',
        href: '/blog/cloudflare-alternatives-and-competitors',
        image: '/media/blog/best-cloudflare-alternatives.png',
        highlightImage: '/media/blog/best-cloudflare-alternatives-highlight.png',
        meta: 'Security • SEP 22, 2026',
        title: 'Best Cloudflare Alternatives and Competitors',
        description:
          'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting. Assess trade-offs, operating costs, and migration paths with Azion.',
        readTime: '13 min read'
      },
      {
        key: 'which-azion-plan-is-right-for-your-project',
        href: '/blog/which-azion-plan-is-right-for-your-project',
        image: '/media/blog/which-azion-plan.png',
        highlightImage: '/media/blog/which-azion-plan-highlight.png',
        meta: 'Company news • SEP 22, 2026',
        title: 'Which Azion Plan Is Right for Your Project?',
        description:
          'Compare Azion’s Hobby, Pro, and Enterprise plans for personal projects, production applications, and operations that need customized terms.',
        readTime: '7 min read'
      }
    ],
    actionLabel: 'Read article',
    ariaLabel: 'Highlight articles'
  }
}
