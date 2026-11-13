<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import SegmentedButton from '../../actions/segmented-button/segmented-button.vue'
  import Avatar from '../../avatar/avatar.vue'
  import InputText from '../../inputs/input-text/input-text.vue'
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
  }

  /** One article, rendered as a linked row. */
  export type ArticleIndexBlogItem = {
    /** Stable identity of the article within the list. */
    key: string
    /** Destination of the article. */
    href: string
    /** URL of the cover drawn at the start of the row. */
    image: string
    /** Overline, usually the category and the date. */
    meta: string
    /** Headline of the article, naming the row link. */
    title: string
    /** Deck under the headline, clamped to two lines. */
    description: string
    /** The writers drawn beside the byline. */
    authors?: ArticleIndexBlogAuthor[]
    /** Byline pinned to the foot of the row, usually the writers and the read time. */
    byline?: string
    /** The categories the article is filed under. */
    categories?: string[]
  }

  /** The search field. */
  export type ArticleIndexBlogSearch = {
    /** Placeholder of the field. */
    placeholder: string
    /** Accessible name of the field. */
    label: string
  }

  interface Props {
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** The articles, newest first; each is `{ key, href, image, meta, title, description, authors?, byline?, categories? }`. */
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
    /** Label of the load-more button under the list; the button is omitted when empty. */
    moreLabel?: string
    /** Accessible name of the list of articles. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    items: () => [],
    categories: () => [],
    allLabel: '',
    categoryLabel: '',
    search: undefined,
    rowLabel: '',
    moreLabel: '',
    ariaLabel: ''
  })

  const attrs = useAttrs()

  const category = ref<string | undefined>(props.allLabel)

  const query = ref('')

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-article-index-blog'
  )

  const options = computed(() => [
    { label: props.allLabel, value: props.allLabel },
    ...props.categories.map((label) => ({ label, value: label }))
  ])

  const matches = computed(() => {
    const term = query.value.trim().toLowerCase()
    const picked = category.value ?? props.allLabel
    return props.items.filter((item) => {
      if (picked !== props.allLabel && !(item.categories ?? []).includes(picked)) return false
      if (!term) return true
      return (
        item.title.toLowerCase().includes(term) || item.description.toLowerCase().includes(term)
      )
    })
  })
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    class="scroll-mt-(--spacing-xxl)"
  >
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        v-if="categories.length > 0 || search"
        flush
        borders="y"
        marks="none"
      >
        <div
          role="search"
          class="flex flex-col gap-(--spacing-md) px-(--spacing-xl) py-(--spacing-lg) lg:flex-row lg:items-center lg:justify-between"
        >
          <div
            v-if="categories.length > 0"
            class="min-w-0 overflow-x-auto"
          >
            <SegmentedButton
              v-model="category"
              :options="options"
              :aria-label="categoryLabel || undefined"
              size="medium"
            />
          </div>

          <div
            v-if="search"
            class="w-full shrink-0 lg:w-(--container-3xs)"
          >
            <InputText
              v-model="query"
              size="medium"
              type="text"
              :placeholder="search.placeholder"
              :aria-label="search.label"
            >
              <template #iconLeft>
                <i class="pi pi-search text-(--text-muted)" />
              </template>
            </InputText>
          </div>
        </div>
      </FrameBox>

      <template v-if="matches.length > 0">
        <FrameBox
          flush
          borders="y"
          marks="bottom"
        >
          <ul
            :aria-label="ariaLabel || undefined"
            data-kind="byline"
            class="group/rows m-0 flex list-none flex-col p-0"
          >
            <li
              v-for="(item, index) in matches"
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
                  class="flex aspect-40/21 items-center justify-center overflow-hidden border-b border-(--border-default) bg-(--bg-surface) lg:border-r lg:border-b-0"
                >
                  <img
                    :src="item.image"
                    alt=""
                    loading="lazy"
                    class="size-full object-cover"
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
                          class="text-pretty text-heading-sm text-(--text-default) no-underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-(--ring-color)"
                        >
                          {{ item.title }}
                        </a>
                      </h3>
                      <p class="m-0 line-clamp-2 text-pretty text-body-sm text-(--text-muted)">
                        {{ item.description }}
                      </p>
                    </div>
                    <span
                      v-if="item.byline"
                      class="flex items-center gap-(--spacing-sm) text-body-sm text-(--text-muted)"
                    >
                      <span class="flex shrink-0 -space-x-(--spacing-xs)">
                        <Avatar
                          v-for="author in item.authors ?? []"
                          :key="author.name"
                          kind="circle"
                          size="small"
                          :label="author.name"
                          :alt="author.name"
                          class="ring-2 ring-(--bg-canvas)"
                        />
                      </span>
                      <span>{{ item.byline }}</span>
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
          v-if="moreLabel"
          flush
          borders="y"
          marks="bottom"
        >
          <div class="flex justify-center p-(--spacing-xl)">
            <Button
              :label="moreLabel"
              kind="outlined"
              size="large"
            />
          </div>
        </FrameBox>
      </template>
    </SectionModule>
  </section>
</template>
