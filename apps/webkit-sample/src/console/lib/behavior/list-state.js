// The state every module list holds — declared once instead of per page.
//
// A list page owns exactly four things beyond its columns and its field catalog:
// the applied filter state, the free-text search, the rows that survive both, and
// the pagination those rows are paged into. Every page was writing all four by
// hand, and the fourth is the one that goes wrong: filtering `:data` from OUTSIDE
// the table does not trip TanStack's `autoResetPageIndex` (from the table's point
// of view the data simply changed), so narrowing to fewer rows than the current
// page's offset renders an empty table with a paginator that says there is more.
//
// So the rewind is the reason this module exists, and it is why the hook — not the
// page — owns the pagination ref: a page that declares its own is a page that can
// forget to rewind it. A scope switch narrows the same way (a scope owns a subset
// of the seed), so the reload window rewinds too, and `useTenancyReload` is read
// here rather than passed in — it is a module-level flag, and every list binds it.
//
// What stays with the page: the field catalog (only the page knows how a row
// answers for each field) and the columns. See list/FilterButton.vue for the control that
// drives `filters`, and lib/filter-bar.js for the model underneath it.
import { computed, ref, toValue, watch } from 'vue'

import { useTenancyReload } from '../state/tenancy-reload'
import { applyFilters } from './filter-bar'

/**
 * Filter + search + pagination for one module list.
 *
 * @param {import('vue').MaybeRefOrGetter<Array<object>>} fields The page's filter
 *   catalog (lib/filter-bar.js) — a plain array for a fixed catalog, or a ref/getter
 *   for a page whose catalog GROWS at runtime. Real-Time Events is the second kind:
 *   filtering by a document field from its Fields panel adds that field to the catalog,
 *   so the filter control can show and clear it like any other filter. Resolved with
 *   `toValue`, so an array keeps working exactly as before.
 * @param {import('vue').MaybeRefOrGetter<Array<object>>} rows Every row before filtering —
 *   a ref, a computed or a getter, so a page can compose provisioned rows with
 *   tenancy-scoped ones and still pass one thing.
 * @param {{ pageSize?: number }} [options]
 * @returns {{
 *   filters: import('vue').Ref<Record<string, Array<unknown>>>,
 *   search: import('vue').Ref<string>,
 *   pagination: import('vue').Ref<{ pageIndex: number, pageSize: number }>,
 *   visibleRows: import('vue').ComputedRef<Array<object>>,
 *   loading: import('vue').ComputedRef<boolean>
 * }}
 */
export function useListFilters(fields, rows, { pageSize = 8 } = {}) {
  const { tenancyReloading } = useTenancyReload()

  // `{ author: ['Bruno Germano'], status: ['Active'] }` — an absent or empty entry
  // is not a filter, which is what lets an unfilled field render as a dimmed
  // plain row in the panel rather than a chip that outlives its value.
  const filters = ref({})

  // Free-text search. The page binds it to the table's `v-model:globalFilter`, so
  // the TABLE owns the matching (every visible column) and this is only the value.
  // It deliberately does NOT narrow `visibleRows`: search and filters run at two
  // different depths, and running search here as well would double-filter.
  const search = ref('')

  const pagination = ref({ pageIndex: 0, pageSize })

  // Fields intersect, values inside a field union — `applyFilters` owns that rule
  // once so no page re-derives it per column.
  const visibleRows = computed(() => applyFilters(toValue(rows), toValue(fields), filters.value))

  // The rewind. Watching `filters` (a ref holding a replaced object — the bar never
  // mutates in place) and the reload window covers both ways the set narrows under
  // a page offset that no longer has rows.
  watch([filters, tenancyReloading], () => {
    pagination.value = { ...pagination.value, pageIndex: 0 }
  })

  return { filters, search, pagination, visibleRows, loading: tenancyReloading }
}
