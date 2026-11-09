import { computed, nextTick, ref, watch } from 'vue'

import { indent } from '../../_shared/markup'

const quote = (text) => `'${String(text).replaceAll("'", "\\'")}'`

const literal = (value, depth = 0) => {
  const pad = '  '.repeat(depth + 1)
  const close = '  '.repeat(depth)
  if (Array.isArray(value)) {
    const items = value.map((item) => literal(item, depth + 1))
    const inline = `[${items.join(', ')}]`
    if (!items.some((item) => item.includes('\n')) && inline.length <= 80) return inline
    return `[\n${items.map((item) => `${pad}${item}`).join(',\n')}\n${close}]`
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value).map(
      ([key, item]) => `${/^[A-Za-z_$][\w$]*$/.test(key) ? key : quote(key)}: ${literal(item, depth + 1)}`
    )
    const inline = `{ ${entries.join(', ')} }`
    if (!entries.some((entry) => entry.includes('\n')) && inline.length <= 100) return inline
    return `{\n${entries.map((entry) => `${pad}${entry}`).join(',\n')}\n${close}}`
  }
  return typeof value === 'string' ? quote(value) : String(value)
}

export const constLine = (name, value) => `const ${name} = ${literal(value)}`

export const daysAgo = (days) => new Date(Date.now() - days * 86_400_000)

const workload = (n, owner, days, lastModified, status = 'Live') => {
  const domain = `my-workload-${n}.azion.run`
  return {
    id: `10${20482 + n * 173}`,
    name: `workload_${String(n).padStart(2, '0')}`,
    domain,
    domains: [
      domain,
      ...Array.from({ length: n * 7 }, (_, j) => `my-workload-${n}-alias-${j + 1}.azion.run`)
    ],
    domainCount: n * 7,
    status,
    owner,
    modifiedAt: daysAgo(days),
    lastModified
  }
}

export const WORKLOAD_ROWS = [
  workload(1, 'Robson Junior', 0, 'just now'),
  workload(2, 'Isaque Böck', 18, '3 weeks ago'),
  workload(3, 'Rafael Garbinatto', 36, '1 month ago'),
  workload(4, 'Herbert Júlio', 54, '2 months ago'),
  workload(5, 'Rafael Umman', 72, '2 months ago'),
  workload(6, 'Marcus Grando', 90, '3 months ago'),
  workload(7, 'Bruno Germano', 108, '4 months ago'),
  workload(8, 'Gab Lisboa', 126, '4 months ago'),
  workload(9, 'Robson Junior', 144, '5 months ago', 'Inactive'),
  workload(10, 'Isaque Böck', 162, '5 months ago')
]

export const ROWS_SCRIPT = [
  'const daysAgo = (days) => new Date(Date.now() - days * 86_400_000)',
  '',
  "const workload = (n, owner, days, lastModified, status = 'Live') => {",
  '  const domain = `my-workload-${n}.azion.run`',
  '  return {',
  '    id: `10${20482 + n * 173}`,',
  "    name: `workload_${String(n).padStart(2, '0')}`,",
  '    domain,',
  '    domains: [',
  '      domain,',
  '      ...Array.from({ length: n * 7 }, (_, j) => `my-workload-${n}-alias-${j + 1}.azion.run`)',
  '    ],',
  '    domainCount: n * 7,',
  '    status,',
  '    owner,',
  '    modifiedAt: daysAgo(days),',
  '    lastModified',
  '  }',
  '}',
  '',
  'const rows = [',
  "  workload(1, 'Robson Junior', 0, 'just now'),",
  "  workload(2, 'Isaque Böck', 18, '3 weeks ago'),",
  "  workload(3, 'Rafael Garbinatto', 36, '1 month ago'),",
  "  workload(4, 'Herbert Júlio', 54, '2 months ago'),",
  "  workload(5, 'Rafael Umman', 72, '2 months ago'),",
  "  workload(6, 'Marcus Grando', 90, '3 months ago'),",
  "  workload(7, 'Bruno Germano', 108, '4 months ago'),",
  "  workload(8, 'Gab Lisboa', 126, '4 months ago'),",
  "  workload(9, 'Robson Junior', 144, '5 months ago', 'Inactive'),",
  "  workload(10, 'Isaque Böck', 162, '5 months ago')",
  ']'
]

export const WORKLOAD_COLUMNS = [
  { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
  { accessorKey: 'id', header: 'ID', minWidth: 80 },
  { accessorKey: 'domain', header: 'Domains', grow: 2 },
  { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: 104 },
  { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, minWidth: 80 },
  { id: 'actions', kind: 'action', hideable: false }
]

export const listedColumnsOf = (columns) =>
  columns
    .filter((column) => column.kind !== 'action')
    .map((column) => ({
      id: column.id ?? column.accessorKey,
      label: column.label ?? column.header,
      locked: column.hideable === false
    }))

export const COLUMN_OPTIONS = listedColumnsOf(WORKLOAD_COLUMNS)

export const useColumnVisibility = (columns, initial = { id: false }) => {
  const columnVisibility = ref({ ...initial })
  const isVisible = (id) => columnVisibility.value[id] !== false
  const setVisible = (id, visible) => {
    const next = { ...columnVisibility.value }
    if (visible) delete next[id]
    else next[id] = false
    columnVisibility.value = next
  }
  const hiddenCount = computed(() => columns.filter((column) => !isVisible(column.id)).length)
  const showAll = () => {
    columnVisibility.value = {}
  }
  return { columnVisibility, isVisible, setVisible, hiddenCount, showAll }
}

export const COLUMN_VISIBILITY_SCRIPT = [
  'const columnVisibility = ref({ id: false })',
  'const isVisible = (id) => columnVisibility.value[id] !== false',
  'const setVisible = (id, visible) => {',
  '  const next = { ...columnVisibility.value }',
  '  if (visible) delete next[id]',
  '  else next[id] = false',
  '  columnVisibility.value = next',
  '}',
  'const hiddenCount = computed(() => listedColumns.filter((column) => !isVisible(column.id)).length)',
  'const showAll = () => {',
  '  columnVisibility.value = {}',
  '}'
]

export const useColumnsPanel = (columns) => {
  const listedColumns = listedColumnsOf(columns)
  const columnsOpen = ref(false)
  const columnsTipOpen = ref(false)
  watch(columnsOpen, (open) => {
    if (open) columnsTipOpen.value = false
  })
  return {
    listedColumns,
    columnsOpen,
    columnsTipOpen,
    ...useColumnVisibility(listedColumns)
  }
}

export const COLUMNS_SCRIPT = [
  'const listedColumns = columns',
  "  .filter((column) => column.kind !== 'action')",
  '  .map((column) => ({',
  '    id: column.id ?? column.accessorKey,',
  '    label: column.label ?? column.header,',
  '    locked: column.hideable === false',
  '  }))',
  'const columnsOpen = ref(false)',
  'const columnsTipOpen = ref(false)',
  'watch(columnsOpen, (open) => {',
  '  if (open) columnsTipOpen.value = false',
  '})',
  ...COLUMN_VISIBILITY_SCRIPT
]

export const useListRefresh = () => {
  const loading = ref(false)
  let timer
  const refresh = () => {
    if (loading.value) return
    loading.value = true
    clearTimeout(timer)
    timer = setTimeout(() => {
      loading.value = false
    }, 700)
  }
  return { loading, refresh }
}

export const REFRESH_SCRIPT = [
  'const loading = ref(false)',
  'let refreshTimer',
  'const refresh = () => {',
  '  if (loading.value) return',
  '  loading.value = true',
  '  clearTimeout(refreshTimer)',
  '  refreshTimer = setTimeout(() => {',
  '    loading.value = false',
  '  }, 700)',
  '}'
]

export const DATE_PRESETS = [
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '3m', label: 'Last 3 months' },
  { value: 'custom', label: 'Custom…', custom: true }
]

