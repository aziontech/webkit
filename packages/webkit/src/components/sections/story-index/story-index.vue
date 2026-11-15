<script setup lang="ts">
  import { useMediaQuery, useMounted } from '@vueuse/core'
  import { computed, defineAsyncComponent, onMounted, ref, useAttrs, useId, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../actions/button/button.vue'
  import type { LogoMark } from '../../content/logo/logo.vue'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Input from '../../inputs/input/input.vue'
  import Select from '../../inputs/select/select.vue'
  import SelectContent from '../../inputs/select/select-content/select-content.vue'
  import SelectItem from '../../inputs/select/select-item/select-item.vue'
  import SelectTrigger from '../../inputs/select/select-trigger/select-trigger.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'

  defineOptions({
    name: 'StoryIndex',
    inheritAttrs: false
  })

  export type { LogoMark }

  /** One success story, rendered as a linked card. */
  export type StoryIndexItem = {
    /** Stable identity of the story within the library. */
    id: string
    /** Destination of the story. */
    href: string
    /** The client the story is about. */
    client: LogoMark
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
  export type StoryIndexFacetOption = {
    /** Value matched against the stories' facet values. */
    value: string
    /** Visible label of the option. */
    label: string
  }

  /** One facet, rendered as a searchable select. */
  export type StoryIndexFacet = {
    /** Identity of the facet, matched against the keys of each story's facets. */
    id: string
    /** Accessible name of the select. */
    label: string
    /** Placeholder shown while no value is selected. */
    allLabel: string
    /** The options, in order. */
    options: StoryIndexFacetOption[]
  }

  export interface StoryIndexProps {
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Headline of the band, rendered left-aligned as its `h2`; the band renders no header when empty. */
    title?: string
    /** The stories, in order; each is `{ id, href, client, category, description, facets?, target? }`; a story whose `target` is `_blank` opens in a new tab. */
    items?: StoryIndexItem[]
    /** The facet selects, in order; each is `{ id, label, allLabel, options }`. */
    facets?: StoryIndexFacet[]
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

  const props = withDefaults(defineProps<StoryIndexProps>(), {
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

  const Chip = defineAsyncComponent(() => import('../../inputs/chip/chip.vue'))
  const attrs = useAttrs()
  const { t } = useTranslate({ storyIndex: en.storyIndex, common: en.common })

  const query = ref('')

  const selection = ref<Record<string, string | undefined>>({})

  const optionQuery = ref<Record<string, string>>({})

  const pages = ref(1)

  const filtersOpen = ref(false)

  const panelId = useId()

  const SEARCH_THRESHOLD = 7

  const wideQuery = useMediaQuery('(min-width: 64rem)')
  const mounted = useMounted()
  const wide = computed(() => mounted.value && wideQuery.value)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-story-index'
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

  const paged = computed(() => props.moreLabel.length > 0 && props.pageSize > 0)

  const visible = computed(() =>
    paged.value ? matches.value.slice(0, pages.value * props.pageSize) : matches.value
  )

  const hasMore = computed(() => paged.value && visible.value.length < matches.value.length)

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
    const label = props.filterLabel || t('storyIndex.filters')
    return applied.value.length > 0
      ? t('storyIndex.filtersApplied', { label, count: applied.value.length })
      : label
  })

  watch([query, selection], () => {
    pages.value = 1
  })

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

  const optionsOf = (facet: StoryIndexFacet): StoryIndexFacetOption[] => {
    const term = (optionQuery.value[facet.id] ?? '').trim().toLowerCase()
    return facet.options.filter((option) => option.label.toLowerCase().includes(term))
  }

  const lastRowFrom = (columns: number): number =>
    visible.value.length - (((visible.value.length - 1) % columns) + 1)

  const select = (key: string, value: unknown): void => {
    selection.value = {
      ...selection.value,
      [key]: typeof value === 'string' && value.length > 0 ? value : undefined
    }
  }

  const resetOptionQuery = (key: string): void => {
    optionQuery.value = { ...optionQuery.value, [key]: '' }
  }

  const setOptionQuery = (key: string, value: string): void => {
    optionQuery.value = { ...optionQuery.value, [key]: value }
  }

  const clear = (): void => {
    query.value = ''
    selection.value = {}
  }

  const cardLabel = (item: StoryIndexItem): string => {
    const name = props.linkLabel ? `${props.linkLabel}: ${item.client.name}` : item.client.name
    return item.target === '_blank' ? `${name} ${t('common.newTab')}` : name
  }
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    :aria-label="title || undefined"
    class="scroll-mt-(--spacing-2xl)"
  >
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template
        v-if="hasTitle"
        #header
      >
        <SectionTitle
          variant="start"
          :title="title"
        />
      </template>

      <RegistrationFrame
        key="toolbar"
        v-if="hasSearch || facets.length > 0"
        flush
        borders="y"
      >
        <div
          role="search"
          class="grid items-center gap-(--spacing-md) px-(--spacing-xl) py-(--spacing-lg) lg:grid-cols-[minmax(0,4fr)_repeat(3,minmax(0,1fr))]"
        >
          <div class="flex items-center gap-(--spacing-sm) lg:contents">
            <Button
              v-if="facets.length > 0"
              :data-testid="`${testId}__filter-button`"
              :label="filterButtonLabel"
              variant="outline"
              size="large"
              icon="ai ai-filter"
              :aria-expanded="filtersOpen ? 'true' : 'false'"
              :aria-controls="panelId"
              class="shrink-0 lg:hidden"
              @click="filtersOpen = !filtersOpen"
            />
            <Input
              v-if="hasSearch"
              v-model="query"
              size="large"
              type="text"
              :placeholder="placeholder"
              :aria-label="searchAriaLabel || undefined"
              class="min-w-0 flex-1"
            >
              <template #leading>
                <i class="ai ai-search text-(--text-muted)" />
              </template>
            </Input>
          </div>
          <div
            v-if="facets.length > 0"
            :id="panelId"
            :data-testid="`${testId}__filters`"
            :data-state="filtersOpen ? 'open' : 'closed'"
            class="flex flex-col gap-(--spacing-sm) max-lg:hidden max-lg:data-[state=open]:flex lg:contents"
          >
            <Select
              v-for="facet in facets"
              :key="facet.id"
              :model-value="selection[facet.id]"
              size="large"
              :placeholder="facet.allLabel"
              @update:model-value="select(facet.id, $event)"
              @update:open="resetOptionQuery(facet.id)"
            >
              <SelectTrigger :aria-label="facet.label" />
              <SelectContent>
                <template
                  v-if="facet.options.length > SEARCH_THRESHOLD"
                  #search
                >
                  <Input
                    :model-value="optionQuery[facet.id] ?? ''"
                    size="small"
                    :placeholder="t('storyIndex.search')"
                    :aria-label="t('storyIndex.searchFacet', { facet: facet.label.toLowerCase() })"
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
                <SelectItem value="">{{ facet.allLabel }}</SelectItem>
                <SelectItem
                  v-for="option in optionsOf(facet)"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
                <p
                  v-if="optionsOf(facet).length === 0"
                  role="status"
                  class="px-(--spacing-xs) py-(--spacing-2xs) text-label-sm text-(--text-muted)"
                >
                  {{ t('storyIndex.noMatch') }}
                </p>
              </SelectContent>
            </Select>
          </div>
          <div
            v-if="applied.length > 0"
            :data-testid="`${testId}__applied`"
            class="flex flex-wrap gap-(--spacing-xs) lg:hidden"
          >
            <Chip
              v-for="chip in applied"
              :key="chip.key"
              :label="chip.label"
              removable
              size="medium"
              @remove="select(chip.key, '')"
            />
          </div>
        </div>
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
              class="border-b border-(--border-default) last:border-b-0 sm:border-e sm:max-lg:even:border-e-0 sm:max-lg:data-last-row-sm:border-b-0 lg:nth-[3n]:border-e-0 lg:data-last-row-lg:border-b-0"
            >
              <a
                :href="item.href"
                :target="item.target"
                :rel="item.target === '_blank' ? 'noopener' : undefined"
                :aria-label="cardLabel(item)"
                class="group/card flex h-full flex-col gap-(--spacing-lg) p-(--spacing-xl) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none"
              >
                <span class="flex h-8 items-center">
                  <img
                    :src="item.client.logo"
                    alt=""
                    class="brightness-0 [[data-theme=dark]_&]:invert h-full w-auto min-w-0 max-w-36 object-contain object-left"
                  />
                </span>
                <span class="text-overline-sm text-(--text-muted)">{{ item.category }}</span>
                <span class="text-pretty text-body-sm text-(--text-muted)">
                  {{ item.description }}
                </span>
                <span
                  v-if="linkLabel"
                  aria-hidden="true"
                  class="mt-auto flex items-center gap-(--spacing-2xs) pt-(--spacing-sm) text-overline-sm text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance group-hover/card:text-(--text-default) motion-reduce:transition-none"
                >
                  {{ linkLabel }}
                  <i
                    class="ai ai-arrow-up-right text-[length:inherit] leading-none transition-[translate] duration-moderate-02 ease-expressive-entrance group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5 rtl:group-hover/card:-translate-x-0.5 motion-reduce:transition-none"
                  />
                </span>
              </a>
            </li>
          </ul>
        </RegistrationFrame>

        <RegistrationFrame
          v-if="hasMore"
          flush
          borders="y"
          marks="bottom"
        >
          <div class="flex justify-center p-(--spacing-xl)">
            <Button
              :label="moreLabel"
              variant="outline"
              size="large"
              @click="pages += 1"
            />
          </div>
        </RegistrationFrame>
      </template>

      <RegistrationFrame
        key="empty"
        v-else-if="emptyTitle"
        flush
        borders="y"
        marks="bottom"
      >
        <EmptyState
          :title="emptyTitle"
          icon="ai ai-search"
          class="p-(--spacing-2xl)"
        >
          <template
            v-if="emptyActionLabel"
            #actions
          >
            <Button
              :label="emptyActionLabel"
              variant="secondary"
              size="large"
              @click="clear"
            />
          </template>
        </EmptyState>
      </RegistrationFrame>
    </SectionModule>
  </section>
</template>
