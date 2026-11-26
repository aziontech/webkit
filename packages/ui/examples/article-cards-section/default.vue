<script setup>
  import ArticleCardsSection from '@aziontech/ui/article-cards-section'
  import placeholderImage from '@aziontech/ui/assets/placeholder-image.svg'
</script>

<template>
  <ArticleCardsSection
    align="start"
    title="Related articles"
    aria-label="Related articles"
    :items="[
      {
        id: 'how-to-reduce-ai-agent-latency',
        href: '/blog/how-to-reduce-ai-agent-latency',
        title: 'How do you reduce AI agent latency?',
        description:
          'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state with distributed architecture, caching, and observability.',
        meta: 'SEP 23, 2026 • 8 min read',
        image: placeholderImage
      },
      {
        id: 'cloudflare-alternatives-and-competitors',
        href: '/blog/cloudflare-alternatives-and-competitors',
        title: 'Best Cloudflare alternatives and competitors',
        description:
          'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting. Assess trade-offs, operating costs, and migration paths with Azion.',
        meta: 'SEP 22, 2026 • 13 min read',
        image: placeholderImage
      },
      {
        id: 'which-azion-plan-is-right-for-your-project',
        href: '/blog/which-azion-plan-is-right-for-your-project',
        title: 'Which Azion plan is right for your project?',
        description:
          'Compare Azion’s Hobby, Pro, and Enterprise plans for personal projects, production applications, and operations that need customized terms.',
        meta: 'SEP 22, 2026 • 7 min read',
        image: placeholderImage
      }
    ]"
  />
</template>
