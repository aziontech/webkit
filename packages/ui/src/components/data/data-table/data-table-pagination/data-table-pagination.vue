<script setup lang="ts">
  import { computed, onScopeDispose, useAttrs, watch } from 'vue'

  import Skeleton from '../../../feedback/skeleton/skeleton.vue'
  import Pagination from '../../pagination/pagination.vue'
  import TableFooter from '../../table/table-footer/table-footer.vue'
  import { useDataTableContext } from '../composables/use-data-table-context'

  defineOptions({
    name: 'DataTablePagination',
    inheritAttrs: false
  })

  export interface DataTablePaginationProps {
    /** Page-size options shown in the selector (the same name as Pagination). */
    pageSizeOptions?: number[]
    /** Rows across every page of a `manual` table; the table counts its own rows otherwise. */
    total?: number
    /** The app pages the rows itself (server side): the table renders `data` as one page and only reports the page. */
    manual?: boolean
  }

  const props = withDefaults(defineProps<DataTablePaginationProps>(), {
    pageSizeOptions: () => [10, 25, 50, 100],
    total: undefined,
    manual: false
  })

  /** Current page, 1-based (v-model:page). */
  const page = defineModel<number>('page', { default: 1 })
  /** Rows per page (v-model:page-size); a new size returns to the first page. */
  const pageSize = defineModel<number>('pageSize', { default: 10 })

  const attrs = useAttrs()
  const { paging, loading } = useDataTableContext()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'data-table-pagination'
  )

  onScopeDispose(paging.register(() => ({ manual: props.manual, total: props.total })))
  if (pageSize.value !== paging.pageSize.value) paging.setPageSize(pageSize.value)
  if (page.value !== paging.page.value) paging.setPage(page.value)

  watch(page, (next) => next !== paging.page.value && paging.setPage(next))
  watch(pageSize, (next) => next !== paging.pageSize.value && paging.setPageSize(next))
  watch(paging.page, (next) => next !== page.value && (page.value = next))
  watch(paging.pageSize, (next) => next !== pageSize.value && (pageSize.value = next))
</script>

<template>
  <TableFooter
    v-bind="$attrs"
    :data-testid="testId"
  >
    <div class="flex items-center px-(--spacing-sm) py-(--spacing-xs)">
      <Skeleton
        v-if="loading && paging.total.value === 0"
        width="12rem"
        height="1rem"
        :data-testid="`${testId}__loading`"
      />
      <Pagination
        v-else
        class="w-full"
        :page="paging.page.value"
        :total="paging.total.value"
        :page-size="paging.pageSize.value"
        :page-size-options="pageSizeOptions"
        @update:page="paging.setPage"
        @update:page-size="paging.setPageSize"
      >
        <template
          v-if="loading"
          #info
        >
          <Skeleton
            width="12rem"
            height="1rem"
            :data-testid="`${testId}__loading`"
          />
        </template>
      </Pagination>
    </div>
  </TableFooter>
</template>
