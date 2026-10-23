<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import FrameBox from '@aziontech/webkit/frame-box'
  import InputText from '@aziontech/webkit/input-text'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import SelectContent from '@aziontech/webkit/select-content'
  import SelectOption from '@aziontech/webkit/select-option'
  import Select from '@aziontech/webkit/select-root'
  import SelectTrigger from '@aziontech/webkit/select-trigger'
  import FilterButton from '@console/components/list/FilterButton.vue'
  import FilterChips from '@console/components/list/FilterChips.vue'
  import ClientMark from '@shared/ui/brand/ClientMark.vue'
  import { computed, reactive, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import { useOptionSearch } from '../../composables/use-option-search'
  import { useSiteLink } from '../../composables/use-site-link'

  defineOptions({ name: 'StoryLibrary' })

  export interface StoryLibraryFacetOption {
    /** Value a story carries for this facet. */
    value: string
    /** Visible label. */
    label: string
  }

  export interface StoryLibraryFacet {
    /** Key of the story facet it narrows; also the query parameter that seeds it. */
    key: string
    /** Accessible name of the control. */
    label: string
    /** Label of the option that shows every story. */
    allLabel: string
    /** The values a reader can narrow to. */
    options: StoryLibraryFacetOption[]
  }

  export interface StoryLibraryItem {
    /** Stable key of the story. */
    key: string
    /** Destination of the story. */
    href: string
    /** Opens the destination in a new tab. */
    external?: boolean
    /** The client behind the story; its mark leads the card. */
    client: Record<string, unknown> & { name: string }
    /** Overline under the mark: the story's industry. */
    category: string
    /** The story's description. */
    description: string
    /** The facet values the story carries, keyed by facet. */
    facets: Record<string, string[]>
  }

  export interface StoryLibrarySearch {
    /** Placeholder of the search field from lg up. */
    placeholder: string
    /** Shorter placeholder below lg. */
    shortPlaceholder: string
    /** Accessible name of the search field. */
    label: string
  }

  export interface StoryLibraryEmpty {
    /** Headline when nothing matches. */
    title: string
    /** Label of the action that clears every filter. */
    action: string
  }

  interface Props {
    /** Id of the band, for in-page links. */
    anchor?: string
    /** Headline over the library. */
    title: string
    /** Every story, in source order. */
    items: StoryLibraryItem[]
    /** Facets the reader narrows the library by. */
    facets?: StoryLibraryFacet[]
    /** Copy of the search field. */
    search: StoryLibrarySearch
    /** Copy of the state when nothing matches. */
    empty: StoryLibraryEmpty
    /** Accessible name of the list. */
    ariaLabel?: string
    /** Label of the link closing each card. */
    readLabel?: string
    /** Label of the button that reveals the next page. */
    moreLabel?: string
    /** Stories revealed per page. */
    pageSize?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    facets: () => [],
    ariaLabel: 'Success stories',
    readLabel: 'Read story',
    moreLabel: 'Load more',
    pageSize: 12
  })

  const ALL = 'all'

  const route = useRoute()
  const { follow } = useSiteLink()
  const { searchable, query, setQuery, narrow } = useOptionSearch()

  const seeded = (facet: StoryLibraryFacet) => {
    const requested = route.query[facet.key]
    return facet.options.some((option) => option.value === requested) ? String(requested) : ALL
  }

  const selection = reactive({
    query: '',
    facets: Object.fromEntries(props.facets.map((facet) => [facet.key, seeded(facet)])) as Record<
      string,
      string
    >
  })

  const shown = ref(props.pageSize)

  const fields = props.facets.map((facet) => ({
    id: facet.key,
    label: facet.label,
    kind: 'range',
    options: facet.options
  }))

  const applied = computed({
    get: () =>
      Object.fromEntries(
        props.facets
          .filter((facet) => selection.facets[facet.key] !== ALL)
          .map((facet) => [facet.key, [selection.facets[facet.key]]])
      ),
    set: (state: Record<string, string[]>) => {
      props.facets.forEach((facet) => {
        selection.facets[facet.key] = state[facet.key]?.[0] ?? ALL
      })
    }
  })

  const facetLabel = (facet: StoryLibraryFacet) => (value: string) =>
    value === ALL
      ? facet.allLabel
      : (facet.options.find((option) => option.value === value)?.label ?? value)

  const matching = (facet: StoryLibraryFacet) =>
    narrow(facet.key, facet.options, (option) => option.label)

  const matches = computed(() => {
    const query = selection.query.trim().toLowerCase()
    return props.items.filter(
      (item) =>
        props.facets.every(
          (facet) =>
            selection.facets[facet.key] === ALL ||
            (item.facets[facet.key] ?? []).includes(selection.facets[facet.key])
        ) &&
        (!query || `${item.client.name} ${item.description}`.toLowerCase().includes(query))
    )
  })

  const visible = computed(() => matches.value.slice(0, shown.value))
  const hasMore = computed(() => shown.value < matches.value.length)

  const inLastRow = (index: number, columns: number) =>
    index >= visible.value.length - (((visible.value.length - 1) % columns) + 1)

  watch(selection, () => {
    shown.value = props.pageSize
  })

  function clearFilters() {
    selection.query = ''
    props.facets.forEach((facet) => {
      selection.facets[facet.key] = ALL
    })
  }
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
    class="scroll-mt-(--spacing-xxl)"
  >
    <template #header>
      <SectionTitle
        kind="left"
        :title="title"
      />
    </template>

    <FrameBox
      flush
      borders="y"
    >
      <div
        role="search"
        class="hidden grid-cols-[minmax(0,4fr)_repeat(3,minmax(0,1fr))] items-center gap-(--spacing-md) px-(--spacing-xl) py-(--spacing-lg) lg:grid"
      >
        <div class="min-w-0">
          <InputText
            v-model="selection.query"
            size="large"
            type="text"
            :placeholder="search.placeholder"
            :aria-label="search.label"
          >
            <template #iconLeft>
              <i class="pi pi-search text-(--text-muted)" />
            </template>
          </InputText>
        </div>

        <div
          v-for="facet in facets"
          :key="facet.key"
          class="min-w-0"
        >
          <Select
            v-model="selection.facets[facet.key]"
            size="large"
            :display-value="facetLabel(facet)"
            @update:open="setQuery(facet.key, '')"
          >
            <SelectTrigger :aria-label="facet.label" />
            <SelectContent>
              <template
                v-if="searchable(facet.options)"
                #search
              >
                <InputText
                  :model-value="query(facet.key)"
                  size="small"
                  placeholder="Search"
                  :aria-label="`Search ${facet.label.toLowerCase()}`"
                  @update:model-value="setQuery(facet.key, $event)"
                >
                  <template #iconLeft>
                    <i
                      class="pi pi-search"
                      aria-hidden="true"
                    />
                  </template>
                </InputText>
              </template>
              <SelectOption :value="ALL">{{ facet.allLabel }}</SelectOption>
              <SelectOption
                v-for="option in matching(facet)"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </SelectOption>
              <p
                v-if="!matching(facet).length"
                role="status"
                class="px-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-muted)"
              >
                No results found
              </p>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        role="search"
        class="flex flex-col gap-(--spacing-sm) px-(--spacing-xl) py-(--spacing-lg) lg:hidden"
      >
        <div class="flex items-center gap-(--spacing-sm)">
          <FilterButton
            v-if="fields.length"
            v-model="applied"
            :fields="fields"
            size="large"
          />
          <div class="min-w-0 flex-1">
            <InputText
              v-model="selection.query"
              size="large"
              type="text"
              :placeholder="search.shortPlaceholder"
              :aria-label="search.label"
            >
              <template #iconLeft>
                <i class="pi pi-search text-(--text-muted)" />
              </template>
            </InputText>
          </div>
        </div>

        <FilterChips
          v-if="fields.length"
          v-model="applied"
          :fields="fields"
        />
      </div>
    </FrameBox>

    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <ul
        v-if="visible.length > 0"
        class="m-0 grid list-none grid-cols-1 p-0 sm:grid-cols-2 lg:grid-cols-3"
        :aria-label="ariaLabel"
      >
        <li
          v-for="(item, index) in visible"
          :key="item.key"
          :data-last-row-sm="inLastRow(index, 2) || null"
          :data-last-row-lg="inLastRow(index, 3) || null"
          class="border-b border-(--border-default) last:border-b-0 sm:border-r sm:max-lg:even:border-r-0 sm:max-lg:data-last-row-sm:border-b-0 lg:nth-[3n]:border-r-0 lg:data-last-row-lg:border-b-0"
        >
          <a
            :href="item.href"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noopener' : undefined"
            :aria-label="`${readLabel}: ${item.client.name}${item.external ? ' (opens in a new tab)' : ''}`"
            class="group/card flex h-full flex-col gap-(--spacing-lg) p-(--spacing-xl) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none"
            @click="follow($event, item.href)"
          >
            <span class="flex h-8 items-center">
              <ClientMark
                :client="item.client"
                monochrome
                mark="h-full w-auto max-w-36 object-contain object-left"
              />
            </span>

            <span class="text-overline-sm text-(--text-muted)">
              {{ item.category }}
            </span>

            <span class="text-pretty text-body-sm text-(--text-muted)">
              {{ item.description }}
            </span>

            <span
              aria-hidden="true"
              class="mt-auto flex items-center gap-(--spacing-xxs) pt-(--spacing-sm) text-overline-sm text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance group-hover/card:text-(--text-default) motion-reduce:transition-none"
            >
              {{ readLabel }}
              <i
                class="pi pi-arrow-up-right text-[length:inherit] leading-none transition-[translate] duration-moderate-02 ease-expressive-entrance group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5 motion-reduce:transition-none"
              />
            </span>
          </a>
        </li>
      </ul>

      <EmptyState
        v-else
        :title="empty.title"
        icon="pi pi-search"
        class="p-(--spacing-xxl)"
      >
        <template #actions>
          <Button
            :label="empty.action"
            kind="secondary"
            size="large"
            @click="clearFilters"
          />
        </template>
      </EmptyState>
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
          @click="shown += pageSize"
        />
      </div>
    </FrameBox>
  </SectionModule>
</template>
