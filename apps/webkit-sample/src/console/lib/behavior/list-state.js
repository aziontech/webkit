import { computed, onScopeDispose, ref, toValue, watch } from 'vue'

import { useTenancyReload } from '../state/tenancy-reload'
import { applyFilters } from './filter-bar'

const REFRESH_MS = 700

export function useListFilters(fields, rows, { pageSize = 8 } = {}) {
  const { tenancyReloading } = useTenancyReload()

  const filters = ref({})

  const search = ref('')

  const pagination = ref({ pageIndex: 0, pageSize })

  const visibleRows = computed(() => applyFilters(toValue(rows), toValue(fields), filters.value))

  watch([filters, tenancyReloading], () => {
    pagination.value = { ...pagination.value, pageIndex: 0 }
  })

  const { loading, refresh } = useListRefresh()

  return { filters, search, pagination, visibleRows, loading, refresh }
}

export function useListRefresh() {
  const { tenancyReloading } = useTenancyReload()

  const refreshing = ref(false)
  let timer
  const refresh = () => {
    if (refreshing.value) return
    refreshing.value = true
    clearTimeout(timer)
    timer = setTimeout(() => {
      refreshing.value = false
    }, REFRESH_MS)
  }
  onScopeDispose(() => clearTimeout(timer))

  return { loading: computed(() => tenancyReloading.value || refreshing.value), refresh }
}
