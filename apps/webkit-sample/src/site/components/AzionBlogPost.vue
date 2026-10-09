<script setup>
  // Blog article — every azion.com/en/blog/<slug> translated with the /site-design-translate flow.
  // The body is the source's article, verbatim, as markdown (content/blog/<slug>.md), rendered
  // on the Site's shared ArticlePage layout (the brand banner, breadcrumb, byline, the share /
  // community / Copy page rail and the outline). The byline shows each author's photo and name.
  // Related articles reuse the index's post card, three across.
  import CardGrid from '@aziontech/webkit/card-grid'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import { computed, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import { BLOG_FEATURED } from '../data/blog.js'
  import { blogArticle, blogRelated, loadBlogBody } from '../data/blog-articles.js'
  import ArticlePage from './ArticlePage.vue'
  import BlogClosingCta from './BlogClosingCta.vue'
  import BlogPostCard from './BlogPostCard.vue'

  const route = useRoute()

  // Every way in is a link from our own index, so an unknown slug is a hand-typed URL; it
  // falls back to the first rebuilt article rather than rendering a page with no subject.
  const article = computed(
    () => blogArticle(String(route.params.slug)) ?? blogArticle(BLOG_FEATURED.key)
  )

  const source = ref('')
  watch(
    () => article.value.key,
    async (key) => {
      source.value = ''
      const markdown = await loadBlogBody(key)
      if (key === article.value.key) source.value = markdown
    },
    { immediate: true }
  )
  const related = computed(() => blogRelated(article.value))

  // Blog › Category › Article. The category crumb opens the index filtered to it; a post the
  // source lists without a category goes straight from Blog to the article.
  const trail = computed(() => [
    { label: 'Blog', href: '/site/blog' },
    ...(article.value.categories?.[0]
      ? [
          {
            label: article.value.categories[0],
            href: `/site/blog?category=${encodeURIComponent(article.value.categories[0])}`
          }
        ]
      : []),
    { label: article.value.title, current: true }
  ])
</script>

<template>
  <ArticlePage
    :article="article"
    :trail="trail"
    :source="source"
    feed
  >
    <SectionGap hatch />

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          kind="left"
          title="Related Articles"
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="all"
      >
        <CardGrid
          flush
          kind="frame"
          :columns="3"
          :mobile-columns="1"
          aria-label="Related articles"
        >
          <CardGrid.Cell
            v-for="post in related"
            :key="post.key"
            kind="canvas"
            :padded="false"
          >
            <BlogPostCard :post="post" />
          </CardGrid.Cell>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <BlogClosingCta />
    </SectionModule>

    <SectionGap hatch />
  </ArticlePage>
</template>
