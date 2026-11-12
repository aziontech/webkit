<script setup>
  import ArticleHighlight from '@aziontech/webkit/article-highlight'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
</script>

<template>
  <ArticleHighlight
    anchor="articles"
    action-label="Read article"
    aria-label="Highlight articles"
    :items="[
      {
        key: 'ship-portfolio-two-commands-azion-cli',
        href: '/blog/ship-portfolio-two-commands-azion-cli',
        image: placeholderImage,
        highlightImage: placeholderImage,
        meta: 'Developers • SEP 25, 2026',
        title: 'How I Shipped My Portfolio in Just Two Commands',
        description:
          'See how a portfolio site went from template to live URL with just azion init and azion deploy.',
        readTime: '9 min read'
      },
      {
        key: 'how-to-reduce-ai-agent-latency',
        href: '/blog/how-to-reduce-ai-agent-latency',
        image: placeholderImage,
        highlightImage: placeholderImage,
        meta: 'Serverless • SEP 23, 2026',
        title: 'How Do You Reduce AI Agent Latency?',
        description:
          'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state.',
        readTime: '8 min read'
      },
      {
        key: 'cloudflare-alternatives-and-competitors',
        href: '/blog/cloudflare-alternatives-and-competitors',
        image: placeholderImage,
        highlightImage: placeholderImage,
        meta: 'Security • SEP 22, 2026',
        title: 'Best Cloudflare Alternatives and Competitors',
        description:
          'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting.',
        readTime: '13 min read'
      },
      {
        key: 'which-azion-plan-is-right-for-your-project',
        href: '/blog/which-azion-plan-is-right-for-your-project',
        image: placeholderImage,
        highlightImage: placeholderImage,
        meta: 'Company news • SEP 22, 2026',
        title: 'Which Azion Plan Is Right for Your Project?',
        description: 'Compare Azion’s Hobby, Pro, and Enterprise plans.',
        readTime: '7 min read'
      }
    ]"
  />
</template>