const RANGE_FORMAT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

export const formatDateRange = ({ start, end }) => {
  if (start && end) return `${RANGE_FORMAT.format(start)} – ${RANGE_FORMAT.format(end)}`
  if (start) return `Since ${RANGE_FORMAT.format(start)}`
  return end ? `Until ${RANGE_FORMAT.format(end)}` : ''
}

export const dateRange = (value) => {
  if (value && typeof value === 'object') return value
  const days = { '24h': 1, '7d': 7, '30d': 30, '3m': 91 }[value]
  return days ? { start: daysAgo(days), end: null } : null
}

export const withinRange = (date, range) => {
  if (!range) return true
  if (range.start && date < range.start) return false
  if (!range.end) return true
  const { end } = range
  return date <= new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999)
}

export const WORKLOAD_FILTER_FIELDS = [
  {
    id: 'owner',
    label: 'Author',
    kind: 'options',
    options: [
      'Bruno Germano',
      'Gab Lisboa',
      'Herbert Júlio',
      'Isaque Böck',
      'Marcus Grando',
      'Rafael Garbinatto',
      'Rafael Umman',
      'Robson Junior'
    ].map((owner) => ({ value: owner, label: owner, avatar: '' })),
    match: (row, values) => values.includes(row.owner)
  },
  {
    id: 'status',
    label: 'Status',
    kind: 'options',
    options: [
      { value: 'Live', label: 'Live' },
      { value: 'Inactive', label: 'Inactive' }
    ],
    match: (row, values) => values.includes(row.status)
  },
  {
    id: 'modified',
    label: 'Last Modified',
    kind: 'range',
    options: DATE_PRESETS,
    formatValue: formatDateRange,
    match: (row, values) => withinRange(row.modifiedAt, dateRange(values[0]))
  }
]

export const DATE_FILTER_SCRIPT = [
  'const DATE_PRESETS = [',
  "  { value: '24h', label: 'Last 24 hours' },",
  "  { value: '7d', label: 'Last 7 days' },",
  "  { value: '30d', label: 'Last 30 days' },",
  "  { value: '3m', label: 'Last 3 months' },",
  "  { value: 'custom', label: 'Custom…', custom: true }",
  ']',
  '',
  "const RANGE_FORMAT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })",
  '',
  'const formatDateRange = ({ start, end }) => {',
  '  if (start && end) return `${RANGE_FORMAT.format(start)} – ${RANGE_FORMAT.format(end)}`',
  '  if (start) return `Since ${RANGE_FORMAT.format(start)}`',
  "  return end ? `Until ${RANGE_FORMAT.format(end)}` : ''",
  '}',
  '',
  'const dateRange = (value) => {',
  "  if (value && typeof value === 'object') return value",
  "  const days = { '24h': 1, '7d': 7, '30d': 30, '3m': 91 }[value]",
  '  return days ? { start: new Date(Date.now() - days * 86_400_000), end: null } : null',
  '}',
  '',
  'const withinRange = (date, range) => {',
  '  if (!range) return true',
  '  if (range.start && date < range.start) return false',
  '  if (!range.end) return true',
  '  const { end } = range',
  '  return date <= new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999)',
  '}'
]

export const WORKLOAD_FIELDS_SCRIPT = [
  'const filterFields = [',
  '  {',
  "    id: 'owner',",
  "    label: 'Author',",
  "    kind: 'options',",
  '    options: [',
  "      'Bruno Germano',",
  "      'Gab Lisboa',",
  "      'Herbert Júlio',",
  "      'Isaque Böck',",
  "      'Marcus Grando',",
  "      'Rafael Garbinatto',",
  "      'Rafael Umman',",
  "      'Robson Junior'",
  "    ].map((owner) => ({ value: owner, label: owner, avatar: '' })),",
  '    match: (row, values) => values.includes(row.owner)',
  '  },',
  '  {',
  "    id: 'status',",
  "    label: 'Status',",
  "    kind: 'options',",
  '    options: [',
  "      { value: 'Live', label: 'Live' },",
  "      { value: 'Inactive', label: 'Inactive' }",
  '    ],',
  '    match: (row, values) => values.includes(row.status)',
  '  },',
  '  {',
  "    id: 'modified',",
  "    label: 'Last Modified',",
  "    kind: 'range',",
  '    options: DATE_PRESETS,',
  '    formatValue: formatDateRange,',
  '    match: (row, values) => withinRange(row.modifiedAt, dateRange(values[0]))',
  '  }',
  ']'
]

export const FILTER_FIELDS_SCRIPT = [...DATE_FILTER_SCRIPT, '', ...WORKLOAD_FIELDS_SCRIPT]

