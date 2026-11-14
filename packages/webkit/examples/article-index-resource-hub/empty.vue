<script setup>
  import ArticleIndexResourceHub from '@aziontech/webkit/article-index-resource-hub'
  import netshoesExtendedReversed from '@aziontech/webkit/assets/netshoes-extended-reversed.svg'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
</script>

<template>
  <ArticleIndexResourceHub
    anchor="resources"
    title="Explore all resources"
    row-label="Read article"
    more-label="Load more"
    aria-label="Resources"
    :empty="{
      title: 'No resources match these filters',
      description: 'Try another content type or industry.',
      action: 'View all resources'
    }"
    :facets="[
      {
        key: 'contentType',
        label: 'Content type',
        allLabel: 'All content types',
        options: ['E-books', 'Blog']
      },
      {
        key: 'industry',
        label: 'Industry',
        allLabel: 'All industries',
        options: ['Retail', 'Tech']
      }
    ]"
    :items="[
      {
        key: 'storefront-performance',
        href: '/resources/storefront-performance',
        image: placeholderImage,
        meta: 'E-books • OCT 15, 2026',
        title: 'Storefront Performance for Retail Teams',
        description: 'Cut page weight and keep checkout fast during peak traffic.',
        facets: { contentType: ['E-books'], industry: ['Retail'] }
      },
      {
        key: 'netshoes-blocks-threats',
        href: 'https://example.com/stories/netshoes',
        mark: { name: 'Netshoes', logo: netshoesExtendedReversed },
        meta: 'Blog • OCT 3, 2026',
        title: 'Netshoes Blocks Threats on Its Storefront',
        description: 'How a retail team kept checkout fast while blocking attacks.',
        facets: { contentType: ['Blog'], industry: ['Retail'] },
        external: true
      }
    ]"
  />
</template>
