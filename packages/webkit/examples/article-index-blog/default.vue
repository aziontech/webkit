<script setup>
  import ArticleIndexBlog from '@aziontech/webkit/article-index-blog'
</script>

<template>
  <ArticleIndexBlog
    anchor="posts"
    all-label="All articles"
    category-label="Category"
    row-label="Read article"
    more-label="Load more"
    aria-label="Articles"
    :categories="['Developers', 'Security', 'Company news', 'Serverless']"
    :search="{ placeholder: 'Search articles', label: 'Search articles' }"
    :items="[
      {
        key: 'ship-portfolio-two-commands-azion-cli',
        href: '/blog/ship-portfolio-two-commands-azion-cli',
        image: '/media/blog/ship-portfolio-two-commands.png',
        meta: 'Developers • SEP 25, 2026',
        title: 'How I Shipped My Portfolio in Just Two Commands',
        description:
          'See how a portfolio site went from template to live URL with just azion init and azion deploy.',
        authors: [{ name: 'Patrick Menoti' }],
        byline: 'Patrick Menoti · 9 min read',
        categories: ['Developers']
      },
      {
        key: 'how-to-reduce-ai-agent-latency',
        href: '/blog/how-to-reduce-ai-agent-latency',
        image: '/media/blog/reduce-ai-agent-latency.png',
        meta: 'Serverless • SEP 23, 2026',
        title: 'How Do You Reduce AI Agent Latency?',
        description:
          'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state.',
        authors: [{ name: 'Marilia Bafutto Costa' }],
        byline: 'Marilia Bafutto Costa · 8 min read',
        categories: ['Serverless']
      },
      {
        key: 'cloudflare-alternatives-and-competitors',
        href: '/blog/cloudflare-alternatives-and-competitors',
        image: '/media/blog/best-cloudflare-alternatives.png',
        meta: 'Security • SEP 22, 2026',
        title: 'Best Cloudflare Alternatives and Competitors',
        description:
          'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting.',
        authors: [{ name: 'Vitor Eltz' }],
        byline: 'Vitor Eltz · 13 min read',
        categories: ['Security']
      }
    ]"
  />
</template>
