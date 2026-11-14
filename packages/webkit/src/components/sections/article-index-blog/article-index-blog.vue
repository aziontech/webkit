<script setup lang="ts">
  import { computed, nextTick, onMounted, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'
  import ToggleGroup from '../../actions/toggle-group/toggle-group.vue'
  import Avatar from '../../content/avatar/avatar.vue'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Input from '../../inputs/input/input.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'

  defineOptions({
    name: 'ArticleIndexBlog',
    inheritAttrs: false
  })

  /** One writer of an article, drawn as an avatar beside the byline. */
  export type ArticleIndexBlogAuthor = {
    /** The writer's name, the avatar's initials and alternative text. */
    name: string
    /** URL of the writer's photo; without one the avatar shows the initials. */
    avatar?: string
  }

  /** The client mark drawn in the cover cell of a row that has no cover. */
  export type ArticleIndexBlogMark = {
    /** The client's name, the mark's alternative text. */
    name: string
    /** URL of the client's logo, drawn in one ink that follows the theme. */
    logo: string
  }

  /** One article, rendered as a linked row. */
  export type ArticleIndexBlogItem = {
    /** Stable identity of the article within the list. */
    key: string
    /** Destination of the article. */
    href: string
    /** URL of the cover drawn at the start of the row. */
    image?: string
    /** Client mark drawn in the cover cell when there is no cover. */
    mark?: ArticleIndexBlogMark
    /** Overline, usually the category and the date. */
    meta: string
    /** Headline of the article, naming the row link. */
    title: string
    /** Deck under the headline, clamped to two lines. */
    description?: string
    /** The writers drawn beside the byline. */
    authors?: ArticleIndexBlogAuthor[]
    /** Byline pinned to the foot of the row, usually the writers and the read time. */
    byline?: string
    /** The categories the article is filed under. */
    categories?: string[]
    /** Opens the destination in a new tab. */
    external?: boolean
  }

  /** The search field. */
  export type ArticleIndexBlogSearch = {
    /** Placeholder of the field. */
    placeholder: string
    /** Accessible name of the field. */
    label: string
  }

  /** The state rendered when nothing matches. */
  export type ArticleIndexBlogEmpty = {
    /** Headline of the empty state. */
    title: string
    /** Sentence under the headline. */
    description?: string
    /** Label of the button that clears every filter. */
    action?: string
  }

  /** Row layout: byline pins the writers to the foot of the copy, centered centres the copy. */
  export type ArticleIndexBlogRowKind = 'byline' | 'centered'

  interface Props {
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Headline beside the controls, rendered as the band's `h2`; it also names the band. */
    title?: string
    /** The articles, newest first; each is `{ key, href, image?, mark?, meta, title, description?, authors?, byline?, categories?, external? }`. */
    items?: ArticleIndexBlogItem[]
    /** Segments of the category picker after the show-all segment; the picker is omitted when empty. */
    categories?: string[]
    /** Label of the first segment, which shows every category. */
    allLabel?: string
    /** Accessible name of the category picker. */
    categoryLabel?: string
    /** The search field's `placeholder` and accessible `label`; the field is omitted when absent. */
    search?: ArticleIndexBlogSearch
    /** Read cue revealed at the end of a row under hover or focus. */
    rowLabel?: string
    /** Label of the load-more button under the list; without it every match is listed and no button renders. */
    moreLabel?: string
    /** Rows listed per page when `moreLabel` is set; the load-more button reveals the next page. */
    pageSize?: number
    /** Leading articles left out until a filter applies, because a band above already shows them. */
    leading?: number
    /** Copy of the state when nothing matches: `{ title, description?, action? }`; `action` labels a button that clears every filter. */
    empty?: ArticleIndexBlogEmpty
    /** Row layout: `byline` pins the writers to the foot of the copy, `centered` centres the copy. */
    rowKind?: ArticleIndexBlogRowKind
    /** Name of a URL query parameter that preselects a category on load and scrolls the band into view; off when empty. */
    categoryParam?: string
    /** Accessible name of the list of articles. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    title: '',
    items: () => [],
    categories: () => [],
    allLabel: '',
    categoryLabel: '',
    search: undefined,
    rowLabel: '',
    moreLabel: '',
    pageSize: 12,
    leading: 0,
    empty: undefined,
    rowKind: 'byline',
    categoryParam: '',
    ariaLabel: ''
  })

  const attrs = useAttrs()

  const { t } = useTranslate({ articleIndex: en.articleIndex })

  const root = ref<HTMLElement | null>(null)

  const category = ref<string | undefined>(props.allLabel)

  const query = ref('')

  const pages = ref(1)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-article-index-blog'
  )

  const options = computed(() => [
    { label: props.allLabel, value: props.allLabel },
    ...props.categories.map((label) => ({ label, value: label }))
  ])

  const filtering = computed(
    () => (category.value ?? props.allLabel) !== props.allLabel || query.value.trim().length > 0
  )

  const matches = computed(() => {
    const term = query.value.trim().toLowerCase()
    const picked = category.value ?? props.allLabel
    const pool = filtering.value ? props.items : props.items.slice(props.leading)
    return pool.filter((item) => {
      if (picked !== props.allLabel && !(item.categories ?? []).includes(picked)) return false
      if (!term) return true
      return (
        item.title.toLowerCase().includes(term) ||
        (item.description ?? '').toLowerCase().includes(term)
      )
    })
  })

  const paged = computed(() => props.moreLabel.length > 0 && props.pageSize > 0)

  const visible = computed(() =>
    paged.value ? matches.value.slice(0, pages.value * props.pageSize) : matches.value
  )

  const hasMore = computed(() => paged.value && visible.value.length < matches.value.length)

  watch([category, query], () => {
    pages.value = 1
  })

  onMounted(async () => {
    if (!props.categoryParam) return
    const requested = new URLSearchParams(window.location.search).get(props.categoryParam)
    if (!requested || !props.categories.includes(requested)) return
    category.value = requested
    await nextTick()
    root.value?.scrollIntoView()
  })

  const clearFilters = (): void => {
    category.value = props.allLabel
    query.value = ''
  }
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    ref="root"
    :data-testid="testId"
    :aria-label="title || undefined"
    class="scroll-mt-(--spacing-xxl)"
  >
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        key="rows"
        v-if="title || categories.length > 0 || search"
        flush
        borders="y"
        marks="none"
      >
        <div
          role="search"
          class="flex flex-col gap-(--spacing-md) px-(--spacing-xl) py-(--spacing-lg) lg:flex-row lg:items-center lg:justify-between"
        >
          <h2
            v-if="title"
            class="m-0 text-heading-md text-(--text-default)"
          >
            {{ title }}
          </h2>

          <div
            v-if="categories.length > 0"
            class="min-w-0 overflow-x-auto"
          >
            <ToggleGroup
              v-model="category"
              :options="options"
              :aria-label="categoryLabel || undefined"
              size="medium"
              class="w-max max-w-none"
            />
          </div>

          <div
            v-if="search"
            class="w-full shrink-0 lg:w-(--container-3xs)"
          >
            <Input
              v-model="query"
              size="medium"
              type="text"
              :placeholder="search.placeholder"
              :aria-label="search.label"
            >
              <template #iconLeft>
                <i class="pi pi-search text-(--text-muted)" />
              </template>
            </Input>
          </div>
        </div>
      </FrameBox>

      <template v-if="visible.length > 0">
        <FrameBox
          flush
          borders="y"
          marks="bottom"
        >
          <ul
            :aria-label="ariaLabel || undefined"
            :data-kind="rowKind"
            class="group/rows m-0 flex list-none flex-col p-0"
          >
            <li
              v-for="(item, index) in visible"
              :key="item.key"
            >
              <div
                v-if="index > 0"
                aria-hidden="true"
                class="h-(--spacing-lg) border-y border-(--border-default)"
              />
              <article
                class="group/row relative grid transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) motion-reduce:transition-none lg:grid-cols-[minmax(0,2fr)_minmax(0,5fr)]"
              >
                <div
                  class="flex aspect-40/21 items-center justify-center overflow-hidden border-b border-(--border-default) bg-(--bg-surface) lg:border-e lg:border-b-0"
                >
                  <img
                    v-if="item.image"
                    :src="item.image"
                    alt=""
                    loading="lazy"
                    class="size-full object-cover"
                  />
                  <img
                    v-else-if="item.mark"
                    :src="item.mark.logo"
                    :alt="item.mark.name"
                    loading="lazy"
                    class="h-8 w-auto max-w-40 object-contain brightness-0 [[data-theme=dark]_&]:invert"
                  />
                </div>
                <div class="flex min-w-0 gap-(--spacing-lg) px-(--spacing-xl) py-(--spacing-lg)">
                  <div
                    class="flex min-w-0 flex-1 flex-col justify-between gap-(--spacing-sm) group-data-[kind=centered]/rows:justify-center"
                  >
                    <div class="flex flex-col gap-(--spacing-sm)">
                      <span class="text-overline-sm text-(--text-muted)">{{ item.meta }}</span>
                      <h3 class="m-0">
                        <a
                          :href="item.href"
                          :target="item.external ? '_blank' : undefined"
                          :rel="item.external ? 'noopener' : undefined"
                          class="text-pretty text-heading-sm text-(--text-default) no-underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-(--ring-color)"
                        >
                          {{ item.title }}
                          <span
                            v-if="item.external"
                            class="sr-only"
                            >{{ t('articleIndex.newTab') }}</span
                          >
                        </a>
                      </h3>
                      <p
                        v-if="item.description"
                        class="m-0 line-clamp-2 text-pretty text-body-sm text-(--text-muted)"
                      >
                        {{ item.description }}
                      </p>
                    </div>
                    <span
                      v-if="item.byline || item.authors?.length"
                      class="flex items-center gap-(--spacing-sm) text-body-sm text-(--text-muted)"
                    >
                      <span
                        v-if="item.authors?.length"
                        class="flex shrink-0 -space-x-(--spacing-xs)"
                      >
                        <Avatar
                          v-for="author in item.authors ?? []"
                          :key="author.name"
                          kind="circle"
                          size="small"
                          :src="author.avatar || undefined"
                          :label="author.avatar ? undefined : author.name"
                          :alt="author.name"
                          class="ring-2 ring-(--bg-canvas)"
                        />
                      </span>
                      <span v-if="item.byline">{{ item.byline }}</span>
                    </span>
                  </div>
                  <span
                    v-if="rowLabel"
                    aria-hidden="true"
                    class="flex shrink-0 translate-y-1 items-center self-center gap-(--spacing-xxs) whitespace-nowrap text-overline-md text-(--text-default) uppercase opacity-0 transition-[opacity,translate] duration-moderate-01 ease-productive-entrance group-hover/row:translate-y-0 group-hover/row:opacity-100 group-has-[a:focus-visible]/row:translate-y-0 group-has-[a:focus-visible]/row:opacity-100 motion-reduce:transition-none max-lg:hidden"
                  >
                    {{ rowLabel }}
                    <i class="pi pi-arrow-up-right leading-none" />
                  </span>
                </div>
              </article>
            </li>
          </ul>
        </FrameBox>

        <FrameBox
          v-if="hasMore"
          flush
          borders="y"
          marks="bottom"
        >
          <div class="flex justify-center p-(--spacing-xl)">
            <Button
              :label="moreLabel"
              kind="outlined"
              size="large"
              @click="pages += 1"
            />
          </div>
        </FrameBox>
      </template>

      <FrameBox
        key="empty"
        v-else-if="empty"
        flush
        borders="y"
        marks="bottom"
      >
        <EmptyState
          :title="empty.title"
          :description="empty.description"
          icon="pi pi-search"
          class="p-(--spacing-xxl)"
        >
          <template
            v-if="empty.action"
            #actions
          >
            <Button
              :label="empty.action"
              kind="secondary"
              size="large"
              @click="clearFilters"
            />
          </template>
        </EmptyState>
      </FrameBox>
    </SectionModule>
  </section>
</template>
