<script setup>
  // Blog — azion.com/en/blog translated with the /site-design-translate flow. Copy is the
  // source's listing payload, verbatim (see data/blog.js); the form is this Site's.
  //
  // Departures from the source, on purpose:
  //   • The source opens on its featured post as the h1. Ours opens on a band hero titled with
  //     the page's own name (`Blog`, its document title and nav label, with the nav's
  //     description); under the filters, the highlight carousel shows the featured post and
  //     the four newest.
  //   • The category tabs become one segmented control beside a compact search.
  //   • No author name or photo on any post.
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import CardGrid from '@aziontech/webkit/card-grid'
  import EmptyState from '@aziontech/webkit/empty-state'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
  import { RouterLink, useRoute } from 'vue-router'

  import {
    BLOG_ALL,
    BLOG_CATEGORIES,
    BLOG_FEATURED,
    BLOG_LABELS,
    BLOG_POSTS
  } from '../data/blog.js'
  import { blogArticle, blogPostLink } from '../data/blog-articles.js'
  import BlogClosingCta from './BlogClosingCta.vue'
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

  const filtering = computed(
    () => selection.category !== BLOG_ALL || selection.query.trim().length > 0
  )

  // The highlight carousel: the featured post and the four newest; the grid skips those four
  // while unfiltered.
  const LEAD_SIDE = BLOG_POSTS.slice(0, 4)
  const HIGHLIGHT = [BLOG_FEATURED, ...LEAD_SIDE]

  const filtered = computed(() => {
    const query = selection.query.trim().toLowerCase()
    return (filtering.value ? BLOG_POSTS : BLOG_POSTS.slice(LEAD_SIDE.length)).filter(
      (post) =>
        (selection.category === BLOG_ALL || post.categories.includes(selection.category)) &&
        (!query || `${post.title} ${post.description}`.toLowerCase().includes(query))
    )
  })

  const shown = ref(PAGE_SIZE)
  const visible = computed(() => filtered.value.slice(0, shown.value))
  const hasMore = computed(() => shown.value < filtered.value.length)

  watch(selection, () => {
    shown.value = PAGE_SIZE
  })

  function showAllArticles() {
    Object.assign(selection, { category: BLOG_ALL, query: '' })
  }
</script>

<template>
  <Hero
    kind="band"
    max-width="site"
    class="[--banner-offset:3.5rem]"
  >
    <Hero.Title
      centered
      eyebrow="Resources"
      title="Blog"
      description="Insights, industry trends"
    >
      <template #actions>
        <Button
          label="See posts"
          kind="secondary"
          size="large"
          href="#posts"
        />
      </template>
    </Hero.Title>
  </Hero>

  <SectionContainer max-width="site">
    <SectionModule
      id="articles"
      :divided="false"
      :padded="false"
      class="scroll-mt-(--spacing-xxl)"
    >
      <!-- The highlight articles: the featured post and the four newest, as a carousel — one on
           top, the wall under it selects. Always shown: the filters below narrow only the grid. -->
      <FrameBox
        flush
        borders="y"
        marks="all"
      >
        <BlogHighlight :posts="HIGHLIGHT" />
      </FrameBox>

      <!-- The page's standard hatched gap between the carousel and the all-articles section. -->
      <SectionGap hatch />

      <!-- The all-articles section opens on its filters (the hero's "See posts" link lands
           here, under the sticky bar): the categories as one segmented control, scrolling
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
        <!-- The default index is a ruled list of rows. The whole row is the link and the hover;
             the inset variant keeps its cards. -->
        <Item.List
          v-if="visible.length > 0 && props.cards !== 'inset'"
          aria-label="Articles"
        >
          <Item
            v-for="post in visible"
            :key="post.key"
            class="group/row relative px-(--spacing-xl)! py-(--spacing-lg)! transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) motion-reduce:transition-none"
          >
            <!-- One stacked column: category and date, the title, then the writers' photos with
                 their names and the read time. The logo wall's label and arrow sit at the row's end:
                 hidden at rest, it rises into place on hover or keyboard focus. -->
            <Item.Content class="min-w-0 gap-(--spacing-sm)">
              <span class="text-body-sm text-(--text-muted)">
                <template v-if="post.categories?.[0]">{{ post.categories[0] }} · </template
                >{{ post.date }}
              </span>
              <Item.Title>
                <RouterLink
                  :to="blogPostLink(post).href"
                  class="text-pretty text-heading-sm text-(--text-default) after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                >
                  {{ post.title }}
                </RouterLink>
              </Item.Title>
              <span class="flex items-center gap-(--spacing-sm) text-body-sm text-(--text-muted)">
                <span
                  v-if="postAuthors(post).length"
                  class="flex shrink-0 -space-x-(--spacing-xs)"
                >
                  <Avatar
                    v-for="person in postAuthors(post)"
                    :key="person.name"
                    kind="circle"
                    size="small"
                    :src="person.avatar || undefined"
                    :label="person.avatar ? undefined : person.name"
                    :alt="person.name"
                    class="ring-2 ring-(--bg-canvas)"
                  />
                </span>
                <span>{{ postByline(post) }}</span>
              </span>
            </Item.Content>
            <Item.Actions class="max-sm:hidden">
              <span
                aria-hidden="true"
                class="flex translate-y-1 items-center gap-(--spacing-xxs) whitespace-nowrap text-overline-md text-(--text-default) uppercase opacity-0 transition-[opacity,translate] duration-moderate-01 ease-productive-entrance group-hover/row:translate-y-0 group-hover/row:opacity-100 group-has-[a:focus-visible]/row:translate-y-0 group-has-[a:focus-visible]/row:opacity-100 motion-reduce:transition-none"
              >
                {{ LABEL.readArticle }}
                <i class="pi pi-arrow-up-right leading-none" />
              </span>
            </Item.Actions>
          </Item>
        </Item.List>

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

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <BlogClosingCta />
    </SectionModule>

    <SectionGap hatch />
  </SectionContainer>
</template>
