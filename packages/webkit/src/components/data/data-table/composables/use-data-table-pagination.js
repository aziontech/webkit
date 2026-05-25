import { computed } from 'vue'

export function useDataTablePagination(data, options) {
  const pageCount = computed(() => {
    const total = options.lazy.value ? options.totalRecords.value : data.value.length
    return Math.max(1, Math.ceil(total / options.rows.value))
  })
  const currentPage = computed(() => Math.floor(options.first.value / options.rows.value))
  const paginatedData = computed(() => {
    if (!options.paginator.value || options.lazy.value) return data.value
    const start = options.first.value
    return data.value.slice(start, start + options.rows.value)
  })
  function goToPage(page) {
    const first = page * options.rows.value
    options.first.value = first
    options.onPage({
      first,
      rows: options.rows.value,
      page,
      pageCount: pageCount.value
    })
  }
  function previousPage() {
    if (currentPage.value > 0) goToPage(currentPage.value - 1)
  }
  function nextPage() {
    if (currentPage.value < pageCount.value - 1) goToPage(currentPage.value + 1)
  }
  const canPrevious = computed(() => currentPage.value > 0)
  const canNext = computed(() => currentPage.value < pageCount.value - 1)
  const pageReport = computed(() => {
    const total = options.lazy.value ? options.totalRecords.value : data.value.length
    if (total === 0) return 'Showing 0 entries'
    const start = options.first.value + 1
    const end = Math.min(options.first.value + options.rows.value, total)
    return `Showing ${start} to ${end} of ${total} entries`
  })
  return {
    paginatedData,
    pageCount,
    currentPage,
    goToPage,
    previousPage,
    nextPage,
    canPrevious,
    canNext,
    pageReport
  }
}
