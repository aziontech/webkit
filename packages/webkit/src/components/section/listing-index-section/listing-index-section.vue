<script setup lang="ts">
  import { useMediaQuery, useMounted } from '@vueuse/core'
  import { computed, onMounted, ref, useAttrs } from 'vue'

  import { useLazyChunks } from '../../../composables/use-lazy-chunks'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { followRowLink } from '../../../utils/follow-row-link'
  import { safeHref } from '../../../utils/safe-href'
  import Button from '../../action/button/button.vue'
  import Item from '../../content/item/item.vue'
  import ItemContent from '../../content/item/item-content.vue'
  import ItemDescription from '../../content/item/item-description.vue'
  import ItemList from '../../content/item/item-list.vue'
  import ItemTitle from '../../content/item/item-title.vue'
  import type { ThirdPartyLogoMark } from '../../content/third-party-logo/third-party-logo.vue'
  import Table from '../../data/table/table.vue'
  import TableBody from '../../data/table/table-body/table-body.vue'
  import TableCell from '../../data/table/table-cell/table-cell.vue'
  import TableHeadCell from '../../data/table/table-head-cell/table-head-cell.vue'
  import TableHeader from '../../data/table/table-header/table-header.vue'
  import TableRow from '../../data/table/table-row/table-row.vue'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import ModuleHeader from '../../layout/module-header/module-header.vue'
  import SectionBand from '../parts/section-band.vue'
  import StoryIndexSectionFacetSelect from '../story-index-section/parts/story-index-section-facet-select.vue'
  import StoryIndexSectionToolbar from '../story-index-section/parts/story-index-section-toolbar.vue'
  import * as listing from './lib/listing-index-rows'
  import { edgeOf, facetDisplay, sortDisplay } from './lib/listing-index-rows'

  defineOptions({
    name: 'ListingIndexSection',
    inheritAttrs: false
  })

  export type { ThirdPartyLogoMark }

  /** Horizontal alignment of a column. */
  export type ListingIndexSectionColumnAlign = 'start' | 'end'

  /** One column of the listing. */
  export type ListingIndexSectionColumn = {
    /** Key of the row value the column shows. */
    key: string
    /** Column header. */
    label: string
    /** Share of the free width the column takes. */
    grow?: 1 | 2 | 3
    /** Horizontal alignment of the column. */
    align?: ListingIndexSectionColumnAlign
  }

  /** One row of the listing, linked by its first column. */
  export type ListingIndexSectionRow = {
    /** Destination of the row. */
    href: string
    /** Group the row is listed under. */
    group: string
    /** The row's values, keyed by column. */
    values: Record<string, string>
    /** The facet values the row carries, keyed by facet. */
    facets?: Record<string, string[]>
    /** Client mark drawn before the name on the table and above it on phones. */
    mark?: ThirdPartyLogoMark
  }

  /** One option of a facet select. */
  export type ListingIndexSectionFacetOption = {
    /** Value a row carries for the facet. */
    value: string
    /** Visible label of the option. */
    label: string
  }

  /** One facet select the reader narrows the listing by. */
  export type ListingIndexSectionFacet = {
    /** Identity of the facet: the key of the row facet it narrows, and the URL query parameter that seeds it. */
    id: string
    /** Accessible name of the select. */
    label: string
    /** Label of the option that keeps every row. */
    allLabel: string
    /** The values the reader can narrow to. */
    options: ListingIndexSectionFacetOption[]
  }

  /** One order of the listing. */
  export type ListingIndexSectionSort = {
    /** Stable value of the order. */
    value: string
    /** Visible label of the order. */
    label: string
    /** Column whose values the order sorts on; empty keeps the source order. */
    by?: string
  }

  export interface ListingIndexSectionProps {
    /** In-page `id` of the band, the target of a `#hash` link. */
    anchor?: string
    /** Headline over the listing, rendered by the section title as its `h2` and naming the band. */
    title?: string
    /** The columns, left to right; each is `{ key, label, grow?, align? }`. The first names the row and links it, the second describes it on phones. */
    columns?: ListingIndexSectionColumn[]
    /** Every row, in source order; each is `{ href, group, values, facets, mark? }` where `values` and `facets` are keyed by column and facet and `mark` is the client's `{ name, logo }`. */
    data?: ListingIndexSectionRow[]
    /** The groups the rows are listed under, in order; a group with no matching row is not shown. */
    groups?: string[]
    /** The facet selects; each is `{ id, label, allLabel, options }` where `id` matches a row facet and seeds it from `?id=` in the URL, and every option is `{ value, label }`. */
    facets?: ListingIndexSectionFacet[]
    /** The orders, the first the default; each is `{ value, label, by? }` where `by` is the column it sorts on and an empty `by` keeps the source order. */
    sorts?: ListingIndexSectionSort[]
    /** Accessible name of the order select. */
    sortAriaLabel?: string
    /** Placeholder of the search field from the large breakpoint up; the field is omitted when this and `searchAriaLabel` are both empty. */
    searchPlaceholder?: string
    /** Shorter placeholder of the search field below the large breakpoint; empty uses `searchPlaceholder`. */
    searchShortPlaceholder?: string
    /** Accessible name of the search field. */
    searchAriaLabel?: string
    /** Headline of the state shown when nothing matches; the state renders only with it. */
    emptyTitle?: string
    /** Sentence under the empty-state headline. */
    emptyDescription?: string
    /** Label of the empty-state button that clears the search and every facet; no button renders without it. */
    emptyActionLabel?: string
    /** Label of the filter button below the large breakpoint; empty uses the locale catalog (`Filters`). */
    filterLabel?: string
  }

  const props = withDefaults(defineProps<ListingIndexSectionProps>(), {
    anchor: '',
    title: '',
    columns: () => [],
    data: () => [],
    groups: () => [],
    facets: () => [],
    sorts: () => [],
    sortAriaLabel: '',
    searchPlaceholder: '',
    searchShortPlaceholder: '',
    searchAriaLabel: '',
    emptyTitle: '',
    emptyDescription: '',
    emptyActionLabel: '',
    filterLabel: ''
  })

  const attrs = useAttrs()

  const { t } = useTranslate({ listingIndexSection: en.listingIndexSection })

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'listing-index-section'
  )

  const query = ref('')
  const sort = ref(props.sorts[0]?.value ?? '')
  const selected = ref<Record<string, string>>(
    Object.fromEntries(props.facets.map((facet) => [facet.id, '']))
  )

  const wideQuery = useMediaQuery('(min-width: 64rem)')
  const mounted = useMounted()
  const wide = computed(() => mounted.value && wideQuery.value)

  onMounted(() =>
    listing.seedFacets(props.facets, globalThis.location?.search ?? '', selected.value)
  )

  const hasRows = computed(() => props.data.length > 0)

  const hasSearch = computed(() => Boolean(props.searchPlaceholder || props.searchAriaLabel))

  const hasHeader = computed(() => hasRows.value && props.title.length > 0)

  const nameKey = computed(() => props.columns[0]?.key ?? '')

  const detailKey = computed(() => props.columns[1]?.key ?? '')

  const placeholder = computed(() =>
    wide.value ? props.searchPlaceholder : props.searchShortPlaceholder || props.searchPlaceholder
  )

  const matches = computed(() =>
    listing.filterRows(props.data, selected.value, query.value, props.sorts, sort.value)
  )

  const listed = computed(() => listing.groupRows(props.groups, matches.value))

  const phoneChunks = useLazyChunks({ rowHeight: 1, chunkSize: 1, threshold: 0 })
  const tableChunks = useLazyChunks({ rowHeight: 1, chunkSize: 1, threshold: 0 })
  const lazyGroups = computed(() => matches.value.length > listing.LAZY_ROWS)
  const blocksOf = (chunks: typeof phoneChunks, rowHeight: number) =>
    computed(() =>
      listing.groupBlocks(listed.value, lazyGroups.value ? chunks.split : null, rowHeight)
    )
  const phoneBlocks = blocksOf(phoneChunks, 76)
  const tableBlocks = blocksOf(tableChunks, 56)

  const applied = computed(() => listing.appliedFacets(props.facets, selected.value))

  const filterButtonLabel = computed(() => {
    const label = props.filterLabel || t('listingIndexSection.filters')
    return applied.value.length > 0
      ? t('listingIndexSection.filtersApplied', { label, count: applied.value.length })
      : label
  })

  const updateFacet = (key: string, value: unknown) => {
    selected.value[key] = typeof value === 'string' ? value : ''
  }

  const updateSort = (value: unknown) => {
    sort.value = typeof value === 'string' ? value : ''
  }

  const clearFilters = () => {
    query.value = ''
    props.facets.forEach((facet) => {
      selected.value[facet.id] = ''
    })
  }