export const useFilterPanel = (fields, initial = {}) => {
  const filters = ref({ ...initial })
  const filterOpen = ref(false)
  const activeId = ref(null)
  const customId = ref(null)
  const calendarOpen = ref(false)
  const customRange = ref(null)
  const query = ref('')
  const direction = ref('forward')
  const filterPanel = ref(null)
  let requestedId = null

  const isApplied = (field) => Boolean(filters.value[field.id]?.length)
  const appliedFilters = computed(() => fields.filter(isApplied))
  const appliedCount = computed(() => appliedFilters.value.length)
  const summarize = (field) => {
    const values = filters.value[field.id] ?? []
    if (!values.length) return null
    const first = field.options.find((option) => option.value === values[0])
    return { label: first ? first.label : field.formatValue(values[0]), extra: values.length - 1 }
  }
  const summarizeText = (field) => {
    const parts = summarize(field)
    if (!parts) return ''
    return parts.extra ? `${parts.label} +${parts.extra}` : parts.label
  }
  const avatarsOf = (field) =>
    field.options
      .filter((option) => 'avatar' in option && (filters.value[field.id] ?? []).includes(option.value))
      .slice(0, 3)

  const customField = computed(() => fields.find((field) => field.id === customId.value))
  const activeField = computed(
    () => fields.find((field) => field.id === activeId.value) ?? customField.value
  )
  const levelKey = computed(() => {
    if (customId.value) return `custom:${customId.value}`
    return activeId.value ? `values:${activeId.value}` : 'fields'
  })
  const filterRows = computed(() => {
    const term = query.value.trim().toLowerCase()
    const source = activeField.value ? activeField.value.options : fields
    return term ? source.filter((row) => row.label.toLowerCase().includes(term)) : source
  })
  const isPicked = (value) => (filters.value[activeId.value] ?? []).includes(value)

  watch(filterOpen, (open) => {
    if (!open) return
    activeId.value = requestedId
    requestedId = null
    customId.value = null
    calendarOpen.value = false
    customRange.value = null
    query.value = ''
    direction.value = 'forward'
  })

  const toLevel = (dir, mutate) => {
    direction.value = dir
    mutate()
  }
  const enter = (fieldId) => {
    if (!filterOpen.value) {
      requestedId = fieldId
      filterOpen.value = true
      return
    }
    toLevel('forward', () => {
      activeId.value = fieldId
      query.value = ''
    })
  }
  const back = () =>
    toLevel('back', () => {
      activeId.value = null
      query.value = ''
    })
  const pick = (field, option) => {
    if (option.custom) {
      toLevel('forward', () => {
        customId.value = field.id
      })
      calendarOpen.value = true
      return
    }
    const current = filters.value[field.id] ?? []
    const next =
      field.kind === 'range'
        ? current[0] === option.value
          ? []
          : [option.value]
        : current.includes(option.value)
          ? current.filter((item) => item !== option.value)
          : [...current, option.value]
    filters.value = { ...filters.value, [field.id]: next }
    if (field.kind === 'range') back()
  }
  const leaveCustom = () => {
    calendarOpen.value = false
    customRange.value = null
    toLevel('back', () => {
      customId.value = null
    })
  }
  const commitCustom = (range) => {
    const field = customField.value
    if (!field) return
    const next = { ...filters.value }
    if (range?.start || range?.end) next[field.id] = [range]
    else delete next[field.id]
    filters.value = next
    leaveCustom()
    back()
    filterOpen.value = false
  }
  const clearFilter = (field) => {
    const next = { ...filters.value }
    delete next[field.id]
    filters.value = next
  }
  const levelRows = () => [
    ...(filterPanel.value?.querySelectorAll(`[data-level="${levelKey.value}"] [data-filter-row]`) ??
      [])
  ]
  const move = (event, step) => {
    const items = levelRows()
    if (!items.length) return
    event.preventDefault()
    const index = items.indexOf(event.target)
    items[(index + step + items.length) % items.length]?.focus()
  }
  watch(levelKey, async () => {
    await nextTick()
    levelRows()[0]?.focus()
  })

  return {
    filters,
    filterFields: fields,
    filterOpen,
    activeId,
    calendarOpen,
    customRange,
    query,
    direction,
    filterPanel,
    isApplied,
    appliedFilters,
    appliedCount,
    summarize,
    summarizeText,
    avatarsOf,
    customField,
    activeField,
    levelKey,
    filterRows,
    isPicked,
    enter,
    back,
    pick,
    leaveCustom,
    commitCustom,
    clearFilter,
    move
  }
}

