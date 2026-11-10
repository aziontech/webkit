const LOGO_BASE = '/marketing-components/logos'

const POSTS = [
  {
    key: 'how-to-reduce-ai-agent-latency',
    href: '/blog/how-to-reduce-ai-agent-latency',
    title: 'How Do You Reduce AI Agent Latency?',
    description:
      'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state with distributed architecture, caching, and observability.',
    meta: 'SEP 23, 2026 • 8 min read',
    image: '/media/blog/reduce-ai-agent-latency.png'
  },
  {
    key: 'cloudflare-alternatives-and-competitors',
    href: '/blog/cloudflare-alternatives-and-competitors',
    title: 'Best Cloudflare Alternatives and Competitors',
    description:
      'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting. Assess trade-offs, operating costs, and migration paths with Azion.',
    meta: 'SEP 22, 2026 • 13 min read',
    image: '/media/blog/best-cloudflare-alternatives.png'
  },
  {
    key: 'which-azion-plan-is-right-for-your-project',
    href: '/blog/which-azion-plan-is-right-for-your-project',
    title: 'Which Azion Plan Is Right for Your Project?',
    description:
      'Compare Azion’s Hobby, Pro, and Enterprise plans for personal projects, production applications, and operations that need customized terms.',
    meta: 'SEP 22, 2026 • 7 min read',
    image: '/media/blog/which-azion-plan.png'
  }
]

const STORIES = [
  {
    key: 'netshoes',
    href: '/success-cases/netshoes',
    title: 'Netshoes Blocks 4M+ Threats in 6 Months with Azion WAF',
    description:
      'Netshoes strengthened its e-commerce security and improved the shopping experience by blocking threats such as SQL Injection and XSS.',
    meta: 'FEB 4, 2022 • 4 min read',
    mark: { name: 'Netshoes', logo: `${LOGO_BASE}/netshoes-extended-reversed.svg` }
  },
  {
    key: 'renner',
    href: '/success-cases/renner',
    title: 'Lojas Renner Optimizes Online Shopping Journey with Azion',
    description:
      'Faster product pages and more resilient digital shopping experiences allowed Renner to scale its e-commerce platform using Azion’s distributed infrastructure.',
    meta: 'AUG 10, 2021 • 4 min read',
    mark: { name: 'Renner', logo: `${LOGO_BASE}/renner-extended-color.svg` }
  },
  {
    key: 'gpa',
    href: '/success-cases/gpa',
    title: 'GPA solved a cyberattack and reduced costs by 30%',
    description:
      'Grupo Pão de Açúcar (GPA) solved a targeted DNS attack, secured 100+ critical applications in 15 days, and reduced costs by 30%.',
    meta: 'MAY 6, 2025 • 4 min read',
    mark: { name: 'GPA', logo: `${LOGO_BASE}/gpa-extended-reversed.svg` }
  }
]

export const ARTICLES_SECTION = {
  _id: 'article-cards',
  props: {
    kind: 'left',
    title: 'Related Articles',
    items: POSTS,
    ariaLabel: 'Related Articles'
  }
}

export const SUCCESS_CASES_SECTION = {
  _id: 'article-cards',
  props: {
    kind: 'left',
    title: 'Related Success Cases',
    items: STORIES,
    ariaLabel: 'Related Success Cases'
  }
}

export const CENTERED_SECTION = {
  _id: 'article-cards',
  props: {
    kind: 'centered',
    eyebrow: 'Success cases',
    title: 'When our customers succeed, we succeed',
    items: STORIES,
    ariaLabel: 'When our customers succeed, we succeed'
  }
}
