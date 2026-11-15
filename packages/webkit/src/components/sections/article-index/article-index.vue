<script setup lang="ts">
  import { computed, nextTick, onMounted, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'
  import ToggleGroup from '../../actions/toggle-group/toggle-group.vue'
  import Avatar from '../../content/avatar/avatar.vue'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Input from '../../inputs/input/input.vue'
  import Select from '../../inputs/select/select.vue'
  import SelectContent from '../../inputs/select/select-content/select-content.vue'
  import SelectItem from '../../inputs/select/select-item/select-item.vue'
  import SelectTrigger from '../../inputs/select/select-trigger/select-trigger.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'

  defineOptions({
    name: 'ArticleIndex',
    inheritAttrs: false
  })

  /** Filter bar: category-search draws a category picker and a search field, facets draws one dropdown per facet. */
  export type ArticleIndexFilters = 'category-search' | 'facets'

  /** One writer of an entry, drawn as an avatar beside the byline. */
  export type ArticleIndexAuthor = {
    /** The writer's name, the avatar's initials and alternative text. */
    name: string
    /** URL of the writer's photo; without one the avatar shows the initials. */
    avatar?: string
  }

  /** The client mark drawn in the cover cell of a row that has no cover. */
  export type ArticleIndexMark = {
    /** The client's name, the mark's alternative text. */
    name: string
    /** URL of the client's logo, drawn in one ink that follows the theme. */
    logo: string
  }

  /** One article or resource, rendered as a linked row. */
  export type ArticleIndexItem = {
    /** Stable identity of the entry within the list. */
    id: string
    /** Destination of the entry. */
    href: string
    /** URL of the cover drawn at the start of the row. */
    image?: string
    /** Client mark drawn in the cover cell when there is no cover. */
    mark?: ArticleIndexMark
    /** Overline, usually the category or the content type and the date. */
    meta: string
    /** Headline of the entry, naming the row link. */
    title: string
    /** Deck under the headline. */
    description?: string
    /** The writers drawn beside the byline. */
    authors?: ArticleIndexAuthor[]
    /** Byline pinned to the foot of the row, usually the writers and the read time. */
    byline?: string
    /** The categories the entry is filed under, matched by the category picker. */
    categories?: string[]
    /** The values the entry carries per facet key, matched by the facet dropdowns. */
    facets?: Record<string, string[]>
    /** Where the destination opens; `_blank` opens it in a new tab. */
    target?: '_blank' | '_self'
  }

  /** One facet, rendered as a searchable dropdown. */
  export type ArticleIndexFacet = {
    /** Identity of the facet, matched against the keys of each entry's facets. */
    id: string
    /** Accessible name of the dropdown. */
    label: string
    /** The first option, selected on load, which keeps every entry. */
    allLabel: string
    /** The options after the show-all one, in order. */
    options: string[]
  }

  /** Row layout: byline pins the writers to the foot of the copy, center centres the copy. */
  export type ArticleIndexRowKind = 'byline' | 'center'

  interface Props {
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Headline beside the controls, rendered as the band's `h2`; it also names the band. */
    title?: string
    /** Filter bar: `category-search` draws the category picker and the search field, `facets` draws one dropdown per facet. */
    filters?: ArticleIndexFilters
    /** The entries, in order; each is `{ id, href, image?, mark?, meta, title, description?, authors?, byline?, categories?, facets?, target? }`. */
    items?: ArticleIndexItem[]
    /** Segments of the category picker after the show-all segment (`category-search`); the picker is omitted when empty. */
    categories?: string[]
    /** Label of the first category segment, which shows every category (`category-search`). */
    allLabel?: string
    /** Accessible name of the category picker (`category-search`). */
    categoryAriaLabel?: string
    /** Placeholder of the search field (`category-search`); the field is omitted when this and `searchAriaLabel` are both empty. */
    searchPlaceholder?: string
    /** Accessible name of the search field (`category-search`). */
    searchAriaLabel?: string
    /** The facet dropdowns, in order (`facets`); each is `{ id, label, allLabel, options }`. */
    facets?: ArticleIndexFacet[]
    /** Read cue revealed at the end of a row under hover or focus. */
    rowLabel?: string
    /** Label of the load-more button under the list; without it every match is listed and no button renders. */
    moreLabel?: string
    /** Rows listed per page when `moreLabel` is set; the load-more button reveals the next page. */
    pageSize?: number
    /** Leading entries left out until a filter applies, because a band above already shows them. */
    leading?: number
    /** Headline of the state when nothing matches; the state renders only with it. */
    emptyTitle?: string
    /** Sentence under the empty-state headline. */
    emptyDescription?: string
    /** Label of the empty-state button that clears every filter; no button renders without it. */
    emptyActionLabel?: string
    /** Row layout: `byline` pins the writers to the foot of the copy, `center` centres the copy; unset, `byline` for `category-search` and `center` for `facets`. */
    rowKind?: ArticleIndexRowKind
    /** Name of a URL query parameter that preselects a category on load and scrolls the band into view (`category-search`); off when empty. */
    categoryParam?: string
    /** Accessible name of the list. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    title: '',
    filters: 'category-search',
    items: () => [],
    categories: () => [],
    allLabel: '',
    categoryAriaLabel: '',
    searchPlaceholder: '',
    searchAriaLabel: '',
    facets: () => [],
    rowLabel: '',
    moreLabel: '',
    pageSize: 12,
    leading: 0,
    emptyTitle: '',
    emptyDescription: '',
    emptyActionLabel: '',
    rowKind: undefined,
    categoryParam: '',
    ariaLabel: ''
  })

  const attrs = useAttrs()

  const { t } = useTranslate({ articleIndex: en.articleIndex })

  const SEARCH_THRESHOLD = 7

  const rootEl = ref<HTMLElement | null>(null)

  const category = ref<string | undefined>(props.allLabel)

  const query = ref('')

  const selection = ref<Record<string, string>>({})

  const optionQuery = ref<Record<string, string>>({})

  const pages = ref(1)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-article-index'
  )

  const faceted = computed(() => props.filters === 'facets')

  const layout = computed<ArticleIndexRowKind>(
    () => props.rowKind ?? (faceted.value ? 'center' : 'byline')
  )

  const showCategories = computed(() => !faceted.value && props.categories.length > 0)

  const showSearch = computed(
    () => !faceted.value && Boolean(props.searchPlaceholder || props.searchAriaLabel)
  )

  const showFacets = computed(() => faceted.value && props.facets.length > 0)

  const options = computed(() => [
    { label: props.allLabel, value: props.allLabel },
    ...props.categories.map((label) => ({ label, value: label }))
  ])

  const valueOf = (facet: ArticleIndexFacet): string => selection.value[facet.id] ?? facet.allLabel

  const filtering = computed(() =>
    faceted.value
      ? props.facets.some((facet) => valueOf(facet) !== facet.allLabel)
      : (category.value ?? props.allLabel) !== props.allLabel || query.value.trim().length > 0
  )

  const keeps = (item: ArticleIndexItem): boolean => {
    if (faceted.value) {
      return props.facets.every((facet) => {
        const value = valueOf(facet)
        return value === facet.allLabel || (item.facets?.[facet.id] ?? []).includes(value)
      })
    }
    const term = query.value.trim().toLowerCase()
    const picked = category.value ?? props.allLabel
    if (picked !== props.allLabel && !(item.categories ?? []).includes(picked)) return false
    if (!term) return true
    return (
      item.title.toLowerCase().includes(term) ||
      (item.description ?? '').toLowerCase().includes(term)
    )
  }

  const matches = computed(() =>
    (filtering.value ? props.items : props.items.slice(props.leading)).filter(keeps)
  )

  const paged = computed(() => props.moreLabel.length > 0 && props.pageSize > 0)

  const visible = computed(() =>
    paged.value ? matches.value.slice(0, pages.value * props.pageSize) : matches.value
  )

  const hasMore = computed(() => paged.value && visible.value.length < matches.value.length)

  watch([category, query, selection], () => {
    pages.value = 1
  })

  onMounted(async () => {
    if (faceted.value || !props.categoryParam) return
    const requested = new URLSearchParams(window.location.search).get(props.categoryParam)
    if (!requested || !props.categories.includes(requested)) return
    category.value = requested
    await nextTick()
    rootEl.value?.scrollIntoView()
  })

  const clearFilters = (): void => {
    category.value = props.allLabel
    query.value = ''
    selection.value = {}
  }

  const searchable = (facet: ArticleIndexFacet): boolean => facet.options.length > SEARCH_THRESHOLD

  const optionsOf = (facet: ArticleIndexFacet): string[] => {
    const term = (optionQuery.value[facet.id] ?? '').trim().toLowerCase()
    return facet.options.filter((option) => option.toLowerCase().includes(term))
  }

  const select = (facet: ArticleIndexFacet, value: unknown): void => {
    selection.value = {
      ...selection.value,
      [facet.id]: typeof value === 'string' ? value : facet.allLabel
    }
  }

  const resetOptionQuery = (key: string): void => {
    optionQuery.value = { ...optionQuery.value, [key]: '' }
  }

  const setOptionQuery = (key: string, value: string): void => {
    optionQuery.value = { ...optionQuery.value, [key]: value }
  }
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    ref="rootEl"
    :data-testid="testId"
    :aria-label="title || undefined"
    class="scroll-mt-(--spacing-2xl)"
  >
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        key="toolbar"
        v-if="title || showCategories || showSearch || showFacets"
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
            v-if="showCategories"
            class="min-w-0 overflow-x-auto"
          >
            <ToggleGroup
              v-model="category"
              :options="options"
              :aria-label="categoryAriaLabel || undefined"
              size="medium"
              class="w-max max-w-none"
            />
          </div>

          <div
            v-if="showSearch"
            class="w-full shrink-0 lg:w-(--container-3xs)"
          >
            <Input
              v-model="query"
              size="medium"
              type="text"
              :placeholder="searchPlaceholder || undefined"
              :aria-label="searchAriaLabel || undefined"
            >
              <template #leading>
                <i class="ai ai-search text-(--text-muted)" />
              </template>
            </Input>
          </div>

          <div
            v-if="showFacets"
            class="flex flex-col gap-(--spacing-sm) sm:flex-row sm:flex-wrap"
          >
            <Select
              v-for="facet in facets"
              :key="facet.id"
              :model-value="valueOf(facet)"
              size="medium"
              class="w-full sm:w-56"
              @update:model-value="select(facet, $event)"
              @update:open="resetOptionQuery(facet.id)"
            >
              <SelectTrigger :aria-label="facet.label" />
              <SelectContent>
                <template
                  v-if="searchable(facet)"
                  #search
                >
                  <Input
                    :model-value="optionQuery[facet.id] ?? ''"
                    size="small"
                    :placeholder="t('articleIndex.search')"
                    :aria-label="
                      t('articleIndex.searchFacet', { facet: facet.label.toLowerCase() })
                    "
                    @update:model-value="setOptionQuery(facet.id, $event)"
                  >
                    <template #leading>
                      <i
                        class="ai ai-search"
                        aria-hidden="true"
                      />
                    </template>
                  </Input>
                </template>
                <SelectItem :value="facet.allLabel">
                  {{ facet.allLabel }}
                </SelectItem>
                <SelectItem
                  v-for="option in optionsOf(facet)"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </SelectItem>
                <p
                  v-if="optionsOf(facet).length === 0"
                  role="status"
                  class="px-(--spacing-xs) py-(--spacing-2xs) text-label-sm text-(--text-muted)"
                >
                  {{ t('articleIndex.empty') }}
                </p>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FrameBox>

      <template v-if="visible.length > 0">
        <FrameBox
          key="rows"
          flush
          borders="y"
          marks="bottom"
        >
          <ul
            :aria-label="ariaLabel || undefined"
            :data-kind="layout"
            :data-filters="filters"
            class="group/rows m-0 flex list-none flex-col p-0"
          >
            <li
              v-for="(item, index) in visible"
              :key="item.id"
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
                    class="flex min-w-0 flex-1 flex-col justify-between gap-(--spacing-sm) group-data-[kind=center]/rows:justify-center"
                  >
                    <div class="flex flex-col gap-(--spacing-sm)">
                      <span class="text-overline-sm text-(--text-muted)">{{ item.meta }}</span>
                      <h3 class="m-0">
                        <a
                          :href="item.href"
                          :target="item.target"
                          :rel="item.target === '_blank' ? 'noopener' : undefined"
                          class="text-pretty text-heading-sm text-(--text-default) no-underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-(--ring-color)"
                        >
                          {{ item.title }}
                          <span
                            v-if="item.target === '_blank'"
                            class="sr-only"
                            >{{ t('articleIndex.newTab') }}</span
                          >
                        </a>
                      </h3>
                      <p
                        v-if="item.description"
                        class="m-0 line-clamp-2 text-pretty text-body-sm text-(--text-muted) group-data-[filters=facets]/rows:line-clamp-none group-data-[filters=facets]/rows:text-body-lg"
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
                    class="flex shrink-0 translate-y-1 items-center self-center gap-(--spacing-2xs) whitespace-nowrap text-overline-md text-(--text-default) uppercase opacity-0 transition-[opacity,translate] duration-moderate-01 ease-productive-entrance group-hover/row:translate-y-0 group-hover/row:opacity-100 group-has-[a:focus-visible]/row:translate-y-0 group-has-[a:focus-visible]/row:opacity-100 motion-reduce:transition-none max-lg:hidden"
                  >
                    {{ rowLabel }}
                    <i class="ai ai-arrow-up-right leading-none" />
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
        v-else-if="emptyTitle"
        key="empty"
        flush
        borders="y"
        marks="bottom"
      >
        <EmptyState
          :title="emptyTitle"
          :description="emptyDescription"
          icon="ai ai-search"
          class="p-(--spacing-2xl)"
        >
          <template
            v-if="emptyActionLabel"
            #actions
          >
            <Button
              :label="emptyActionLabel"
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