export const filterStateScript = (initial = {}) => [
  `const filters = ref(${literal(initial)})`,
  'const filterOpen = ref(false)',
  'const activeId = ref(null)',
  'const customId = ref(null)',
  'const calendarOpen = ref(false)',
  'const customRange = ref(null)',
  "const query = ref('')",
  "const direction = ref('forward')",
  'const filterPanel = ref(null)',
  'let requestedId = null',
  '',
  'const isApplied = (field) => Boolean(filters.value[field.id]?.length)',
  'const appliedFilters = computed(() => filterFields.filter(isApplied))',
  'const appliedCount = computed(() => appliedFilters.value.length)',
  'const summarize = (field) => {',
  '  const values = filters.value[field.id] ?? []',
  '  if (!values.length) return null',
  '  const first = field.options.find((option) => option.value === values[0])',
  '  return { label: first ? first.label : field.formatValue(values[0]), extra: values.length - 1 }',
  '}',
  'const summarizeText = (field) => {',
  '  const parts = summarize(field)',
  "  if (!parts) return ''",
  '  return parts.extra ? `${parts.label} +${parts.extra}` : parts.label',
  '}',
  'const avatarsOf = (field) =>',
  '  field.options',
  "    .filter((option) => 'avatar' in option && (filters.value[field.id] ?? []).includes(option.value))",
  '    .slice(0, 3)',
  '',
  'const customField = computed(() => filterFields.find((field) => field.id === customId.value))',
  'const activeField = computed(',
  '  () => filterFields.find((field) => field.id === activeId.value) ?? customField.value',
  ')',
  'const levelKey = computed(() => {',
  '  if (customId.value) return `custom:${customId.value}`',
  "  return activeId.value ? `values:${activeId.value}` : 'fields'",
  '})',
  'const filterRows = computed(() => {',
  '  const term = query.value.trim().toLowerCase()',
  '  const source = activeField.value ? activeField.value.options : filterFields',
  '  return term ? source.filter((row) => row.label.toLowerCase().includes(term)) : source',
  '})',
  'const isPicked = (value) => (filters.value[activeId.value] ?? []).includes(value)',
  '',
  'watch(filterOpen, (open) => {',
  '  if (!open) return',
  '  activeId.value = requestedId',
  '  requestedId = null',
  '  customId.value = null',
  '  calendarOpen.value = false',
  '  customRange.value = null',
  "  query.value = ''",
  "  direction.value = 'forward'",
  '})',
  '',
  'const toLevel = (dir, mutate) => {',
  '  direction.value = dir',
  '  mutate()',
  '}',
  'const enter = (fieldId) => {',
  '  if (!filterOpen.value) {',
  '    requestedId = fieldId',
  '    filterOpen.value = true',
  '    return',
  '  }',
  "  toLevel('forward', () => {",
  '    activeId.value = fieldId',
  "    query.value = ''",
  '  })',
  '}',
  'const back = () =>',
  "  toLevel('back', () => {",
  '    activeId.value = null',
  "    query.value = ''",
  '  })',
  'const pick = (field, option) => {',
  '  if (option.custom) {',
  "    toLevel('forward', () => {",
  '      customId.value = field.id',
  '    })',
  '    calendarOpen.value = true',
  '    return',
  '  }',
  '  const current = filters.value[field.id] ?? []',
  '  const next =',
  "    field.kind === 'range'",
  '      ? current[0] === option.value',
  '        ? []',
  '        : [option.value]',
  '      : current.includes(option.value)',
  '        ? current.filter((item) => item !== option.value)',
  '        : [...current, option.value]',
  '  filters.value = { ...filters.value, [field.id]: next }',
  "  if (field.kind === 'range') back()",
  '}',
  'const leaveCustom = () => {',
  '  calendarOpen.value = false',
  '  customRange.value = null',
  "  toLevel('back', () => {",
  '    customId.value = null',
  '  })',
  '}',
  'const commitCustom = (range) => {',
  '  const field = customField.value',
  '  if (!field) return',
  '  const next = { ...filters.value }',
  '  if (range?.start || range?.end) next[field.id] = [range]',
  '  else delete next[field.id]',
  '  filters.value = next',
  '  leaveCustom()',
  '  back()',
  '  filterOpen.value = false',
  '}',
  'const clearFilter = (field) => {',
  '  const next = { ...filters.value }',
  '  delete next[field.id]',
  '  filters.value = next',
  '}',
  'const levelRows = () => [',
  '  ...(filterPanel.value?.querySelectorAll(`[data-level="${levelKey.value}"] [data-filter-row]`) ??',
  '    [])',
  ']',
  'const move = (event, step) => {',
  '  const items = levelRows()',
  '  if (!items.length) return',
  '  event.preventDefault()',
  '  const index = items.indexOf(event.target)',
  '  items[(index + step + items.length) % items.length]?.focus()',
  '}',
  'watch(levelKey, async () => {',
  '  await nextTick()',
  '  levelRows()[0]?.focus()',
  '})'
]

const DOMAIN_PAGE = 10

export const WIRE_WIDTHS = ['92%', '74%', '86%', '68%', '90%', '78%', '84%', '70%', '88%', '76%']

export const useDomainOverflow = () => {
  const domainQuery = ref({})
  const domainShown = ref({})
  const domainLoading = ref({})
  const matchingDomains = (row) => {
    const needle = (domainQuery.value[row.id] ?? '').trim().toLowerCase()
    return needle ? row.domains.filter((domain) => domain.toLowerCase().includes(needle)) : row.domains
  }
  const visibleDomains = (row) => matchingDomains(row).slice(0, domainShown.value[row.id] ?? DOMAIN_PAGE)
  const remainingDomains = (row) => matchingDomains(row).length - visibleDomains(row).length
  const nextDomains = (row) => Math.min(DOMAIN_PAGE, remainingDomains(row))
  const domainSummary = (row) => {
    const total = row.domains.length
    const shown = visibleDomains(row).length
    const matched = matchingDomains(row).length
    const searching = Boolean(domainQuery.value[row.id])
    if (remainingDomains(row)) {
      return searching ? `${shown} of ${matched} matching domains` : `${shown} of ${total} domains`
    }
    return searching ? `${matched} of ${total} domains` : `${total} domains`
  }
  const searchDomains = (row, value) => {
    domainQuery.value = { ...domainQuery.value, [row.id]: value }
    domainShown.value = { ...domainShown.value, [row.id]: DOMAIN_PAGE }
    domainLoading.value = { ...domainLoading.value, [row.id]: false }
  }
  const openDomains = (row, open) => {
    if (open) searchDomains(row, '')
  }
  const loadMoreDomains = (row) => {
    if (domainLoading.value[row.id] || !remainingDomains(row)) return
    domainLoading.value = { ...domainLoading.value, [row.id]: true }
    setTimeout(() => {
      domainShown.value = {
        ...domainShown.value,
        [row.id]: (domainShown.value[row.id] ?? DOMAIN_PAGE) + DOMAIN_PAGE
      }
      domainLoading.value = { ...domainLoading.value, [row.id]: false }
    }, 420)
  }
  return {
    WIRE_WIDTHS,
    domainQuery,
    domainLoading,
    matchingDomains,
    visibleDomains,
    remainingDomains,
    nextDomains,
    domainSummary,
    searchDomains,
    openDomains,
    loadMoreDomains
  }
}

export const DOMAIN_SCRIPT = [
  'const DOMAIN_PAGE = 10',
  "const WIRE_WIDTHS = ['92%', '74%', '86%', '68%', '90%', '78%', '84%', '70%', '88%', '76%']",
  'const domainQuery = ref({})',
  'const domainShown = ref({})',
  'const domainLoading = ref({})',
  'const matchingDomains = (row) => {',
  "  const needle = (domainQuery.value[row.id] ?? '').trim().toLowerCase()",
  '  return needle ? row.domains.filter((domain) => domain.toLowerCase().includes(needle)) : row.domains',
  '}',
  'const visibleDomains = (row) => matchingDomains(row).slice(0, domainShown.value[row.id] ?? DOMAIN_PAGE)',
  'const remainingDomains = (row) => matchingDomains(row).length - visibleDomains(row).length',
  'const nextDomains = (row) => Math.min(DOMAIN_PAGE, remainingDomains(row))',
  'const domainSummary = (row) => {',
  '  const total = row.domains.length',
  '  const shown = visibleDomains(row).length',
  '  const matched = matchingDomains(row).length',
  '  const searching = Boolean(domainQuery.value[row.id])',
  '  if (remainingDomains(row)) {',
  '    return searching ? `${shown} of ${matched} matching domains` : `${shown} of ${total} domains`',
  '  }',
  '  return searching ? `${matched} of ${total} domains` : `${total} domains`',
  '}',
  'const searchDomains = (row, value) => {',
  '  domainQuery.value = { ...domainQuery.value, [row.id]: value }',
  '  domainShown.value = { ...domainShown.value, [row.id]: DOMAIN_PAGE }',
  '  domainLoading.value = { ...domainLoading.value, [row.id]: false }',
  '}',
  'const openDomains = (row, open) => {',
  "  if (open) searchDomains(row, '')",
  '}',
  'const loadMoreDomains = (row) => {',
  '  if (domainLoading.value[row.id] || !remainingDomains(row)) return',
  '  domainLoading.value = { ...domainLoading.value, [row.id]: true }',
  '  setTimeout(() => {',
  '    domainShown.value = {',
  '      ...domainShown.value,',
  '      [row.id]: (domainShown.value[row.id] ?? DOMAIN_PAGE) + DOMAIN_PAGE',
  '    }',
  '    domainLoading.value = { ...domainLoading.value, [row.id]: false }',
  '  }, 420)',
  '}'
]

