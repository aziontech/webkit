<script setup lang="ts">
  import { useMediaQuery, useMounted } from '@vueuse/core'
  import { computed, defineAsyncComponent, onMounted, ref, useAttrs, useId } from 'vue'

  import { useLazyChunks } from '../../../composables/use-lazy-chunks'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import Item from '../../content/item/item.vue'
  import ItemContent from '../../content/item/item-content.vue'
  import ItemDescription from '../../content/item/item-description.vue'
  import ItemList from '../../content/item/item-list.vue'
  import ItemTitle from '../../content/item/item-title.vue'
  import type { LogoMark } from '../../content/logo/logo.vue'
  import Table from '../../data/table/table.vue'
  import TableBody from '../../data/table/table-body/table-body.vue'
  import TableCell from '../../data/table/table-cell/table-cell.vue'
  import TableHeadCell from '../../data/table/table-head-cell/table-head-cell.vue'
  import TableHeader from '../../data/table/table-header/table-header.vue'
  import TableRow from '../../data/table/table-row/table-row.vue'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Input from '../../input/input/input.vue'
  import Select from '../../input/select/select.vue'
  import SelectContent from '../../input/select/select-content/select-content.vue'
  import SelectItem from '../../input/select/select-item/select-item.vue'
  import SelectTrigger from '../../input/select/select-trigger/select-trigger.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'

  defineOptions({
    name: 'ListingIndexSection',
    inheritAttrs: false
  })

  export type { LogoMark }

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
    mark?: LogoMark
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

  const Chip = defineAsyncComponent(() => import('../../input/chip/chip.vue'))
  const attrs = useAttrs()

  const { t } = useTranslate({ listingIndexSection: en.listingIndexSection })

  const panelId = useId()

  const SEARCH_THRESHOLD = 7

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'listing-index-section'
  )

  const query = ref('')
  const sort = ref(props.sorts[0]?.value ?? '')
  const selected = ref<Record<string, string>>(
    Object.fromEntries(props.facets.map((facet) => [facet.id, '']))
  )

  const filtersOpen = ref(false)

  const optionQuery = ref<Record<string, string>>({})

  const wideQuery = useMediaQuery('(min-width: 64rem)')
  const mounted = useMounted()
  const wide = computed(() => mounted.value && wideQuery.value)

  onMounted(() => {
    const params = new URLSearchParams(globalThis.location?.search ?? '')
    props.facets.forEach((facet) => {
      const value = params.get(facet.id)
      if (value && facet.options.some((option) => option.value === value)) {
        selected.value[facet.id] = value
      }
    })
  })

  const hasRows = computed(() => props.data.length > 0)

  const hasSearch = computed(() => Boolean(props.searchPlaceholder || props.searchAriaLabel))

  const hasHeader = computed(() => hasRows.value && props.title.length > 0)

  const nameKey = computed(() => props.columns[0]?.key ?? '')

  const detailKey = computed(() => props.columns[1]?.key ?? '')

  const placeholder = computed(() =>
    wide.value ? props.searchPlaceholder : props.searchShortPlaceholder || props.searchPlaceholder
  )

  const matches = computed(() => {
    const needle = query.value.trim().toLowerCase()
    const found = props.data.filter(
      (row) =>
        Object.entries(selected.value).every(
          ([key, value]) => !value || (row.facets?.[key] ?? []).includes(value)
        ) &&
        (!needle || Object.values(row.values).join(' ').toLowerCase().includes(needle))
    )
    const by = props.sorts.find((option) => option.value === sort.value)?.by
    return by
      ? [...found].sort((a, b) => (a.values[by] ?? '').localeCompare(b.values[by] ?? ''))
      : found
  })

  const listed = computed(() =>
    props.groups
      .map((group) => ({ group, rows: matches.value.filter((row) => row.group === group) }))
      .filter((entry) => entry.rows.length > 0)
  )

  const LAZY_ROWS = 300
  const phoneChunks = useLazyChunks({ rowHeight: 1, chunkSize: 1, threshold: 0 })
  const tableChunks = useLazyChunks({ rowHeight: 1, chunkSize: 1, threshold: 0 })
  const lazyGroups = computed(() => matches.value.length > LAZY_ROWS)
  const blocksOf = (chunks: typeof phoneChunks, rowHeight: number) =>
    computed(() =>
      (lazyGroups.value
        ? chunks.split(listed.value)
        : listed.value.map((entry, index) => ({ index, items: [entry], mounted: true }))
      ).map((chunk) => ({
        index: chunk.index,
        entry: chunk.items[0],
        mounted: chunk.mounted,
        height: `${(chunk.items[0].rows.length + 1) * rowHeight}px`
      }))
    )
  const phoneBlocks = blocksOf(phoneChunks, 76)
  const tableBlocks = blocksOf(tableChunks, 56)

  const SORT_KEY = '__sort'

  const narrowed = <T extends { label: string }>(key: string, options: T[]): T[] => {
    const term = (optionQuery.value[key] ?? '').trim().toLowerCase()
    return term ? options.filter((option) => option.label.toLowerCase().includes(term)) : options
  }

  const setOptionQuery = (key: string, value: string) => {
    optionQuery.value = { ...optionQuery.value, [key]: value }
  }

  const applied = computed(() =>
    props.facets.flatMap((facet) => {
      const value = selected.value[facet.id]
      const option = value
        ? facet.options.find((candidate) => candidate.value === value)
        : undefined
      return option ? [{ key: facet.id, label: `${facet.label}: ${option.label}` }] : []
    })
  )

  const filterButtonLabel = computed(() => {
    const label = props.filterLabel || t('listingIndexSection.filters')
    return applied.value.length > 0
      ? t('listingIndexSection.filtersApplied', { label, count: applied.value.length })
      : label
  })

  const followRow = (event: MouseEvent): void => {
    const target = event.target as Element | null
    if (!target || target.closest('a, button')) return
    if (window.getSelection()?.toString()) return
    const link = (event.currentTarget as Element | null)?.querySelector('a[href]')
    link?.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey
      })
    )
  }

  const facetDisplay = (facet: ListingIndexSectionFacet) => (value: unknown) =>
    facet.options.find((option) => option.value === value)?.label ?? ''

  const sortDisplay = (value: unknown) =>
    props.sorts.find((option) => option.value === value)?.label ?? ''

  const edge = (index: number) =>
    index === 0 ? 'start' : index === props.columns.length - 1 ? 'end' : undefined

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
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    :aria-label="hasHeader ? title : undefined"
    class="scroll-mt-(--spacing-2xl)"
  >
    <SectionModule
      v-if="hasRows"
      :divided="false"
      :padded="false"
    >
      <RegistrationFrame
        flush
        borders="y"
        marks="bottom"
      >
        <SectionTitle
          v-if="hasHeader"
          align="start"
          :framed="false"
          :title="title"
          class="border-b border-(--border-default) px-(--spacing-xl) py-(--spacing-2xl)"
        />

        <div
          v-if="hasSearch || facets.length > 0 || sorts.length > 0"
          role="search"
          :data-testid="`${testId}__toolbar`"
          class="grid gap-(--spacing-md) border-b border-(--border-default) px-(--spacing-xl) py-(--spacing-lg) lg:grid-cols-[minmax(0,4fr)_repeat(3,minmax(0,1fr))] lg:items-center"
        >
          <div class="flex items-center gap-(--spacing-sm) lg:contents">
            <Button
              v-if="facets.length > 0 || sorts.length > 0"
              :data-testid="`${testId}__filter`"
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
            v-if="facets.length > 0 || sorts.length > 0"
            :id="panelId"
            :data-testid="`${testId}__filters`"
            :data-state="filtersOpen ? 'open' : 'closed'"
            class="flex flex-col gap-(--spacing-sm) max-lg:hidden max-lg:data-[state=open]:flex lg:contents"
          >
            <Select
              v-for="facet in facets"
              :key="facet.id"
              :model-value="selected[facet.id]"
              size="large"
              :placeholder="facet.allLabel"
              :display-value="facetDisplay(facet)"
              @update:model-value="(value) => updateFacet(facet.id, value)"
              @update:open="setOptionQuery(facet.id, '')"
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
                    :placeholder="t('listingIndexSection.search')"
                    :aria-label="
                      t('listingIndexSection.searchFacet', { facet: facet.label.toLowerCase() })
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
                <SelectItem value="">{{ facet.allLabel }}</SelectItem>
                <SelectItem
                  v-for="option in narrowed(facet.id, facet.options)"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
                <p
                  v-if="narrowed(facet.id, facet.options).length === 0"
                  role="status"
                  class="px-(--spacing-xs) py-(--spacing-2xs) text-label-sm text-(--text-muted)"
                >
                  {{ t('listingIndexSection.noMatch') }}
                </p>
              </SelectContent>
            </Select>
            <Select
              v-if="sorts.length > 0"
              :model-value="sort"
              size="large"
              :display-value="sortDisplay"
              @update:model-value="updateSort"
              @update:open="setOptionQuery(SORT_KEY, '')"
            >
              <SelectTrigger :aria-label="sortAriaLabel || undefined" />
              <SelectContent>
                <template
                  v-if="sorts.length > SEARCH_THRESHOLD"
                  #search
                >
                  <Input
                    :model-value="optionQuery[SORT_KEY] ?? ''"
                    size="small"
                    :placeholder="t('listingIndexSection.search')"
                    :aria-label="
                      t('listingIndexSection.searchFacet', { facet: sortAriaLabel.toLowerCase() })
                    "
                    @update:model-value="setOptionQuery(SORT_KEY, $event)"
                  >
                    <template #leading>
                      <i
                        class="ai ai-search"
                        aria-hidden="true"
                      />
                    </template>
                  </Input>
                </template>
                <SelectItem
                  v-for="option in narrowed(SORT_KEY, sorts)"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
                <p
                  v-if="narrowed(SORT_KEY, sorts).length === 0"
                  role="status"
                  class="px-(--spacing-xs) py-(--spacing-2xs) text-label-sm text-(--text-muted)"
                >
                  {{ t('listingIndexSection.noMatch') }}
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
              @remove="updateFacet(chip.key, '')"
            />
          </div>
        </div>

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
                          :href="row.href"
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
                  :data-edge="edge(index)"
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
                  @click="followRow"
                >
                  <TableCell
                    v-for="(column, cellIndex) in columns"
                    :key="column.key"
                    :grow="column.grow ?? 1"
                    :align="column.align ?? 'start'"
                    :principal="cellIndex === 0"
                    :data-edge="edge(cellIndex)"
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
                        :href="row.href"
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
      </RegistrationFrame>
    </SectionModule>
  </section>
</template>
