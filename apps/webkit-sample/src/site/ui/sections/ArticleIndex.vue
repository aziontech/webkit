<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import FrameBox from '@aziontech/webkit/frame-box'
  import InputText from '@aziontech/webkit/input-text'
  import SectionModule from '@aziontech/webkit/section-module'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import SelectContent from '@aziontech/webkit/select-content'
  import SelectOption from '@aziontech/webkit/select-option'
  import Select from '@aziontech/webkit/select-root'
  import SelectTrigger from '@aziontech/webkit/select-trigger'
  import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import { useOptionSearch } from '../../composables/use-option-search'
  import ArticleRows, { type ArticleRow, type ArticleRowsKind } from '../ArticleRows.vue'

  defineOptions({ name: 'ArticleIndex' })

  export interface ArticleIndexItem extends ArticleRow {
    /** Categories the article is filed under. */
    categories: string[]
    /** Values the article carries for each facet, keyed by facet. */
    facets?: Record<string, string[]>
  }

  export interface ArticleIndexFacet {
    /** Key of the item facet it narrows. */
    key: string
    /** Accessible name of the control. */
    label: string
    /** Label of the option that shows every article. */
    allLabel: string
    /** The values a reader can narrow to, in order. */
    options: string[]
  }

  export interface ArticleIndexSearch {
    /** Placeholder of the search field. */
    placeholder: string
    /** Accessible name of the search field. */
    label: string
  }

  export interface ArticleIndexEmpty {
    /** Headline when nothing matches. */
    title: string
    /** Sentence under the headline. */
    description?: string
    /** Label of the action that clears every filter. */
    action: string
  }

  interface Props {
    /** Id of the band, for in-page links. */
    anchor?: string
    /** Headline beside the filters. */
    title?: string
    /** Every article, newest first. */
    items: ArticleIndexItem[]
    /** Categories the reader narrows the list by, in order; none hides the segmented control. */
    categories?: string[]
    /** Label of the segment that shows every category. */
    allLabel?: string
    /** Dropdown filters, each narrowing by one facet of the items. */
    facets?: ArticleIndexFacet[]
    /** Accessible name of the category control. */
    categoryLabel?: string
    /** Leading items left out until a filter applies, because a band above already shows them. */
    leading?: number
    /** Copy of the search field; none hides it. */
    search?: ArticleIndexSearch | null
    /** Label revealed on a row under hover or focus. */
    rowLabel?: string
    /** Row layout: `byline` pins the writers to the foot of the copy; `centered` centres the copy. */
    rowKind?: ArticleRowsKind
    /** Label of the action that lists the next page. */
    moreLabel: string
    /** Rows listed per page. */
    pageSize?: number
    /** Copy of the state when nothing matches. */
    empty: ArticleIndexEmpty
    /** Accessible name of the list. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    title: '',
    categories: () => [],
    allLabel: '',
    facets: () => [],
    search: null,
    categoryLabel: 'Category',
    leading: 0,
    rowLabel: 'Read article',
    rowKind: 'byline',
    pageSize: 12,
    ariaLabel: 'Articles'
  })

  const route = useRoute()
  const { searchable, query, setQuery, narrow } = useOptionSearch()

  const requested = props.categories.includes(String(route.query.category))
    ? String(route.query.category)
    : props.allLabel

  const selection = reactive({ category: requested, query: '' })
  const picked = reactive<Record<string, string>>(
    Object.fromEntries(props.facets.map((facet) => [facet.key, facet.allLabel]))
  )
  const shown = ref(props.pageSize)

  const options = computed(() =>
    [props.allLabel, ...props.categories].map((category) => ({ label: category, value: category }))
  )

  const facetActive = (facet: ArticleIndexFacet) => picked[facet.key] !== facet.allLabel

  const matching = (facet: ArticleIndexFacet) => narrow(facet.key, facet.options, (option) => option)

  const filtering = computed(
    () =>
      selection.category !== props.allLabel ||
      selection.query.trim().length > 0 ||
      props.facets.some(facetActive)
  )

  const filtered = computed(() => {
    const query = selection.query.trim().toLowerCase()
    return (filtering.value ? props.items : props.items.slice(props.leading)).filter(
      (item) =>
        (selection.category === props.allLabel || item.categories.includes(selection.category)) &&
        props.facets.every(
          (facet) => !facetActive(facet) || item.facets?.[facet.key]?.includes(picked[facet.key])
        ) &&
        (!query || `${item.title} ${item.description ?? ''}`.toLowerCase().includes(query))
    )
  })

  const visible = computed(() => filtered.value.slice(0, shown.value))
  const hasMore = computed(() => shown.value < filtered.value.length)

  watch([selection, picked], () => {
    shown.value = props.pageSize
  })

  onMounted(async () => {
    if (requested === props.allLabel || !props.anchor) return
    await nextTick()
    globalThis.document?.getElementById(props.anchor)?.scrollIntoView()
  })

  function clearFilters() {
    Object.assign(selection, { category: props.allLabel, query: '' })
    props.facets.forEach((facet) => {
      picked[facet.key] = facet.allLabel
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
    <FrameBox
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
          v-if="categories.length"
          class="min-w-0 overflow-x-auto"
        >
          <SegmentedButton
            v-model="selection.category"
            :options="options"
            :aria-label="categoryLabel"
            size="medium"
          />
        </div>

        <div
          v-if="facets.length"
          class="flex flex-col gap-(--spacing-sm) sm:flex-row"
        >
          <Select
            v-for="facet in facets"
            :key="facet.key"
            v-model="picked[facet.key]"
            size="medium"
            class="w-full sm:w-56"
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
              <SelectOption :value="facet.allLabel">{{ facet.allLabel }}</SelectOption>
              <SelectOption
                v-for="option in matching(facet)"
                :key="option"
                :value="option"
              >
                {{ option }}
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

        <div
          v-if="search"
          class="w-full shrink-0 lg:w-(--container-3xs)"
        >
          <InputText
            v-model="selection.query"
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

    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <ArticleRows
        v-if="visible.length > 0"
        :items="visible"
        :kind="rowKind"
        :row-label="rowLabel"
        :aria-label="ariaLabel"
      />

      <EmptyState
        v-else
        :title="empty.title"
        :description="empty.description"
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
