<script setup>
  import ArticleIndexSection from '@aziontech/webkit/article-index-section'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
</script>

<template>
  <ArticleIndexSection
    anchor="posts"
    title="All articles"
    all-label="All articles"
    category-aria-label="Category"
    row-label="Read article"
    more-label="Load more"
    aria-label="Articles"
    :categories="['Developers', 'Security']"
    search-placeholder="Search articles"
    search-aria-label="Search articles"
    empty-title="No articles match these filters"
    empty-description="Try another category or a shorter search."
    empty-action-label="View all articles"
    :items="[
      {
        id: 'ship-a-site-in-two-commands',
        href: '/blog/ship-a-site-in-two-commands',
        image: placeholderImage,
        meta: 'Developers • SEP 25, 2026',
        title: 'Ship a Site in Two Commands',
        description: 'From a template to a live URL with one command to start and one to deploy.',
        authors: [{ name: 'Jane Doe' }],
        byline: 'Jane Doe · 9 min read',
        categories: ['Developers']
      }
    ]"
  />
</template>
