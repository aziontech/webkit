<script setup>
  import ArticleIndexResourceHub from '@aziontech/webkit/article-index-resource-hub'
</script>

<template>
  <ArticleIndexResourceHub
    anchor="resources"
    title="Explore all resources"
    row-label="Read article"
    more-label="Load more"
    aria-label="Resources"
    :facets="[
      {
        key: 'contentType',
        label: 'Content type',
        allLabel: 'All content types',
        options: ['E-books', 'Blog', 'Comparisons']
      },
      {
        key: 'industry',
        label: 'Industry',
        allLabel: 'All industries',
        options: ['Financial', 'Retail', 'Tech']
      }
    ]"
    :items="[
      {
        key: 'security-applications-apis-ai-agents',
        href: 'https://www.azion.com/en/lp/security-applications-apis-ai-agents/',
        image: 'https://www.azion.com/assets/content/blog/uploads/Rich%20contentsdark.png',
        meta: 'E-books • OCT 15, 2026',
        title: 'Security for applications, APIs, and AI agents',
        description:
          'Learn how to bring security policies into deployment, automate protection, and monitor traffic.',
        facets: { contentType: ['E-books'] }
      },
      {
        key: 'azion-mcp-servers-generally-available',
        href: 'https://www.azion.com/en/blog/azion-mcp-servers-generally-available/',
        image: 'https://www.azion.com/assets/content/blog/uploads/mcp-ga/Azion-MCP.svg',
        meta: 'Blog • OCT 14, 2026',
        title: 'Azion MCP servers: Connect Your Coding Agent to Azion',
        description: 'Azion MCP servers connect coding agents to the Azion documentation and API.',
        facets: { contentType: ['Blog'] }
      },
      {
        key: 'cloudflare-to-azion-alternative-guide',
        href: 'https://www.azion.com/en/lp/cloudflare-to-azion-alternative-guide/',
        image: 'https://www.azion.com/assets/content/lp/uploads/og-image/og-img-cf-to-azion.png',
        meta: 'Comparisons • OCT 3, 2026',
        title: 'Cloudflare Alternative Comparison: Azion vs Cloudflare',
        description: 'Azion vs Cloudflare: the same platform on every plan.',
        facets: { contentType: ['Comparisons'] }
      }
    ]"
  />
</template>
