<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { PaginatorInjectionKey } from './injection-key'
  import PaginationButton from './pagination-button/pagination-button.vue'
  import PaginatorInfo from './paginator-info/paginator-info.vue'
  import PaginatorPageSize from './paginator-page-size/paginator-page-size.vue'

  type PageItem = { type: 'page' | 'more'; value: number; key: string }

  defineOptions({
    name: 'Paginator',
    inheritAttrs: false
  })

  interface Props {
    /** Current page, 1-based (data-driven mode). Supports v-model:page. */
    page?: number
    /** Total item count. When set, the Paginator runs in data-driven mode and renders its own controls. */
    total?: number
    /** Rows per page (data-driven mode). Supports v-model:page-size. */
    pageSize?: number
    /** Page-size options offered in the rows-per-page selector. */
    pageSizeOptions?: number[]
    /** Page numbers shown on each side of the current page before collapsing into an overflow ellipsis. */
    siblingCount?: number
    /** Accessible name for the navigation landmark. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    page: 1,
    total: undefined,
    pageSize: 10,
    pageSizeOptions: () => [10, 25, 50, 100],
    siblingCount: 1,
    ariaLabel: 'Pagination'
  })

  const emit = defineEmits<{
    'update:page': [page: number]
    'update:pageSize': [pageSize: number]
  }>()

  defineSlots<{
    info(): unknown
    default(): unknown
    controls(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'data-paginator'
  )

  provide(PaginatorInjectionKey, { testId: testId.value })

  // When `total` is provided, the root renders and drives its own controls;
  // otherwise it stays a pure layout landmark and the consumer fills the slots.
  const dataDriven = computed<boolean>(() => props.total !== undefined)

  const pageCount = computed<number>(() =>
    props.total === undefined ? 0 : Math.max(1, Math.ceil(props.total / props.pageSize))
  )

  const currentPage = computed<number>(() =>
    Math.min(Math.max(1, props.page), pageCount.value || 1)
  )

  const rangeStart = computed<number>(() =>
    !props.total ? 0 : (currentPage.value - 1) * props.pageSize + 1
  )

  const rangeEnd = computed<number>(() =>
    Math.min(currentPage.value * props.pageSize, props.total ?? 0)
  )

  const range = (start: number, end: number): number[] => {
    const out: number[] = []
    for (let i = start; i <= end; i++) out.push(i)
    return out
  }

  const pageItems = computed<PageItem[]>(() => {
    const count = pageCount.value
    const current = currentPage.value
    const siblings = Math.max(0, props.siblingCount)

    const page = (value: number): PageItem => ({ type: 'page', value, key: `page-${value}` })
    const more = (key: string): PageItem => ({ type: 'more', value: 0, key })

    // first + last + current + 2 siblings + 2 ellipses
    const totalSlots = siblings * 2 + 5
    if (count <= totalSlots) return range(1, count).map(page)

    const leftSibling = Math.max(current - siblings, 1)
    const rightSibling = Math.min(current + siblings, count)
    const showLeftMore = leftSibling > 2
    const showRightMore = rightSibling < count - 1
    const edgeCount = 3 + 2 * siblings

    if (!showLeftMore && showRightMore) {
      return [...range(1, edgeCount).map(page), more('more-end'), page(count)]
    }
    if (showLeftMore && !showRightMore) {
      return [page(1), more('more-start'), ...range(count - edgeCount + 1, count).map(page)]
    }
    return [
      page(1),
      more('more-start'),
      ...range(leftSibling, rightSibling).map(page),
      more('more-end'),
      page(count)
    ]
  })

  const goToPage = (next: number) => {
    const clamped = Math.min(Math.max(1, next), pageCount.value)
    if (clamped === currentPage.value) return
    emit('update:page', clamped)
  }

  const onPrevious = () => goToPage(currentPage.value - 1)
  const onNext = () => goToPage(currentPage.value + 1)

  const onItemClick = (item: PageItem) => {
    if (item.type === 'page') goToPage(item.value)
  }

  const onPageSizeChange = (value: number) => {
    emit('update:pageSize', value)
    // Reset to the first page so the current page can never fall out of range.
    if (currentPage.value !== 1) {
      emit('update:page', 1)
    }
  }
</script>

<template>
  <nav
    v-bind="$attrs"
    :aria-label="ariaLabel"
    :data-testid="testId"
    class="flex w-full flex-wrap items-center justify-between gap-[var(--spacing-sm)] text-[var(--text-default)]"
  >
    <div class="flex min-w-0 items-center">
      <slot name="info">
        <PaginatorInfo v-if="dataDriven">
          Showing {{ rangeStart }} to {{ rangeEnd }} of {{ total }} entries
        </PaginatorInfo>
      </slot>
    </div>
    <div
      class="flex flex-auto flex-wrap items-center justify-end gap-x-[var(--spacing-sm)] gap-y-[var(--spacing-xs)]"
    >
      <div class="flex flex-wrap items-center justify-center gap-[var(--spacing-xxs)]">
        <template v-if="dataDriven">
          <PaginationButton
            kind="previous"
            aria-label="Previous page"
            :disabled="currentPage <= 1"
            @click="onPrevious"
          />
          <PaginationButton
            v-for="item in pageItems"
            :key="item.key"
            :kind="item.type === 'more' ? 'more' : 'number'"
            :selected="item.type === 'page' && item.value === currentPage"
            @click="onItemClick(item)"
          >
            {{ item.type === 'page' ? item.value : '' }}
          </PaginationButton>
          <PaginationButton
            kind="next"
            aria-label="Next page"
            :disabled="currentPage >= pageCount"
            @click="onNext"
          />
        </template>
        <slot v-else />
      </div>
      <slot name="controls">
        <PaginatorPageSize
          v-if="dataDriven"
          :model-value="pageSize"
          :options="pageSizeOptions"
          @update:model-value="onPageSizeChange"
        />
      </slot>
    </div>
  </nav>
</template>
