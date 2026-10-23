<script setup>
  // Blog — azion.com/en/blog translated with the /site-design-translate flow. Copy is the
  // source's listing payload, verbatim (see data/blog.js); the form is this Site's.
  //
  // Departures from the source, on purpose:
  //   • The source opens on its featured post as the h1. Ours opens straight on the highlight
  //     carousel: the featured post and the two newest.
  //   • The category tabs become one segmented control beside a compact search.
  //   • No author name or photo on any post.
  import Button from '@aziontech/webkit/button'
  import CardGrid from '@aziontech/webkit/card-grid'
  import EmptyState from '@aziontech/webkit/empty-state'
  import FrameBox from '@aziontech/webkit/frame-box'
  import InputText from '@aziontech/webkit/input-text'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import {
    BLOG_ALL,
    BLOG_CATEGORIES,
    BLOG_LABELS,
    BLOG_POSTS
  } from '../data/blog.js'
  import { blogArticle, blogPostLink } from '../data/blog-articles.js'
  import { COMPANY_CLOSING } from '../data/product-pages.js'
  import ArticleRows from '../ui/ArticleRows.vue'
  import ClosingCallToAction from '../ui/sections/ClosingCallToAction.vue'
  import BlogHighlight from './BlogHighlight.vue'
  import BlogPostCard from './BlogPostCard.vue'

  const props = defineProps({
    /** Post card style: `stacked` (image over copy) or `inset` (framed image, date first, arrow corner). */
    cards: { type: String, default: 'stacked' }
  })

  const postAuthors = (post) => blogArticle(post.key)?.authors ?? []
  const postByline = (post) =>
    [blogArticle(post.key)?.author, post.readTime].filter(Boolean).join(' · ')

  const PAGE_SIZE = 12

  const LABEL = {
    readArticle: 'Read article',
    category: 'Category',
    searchLabel: 'Search articles',
    notFound: 'No results found for these applied filters.',
    reset: 'View all articles'
  }

  const CATEGORY_OPTIONS = [
    { label: BLOG_ALL, value: BLOG_ALL },
    ...BLOG_CATEGORIES.map((category) => ({ label: category, value: category }))
  ]

  // An article's category crumb links here as `?category=<name>`: open on that category and
  // bring the filtered list into view.
  const route = useRoute()
  const requested = BLOG_CATEGORIES.includes(route.query.category) ? route.query.category : BLOG_ALL
  const selection = reactive({ category: requested, query: '' })
  onMounted(async () => {
    if (requested === BLOG_ALL) return
    await nextTick()
    globalThis.document?.getElementById('posts')?.scrollIntoView()
  })

  // The highlight carousel; the same articles lead the list.
  const HIGHLIGHT_KEYS = [
    'ship-portfolio-two-commands-azion-cli',
    'how-to-reduce-ai-agent-latency',
    'cloudflare-alternatives-and-competitors',
    'which-azion-plan-is-right-for-your-project'
  ]
  const HIGHLIGHT = HIGHLIGHT_KEYS.map((key) => BLOG_POSTS.find((post) => post.key === key))
  const ORDERED_POSTS = [
    ...HIGHLIGHT,
    ...BLOG_POSTS.filter((post) => !HIGHLIGHT_KEYS.includes(post.key))
  ]

  const filtered = computed(() => {
    const query = selection.query.trim().toLowerCase()
    return ORDERED_POSTS.filter(
      (post) =>
        (selection.category === BLOG_ALL || post.categories.includes(selection.category)) &&
        (!query || `${post.title} ${post.description}`.toLowerCase().includes(query))
    )
  })

  const shown = ref(PAGE_SIZE)
  const visible = computed(() => filtered.value.slice(0, shown.value))
  const hasMore = computed(() => shown.value < filtered.value.length)

  const rows = computed(() =>
    visible.value.map((post) => ({
      key: post.key,
      ...blogPostLink(post),
      image: post.image,
      meta: [post.categories?.[0], post.date].filter(Boolean).join(' • '),
      title: post.title,
      authors: postAuthors(post),
      byline: postByline(post)
    }))
  )

  watch(selection, () => {
    shown.value = PAGE_SIZE
  })

  function showAllArticles() {
    Object.assign(selection, { category: BLOG_ALL, query: '' })
  }
  const { section: _section, ...CLOSING } = COMPANY_CLOSING
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap size="small" />

    <SectionModule
      id="articles"
      :divided="false"
      :padded="false"
      class="scroll-mt-(--spacing-xxl)"
    >
      <!-- The highlight articles, as a carousel — one on
           top, the wall under it selects. Always shown: the filters below narrow only the grid. -->
      <FrameBox
        flush
        borders="y"
        marks="all"
      >
        <!-- From lg up, the gaps above and below and the highlight fill one viewport under the sticky nav. -->
        <BlogHighlight
          :posts="HIGHLIGHT"
          class="lg:h-[calc(100dvh-var(--banner-offset)-var(--spacing-xxl)*2-0.25rem)]"
        />
      </FrameBox>

      <!-- A short blank gap between the carousel and the all-articles section. -->
      <SectionGap size="small" />

      <!-- The all-articles section opens on its filters (the `#posts` anchor lands here,
           under the sticky bar): the categories as one segmented control, scrolling
           sideways when they outgrow the row, and a compact search beside it. They stack below
           `lg`. -->
      <FrameBox
        id="posts"
        flush
        borders="y"
        marks="none"
        class="scroll-mt-(--spacing-xxl)"
      >
        <div
          role="search"
          class="flex flex-col gap-(--spacing-md) px-(--spacing-xl) py-(--spacing-lg) lg:flex-row lg:items-center lg:justify-between"
        >
          <div class="min-w-0 overflow-x-auto">
            <SegmentedButton
              v-model="selection.category"
              :options="CATEGORY_OPTIONS"
              :aria-label="LABEL.category"
              size="medium"
            />
          </div>

          <div class="w-full shrink-0 lg:w-(--container-3xs)">
            <InputText
              v-model="selection.query"
              size="medium"
              type="text"
              :placeholder="BLOG_LABELS.search"
              :aria-label="LABEL.searchLabel"
            >
              <template #iconLeft>
                <i class="pi pi-search text-(--text-muted)" />
              </template>
            </InputText>
          </div>
        </div>
      </FrameBox>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <!-- The default index is the shared ruled rows; the inset variant keeps its cards. -->
        <ArticleRows
          v-if="visible.length > 0 && props.cards !== 'inset'"
          :items="rows"
          :row-label="LABEL.readArticle"
        />

        <CardGrid
          v-else-if="visible.length > 0"
          flush
          kind="frame"
          :columns="3"
          :mobile-columns="1"
          aria-label="Articles"
        >
          <CardGrid.Cell
            v-for="post in visible"
            :key="post.key"
            kind="canvas"
            :padded="false"
          >
            <BlogPostCard
              :post="post"
              :kind="props.cards"
            />
          </CardGrid.Cell>
        </CardGrid>

        <EmptyState
          v-else
          :title="LABEL.notFound"
          icon="pi pi-search"
          class="p-(--spacing-xxl)"
        >
          <template #actions>
            <Button
              :label="LABEL.reset"
              kind="secondary"
              size="large"
              @click="showAllArticles"
            />
          </template>
        </EmptyState>
      </FrameBox>

      <FrameBox
        key="load-more"
        v-if="hasMore"
        flush
        borders="y"
        marks="bottom"
      >
        <div class="flex justify-center p-(--spacing-xl)">
          <Button
            :label="BLOG_LABELS.loadMore"
            kind="outlined"
            size="large"
            @click="shown += PAGE_SIZE"
          />
        </div>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <ClosingCallToAction v-bind="CLOSING" />
  </SectionContainer>
</template>