const FILTER_ROW_CLASS =
  'flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-left text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none'

export const FILTER_POPOVER = `<div class="flex shrink-0 items-center">
  <PopoverRoot v-model:open="filterOpen" placement="bottom-start" :dismissible="!calendarOpen" class="shrink-0">
    <PopoverTrigger class="relative">
      <Button label="Filter" kind="outlined" size="medium" icon="pi pi-filter" />
      <Transition
        enter-from-class="scale-75 opacity-0"
        enter-active-class="transition-[transform,scale,opacity] duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
        leave-to-class="scale-75 opacity-0"
        leave-active-class="transition-[transform,scale,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
      >
        <Badge
          v-if="appliedCount"
          :label="String(appliedCount)"
          severity="primary"
          size="small"
          aria-hidden="true"
          class="pointer-events-none absolute -top-2 -right-2 min-w-5"
        />
      </Transition>
    </PopoverTrigger>
    <PopoverContent>
      <div ref="filterPanel" class="flex flex-col" @keydown.down="move($event, 1)" @keydown.up="move($event, -1)">
        <div class="relative overflow-hidden">
          <Transition
            :enter-from-class="direction === 'forward' ? 'translate-x-[12%] opacity-0' : 'translate-x-[-12%] opacity-0'"
            enter-active-class="transition-[translate,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
            :leave-to-class="direction === 'forward' ? 'translate-x-[-12%] opacity-0' : 'translate-x-[12%] opacity-0'"
            leave-active-class="absolute inset-x-0 top-0 transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
          >
            <div :key="levelKey" :data-level="levelKey" class="flex flex-col">
              <div
                v-if="activeField"
                class="flex items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-xs) py-(--spacing-xs)"
              >
                <IconButton
                  icon="pi pi-angle-left"
                  kind="outlined"
                  size="small"
                  :aria-label="customField ? 'Back to date periods' : 'Back to all filters'"
                  @click="customField ? leaveCustom() : back()"
                />
                <span class="truncate text-label-sm text-(--text-default)">{{ activeField.label }}</span>
              </div>

              <div v-if="customField" class="px-(--spacing-md) py-(--spacing-sm)">
                <CalendarRoot
                  v-model="customRange"
                  v-model:open="calendarOpen"
                  mode="range"
                  size="medium"
                  :show-fields="false"
                  placeholder="Pick a range"
                  class="w-full [&>span]:w-full [&>span>span]:w-full"
                  @update:model-value="commitCustom"
                />
              </div>

              <template v-else>
                <div class="border-b border-(--border-default) p-(--spacing-xs)">
                  <InputText
                    v-model="query"
                    size="medium"
                    class="w-full"
                    :placeholder="activeField ? 'Filter ' + activeField.label.toLowerCase() + '…' : 'Filter by…'"
                    :aria-label="activeField ? 'Search ' + activeField.label + ' values' : 'Search filter fields'"
                  >
                    <template #iconLeft>
                      <i class="pi pi-search" aria-hidden="true" />
                    </template>
                  </InputText>
                </div>

                <div class="flex max-h-(--container-3xs) flex-col gap-(--spacing-xxs) overflow-y-auto p-(--spacing-xxs)">
                  <template v-if="!activeField">
                    <button
                      v-for="field in filterRows"
                      :key="field.id"
                      type="button"
                      data-filter-row
                      class="${FILTER_ROW_CLASS}"
                      :aria-expanded="false"
                      @click="enter(field.id)"
                    >
                      <span class="grow truncate">{{ field.label }}</span>
                      <span v-if="isApplied(field)" class="truncate text-(--text-muted)">{{ summarizeText(field) }}</span>
                      <i class="pi pi-angle-right shrink-0 text-(--text-muted)" aria-hidden="true" />
                    </button>
                  </template>

                  <template v-else>
                    <button
                      v-for="option in filterRows"
                      :key="String(option.value)"
                      type="button"
                      data-filter-row
                      :role="option.custom ? undefined : activeField.kind === 'range' ? 'menuitemradio' : 'menuitemcheckbox'"
                      :aria-checked="option.custom ? undefined : isPicked(option.value)"
                      class="${FILTER_ROW_CLASS}"
                      @click="pick(activeField, option)"
                    >
                      <Avatar
                        v-if="'avatar' in option"
                        :alt="option.label"
                        :label="option.label"
                        size="small"
                        kind="square"
                        class="shrink-0"
                      />
                      <span class="grow truncate">{{ option.label }}</span>
                      <i v-if="option.custom" class="pi pi-angle-right shrink-0 text-(--text-muted)" aria-hidden="true" />
                      <i
                        v-else
                        class="pi pi-check shrink-0 text-(--text-default)"
                        :class="isPicked(option.value) ? '' : 'invisible'"
                        aria-hidden="true"
                      />
                    </button>
                  </template>

                  <p v-if="!filterRows.length" class="px-(--spacing-sm) py-(--spacing-xs) text-label-sm text-(--text-muted)">
                    No match for “{{ query }}”.
                  </p>
                </div>

                <div v-if="activeField && isApplied(activeField)" class="border-t border-(--border-default) p-(--spacing-xxs)">
                  <button type="button" class="${FILTER_ROW_CLASS}" @click="clearFilter(activeField)">
                    <i class="pi pi-filter-slash text-(--text-muted)" aria-hidden="true" />
                    Clear {{ activeField.label }}
                  </button>
                </div>
              </template>
            </div>
          </Transition>
        </div>
      </div>
    </PopoverContent>
  </PopoverRoot>
</div>`

export const filterButton = () => FILTER_POPOVER

