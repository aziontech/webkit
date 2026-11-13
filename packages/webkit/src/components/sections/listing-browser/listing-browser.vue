<script setup lang="ts">
  import { useMediaQuery } from '@vueuse/core'
  import { computed, onMounted, ref, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import Item from '../../content/item/item.vue'
  import ItemContent from '../../content/item/item-content.vue'
  import ItemDescription from '../../content/item/item-description.vue'
  import ItemList from '../../content/item/item-list.vue'
  import ItemTitle from '../../content/item/item-title.vue'
  import Table from '../../data/table/table.vue'
  import TableBody from '../../data/table/table-body/table-body.vue'
  import TableCell from '../../data/table/table-cell/table-cell.vue'
  import TableHeadCell from '../../data/table/table-head-cell/table-head-cell.vue'
  import TableHeader from '../../data/table/table-header/table-header.vue'
  import TableRow from '../../data/table/table-row/table-row.vue'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import InputText from '../../inputs/input-text/input-text.vue'
  import Select from '../../inputs/select/select.vue'
  import SelectContent from '../../inputs/select/select-content/select-content.vue'
  import SelectOption from '../../inputs/select/select-option/select-option.vue'
  import SelectTrigger from '../../inputs/select/select-trigger/select-trigger.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'

  defineOptions({
    name: 'ListingBrowser',
    inheritAttrs: false
  })

  /** One column of the listing. */
  export type ListingBrowserColumn = {
    /** Key of the row value the column shows. */
    key: string
    /** Column header. */
    label: string
    /** Share of the free width the column takes. */
    grow?: 1 | 2 | 3
    /** Horizontal alignment of the column. */
    align?: 'start' | 'end'
  }

  /** One row of the listing, linked by its first column. */
  export type ListingBrowserRow = {
    /** Destination of the row. */
    href: string
    /** Group the row is listed under. */
    group: string
    /** The row's values, keyed by column. */
    values: Record<string, string>
    /** The facet values the row carries, keyed by facet. */
    facets?: Record<string, string[]>
  }

  /** One option of a facet select. */
  export type ListingBrowserFacetOption = {
    /** Value a row carries for the facet. */
    value: string
    /** Visible label of the option. */
    label: string
  }

  /** One facet select the reader narrows the listing by. */
  export type ListingBrowserFacet = {
    /** Key of the row facet it narrows, and the URL query parameter that seeds it. */
    key: string
    /** Accessible name of the select. */
    label: string
    /** Label of the option that keeps every row. */
    allLabel: string
    /** The values the reader can narrow to. */
    options: ListingBrowserFacetOption[]
  }

  /** One order of the listing. */
  export type ListingBrowserSort = {
    /** Stable value of the order. */
    value: string
    /** Visible label of the order. */
    label: string
    /** Column whose values the order sorts on; empty keeps the source order. */
    by?: string
  }

  /** Copy of the search field. */
  export type ListingBrowserSearch = {
    /** Placeholder of the field from the large breakpoint up. */
    placeholder: string
    /** Shorter placeholder below the large breakpoint. */
    shortPlaceholder?: string
    /** Accessible name of the field. */
    label: string
  }

  /** Copy of the state shown when nothing matches. */
  export type ListingBrowserEmpty = {
    /** Headline of the state. */
    title: string
    /** Sentence under the headline. */
    description?: string
    /** Label of the button that clears the search and every facet. */
    clearLabel?: string
  }

  interface Props {
    /** In-page `id` of the band, the target of a `#hash` link. */
    anchor?: string
    /** Headline over the listing, rendered by the section title as its `h2` and naming the band. */
    title?: string
    /** The columns, left to right; each is `{ key, label, grow?, align? }`. The first names the row and links it, the second describes it on phones. */
    columns?: ListingBrowserColumn[]
    /** Every row, in source order; each is `{ href, group, values, facets }` where `values` and `facets` are keyed by column and facet. */
    rows?: ListingBrowserRow[]
    /** The groups the rows are listed under, in order; a group with no matching row is not shown. */
    groups?: string[]
    /** The facet selects; each is `{ key, label, allLabel, options }` where `key` matches a row facet and seeds it from `?key=` in the URL, and every option is `{ value, label }`. */
    facets?: ListingBrowserFacet[]
    /** The orders, the first the default; each is `{ value, label, by? }` where `by` is the column it sorts on and an empty `by` keeps the source order. */
    sorts?: ListingBrowserSort[]
    /** Accessible name of the order select. */
    sortAriaLabel?: string
    /** The search field; `{ placeholder, shortPlaceholder, label }` where `shortPlaceholder` is used below the large breakpoint and `label` names the field. Omitted when absent. */
    search?: ListingBrowserSearch
    /** The state shown when nothing matches; `{ title, description, clearLabel }` where `clearLabel` is the button that clears the search and every facet. Omitted when absent. */
    empty?: ListingBrowserEmpty
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    title: '',
    columns: () => [],
    rows: () => [],
    groups: () => [],
    facets: () => [],
    sorts: () => [],
    sortAriaLabel: '',
    search: undefined,
    empty: undefined
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-listing-browser'
  )

  const query = ref('')
  const sort = ref(props.sorts[0]?.value ?? '')
  const selected = ref<Record<string, string>>(
    Object.fromEntries(props.facets.map((facet) => [facet.key, '']))
  )

  const wide = useMediaQuery('(min-width: 64rem)')

  onMounted(() => {
    const params = new URLSearchParams(globalThis.location?.search ?? '')
    props.facets.forEach((facet) => {
      const value = params.get(facet.key)
      if (value && facet.options.some((option) => option.value === value)) {
        selected.value[facet.key] = value
      }
    })
  })

  const hasRows = computed(() => props.rows.length > 0)

  const hasHeader = computed(() => hasRows.value && props.title.length > 0)

  const nameKey = computed(() => props.columns[0]?.key ?? '')

  const detailKey = computed(() => props.columns[1]?.key ?? '')

  const placeholder = computed(() =>
    wide.value
      ? (props.search?.placeholder ?? '')
      : props.search?.shortPlaceholder || props.search?.placeholder || ''
  )

  const matches = computed(() => {
    const needle = query.value.trim().toLowerCase()
    const found = props.rows.filter(
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

  const facetDisplay = (facet: ListingBrowserFacet) => (value: unknown) =>
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
      selected.value[facet.key] = ''
    })
  }
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    :aria-label="hasHeader ? title : undefined"
    class="scroll-mt-(--spacing-xxl)"
  >
    <SectionModule
      v-if="hasRows"
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <SectionTitle
          v-if="hasHeader"
          kind="left"
          :framed="false"
          :title="title"
          class="border-b border-(--border-default) px-(--spacing-xl) py-(--spacing-xxl)"
        />

        <div
          v-if="search || facets.length > 0 || sorts.length > 0"
          role="search"
          :data-testid="`${testId}__toolbar`"
          class="grid gap-(--spacing-md) border-b border-(--border-default) px-(--spacing-xl) py-(--spacing-lg) lg:grid-cols-[minmax(0,4fr)_repeat(3,minmax(0,1fr))] lg:items-center"
        >
          <InputText
            v-if="search"
            v-model="query"
            size="large"
            type="text"
            :placeholder="placeholder"
            :aria-label="search.label"
          >
            <template #iconLeft>
              <i class="pi pi-search text-(--text-muted)" />
            </template>
          </InputText>
          <Select
            v-for="facet in facets"
            :key="facet.key"
            :model-value="selected[facet.key]"
            size="large"
            :placeholder="facet.allLabel"
            :display-value="facetDisplay(facet)"
            @update:model-value="(value) => updateFacet(facet.key, value)"
          >
            <SelectTrigger :aria-label="facet.label" />
            <SelectContent>
              <SelectOption value="">{{ facet.allLabel }}</SelectOption>
              <SelectOption
                v-for="option in facet.options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </SelectOption>
            </SelectContent>
          </Select>
          <Select
            v-if="sorts.length > 0"
            :model-value="sort"
            size="large"
            :display-value="sortDisplay"
            @update:model-value="updateSort"
          >
            <SelectTrigger :aria-label="sortAriaLabel || undefined" />
            <SelectContent>
              <SelectOption
                v-for="option in sorts"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </SelectOption>
            </SelectContent>
          </Select>
        </div>

        <template v-if="listed.length > 0">
          <div
            :data-testid="`${testId}__list`"
            class="sm:hidden"
          >
            <section
              v-for="(entry, index) in listed"
              :key="entry.group"
              :data-ruled="index > 0 || null"
              class="data-[ruled]:border-t data-[ruled]:border-(--border-default)"
            >
              <h3
                class="m-0 border-b border-(--border-default) px-(--spacing-xl) py-(--spacing-md) text-overline-md text-(--text-muted)"
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
                      class="line-clamp-none! text-pretty"
                    >
                      {{ row.values[detailKey] }}
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </ItemList>
            </section>
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
                  class="data-[edge=end]:pr-(--spacing-xl)! data-[edge=start]:pl-(--spacing-xl)!"
                >
                  <span class="text-overline-md text-(--text-muted)">{{ column.label }}</span>
                </TableHeadCell>
              </TableRow>
            </TableHeader>

            <TableBody
              v-for="(entry, index) in listed"
              :key="entry.group"
            >
              <TableRow
                :data-ruled="index > 0 || null"
                class="bg-(--bg-surface) data-[ruled]:border-t data-[ruled]:border-(--border-default)"
              >
                <TableCell
                  :grow="3"
                  class="pl-(--spacing-xl)!"
                >
                  <h3 class="m-0 text-overline-md text-(--text-default)">{{ entry.group }}</h3>
                </TableCell>
              </TableRow>
              <TableRow
                v-for="row in entry.rows"
                :key="row.href"
                class="relative cursor-pointer hover:[--table-row-bg:var(--bg-canvas)]"
              >
                <TableCell
                  v-for="(column, cellIndex) in columns"
                  :key="column.key"
                  :grow="column.grow ?? 1"
                  :align="column.align ?? 'start'"
                  :principal="cellIndex === 0"
                  :data-edge="edge(cellIndex)"
                  class="py-(--spacing-lg)! text-(--text-muted) data-[edge=end]:pr-(--spacing-xl)! data-[edge=start]:pl-(--spacing-xl)!"
                >
                  <a
                    v-if="cellIndex === 0"
                    :href="row.href"
                    class="text-label-lg text-(--text-default) after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-(--ring-color) focus-visible:after:ring-inset"
                  >
                    {{ row.values[column.key] }}
                  </a>
                  <template v-else>
                    {{ row.values[column.key] }}
                  </template>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </template>

        <EmptyState
          v-else-if="empty"
          :title="empty.title"
          :description="empty.description ?? ''"
        >
          <template
            v-if="empty.clearLabel"
            #actions
          >
            <Button
              :label="empty.clearLabel"
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
