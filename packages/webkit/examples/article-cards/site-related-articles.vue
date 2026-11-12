<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import ArticleCards from '@aziontech/webkit/article-cards'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'

  const items = [
    {
      key: 'how-to-reduce-ai-agent-latency',
      href: '/blog/how-to-reduce-ai-agent-latency',
      title: 'How Do You Reduce AI Agent Latency?',
      description:
        'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state with distributed architecture, caching, and observability.',
      meta: 'SEP 23, 2026 • 8 min read',
      image: placeholderImage
    },
    {
      key: 'cloudflare-alternatives-and-competitors',
      href: '/blog/cloudflare-alternatives-and-competitors',
      title: 'Best Cloudflare Alternatives and Competitors',
      description:
        'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting. Assess trade-offs, operating costs, and migration paths with Azion.',
      meta: 'SEP 22, 2026 • 13 min read',
      image: placeholderImage
    },
    {
      key: 'which-azion-plan-is-right-for-your-project',
      href: '/blog/which-azion-plan-is-right-for-your-project',
      title: 'Which Azion Plan Is Right for Your Project?',
      description:
        'Compare Azion’s Hobby, Pro, and Enterprise plans for personal projects, production applications, and operations that need customized terms.',
      meta: 'SEP 22, 2026 • 7 min read',
      image: placeholderImage
    }
  ]
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <ArticleCards
      kind="left"
      title="Related Articles"
      :items="items"
      aria-label="Related Articles"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