</script>

<template>
  <SectionBand
    v-bind="$attrs"
    :data-testid="testId"
    :anchor="anchor"
    :label="hasHeader ? title : ''"
    :filled="hasRows"
    marks="bottom"
  >
    <ModuleHeader
      v-if="hasHeader"
      align="start"
      :framed="false"
      :title="title"
      class="border-b border-(--border-default) px-(--spacing-xl) py-(--spacing-2xl)"
    />

    <StoryIndexSectionToolbar
      v-if="hasSearch || facets.length > 0 || sorts.length > 0"
      v-model:query="query"
      :data-testid="`${testId}__toolbar`"
      :test-id="testId"
      :filterable="facets.length > 0 || sorts.length > 0"
      :filter-label="filterButtonLabel"
      :searchable="hasSearch"
      :search-placeholder="placeholder"
      :search-aria-label="searchAriaLabel"
      :applied="applied"
      class="border-b border-(--border-default) lg:items-center"
      @remove="(_event, key) => updateFacet(key, '')"
    >
      <StoryIndexSectionFacetSelect
        v-for="facet in facets"
        :key="facet.id"
        :model-value="selected[facet.id]"
        :label="facet.label"
        :options="facet.options"
        :all-option="{ value: '', label: facet.allLabel }"
        :placeholder="facet.allLabel"
        :display-value="facetDisplay(facet)"
        :search-placeholder="t('listingIndexSection.search')"
        :search-aria-label="
          t('listingIndexSection.searchFacet', { facet: facet.label.toLowerCase() })
        "
        :no-match-label="t('listingIndexSection.noMatch')"
        @update:model-value="(value) => updateFacet(facet.id, value)"
      />
      <StoryIndexSectionFacetSelect
        v-if="sorts.length > 0"
        :model-value="sort"
        :label="sortAriaLabel"
        :options="sorts"
        :display-value="sortDisplay(sorts)"
        :search-placeholder="t('listingIndexSection.search')"
        :search-aria-label="
          t('listingIndexSection.searchFacet', { facet: sortAriaLabel.toLowerCase() })
        "
        :no-match-label="t('listingIndexSection.noMatch')"
        @update:model-value="updateSort"
      />
    </StoryIndexSectionToolbar>

    <template v-if="listed.length > 0">
      <div
        :data-testid="`${testId}__list`"
        class="sm:hidden"
      >
        <template
          v-for="{ entry, index, mounted: shown, height } in phoneBlocks"
          :key="entry.group"
        >
          <div
            v-if="!shown"
            :ref="(el) => phoneChunks.observe(el, index)"
            :data-chunk="index"
            aria-hidden="true"
            :style="{ height }"
          />
          <section
            v-else
            :data-ruled="index > 0 || null"
            class="data-[ruled]:border-t data-[ruled]:border-(--border-default)"
          >
            <h3
              class="sticky top-(--layout-header-height) z-20 m-0 border-b border-(--border-default) bg-(--bg-canvas) px-(--spacing-xl) py-(--spacing-md) text-overline-md text-(--text-muted)"
            >
              {{ entry.group }}
            </h3>
            <ItemList>
              <Item
                v-for="row in entry.rows"
                :key="row.href"
                role="listitem"
                class="relative px-(--spacing-xl)! py-(--spacing-lg)! hover:bg-(--bg-hover)"
              >
                <ItemContent class="gap-(--spacing-xs)">
                  <span
                    v-if="row.mark"
                    class="flex h-5 items-center"
                  >
                    <img
                      :src="row.mark.logo"
                      :alt="row.mark.name"
                      loading="lazy"
                      class="h-full w-auto max-w-28 object-contain brightness-0 [[data-theme=dark]_&]:invert"
                    />
                  </span>
                  <ItemTitle>
                    <a
                      :href="safeHref(row.href) ?? undefined"
                      class="text-pretty text-label-lg text-(--text-default) after:absolute after:inset-0 after:content-['']"
                    >
                      {{ row.values[nameKey] }}
                    </a>
                  </ItemTitle>
                  <ItemDescription
                    v-if="detailKey && row.values[detailKey]"
                    class="line-clamp-none! text-overline-sm! text-pretty"
                  >
                    {{ row.values[detailKey] }}
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemList>
          </section>
        </template>
      </div>

      <Table
        :data-testid="`${testId}__table`"
        class="max-sm:hidden!"
      >
        <TableHeader>
          <TableRow>
            <TableHeadCell
              v-for="(column, index) in columns"
              :key="column.key"
              :grow="column.grow ?? 1"
              :align="column.align ?? 'start'"
              :data-edge="edgeOf(index, columns.length)"
              class="data-[edge=end]:pe-(--spacing-xl)! data-[edge=start]:ps-(--spacing-xl)!"
            >
              <span class="text-overline-md text-(--text-muted)">{{ column.label }}</span>
            </TableHeadCell>
          </TableRow>
        </TableHeader>

        <template
          v-for="{ entry, index, mounted: shown, height } in tableBlocks"
          :key="entry.group"
        >
          <div
            v-if="!shown"
            :ref="(el) => tableChunks.observe(el, index)"
            :data-chunk="index"
            aria-hidden="true"
            :style="{ height }"
          />
          <TableBody v-else>
            <TableRow
              :data-ruled="index > 0 || null"
              class="sticky top-(--layout-header-height) z-20 bg-(--bg-surface) data-[ruled]:border-t data-[ruled]:border-(--border-default)"
            >
              <TableCell
                :grow="3"
                class="ps-(--spacing-xl)!"
              >
                <h3 class="m-0 text-overline-md text-(--text-default)">{{ entry.group }}</h3>
              </TableCell>
            </TableRow>
            <TableRow
              v-for="row in entry.rows"
              :key="row.href"
              class="cursor-pointer hover:[--table-row-bg:var(--bg-hover)]!"
              @click="followRowLink"
            >
              <TableCell
                v-for="(column, cellIndex) in columns"
                :key="column.key"
                :grow="column.grow ?? 1"
                :align="column.align ?? 'start'"
                :principal="cellIndex === 0"
                :data-edge="edgeOf(cellIndex, columns.length)"
                :data-meta="cellIndex > 0 || null"
                class="py-(--spacing-lg)! text-(--text-muted) data-[meta]:text-overline-sm! data-[edge=end]:pe-(--spacing-xl)! data-[edge=start]:ps-(--spacing-xl)!"
              >
                <div
                  v-if="cellIndex === 0"
                  class="flex min-w-0 items-center gap-(--spacing-lg)"
                >
                  <span
                    v-if="row.mark"
                    class="flex h-5 w-28 shrink-0 items-center"
                  >
                    <img
                      :src="row.mark.logo"
                      :alt="row.mark.name"
                      loading="lazy"
                      class="h-full w-auto max-w-full object-contain brightness-0 [[data-theme=dark]_&]:invert"
                    />
                  </span>
                  <a
                    :href="safeHref(row.href) ?? undefined"
                    class="min-w-0 whitespace-normal text-pretty text-label-lg text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                  >
                    {{ row.values[column.key] }}
                  </a>
                </div>
                <span
                  v-else
                  class="min-w-0 truncate"
                  :title="row.values[column.key]"
                  >{{ row.values[column.key] }}</span
                >
              </TableCell>
            </TableRow>
          </TableBody>
        </template>
      </Table>
    </template>

    <EmptyState
      v-else-if="emptyTitle"
      :title="emptyTitle"
      :description="emptyDescription"
    >
      <template
        v-if="emptyActionLabel"
        #actions
      >
        <Button
          :label="emptyActionLabel"
          variant="secondary"
          size="large"
          @click="clearFilters"
        />
      </template>
    </EmptyState>
  </SectionBand>
</template>
