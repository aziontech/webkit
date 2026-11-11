<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import ArticleIndexBlog from '@aziontech/webkit/article-index-blog'

  const items = [
    {
      key: 'ship-portfolio-two-commands-azion-cli',
      href: '/blog/ship-portfolio-two-commands-azion-cli',
      image: '/media/blog/ship-portfolio-two-commands.png',
      meta: 'Developers • SEP 25, 2026',
      title: 'How I Shipped My Portfolio in Just Two Commands',
      description:
        "See how a portfolio site went from template to live URL with just azion init and azion deploy, running free on Azion's Hobby plan.",
      byline: 'Patrick Menoti · 9 min read',
      authors: [
        {
          name: 'Patrick Menoti'
        }
      ],
      categories: ['Developers']
    },
    {
      key: 'how-to-reduce-ai-agent-latency',
      href: '/blog/how-to-reduce-ai-agent-latency',
      image: '/media/blog/reduce-ai-agent-latency.png',
      meta: 'Serverless • SEP 23, 2026',
      title: 'How Do You Reduce AI Agent Latency?',
      description:
        'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state with distributed architecture, caching, and observability.',
      byline: 'Marilia Bafutto Costa · 8 min read',
      authors: [
        {
          name: 'Marilia Bafutto Costa'
        }
      ],
      categories: ['Serverless']
    },
    {
      key: 'cloudflare-alternatives-and-competitors',
      href: '/blog/cloudflare-alternatives-and-competitors',
      image: '/media/blog/best-cloudflare-alternatives.png',
      meta: 'Security • SEP 22, 2026',
      title: 'Best Cloudflare Alternatives and Competitors',
      description:
        'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting. Assess trade-offs, operating costs, and migration paths with Azion.',
      byline: 'Vitor Eltz · 13 min read',
      authors: [
        {
          name: 'Vitor Eltz'
        }
      ],
      categories: ['Security']
    },
    {
      key: 'which-azion-plan-is-right-for-your-project',
      href: '/blog/which-azion-plan-is-right-for-your-project',
      image: '/media/blog/which-azion-plan.png',
      meta: 'Company news • SEP 22, 2026',
      title: 'Which Azion Plan Is Right for Your Project?',
      description:
        'Compare Azion’s Hobby, Pro, and Enterprise plans for personal projects, production applications, and operations that need customized terms.',
      byline: 'Marilia Bafutto Costa · 7 min read',
      authors: [
        {
          name: 'Marilia Bafutto Costa'
        }
      ],
      categories: ['Company news']
    }
  ]

  const categories = [
    'Developers',
    'Security',
    'Company news',
    'Market trends',
    'Serverless',
    'Caching',
    'Observability',
    'Routing and networking'
  ]

  const search = {
    placeholder: 'Search articles',
    label: 'Search articles'
  }
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <ArticleIndexBlog
      anchor="posts"
      :items="items"
      :categories="categories"
      all-label="All articles"
      category-label="Category"
      :search="search"
      row-label="Read article"
      more-label="Load more"
      aria-label="Articles"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