export const searchField = (placeholder, ariaLabel = placeholder) => `<InputText
  v-model="search"
  size="medium"
  placeholder="${placeholder}"
  aria-label="${ariaLabel}"
  class="min-w-36 grow basis-(--container-2xs)"
>
  <template #iconLeft>
    <i class="pi pi-search" aria-hidden="true" />
  </template>
</InputText>`

export const SEARCH_FIELD = searchField('Search workloads')

export const REFRESH_BUTTON = `<Tooltip text="Refresh" class="shrink-0">
  <IconButton icon="pi pi-refresh" kind="outlined" size="medium" :loading="loading" aria-label="Refresh" @click="refresh" />
</Tooltip>`

export const EXPORT_BUTTON = `<Tooltip text="Download CSV" class="shrink-0">
  <IconButton icon="pi pi-download" kind="outlined" size="medium" aria-label="Download CSV" />
</Tooltip>`

export const exportButton = (filename) => `<Tooltip text="Download CSV" class="shrink-0">
  <IconButton
    icon="pi pi-download"
    kind="outlined"
    size="medium"
    :disabled="!tableRef"
    aria-label="Download CSV"
    @click="tableRef?.exportCsv({ filename: '${filename}' })"
  />
</Tooltip>`

export const WIRED_EXPORT_BUTTON = exportButton('workloads.csv')

export const COLUMNS_BUTTON = `<Tooltip text="Columns" class="shrink-0">
  <IconButton icon="ai ai-column" kind="outlined" size="medium" aria-label="Columns" />
</Tooltip>`

export const COLUMNS_POPOVER = `<PopoverRoot v-model:open="columnsOpen" placement="bottom-end" class="shrink-0">
  <PopoverTrigger>
    <Tooltip v-model:open="columnsTipOpen" text="Columns" :disabled="columnsOpen">
      <IconButton icon="ai ai-column" kind="outlined" size="medium" aria-label="Columns" />
    </Tooltip>
  </PopoverTrigger>
  <PopoverContent>
    <div class="flex flex-col">
      <div class="border-b border-(--border-default) px-(--spacing-md) py-(--spacing-xs)">
        <p class="text-label-md text-(--text-default)">Columns</p>
      </div>
      <div class="flex max-h-(--container-xs) flex-col gap-(--spacing-xxs) overflow-y-auto overscroll-contain p-(--spacing-xxs)">
        <label
          v-for="column in listedColumns"
          :key="column.id"
          class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-left text-label-sm transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
          :class="column.locked ? 'cursor-default text-(--text-muted)' : 'cursor-pointer text-(--text-default) hover:bg-(--bg-hover)'"
        >
          <Switch
            :model-value="isVisible(column.id)"
            :disabled="column.locked"
            @update:model-value="(value) => setVisible(column.id, !!value)"
          />
          <span class="min-w-0 truncate">{{ column.label }}</span>
          <span v-if="column.locked" class="ml-auto shrink-0 text-label-xs text-(--text-muted)">Always shown</span>
        </label>
      </div>
      <div v-if="hiddenCount" class="border-t border-(--border-default) p-(--spacing-xxs)">
        <Button label="Show all columns" kind="text" size="small" class="w-full" @click="showAll" />
      </div>
    </div>
  </PopoverContent>
</PopoverRoot>`

export const controlsRow = ({
  filter = FILTER_POPOVER,
  search = SEARCH_FIELD,
  exportButton: download = EXPORT_BUTTON,
  columns = COLUMNS_POPOVER
} = {}) =>
  `<header class="flex items-center gap-(--layout-group-gap)">
  <div class="flex min-w-0 grow items-center gap-(--spacing-xs)">
${indent(filter, 2)}
${indent(search, 2)}
  </div>
  <div class="flex shrink-0 items-center gap-(--spacing-xs)">
${indent(REFRESH_BUTTON, 2)}
${indent(download, 2)}
${indent(columns, 2)}
  </div>
</header>`

export const APPLIED_CHIPS = `<div v-if="appliedFilters.length" class="relative flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
  <TransitionGroup
    move-class="transition-[transform,translate,scale,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
    enter-from-class="scale-90 opacity-0"
    leave-from-class="scale-100 opacity-100"
    leave-to-class="scale-90 opacity-0"
    leave-active-class="pointer-events-none absolute duration-fast-02 ease-productive-exit motion-reduce:transition-none"
  >
    <span
      v-for="field in appliedFilters"
      :key="field.id"
      class="inline-flex w-fit max-w-full transition-[transform,translate,scale,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
    >
      <Chip
        :data-filter-chip="field.id"
        :label="field.label"
        kind="filled"
        size="medium"
        clickable
        removable
        @click="enter(field.id)"
        @remove="clearFilter(field)"
      >
        <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
          <span class="truncate text-(--text-muted)">{{ field.label }}</span>
          <span v-if="avatarsOf(field).length" class="flex shrink-0 items-center">
            <Avatar
              v-for="(option, i) in avatarsOf(field)"
              :key="String(option.value)"
              :alt="option.label"
              :label="option.label"
              size="small"
              kind="circle"
              class="size-4 ring-1 ring-(--bg-surface)"
              :class="i > 0 ? '-ml-1' : ''"
            />
          </span>
          <span class="truncate">{{ summarize(field)?.label }}</span>
          <span v-if="summarize(field)?.extra" class="shrink-0 text-(--text-muted)">+{{ summarize(field).extra }}</span>
        </span>
      </Chip>
    </span>
  </TransitionGroup>
</div>`

