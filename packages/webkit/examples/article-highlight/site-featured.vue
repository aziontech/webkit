<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import ArticleHighlight from '@aziontech/webkit/article-highlight'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'

  const items = [
    {
      key: 'ship-portfolio-two-commands-azion-cli',
      href: '/blog/ship-portfolio-two-commands-azion-cli',
      image: placeholderImage,
      highlightImage: placeholderImage,
      meta: 'Developers • SEP 25, 2026',
      title: 'How I Shipped My Portfolio in Just Two Commands',
      description:
        "See how a portfolio site went from template to live URL with just azion init and azion deploy, running free on Azion's Hobby plan.",
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
        'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state with distributed architecture, caching, and observability.',
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
        'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting. Assess trade-offs, operating costs, and migration paths with Azion.',
      readTime: '13 min read'
    },
    {
      key: 'which-azion-plan-is-right-for-your-project',
      href: '/blog/which-azion-plan-is-right-for-your-project',
      image: placeholderImage,
      highlightImage: placeholderImage,
      meta: 'Company news • SEP 22, 2026',
      title: 'Which Azion Plan Is Right for Your Project?',
      description:
        'Compare Azion’s Hobby, Pro, and Enterprise plans for personal projects, production applications, and operations that need customized terms.',
      readTime: '7 min read'
    },
    {
      key: 'how-to-structure-an-ai-saas-with-security',
      href: '/blog/how-to-structure-an-ai-saas-with-security',
      image: placeholderImage,
      highlightImage: placeholderImage,
      meta: 'Security • SEP 18, 2026',
      title: 'How to Structure an AI SaaS with Security on Azion',
      description:
        'Combine your application, database, AI inference and security on Azion, with Firewall and WAF policies versioned alongside the code.',
      readTime: '10 min read'
    }
  ]
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <ArticleHighlight
      anchor="articles"
      :items="items"
      action-label="Read article"
      aria-label="Highlight articles"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
