<script setup>
  // Success story — every azion.com/en/success-case/<slug> translated with the
  // /site-design-translate flow and rendered on the blog article's own layout (ArticlePage), so
  // a story and a blog post read as the same page. The body is the source's, verbatim, as
  // markdown (content/success-cases/<slug>.md).
  //
  // Departures from the source, on purpose:
  //   • The source has no banner, breadcrumb or rails; the blog's are used so the two match.
  //     The share row drops the blog's RSS action, since stories have no feed.
  //   • The source closes on the body. Like the blog, ours adds three related stories (same
  //     industry first, in library order) and the library's own closing CTA.
  import CardGrid from '@aziontech/webkit/card-grid'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import { computed, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import {
    loadSuccessCaseBody,
    successCaseArticle,
    successCaseRelated
  } from '../data/success-case-articles.js'
  import ArticlePage from './ArticlePage.vue'
  import SuccessCaseClosingCta from './SuccessCaseClosingCta.vue'
  import SuccessCasePostCard from './SuccessCasePostCard.vue'

  const route = useRoute()

  // Every way in is a link from our own library, so an unknown slug is a hand-typed URL; it
  // falls back to the first featured story rather than rendering a page with no subject.
  const article = computed(
    () => successCaseArticle(String(route.params.slug)) ?? successCaseArticle('magalu')
  )

  const source = ref('')
  watch(
    () => article.value.slug,
    async (slug) => {
      source.value = ''
      const markdown = await loadSuccessCaseBody(slug)
      if (slug === article.value.slug) source.value = markdown
    },
    { immediate: true }
  )
  const related = computed(() => successCaseRelated(article.value))

  // Success cases › Industry › Story. The industry crumb opens the library filtered to it.
  const trail = computed(() => [
    { label: 'Success cases', href: '/site/success-cases' },
    {
      label: article.value.industry,
      href: `/site/success-cases?industry=${encodeURIComponent(article.value.industry)}`
    },
    { label: article.value.title, current: true }
  ])
</script>

<template>
  <ArticlePage
    :article="article"
    :trail="trail"
    :source="source"
  >
    <SectionGap hatch />

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          kind="left"
          title="Related Success Cases"
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
          aria-label="Related success cases"
        >
          <CardGrid.Cell
            v-for="story in related"
            :key="story.key"
            kind="canvas"
            :padded="false"
          >
            <SuccessCasePostCard :story="story" />
          </CardGrid.Cell>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <SuccessCaseClosingCta />
    </SectionModule>

    <SectionGap hatch />
  </ArticlePage>
</template>
