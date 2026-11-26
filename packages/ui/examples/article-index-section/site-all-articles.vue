<script setup>
  import ArticleIndexSection from '@aziontech/webkit/article-index-section'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
  import Container from '@aziontech/webkit/container'
  import Spacer from '@aziontech/webkit/spacer'

  const items = [
    {
      id: 'ship-portfolio-two-commands-azion-cli',
      href: '/blog/ship-portfolio-two-commands-azion-cli',
      image: placeholderImage,
      meta: 'Developers • SEP 25, 2026',
      title: 'How I Shipped My Portfolio in Just Two Commands',
      description:
        "See how a portfolio site went from template to live URL with just azion init and azion deploy, running free on Azion's Hobby plan.",
      byline: 'Jane Doe · 9 min read',
      authors: [
        {
          name: 'Jane Doe'
        }
      ],
      categories: ['Developers']
    },
    {
      id: 'how-to-reduce-ai-agent-latency',
      href: '/blog/how-to-reduce-ai-agent-latency',
      image: placeholderImage,
      meta: 'Serverless • SEP 23, 2026',
      title: 'How do you reduce AI agent latency?',
      description:
        'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state with distributed architecture, caching, and observability.',
      byline: 'Priya Patel · 8 min read',
      authors: [
        {
          name: 'Priya Patel'
        }
      ],
      categories: ['Serverless']
    },
    {
      id: 'cloudflare-alternatives-and-competitors',
      href: '/blog/cloudflare-alternatives-and-competitors',
      image: placeholderImage,
      meta: 'Security • SEP 22, 2026',
      title: 'Best Cloudflare alternatives and competitors',
      description:
        'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting. Assess trade-offs, operating costs, and migration paths with Azion.',
      byline: 'Alex Morgan · 13 min read',
      authors: [
        {
          name: 'Alex Morgan'
        }
      ],
      categories: ['Security']
    },
    {
      id: 'which-azion-plan-is-right-for-your-project',
      href: '/blog/which-azion-plan-is-right-for-your-project',
      image: placeholderImage,
      meta: 'Company news • SEP 22, 2026',
      title: 'Which Azion plan is right for your project?',
      description:
        'Compare Azion’s Hobby, Pro, and Enterprise plans for personal projects, production applications, and operations that need customized terms.',
      byline: 'Priya Patel · 7 min read',
      authors: [
        {
          name: 'Priya Patel'
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
</script>

<template>
  <Container max-width="site">
    <Spacer hatch />

    <ArticleIndexSection
      anchor="posts"
      :items="items"
      :categories="categories"
      all-label="All articles"
      category-aria-label="Category"
      search-placeholder="Search articles"
      search-aria-label="Search articles"
      row-label="Read article"
      more-label="Load more"
      empty-title="No articles match these filters"
      empty-action-label="View all articles"
      aria-label="Articles"
    />

    <Spacer hatch />
  </Container>
</template>