const DOMAIN_POPOVER = `<PopoverRoot
  v-if="row.domainCount"
  placement="bottom-start"
  width="small"
  @update:open="(open) => openDomains(row, open)"
>
  <PopoverTrigger @click.stop>
    <Tag :label="'+' + row.domainCount" severity="secondary" size="small" class="shrink-0 cursor-pointer" />
  </PopoverTrigger>
  <PopoverContent @click.stop>
    <div class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)">
      <p class="text-label-sm text-(--text-muted)">{{ domainSummary(row) }}</p>
      <InputText
        v-if="row.domains.length > 10"
        :model-value="domainQuery[row.id] ?? ''"
        size="medium"
        placeholder="Search domains"
        aria-label="Search domains"
        @update:model-value="(value) => searchDomains(row, value)"
      >
        <template #iconLeft>
          <i class="pi pi-search" aria-hidden="true" />
        </template>
      </InputText>
    </div>
    <div class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-xxs)">
      <a
        v-for="domain in visibleDomains(row)"
        :key="domain"
        :href="'https://' + domain"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-(--spacing-xxs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default) hover:bg-(--bg-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
        @click.stop
      >
        <span class="truncate">{{ domain }}</span>
        <i class="pi pi-external-link ml-auto shrink-0 text-body-xs leading-none" aria-hidden="true" />
      </a>
      <div v-if="domainLoading[row.id]">
        <div v-for="index in nextDomains(row)" :key="index" class="flex h-7 items-center px-(--spacing-xs)">
          <Skeleton height="var(--size-3)" :width="WIRE_WIDTHS[(index - 1) % WIRE_WIDTHS.length]" />
        </div>
      </div>
      <p
        v-if="!matchingDomains(row).length"
        class="px-(--spacing-xs) py-(--spacing-sm) text-center text-body-sm text-(--text-muted)"
      >
        No domain matches “{{ domainQuery[row.id] }}”.
      </p>
    </div>
    <div v-if="remainingDomains(row)" class="border-t border-(--border-default) p-(--spacing-xxs)">
      <Button
        :label="'Load ' + nextDomains(row) + ' more'"
        kind="text"
        size="small"
        :loading="domainLoading[row.id]"
        class="w-full"
        @click.stop="loadMoreDomains(row)"
      />
    </div>
    <span class="sr-only" role="status">
      {{ domainLoading[row.id] ? 'Loading ' + nextDomains(row) + ' more domains' : domainSummary(row) }}
    </span>
  </PopoverContent>
</PopoverRoot>`

const tableOpen = ({ wired }) =>
  wired
    ? `<TableRoot
      ref="tableRef"
      v-model:pagination="pagination"
      v-model:globalFilter="search"
      v-model:columnVisibility="columnVisibility"
      :data="visibleRows"
      :columns="columns"
      row-key="id"
      enable-sorting
      paginated
      :page-size="10"
      :border="false"
      :loading="loading"
    >`
    : `<TableRoot
      :data="rows"
      :columns="columns"
      row-key="id"
      enable-sorting
      paginated
      :page-size="10"
      :border="false"
    >`

export const tableCard = ({ wired = false } = {}) => `<CardBox :padded="false">
  <template #content>
    ${tableOpen({ wired })}
      <template #cell-name="{ value }">
        <div class="flex min-w-0 items-center gap-(--spacing-xs)">
          <i class="ai ai-workloads shrink-0 text-body-lg text-(--text-muted)" aria-hidden="true" />
          <span class="truncate cursor-pointer hover:underline">{{ value }}</span>
        </div>
      </template>
      <template #cell-id="{ value }">
        <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
          <span class="min-w-0 flex-1 truncate tabular-nums">{{ value }}</span>
          <CopyButton v-if="value" kind="outlined" :value="value" aria-label="Copy workload ID" />
        </div>
      </template>
      <template #cell-domain="{ row, value }">
        <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
          <i class="ai ai-domains shrink-0 text-body-lg text-(--text-muted)" aria-hidden="true" />
          <Tooltip :text="'Open ' + value + ' in a new tab'" class="min-w-0 shrink!">
            <a
              :href="'https://' + value"
              target="_blank"
              rel="noopener noreferrer"
              data-link
              class="group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
              @click.stop
            >
              <span class="truncate underline-offset-2 group-hover/link:underline">{{ value }}</span>
              <span class="sr-only">(opens in a new tab)</span>
              <i class="pi pi-external-link shrink-0 text-body-xs leading-none" aria-hidden="true" />
            </a>
          </Tooltip>
${indent(DOMAIN_POPOVER, 5)}
          <CopyButton kind="outlined" :value="value" aria-label="Copy domain name" class="ml-auto shrink-0" />
        </div>
      </template>
      <template #cell-status="{ value }">
        <Tag :label="value" :severity="value === 'Live' ? 'success' : 'secondary'" size="medium" />
      </template>
      <template #cell-lastModified="{ row, value }">
        <div class="flex min-w-0 items-center gap-(--spacing-xs)">
          <Tooltip v-if="row.owner" :text="row.owner">
            <Avatar :alt="row.owner" :label="row.owner" size="small" kind="square" />
          </Tooltip>
          <span class="truncate text-body-sm text-(--text-muted)">{{ value }}</span>
        </div>
      </template>
      <template #cell-actions>
        <DropdownRoot placement="bottom-end">
          <DropdownTrigger>
            <Tooltip text="Row actions">
              <IconButton icon="pi pi-ellipsis-h" kind="outlined" size="small" aria-label="Row actions" />
            </Tooltip>
          </DropdownTrigger>
          <DropdownGroup>
            <DropdownOption value="deploy" label="Deploy">
              <template #left><i class="pi pi-cloud-upload" aria-hidden="true" /></template>
            </DropdownOption>
            <DropdownOption value="view" label="View details">
              <template #left><i class="pi pi-eye" aria-hidden="true" /></template>
            </DropdownOption>
            <DropdownOption value="duplicate" label="Clone">
              <template #left><i class="pi pi-clone" aria-hidden="true" /></template>
            </DropdownOption>
          </DropdownGroup>
          <DropdownGroup>
            <DropdownOption value="delete" label="Delete">
              <template #left><i class="pi pi-trash" aria-hidden="true" /></template>
            </DropdownOption>
          </DropdownGroup>
        </DropdownRoot>
      </template>
      <template #empty>
        <EmptyState
          size="medium"
          title="No workloads yet"
          description="Create a workload to serve your applications on your domains."
        >
          <template #actions>
            <div class="flex flex-wrap items-center justify-center gap-(--spacing-xs)">
              <Button label="Create Workload" icon="pi pi-plus" kind="secondary" size="small" />
              <Button
                label="Docs"
                icon="pi pi-book"
                kind="outlined"
                size="small"
                href="https://www.azion.com/en/documentation/products/build/edge-application/workloads/"
                target="_blank"
              />
            </div>
          </template>
        </EmptyState>
      </template>
    </TableRoot>
  </template>
</CardBox>`

export const TABLE_CARD = tableCard()

export const CONTROLS_IMPORTS = [
  "import Avatar from '@aziontech/webkit/avatar'",
  "import Badge from '@aziontech/webkit/badge'",
  "import Button from '@aziontech/webkit/button'",
  "import CalendarRoot from '@aziontech/webkit/calendar-root'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import PopoverContent from '@aziontech/webkit/popover-content'",
  "import PopoverRoot from '@aziontech/webkit/popover-root'",
  "import PopoverTrigger from '@aziontech/webkit/popover-trigger'",
  "import Switch from '@aziontech/webkit/switch'",
  "import Tooltip from '@aziontech/webkit/tooltip'"
]

