<script setup>
  import ArticleIndexSection from '@aziontech/ui/article-index-section'
  import placeholderImage from '@aziontech/ui/assets/placeholder-image.svg'
</script>

<template>
  <ArticleIndexSection
    anchor="posts"
    all-label="All articles"
    category-aria-label="Category"
    row-label="Read article"
    more-label="Load more"
    aria-label="Articles"
    :categories="['Developers', 'Security', 'Company news', 'Serverless']"
    search-placeholder="Search articles"
    search-aria-label="Search articles"
    :items="[
      {
        id: 'ship-portfolio-two-commands-azion-cli',
        href: '/blog/ship-portfolio-two-commands-azion-cli',
        image: placeholderImage,
        meta: 'Developers • SEP 25, 2026',
        title: 'How I Shipped My Portfolio in Just Two Commands',
        description:
          'See how a portfolio site went from template to live URL with just azion init and azion deploy.',
        authors: [{ name: 'Jane Doe' }],
        byline: 'Jane Doe · 9 min read',
        categories: ['Developers']
      },
      {
        id: 'how-to-reduce-ai-agent-latency',
        href: '/blog/how-to-reduce-ai-agent-latency',
        image: placeholderImage,
        meta: 'Serverless • SEP 23, 2026',
        title: 'How do you reduce AI agent latency?',
        description:
          'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state.',
        authors: [{ name: 'Priya Patel' }],
        byline: 'Priya Patel · 8 min read',
        categories: ['Serverless']
      },
      {
        id: 'cloudflare-alternatives-and-competitors',
        href: '/blog/cloudflare-alternatives-and-competitors',
        image: placeholderImage,
        meta: 'Security • SEP 22, 2026',
        title: 'Best Cloudflare alternatives and competitors',
        description:
          'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting.',
        authors: [{ name: 'Alex Morgan' }],
        byline: 'Alex Morgan · 13 min read',
        categories: ['Security']
      }
    ]"
  />
</template>
