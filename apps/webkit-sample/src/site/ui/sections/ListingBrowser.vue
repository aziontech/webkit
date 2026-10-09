<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import FrameBox from '@aziontech/webkit/frame-box'
  import InputText from '@aziontech/webkit/input-text'
  import ItemContent from '@aziontech/webkit/item-content'
  import ItemDescription from '@aziontech/webkit/item-description'
  import ItemList from '@aziontech/webkit/item-list'
  import Item from '@aziontech/webkit/item-root'
  import ItemTitle from '@aziontech/webkit/item-title'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import SelectContent from '@aziontech/webkit/select-content'
  import SelectOption from '@aziontech/webkit/select-option'
  import Select from '@aziontech/webkit/select-root'
  import SelectTrigger from '@aziontech/webkit/select-trigger'
  import TableBody from '@aziontech/webkit/table-body'
  import TableCell from '@aziontech/webkit/table-cell'
  import TableHeadCell from '@aziontech/webkit/table-head-cell'
  import TableHeader from '@aziontech/webkit/table-header'
  import Table from '@aziontech/webkit/table-root'
  import TableRow from '@aziontech/webkit/table-row'
  import FilterButton from '@console/components/list/FilterButton.vue'
  import FilterChips from '@console/components/list/FilterChips.vue'
  import { computed, reactive } from 'vue'
  import { useRoute } from 'vue-router'

  import { useSiteLink } from '../../composables/use-site-link'
  import type { ListingColumn } from './ListingTable.vue'

  defineOptions({ name: 'ListingBrowser' })

  export interface ListingFacetOption {
    /** Value a row carries for this facet. */
    value: string
    /** Visible label. */
    label: string
  }

  export interface ListingFacet {
    /** Key of the row facet it narrows; also the query parameter that seeds it. */
    key: string
    /** Accessible name of the control. */
    label: string
    /** Label of the option that shows every row. */
    allLabel: string
    /** The values a reader can narrow to. */
    options: ListingFacetOption[]
  }

  export interface ListingSort {
    /** Stable value of the order. */
    value: string
    /** Visible label. */
    label: string
    /** Column whose values the order sorts on; empty keeps the source order. */
    by?: string
  }

  export interface ListingBrowserRow {
    /** Destination of the row; the first column links to it. */
    href: string
    /** The row's values, keyed by column. */
    values: Record<string, string>
    /** Group the row is listed under. */
    group: string
    /** The facet values the row carries, keyed by facet. */
    facets: Record<string, string[]>
  }

  export interface ListingSearch {
    /** Placeholder of the search field from lg up. */
    placeholder: string
    /** Shorter placeholder below lg. */
    shortPlaceholder: string
    /** Accessible name of the search field. */
    label: string
  }

  export interface ListingEmpty {
    /** Headline when nothing matches. */
    title: string
    /** Sentence under it. */
    description: string
    /** Label of the action that clears every filter. */
    action: string
  }

  interface Props {
    /** Id of the band, for in-page links. */
    anchor?: string
    /** Headline over the listing. */
    title: string
    /** Columns, left to right; the first names the row and the second describes it on phones. */
    columns: ListingColumn[]
    /** Every row of the listing, in source order. */
    rows: ListingBrowserRow[]
    /** Groups the rows are listed under, in order. */
    groups: string[]
    /** Facets the reader narrows the listing by. */
    facets?: ListingFacet[]
    /** Orders the reader can switch between; the first is the default. */
    sorts?: ListingSort[]
    /** Accessible name of the order control. */
    sortLabel?: string
    /** Copy of the search field. */
    search: ListingSearch
    /** Copy of the state when nothing matches. */
    empty: ListingEmpty
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    facets: () => [],
    sorts: () => [],
    sortLabel: 'Sort'
  })

  const ALL = 'all'

  const route = useRoute()
  const { follow } = useSiteLink()

  const seeded = (facet: ListingFacet) => {
    const requested = route.query[facet.key]
    return facet.options.some((option) => option.value === requested) ? String(requested) : ALL
  }

  const selection = reactive({
    query: '',
    sort: props.sorts[0]?.value ?? '',
    facets: Object.fromEntries(props.facets.map((facet) => [facet.key, seeded(facet)])) as Record<
      string,
      string
    >
  })

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

  const facetLabel = (facet: ListingFacet) => (value: string) =>
    value === ALL
      ? facet.allLabel
      : (facet.options.find((option) => option.value === value)?.label ?? value)

  const sortDisplay = (value: string) =>
    props.sorts.find((sort) => sort.value === value)?.label ?? ''

  const nameKey = computed(() => props.columns[0]?.key ?? '')
  const detailKey = computed(() => props.columns[1]?.key ?? '')

  const matches = computed(() => {
    const query = selection.query.trim().toLowerCase()
    const found = props.rows.filter(
      (row) =>
        props.facets.every(
          (facet) =>
            selection.facets[facet.key] === ALL ||
            (row.facets[facet.key] ?? []).includes(selection.facets[facet.key])
        ) &&
        (!query || Object.values(row.values).join(' ').toLowerCase().includes(query))
    )
    const by = props.sorts.find((sort) => sort.value === selection.sort)?.by
    return by
      ? [...found].sort((a, b) => (a.values[by] ?? '').localeCompare(b.values[by] ?? ''))
      : found
  })

  const listed = computed(() =>
    props.groups
      .map((group) => ({ group, rows: matches.value.filter((row) => row.group === group) }))
      .filter((entry) => entry.rows.length > 0)
  )

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
  >
    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <SectionTitle
        kind="left"
        :framed="false"
        :title="title"
        class="border-b border-(--border-default) px-(--spacing-xl) py-(--spacing-xxl)"
      />

      <div
        role="search"
        class="hidden grid-cols-[minmax(0,4fr)_repeat(3,minmax(0,1fr))] items-center gap-(--spacing-md) border-b border-(--border-default) px-(--spacing-xl) py-(--spacing-lg) lg:grid"
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
          >
            <SelectTrigger :aria-label="facet.label" />
            <SelectContent>
              <SelectOption :value="ALL">{{ facet.allLabel }}</SelectOption>
              <SelectOption
                v-for="option in facet.options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </SelectOption>
            </SelectContent>
          </Select>
        </div>

        <div
          v-if="sorts.length"
          class="min-w-0"
        >
          <Select
            v-model="selection.sort"
            size="large"
            :display-value="sortDisplay"
          >
            <SelectTrigger :aria-label="sortLabel" />
            <SelectContent>
              <SelectOption
                v-for="sort in sorts"
                :key="sort.value"
                :value="sort.value"
              >
                {{ sort.label }}
              </SelectOption>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        role="search"
        class="flex flex-col gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-xl) py-(--spacing-lg) lg:hidden"
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

      <EmptyState
        v-if="listed.length === 0"
        :title="empty.title"
        :description="empty.description"
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

      <template v-else>
        <div class="sm:hidden">
          <section
            v-for="(entry, index) in listed"
            :key="entry.group"
            :data-ruled="index > 0 || null"
            class="data-ruled:border-t data-ruled:border-(--border-default)"
          >
            <h3
              class="sticky top-14 z-20 m-0 border-b border-(--border-default) bg-(--bg-canvas) px-(--spacing-xl) py-(--spacing-md) text-overline-md text-(--text-muted)"
            >
              {{ entry.group }}
            </h3>
            <ItemList>
              <Item
                v-for="row in entry.rows"
                :key="row.href"
                class="relative px-(--spacing-xl)! py-(--spacing-lg)! hover:bg-(--bg-hover)"
              >
                <ItemContent class="gap-(--spacing-xs)">
                  <ItemTitle>
                    <a
                      :href="row.href"
                      class="text-pretty text-label-lg text-(--text-default) after:absolute after:inset-0 after:content-['']"
                      @click="follow($event, row.href)"
                    >
                      {{ row.values[nameKey] }}
                    </a>
                  </ItemTitle>
                  <ItemDescription
                    v-if="detailKey"
                    class="line-clamp-none! text-overline-sm! text-pretty"
                  >
                    {{ row.values[detailKey] }}
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemList>
          </section>
        </div>

        <Table class="max-sm:hidden!">
          <TableHeader>
            <TableRow>
              <TableHeadCell
                v-for="(column, index) in columns"
                :key="column.key"
                :grow="column.grow ?? 1"
                :align="column.align ?? 'start'"
                :data-edge="index === 0 ? 'start' : index === columns.length - 1 ? 'end' : null"
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
              class="sticky top-14 z-20 bg-(--bg-surface) data-ruled:border-t data-ruled:border-(--border-default)"
            >
              <TableCell
                :grow="3"
                class="pl-(--spacing-xl)!"
              >
                <h3 class="m-0 text-overline-md text-(--text-default)">
                  {{ entry.group }}
                </h3>
              </TableCell>
            </TableRow>
            <TableRow
              v-for="row in entry.rows"
              :key="row.href"
              class="cursor-pointer hover:[--table-row-bg:var(--bg-hover)]!"
              @click="follow($event, row.href)"
            >
              <TableCell
                v-for="(column, index) in columns"
                :key="column.key"
                :grow="column.grow ?? 1"
                :align="column.align ?? 'start'"
                :principal="index === 0"
                :data-meta="index > 0 || null"
                :data-edge="index === 0 ? 'start' : index === columns.length - 1 ? 'end' : null"
                class="py-(--spacing-lg)! text-(--text-muted) data-[meta]:text-overline-sm! data-[edge=end]:pr-(--spacing-xl)! data-[edge=start]:pl-(--spacing-xl)!"
              >
                <a
                  v-if="index === 0"
                  :href="row.href"
                  class="min-w-0 whitespace-normal text-pretty text-label-lg text-(--text-default)"
                  @click.stop="follow($event, row.href)"
                >
                  {{ row.values[column.key] }}
                </a>
                <span
                  v-else
                  class="min-w-0 truncate"
                  :title="row.values[column.key]"
                  >{{ row.values[column.key] }}</span
                >
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </template>
    </FrameBox>
  </SectionModule>
</template>
