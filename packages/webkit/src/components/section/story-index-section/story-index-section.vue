<script setup lang="ts">
  import { useMediaQuery, useMounted } from '@vueuse/core'
  import { computed, onMounted, ref, useAttrs, watch } from 'vue'

  import { useLoadMore } from '../../../composables/use-load-more'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { safeHref } from '../../../utils/safe-href'
  import type { ThirdPartyLogoMark } from '../../content/third-party-logo/third-party-logo.vue'
  import Module from '../../layout/module/module.vue'
  import ModuleHeader from '../../layout/module-header/module-header.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import ArticleIndexSectionEmpty from '../article-index-section/parts/article-index-section-empty.vue'
  import ArticleIndexSectionMore from '../article-index-section/parts/article-index-section-more.vue'
  import StoryIndexSectionFacetSelect from './parts/story-index-section-facet-select.vue'
  import StoryIndexSectionToolbar from './parts/story-index-section-toolbar.vue'

  defineOptions({
    name: 'StoryIndexSection',
    inheritAttrs: false
  })

  export type { ThirdPartyLogoMark }

  /** One success story, rendered as a linked card. */
  export type StoryIndexSectionItem = {
    /** Stable identity of the story within the library. */
    id: string
    /** Destination of the story. */
    href: string
    /** The client the story is about. */
    client: ThirdPartyLogoMark
    /** Eyebrow of the card, usually the industry. */
    category: string
    /** One or two sentences on the story. */
    description: string
    /** The values the story carries per facet key. */
    facets?: Record<string, string[]>
    /** Where the destination opens; `_blank` opens it in a new tab. */
    target?: '_blank' | '_self'
  }

  /** One option of a facet select. */
  export type StoryIndexSectionFacetOption = {
    /** Value matched against the stories' facet values. */
    value: string
    /** Visible label of the option. */
    label: string
  }

  /** One facet, rendered as a searchable select. */
  export type StoryIndexSectionFacet = {
    /** Identity of the facet, matched against the keys of each story's facets. */
    id: string
    /** Accessible name of the select. */
    label: string
    /** Placeholder shown while no value is selected. */
    allLabel: string
    /** The options, in order. */
    options: StoryIndexSectionFacetOption[]
  }

  export interface StoryIndexSectionProps {
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Headline of the band, rendered left-aligned as its `h2`; the band renders no header when empty. */
    title?: string
    /** The stories, in order; each is `{ id, href, client, category, description, facets?, target? }`; a story whose `target` is `_blank` opens in a new tab. */
    items?: StoryIndexSectionItem[]
    /** The facet selects, in order; each is `{ id, label, allLabel, options }`. */
    facets?: StoryIndexSectionFacet[]
    /** Placeholder of the search field; the field is omitted when this and `searchAriaLabel` are both empty. */
    searchPlaceholder?: string
    /** Shorter placeholder of the search field below the large breakpoint; empty uses `searchPlaceholder`. */
    searchShortPlaceholder?: string
    /** Accessible name of the search field. */
    searchAriaLabel?: string
    /** Message of the no-match state; the state renders only with it. */
    emptyTitle?: string
    /** Label of the no-match state's button that clears every filter; no button renders without it. */
    emptyActionLabel?: string
    /** Read cue at the foot of each card, also the lead of its accessible name. */
    linkLabel?: string
    /** Label of the load-more button under the grid; without it every match is listed and no button renders. */
    moreLabel?: string
    /** Stories listed per page when `moreLabel` is set; the load-more button reveals the next page. */
    pageSize?: number
    /** Label of the filter button below the large breakpoint; empty uses the locale catalog (`Filters`). */
    filterLabel?: string
    /** Seeds each facet on mount from the URL query parameter named by its `id` when the value is one of its options. */
    seedFromQuery?: boolean
    /** Accessible name of the list of stories. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<StoryIndexSectionProps>(), {
    anchor: '',
    title: '',
    items: () => [],
    facets: () => [],
    searchPlaceholder: '',
    searchShortPlaceholder: '',
    searchAriaLabel: '',
    emptyTitle: '',
    emptyActionLabel: '',
    linkLabel: '',
    moreLabel: '',
    pageSize: 12,
    filterLabel: '',
    seedFromQuery: false,
    ariaLabel: ''
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ storyIndexSection: en.storyIndexSection, common: en.common })

  const query = ref('')

  const selection = ref<Record<string, string | undefined>>({})

  const wideQuery = useMediaQuery('(min-width: 64rem)')
  const mounted = useMounted()
  const wide = computed(() => mounted.value && wideQuery.value)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'story-index-section'
  )

  const hasTitle = computed(() => props.title.length > 0)

  const matches = computed(() => {
    const term = query.value.trim().toLowerCase()
    return props.items.filter((item) => {
      if (
        term &&
        !item.client.name.toLowerCase().includes(term) &&
        !item.description.toLowerCase().includes(term)
      ) {
        return false
      }
      return props.facets.every((facet) => {
        const value = selection.value[facet.id]
        return value === undefined || (item.facets?.[facet.id] ?? []).includes(value)
      })
    })
  })

  const { visible, hasMore, loadMore, resetPages } = useLoadMore(matches, () =>
    props.moreLabel ? props.pageSize : 0
  )

  const hasSearch = computed(() => Boolean(props.searchPlaceholder || props.searchAriaLabel))

  const placeholder = computed(() =>
    wide.value ? props.searchPlaceholder : props.searchShortPlaceholder || props.searchPlaceholder
  )

  const applied = computed(() =>
    props.facets.flatMap((facet) => {
      const value = selection.value[facet.id]
      const option =
        value === undefined
          ? undefined
          : facet.options.find((candidate) => candidate.value === value)
      return option ? [{ key: facet.id, label: `${facet.label}: ${option.label}` }] : []
    })
  )

  const filterButtonLabel = computed(() => {
    const label = props.filterLabel || t('storyIndexSection.filters')
    return applied.value.length > 0
      ? t('storyIndexSection.filtersApplied', { label, count: applied.value.length })
      : label
  })

  watch([query, selection], resetPages)

  onMounted(() => {
    if (!props.seedFromQuery) return
    const params = new URLSearchParams(window.location.search)
    const seeded = { ...selection.value }
    props.facets.forEach((facet) => {
      const value = params.get(facet.id)
      if (value && facet.options.some((option) => option.value === value)) seeded[facet.id] = value
    })
    selection.value = seeded
  })

  const lastRowFrom = (columns: number): number =>
    visible.value.length - (((visible.value.length - 1) % columns) + 1)

  const select = (key: string, value: unknown): void => {
    selection.value = {
      ...selection.value,
      [key]: typeof value === 'string' && value.length > 0 ? value : undefined
    }
  }

  const clear = (): void => {
    query.value = ''
    selection.value = {}
  }

  const cardLabel = (item: StoryIndexSectionItem): string => {
    const name = props.linkLabel ? `${props.linkLabel}: ${item.client.name}` : item.client.name
    return item.target === '_blank' ? `${name} ${t('common.newTab')}` : name
  }

  const CARD_CELL_CLASS =
    'border-b border-(--border-default) last:border-b-0 sm:border-e sm:max-lg:even:border-e-0 sm:max-lg:data-last-row-sm:border-b-0 lg:nth-[3n]:border-e-0 lg:data-last-row-lg:border-b-0'

  const CARD_LINK_CLASS =
    'group/card flex h-full flex-col gap-(--spacing-lg) p-(--spacing-xl) transition-colors duration-fast-02 ease-productive-entrance ' +
    'hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none'

  const CARD_LINK_LABEL_CLASS =
    'mt-auto flex items-center gap-(--spacing-2xs) pt-(--spacing-sm) text-overline-sm text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance ' +
    'group-hover/card:text-(--text-default) motion-reduce:transition-none'

  const CARD_ARROW_CLASS =
    'az az-arrow-up-right text-[length:inherit] leading-none transition-[translate] duration-moderate-02 ease-expressive-entrance ' +
    'group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5 rtl:group-hover/card:-translate-x-0.5 motion-reduce:transition-none'
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    :aria-label="title || undefined"
    class="scroll-mt-(--spacing-2xl)"
  >
    <Module
      :divided="false"
      :padded="false"
    >
      <template
        v-if="hasTitle"
        #header
      >
        <ModuleHeader
          align="start"
          :title="title"
        />
      </template>

      <RegistrationFrame
        key="toolbar"
        v-if="hasSearch || facets.length > 0"
        flush
        borders="y"
      >
        <StoryIndexSectionToolbar
          v-model:query="query"
          :test-id="testId"
          :filterable="facets.length > 0"
          :filter-label="filterButtonLabel"
          :searchable="hasSearch"
          :search-placeholder="placeholder"
          :search-aria-label="searchAriaLabel"
          :applied="applied"
          class="items-center"
          @remove="(_event, key) => select(key, '')"
        >
          <StoryIndexSectionFacetSelect
            v-for="facet in facets"
            :key="facet.id"
            :model-value="selection[facet.id]"
            :label="facet.label"
            :options="facet.options"
            :all-option="{ value: '', label: facet.allLabel }"
            :placeholder="facet.allLabel"
            :search-placeholder="t('storyIndexSection.search')"
            :search-aria-label="
              t('storyIndexSection.searchFacet', { facet: facet.label.toLowerCase() })
            "
            :no-match-label="t('storyIndexSection.noMatch')"
            @update:model-value="select(facet.id, $event)"
          />
        </StoryIndexSectionToolbar>
      </RegistrationFrame>

      <template v-if="visible.length > 0">
        <RegistrationFrame
          flush
          borders="y"
          marks="bottom"
        >
          <ul
            class="m-0 grid list-none grid-cols-1 p-0 sm:grid-cols-2 lg:grid-cols-3"
            :aria-label="ariaLabel || undefined"
          >
            <li
              v-for="(item, index) in visible"
              :key="item.id"
              :data-last-row-sm="index >= lastRowFrom(2) || undefined"
              :data-last-row-lg="index >= lastRowFrom(3) || undefined"
              :class="CARD_CELL_CLASS"
            >
              <a
                :href="safeHref(item.href) ?? undefined"
                :target="item.target"
                :rel="item.target === '_blank' ? 'noopener' : undefined"
                :aria-label="cardLabel(item)"
                :class="CARD_LINK_CLASS"
              >
                <span class="flex h-8 items-center">
                  <img
                    :src="item.client.logo"
                    alt=""
                    class="brightness-0 [[data-theme=dark]_&]:invert h-full w-auto min-w-0 max-w-36 object-contain object-left"
                  />
                </span>
                <span class="text-overline-sm text-(--text-muted)">{{ item.category }}</span>
                <span class="text-pretty text-body-sm text-(--text-default)">
                  {{ item.description }}
                </span>
                <span
                  v-if="linkLabel"
                  aria-hidden="true"
                  :class="CARD_LINK_LABEL_CLASS"
                >
                  {{ linkLabel }}
                  <i :class="CARD_ARROW_CLASS" />
                </span>
              </a>
            </li>
          </ul>
        </RegistrationFrame>

        <ArticleIndexSectionMore
          v-if="hasMore"
          :label="moreLabel"
          @more="loadMore"
        />
      </template>

      <ArticleIndexSectionEmpty
        v-else-if="emptyTitle"
        key="empty"
        :title="emptyTitle"
        :action-label="emptyActionLabel"
        @clear="clear"
      />
    </Module>
  </section>
</template>
