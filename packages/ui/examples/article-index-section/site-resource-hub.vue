<script setup>
  import ArticleIndexSection from '@aziontech/webkit/article-index-section'
  import Container from '@aziontech/webkit/container'
  import Spacer from '@aziontech/webkit/spacer'

  const items = [
    {
      id: 'security-applications-apis-ai-agents',
      href: 'https://www.azion.com/en/lp/security-applications-apis-ai-agents/',
      image: 'https://www.azion.com/assets/content/blog/uploads/Rich%20contentsdark.png',
      meta: 'E-books • OCT 15, 2026',
      title: 'Security for applications, APIs, and AI agents',
      description:
        'Learn how to bring security policies into deployment, automate protection, and monitor traffic across applications, APIs, and AI agents.',
      facets: {
        contentType: ['E-books']
      }
    },
    {
      id: 'azion-mcp-servers-generally-available',
      href: 'https://www.azion.com/en/blog/azion-mcp-servers-generally-available/',
      image: 'https://www.azion.com/assets/content/blog/uploads/mcp-ga/Azion-MCP.svg',
      meta: 'Blog • OCT 14, 2026',
      title: 'Azion MCP servers: Connect Your Coding Agent to Azion',
      description:
        'Azion MCP servers connect Claude Code, Cursor, and other coding agents to the Azion documentation and API, with a dry_run preview before each write.',
      facets: {
        contentType: ['Blog']
      }
    },
    {
      id: 'cloudflare-to-azion-alternative-guide',
      href: 'https://www.azion.com/en/lp/cloudflare-to-azion-alternative-guide/',
      image: 'https://www.azion.com/assets/content/lp/uploads/og-image/og-img-cf-to-azion.png',
      meta: 'Comparisons • OCT 3, 2026',
      title: 'Cloudflare Alternative Comparison: Azion vs Cloudflare',
      description:
        'Azion vs Cloudflare: the same platform on every plan, more than one way to recover from failures, and Enterprise support that answers in minutes.',
      facets: {
        contentType: ['Comparisons']
      }
    },
    {
      id: 'f5-to-azion-alternative-guide',
      href: 'https://www.azion.com/en/lp/f5-to-azion-alternative-guide/',
      image: 'https://www.azion.com/assets/content/lp/uploads/og-image/og-img-f5-to-azion.png',
      meta: 'Comparisons • OCT 3, 2026',
      title: 'F5 Alternative Comparison: Azion vs F5',
      description:
        'Azion vs F5: one managed platform for every application. No appliances, no licensing matrix, and a path off BIG-IP one app at a time.',
      facets: {
        contentType: ['Comparisons']
      }
    }
  ]

  const facets = [
    {
      id: 'contentType',
      label: 'Content type',
      allLabel: 'All content types',
      options: ['E-books', 'Blog', 'Comparisons', 'Success stories']
    },
    {
      id: 'category',
      label: 'Category',
      allLabel: 'All categories',
      options: [
        'Developers',
        'Security',
        'Company news',
        'Market trends',
        'Routing',
        'Serverless',
        'Caching',
        'Orchestration',
        'Observability',
        'Routing and networking'
      ]
    },
    {
      id: 'industry',
      label: 'Industry',
      allLabel: 'All industries',
      options: ['Financial', 'Fintech', 'EdTech', 'Retail', 'Tech', 'Education', 'Media']
    }
  ]
</script>

<template>
  <Container max-width="site">
    <Spacer hatch />

    <ArticleIndexSection
      filters="facets"
      anchor="resources"
      title="Explore all resources"
      :items="items"
      :facets="facets"
      row-label="Read article"
      more-label="Load more"
      empty-title="No resources match these filters"
      empty-description="Try another content type or industry."
      empty-action-label="View all resources"
      aria-label="Resources"
    />

    <Spacer hatch />
  </Container>
</template>