export const TABLE_IMPORTS = [
  "import Avatar from '@aziontech/webkit/avatar'",
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import CopyButton from '@aziontech/webkit/copy-button'",
  "import DropdownGroup from '@aziontech/webkit/dropdown-group'",
  "import DropdownOption from '@aziontech/webkit/dropdown-option'",
  "import DropdownRoot from '@aziontech/webkit/dropdown-root'",
  "import DropdownTrigger from '@aziontech/webkit/dropdown-trigger'",
  "import EmptyState from '@aziontech/webkit/empty-state'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import PopoverContent from '@aziontech/webkit/popover-content'",
  "import PopoverRoot from '@aziontech/webkit/popover-root'",
  "import PopoverTrigger from '@aziontech/webkit/popover-trigger'",
  "import Skeleton from '@aziontech/webkit/skeleton'",
  "import TableRoot from '@aziontech/webkit/table-root'",
  "import Tag from '@aziontech/webkit/tag'",
  "import Tooltip from '@aziontech/webkit/tooltip'"
]

export const mergeImports = (...groups) => [...new Set(groups.flat())].sort()

export const idCell = (resource) => `<template #cell-id="{ value }">
  <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
    <span class="min-w-0 flex-1 truncate tabular-nums">{{ value }}</span>
    <CopyButton v-if="value" kind="outlined" :value="value" aria-label="Copy ${resource} ID" />
  </div>
</template>`

export const lastModifiedCell = (key, author) => `<template #cell-${key}="{ row, value }">
  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
    <Tooltip v-if="row.${author}" :text="row.${author}">
      <Avatar :alt="row.${author}" :label="row.${author}" size="small" kind="square" />
    </Tooltip>
    <span class="truncate text-body-sm text-(--text-muted)">{{ value }}</span>
  </div>
</template>`

const actionOption = ({ value, label, icon }) => `<DropdownOption value="${value}" label="${label}">
  <template #left><i class="${icon}" aria-hidden="true" /></template>
</DropdownOption>`

export const rowActions = ({ tooltip = 'Row actions', ariaLabel = 'Row actions', groups, condition = '' }) =>
  `<template #cell-actions${condition ? '="{ row }"' : ''}>
  <DropdownRoot${condition ? ` v-if="${condition}"` : ''} placement="bottom-end">
    <DropdownTrigger>
      <Tooltip text="${tooltip}">
        <IconButton icon="pi pi-ellipsis-h" kind="outlined" size="small" aria-label="${ariaLabel}" />
      </Tooltip>
    </DropdownTrigger>
${groups
  .map((group) => `    <DropdownGroup>\n${indent(group.map(actionOption).join('\n'), 3)}\n    </DropdownGroup>`)
  .join('\n')}
  </DropdownRoot>
</template>`

export const pageHeading = ({ title, description, size = 'medium', docs = '', action = '' }) => {
  const heading = { small: 'text-heading-xs', medium: 'text-heading-sm', large: 'text-heading-lg' }[size]
  const actions = [
    docs
      ? `<Button
  label="Documentation"
  icon="pi pi-book"
  kind="outlined"
  size="medium"
  href="${docs}"
  target="_blank"
  class="w-full md:w-auto"
/>`
      : '',
    action
      ? `<Button label="${action}" icon="pi pi-plus" kind="outlined" size="medium" class="w-full md:w-auto" />`
      : ''
  ].filter(Boolean)
  return `<header class="flex flex-wrap items-start justify-between gap-(--spacing-md)">
  <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
      <h1 class="text-balance ${heading} text-(--text-default)">${title}</h1>
    </div>
    <p class="text-pretty text-body-sm text-(--text-muted)">${description}</p>
  </div>${
    actions.length
      ? `\n  <div class="flex w-full shrink-0 flex-wrap items-center gap-(--spacing-sm) md:w-auto md:max-w-full">\n${indent(actions.join('\n'), 2)}\n  </div>`
      : ''
  }
</header>`
}

export const listPage = ({ heading, body }) => `<div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
  <main class="layout-column flex min-h-full flex-col">
${indent(heading, 2)}
    <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
      <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
${indent(body, 4)}
      </section>
    </section>
  </main>
</div>`

export const useListPage = ({ fields, rows, columns, initial = {}, pageSize = 10 }) => {
  const panel = useFilterPanel(fields, initial)
  const pagination = ref({ pageIndex: 0, pageSize })
  const visibleRows = computed(() =>
    rows.filter((row) =>
      fields.every((field) => {
        const values = panel.filters.value[field.id]
        return !values?.length || field.match(row, values)
      })
    )
  )
  watch(panel.filters, () => {
    pagination.value = { ...pagination.value, pageIndex: 0 }
  })
  return {
    search: ref(''),
    columns,
    rows,
    tableRef: ref(null),
    pagination,
    visibleRows,
    ...panel,
    ...useListRefresh(),
    ...useColumnsPanel(columns)
  }
}

export const listScript = (pageSize = 10) => [
  'const tableRef = ref(null)',
  `const pagination = ref({ pageIndex: 0, pageSize: ${pageSize} })`,
  'const visibleRows = computed(() =>',
  '  rows.filter((row) =>',
  '    filterFields.every((field) => {',
  '      const values = filters.value[field.id]',
  '      return !values?.length || field.match(row, values)',
  '    })',
  '  )',
  ')',
  'watch(filters, () => {',
  '  pagination.value = { ...pagination.value, pageIndex: 0 }',
  '})'
]

export const listStateScript = (initial = {}, pageSize = 10) => [
  "const search = ref('')",
  '',
  ...filterStateScript(initial),
  '',
  ...REFRESH_SCRIPT,
  '',
  ...COLUMNS_SCRIPT,
  '',
  ...listScript(pageSize)
]

export const LIST_COMPONENT_IMPORTS = mergeImports(CONTROLS_IMPORTS, [
  "import CardBox from '@aziontech/webkit/card-box'",
  "import Chip from '@aziontech/webkit/chip'",
  "import CopyButton from '@aziontech/webkit/copy-button'",
  "import DropdownGroup from '@aziontech/webkit/dropdown-group'",
  "import DropdownOption from '@aziontech/webkit/dropdown-option'",
  "import DropdownRoot from '@aziontech/webkit/dropdown-root'",
  "import DropdownTrigger from '@aziontech/webkit/dropdown-trigger'",
  "import TableRoot from '@aziontech/webkit/table-root'",
  "import Tag from '@aziontech/webkit/tag'"
])
