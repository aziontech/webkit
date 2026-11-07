import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  componentsFor,
  FILTER_BUTTON,
  FILTER_CHIPS,
  FILTER_SCRIPT,
  page,
  pageHeading,
  RELATIVE_TIME,
  runScript,
  scriptOf
} from './_observe-markup'

const PURGES = `[
  {
    id: 'purge-9012',
    type: 'url',
    layer: 'cache',
    arguments: ['www.example.com/index.html', 'www.example.com/pricing'],
    modifiedAt: hoursAgo(2)
  },
  {
    id: 'purge-9011',
    type: 'wildcard',
    layer: 'cache',
    arguments: ['www.example.com/assets/css/*'],
    modifiedAt: hoursAgo(5)
  },
  {
    id: 'purge-9010',
    type: 'cachekey',
    layer: 'tiered_cache',
    arguments: [
      'www.example.com/images/hero.webp',
      'www.example.com/images/hero@2x.webp',
      'www.example.com/images/og.png',
      'www.example.com/images/logo.svg'
    ],
    modifiedAt: hoursAgo(20)
  },
  {
    id: 'purge-9009',
    type: 'url',
    layer: 'cache',
    arguments: ['shop.example.com/products/sneakers-x1'],
    modifiedAt: daysAgo(1)
  },
  {
    id: 'purge-9008',
    type: 'cachekey',
    layer: 'cache',
    arguments: [
      'api.example.com/v1/catalog@@country=BR',
      'api.example.com/v1/catalog@@country=US',
      'api.example.com/v1/catalog@@country=PT'
    ],
    modifiedAt: daysAgo(3)
  },
  {
    id: 'purge-9007',
    type: 'wildcard',
    layer: 'cache',
    arguments: ['blog.example.com/2026/10/*', 'blog.example.com/feed/*'],
    modifiedAt: daysAgo(4)
  },
  {
    id: 'purge-9006',
    type: 'url',
    layer: 'cache',
    arguments: [
      'www.example.com/',
      'www.example.com/about',
      'www.example.com/careers',
      'www.example.com/contact',
      'www.example.com/legal/privacy',
      'www.example.com/legal/terms'
    ],
    modifiedAt: daysAgo(6)
  },
  {
    id: 'purge-9005',
    type: 'cachekey',
    layer: 'tiered_cache',
    arguments: ['media.example.com/videos/launch-keynote/master.m3u8'],
    modifiedAt: daysAgo(9)
  },
  {
    id: 'purge-9004',
    type: 'wildcard',
    layer: 'cache',
    arguments: ['docs.example.com/*'],
    modifiedAt: daysAgo(13)
  },
  {
    id: 'purge-9003',
    type: 'url',
    layer: 'cache',
    arguments: ['www.example.com/sitemap.xml', 'www.example.com/robots.txt'],
    modifiedAt: daysAgo(18)
  },
  {
    id: 'purge-9002',
    type: 'cachekey',
    layer: 'cache',
    arguments: ['shop.example.com/cart@@session=guest'],
    modifiedAt: daysAgo(24)
  },
  {
    id: 'purge-9001',
    type: 'url',
    layer: 'cache',
    arguments: ['status.example.com/'],
    modifiedAt: daysAgo(29)
  }
].map(purgeRow)`

const DATA = `const people = [
  'Robson Junior',
  'Isaque Böck',
  'Rafael Garbinatto',
  'Herbert Júlio',
  'Rafael Umman',
  'Marcus Grando',
  'Bruno Germano',
  'Gab Lisboa'
]

const hoursAgo = (n) => new Date(Date.now() - n * 3600000)

const daysAgo = (n) => {
  const date = new Date()
  date.setDate(date.getDate() - n)
  return date
}

const monthsAgo = (n) => {
  const date = new Date()
  date.setMonth(date.getMonth() - n)
  return date
}

const dateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: '2-digit',
  year: 'numeric'
})
const timeFormat = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true
})
const formatListDate = (date) => dateFormat.format(date) + ', ' + timeFormat.format(date)

const purgeTypes = [
  { value: 'cachekey', label: 'Cache Key', noun: 'cache key' },
  { value: 'url', label: 'URL', noun: 'URL' },
  { value: 'wildcard', label: 'Wildcard', noun: 'wildcard expression' }
]

const purgeLayers = [
  { value: 'cache', label: 'Cache' },
  { value: 'tiered_cache', label: 'Tiered Cache' }
]

const purgeTypeOptions = purgeTypes.map(({ value, label }) => ({ value, label }))

const purgeSummary = (type, count) => {
  const noun = purgeTypes.find((entry) => entry.value === type)?.noun ?? 'object'
  return count === 1 ? '1 ' + noun : count + ' ' + noun + 's'
}

const purgeRow = (purge, index = 0) => ({
  ...purge,
  typeLabel: purgeTypes.find((entry) => entry.value === purge.type)?.label ?? purge.type,
  layerLabel: purgeLayers.find((entry) => entry.value === purge.layer)?.label ?? purge.layer,
  argumentsText: purge.arguments.join(' '),
  author: people[index % people.length],
  authorAvatar: '',
  lastModified: formatListDate(purge.modifiedAt)
})

const purges = ref(__PURGES__)

const datePresets = [
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '3m', label: 'Last 3 months' },
  { value: 'custom', label: 'Custom…', custom: true }
]

const dateRange = (value) => {
  if (value && typeof value === 'object') return value
  if (value === '24h') return { start: daysAgo(1), end: null }
  if (value === '7d') return { start: daysAgo(7), end: null }
  if (value === '30d') return { start: daysAgo(30), end: null }
  if (value === '3m') return { start: monthsAgo(3), end: null }
  return null
}

const rangeFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

const formatDateRange = (value) => {
  if (!value || typeof value !== 'object') return ''
  const { start, end } = value
  if (start && end) return rangeFormat.format(start) + ' – ' + rangeFormat.format(end)
  if (start) return 'Since ' + rangeFormat.format(start)
  if (end) return 'Until ' + rangeFormat.format(end)
  return ''
}

const withinRange = (date, range) => {
  if (!range) return true
  const { start, end } = range
  if (!start && !end) return true
  if (start && date.getTime() < start.getTime()) return false
  if (end) {
    const midnight =
      end.getHours() === 0 &&
      end.getMinutes() === 0 &&
      end.getSeconds() === 0 &&
      end.getMilliseconds() === 0
    const bound = midnight
      ? new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999)
      : end
    if (date.getTime() > bound.getTime()) return false
  }
  return true
}

const matchDate = (date, values) => withinRange(date, dateRange(values[0]))

const columns = [
  { accessorKey: 'argumentsText', header: 'Arguments', principal: true, hideable: false, grow: 3 },
  { accessorKey: 'typeLabel', header: 'Type', enableSorting: true, minWidth: 136 },
  { accessorKey: 'layerLabel', header: 'Layer', enableSorting: true, minWidth: 80 },
  { accessorKey: 'author', header: 'Last Editor', enableSorting: true, minWidth: 80 },
  { accessorKey: 'lastModified', header: 'Purged', enableSorting: true, minWidth: 80 },
  { id: 'actions', kind: 'action', hideable: false }
]

const authorOptions = computed(() =>
  [...new Map(purges.value.map((purge) => [purge.author, purge.authorAvatar]))]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([author, avatar]) => ({ value: author, label: author, avatar }))
)

const filterFields = computed(() => [
  {
    id: 'type',
    label: 'Type',
    kind: 'options',
    options: purgeTypeOptions,
    match: (purge, values) => values.includes(purge.type)
  },
  {
    id: 'layer',
    label: 'Layer',
    kind: 'options',
    options: purgeLayers,
    match: (purge, values) => values.includes(purge.layer)
  },
  {
    id: 'author',
    label: 'Last Editor',
    kind: 'options',
    options: authorOptions.value,
    match: (purge, values) => values.includes(purge.author)
  },
  {
    id: 'purged',
    label: 'Purged',
    kind: 'range',
    options: datePresets,
    formatValue: formatDateRange,
    match: (purge, values) => matchDate(purge.modifiedAt, values)
  }
])

const filters = ref(__FILTERS__)
const search = ref('')
const pagination = ref({ pageIndex: 0, pageSize: 10 })

const visiblePurges = computed(() =>
  purges.value.filter((purge) =>
    filterFields.value.every((field) => {
      const values = filters.value[field.id]
      if (!values?.length) return true
      return field.match(purge, values)
    })
  )
)

watch(filters, () => {
  pagination.value = { ...pagination.value, pageIndex: 0 }
})

const loading = ref(false)
let refreshTimer = null
const refresh = () => {
  if (loading.value) return
  loading.value = true
  clearTimeout(refreshTimer)
  refreshTimer = setTimeout(() => {
    loading.value = false
  }, 700)
}

const filtering = computed(() => Object.values(filters.value).some((values) => values?.length))

const tableRef = ref(null)
const exportCsv = () => tableRef.value?.exportCsv({ filename: 'real-time-purge.csv' })

const columnVisibility = ref({})
const columnsOpen = ref(false)
const columnsTipOpen = ref(false)
watch(columnsOpen, (open) => {
  if (open) columnsTipOpen.value = false
})

const listedColumns = columns
  .filter((column) => column.kind !== 'action')
  .map((column) => ({
    id: column.accessorKey,
    label: column.header,
    locked: column.hideable === false
  }))
const isVisible = (id) => columnVisibility.value[id] !== false
const setVisible = (id, visible) => {
  const next = { ...columnVisibility.value }
  if (visible) delete next[id]
  else next[id] = false
  columnVisibility.value = next
}
const hiddenCount = computed(() => listedColumns.filter((column) => !isVisible(column.id)).length)
const showAll = () => {
  columnVisibility.value = {}
}

const clearFilters = () => {
  filters.value = {}
}

const pendingRepurge = ref(null)
const repurgeOpen = ref(false)

const repurgeDescription = computed(() => {
  const purge = pendingRepurge.value
  if (!purge) return ''
  return (
    'This purges the same ' +
    purgeSummary(purge.type, purge.arguments.length) +
    ' from the ' +
    purge.layerLabel +
    ' layer again. Each object is fetched from your origin on its next request.'
  )
})

const confirmRepurge = () => {
  const purge = pendingRepurge.value
  if (!purge) return
  const row = purgeRow({
    id: 'real-time-purge-' + Date.now().toString(36),
    type: purge.type,
    layer: purge.layer,
    arguments: purge.arguments,
    modifiedAt: new Date()
  })
  purges.value = [row, ...purges.value]
  pendingRepurge.value = null
}

const onRowAction = (event, action, row) => {
  if (action === 'repurge') {
    pendingRepurge.value = row
    repurgeOpen.value = true
  }
}`

const bodyOf = ({ empty = false, filters = '{}' }) =>
  [
    DATA.replace('__PURGES__', empty ? '[]' : PURGES).replace('__FILTERS__', filters),
    RELATIVE_TIME,
    FILTER_SCRIPT
  ].join('\n\n')

const HEADING = pageHeading({
  title: 'Real-Time Purge',
  description:
    'Evict cached content from every edge location. The history keeps the purges of the last 30 days.',
  action:
    '<Button label="Create Purge" icon="pi pi-plus" kind="outlined" size="medium" class="w-full md:w-auto" />'
})

const COLUMNS_BUTTON = `<Popover v-model:open="columnsOpen" placement="bottom-end" class="shrink-0">
  <Popover.Trigger>
    <Tooltip v-model:open="columnsTipOpen" text="Columns" :disabled="columnsOpen">
      <IconButton
        icon="ai ai-column"
        kind="outlined"
        size="medium"
        aria-label="Columns"
        data-testid="columns-button__trigger"
      />
    </Tooltip>
  </Popover.Trigger>

  <Popover.Content>
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
            :data-testid="'columns-button__switch-' + column.id"
            @update:model-value="(value) => setVisible(column.id, !!value)"
          />
          <span class="min-w-0 truncate">{{ column.label }}</span>
          <span v-if="column.locked" class="ml-auto shrink-0 text-label-xs text-(--text-muted)">Always shown</span>
        </label>
      </div>

      <div v-if="hiddenCount" class="border-t border-(--border-default) p-(--spacing-xxs)">
        <Button
          label="Show all columns"
          kind="text"
          size="small"
          class="w-full"
          data-testid="columns-button__reset"
          @click="showAll"
        />
      </div>
    </div>
  </Popover.Content>
</Popover>`

const CONTROLS = `<header v-if="purges.length" class="flex items-center gap-(--layout-group-gap)">
  <div class="flex min-w-0 grow items-center gap-(--spacing-xs)">
${indent(FILTER_BUTTON, 2)}
    <InputText
      v-model="search"
      size="medium"
      placeholder="Search arguments"
      aria-label="Search purges by argument"
      class="min-w-36 grow basis-(--container-2xs)"
    >
      <template #iconLeft>
        <i class="pi pi-search" aria-hidden="true" />
      </template>
    </InputText>
  </div>
  <div class="flex shrink-0 items-center gap-(--spacing-xs)">
    <Tooltip text="Refresh" class="shrink-0">
      <IconButton
        icon="pi pi-refresh"
        kind="outlined"
        size="medium"
        :loading="loading"
        aria-label="Refresh"
        data-testid="refresh-button"
        @click="refresh"
      />
    </Tooltip>
    <Tooltip text="Download CSV" class="shrink-0">
      <IconButton
        icon="pi pi-download"
        kind="outlined"
        size="medium"
        :disabled="!tableRef"
        aria-label="Download CSV"
        data-testid="export-button"
        @click="exportCsv"
      />
    </Tooltip>
${indent(COLUMNS_BUTTON, 2)}
  </div>
</header>`

const EMPTY = `<section v-if="!purges.length" class="flex min-h-0 flex-1 items-center justify-center">
  <CardBox class="w-full max-w-(--container-2xl)">
    <template #content>
      <EmptyState
        size="medium"
        title="No purges yet"
        description="Purge a URL, a cache key, or a wildcard expression to evict it from every edge location."
        class="flex-1 rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised)"
      >
        <template #icon>
          <span class="relative flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface)">
            <i class="ai ai-real-time-purge text-body-md leading-none text-(--text-default)" aria-hidden="true" />
          </span>
        </template>
        <template #actions>
          <Button label="Create Purge" kind="secondary" size="large" icon="pi pi-plus" />
        </template>
      </EmptyState>
    </template>
  </CardBox>
</section>`

const ARGUMENTS_CELL = `<template #cell-argumentsText="{ row }">
  <span v-if="!row.arguments.length" class="text-body-sm text-(--text-muted)">—</span>

  <div v-else class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
    <span class="min-w-0 truncate text-body-sm text-(--text-default)" :title="row.arguments[0]">{{ row.arguments[0] }}</span>

    <Popover v-if="row.arguments.length > 1" placement="bottom-start" width="medium">
      <Popover.Trigger @click.stop>
        <Tooltip :text="'Show all ' + row.arguments.length + ' arguments'">
          <button
            type="button"
            :aria-label="'Show all ' + row.arguments.length + ' arguments'"
            class="flex shrink-0 cursor-pointer rounded-(--shape-elements) outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
          >
            <Tag :label="'+' + (row.arguments.length - 1)" severity="secondary" size="small" />
          </button>
        </Tooltip>
      </Popover.Trigger>

      <Popover.Content @click.stop>
        <p class="border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-overline-sm text-(--text-muted)">
          {{ row.arguments.length }} arguments
        </p>

        <div class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-xxs)">
          <span
            v-for="item in row.arguments"
            :key="item"
            class="block break-all rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default)"
            >{{ item }}</span
          >
        </div>
      </Popover.Content>
    </Popover>

    <span class="ml-auto flex shrink-0">
      <CopyButton
        kind="outlined"
        :value="row.arguments.join('\\n')"
        :aria-label="row.arguments.length === 1 ? 'Copy argument' : 'Copy ' + row.arguments.length + ' arguments'"
        @click.stop
      />
    </span>
  </div>
</template>`

const TABLE = `<section v-else class="flex min-h-0 flex-col">
  <CardBox :padded="false">
    <template #content>
      <TableRoot
        ref="tableRef"
        v-model:pagination="pagination"
        v-model:globalFilter="search"
        v-model:columnVisibility="columnVisibility"
        :data="visiblePurges"
        :columns="columns"
        row-key="id"
        enable-sorting
        paginated
        :page-size="10"
        :border="false"
        :loading="loading"
      >
${indent(ARGUMENTS_CELL, 4)}

        <template #cell-typeLabel="{ value }">
          <Tag :label="value" severity="secondary" size="medium" rounded />
        </template>

        <template #cell-layerLabel="{ value }">
          <span class="truncate text-body-sm text-(--text-default)">{{ value }}</span>
        </template>

        <template #cell-author="{ row }">
          <div class="flex min-w-0 items-center gap-(--spacing-xs)">
            <Avatar
              :src="row.authorAvatar || undefined"
              :alt="row.author"
              :label="row.author"
              size="small"
              kind="square"
              class="shrink-0"
            />
            <span class="truncate text-body-sm text-(--text-default)">{{ row.author }}</span>
          </div>
        </template>

        <template #cell-lastModified="{ row }">
          <div class="flex min-w-0 items-center gap-(--spacing-xs)">
            <span class="truncate text-body-sm text-(--text-muted)">{{ relativeTime(row.modifiedAt) }}</span>
          </div>
        </template>

        <template #cell-actions="{ row }">
          <Dropdown placement="bottom-end" @select="(event, action) => onRowAction(event, action, row)">
            <Dropdown.Trigger>
              <Tooltip text="Actions">
                <IconButton icon="pi pi-ellipsis-h" kind="outlined" size="small" aria-label="Row actions" />
              </Tooltip>
            </Dropdown.Trigger>
            <Dropdown.Group>
              <Dropdown.Option value="repurge" label="Repurge">
                <template #left><i class="pi pi-refresh" aria-hidden="true" /></template>
              </Dropdown.Option>
              <Dropdown.Option value="edit" label="Edit and Purge">
                <template #left><i class="pi pi-pencil" aria-hidden="true" /></template>
              </Dropdown.Option>
            </Dropdown.Group>
          </Dropdown>
        </template>

        <template #empty>
          <EmptyState
            size="small"
            :title="filtering ? 'No purges match these filters' : 'No purges match this search'"
            :description="
              filtering
                ? 'Clear the filters to see the whole 30-day history.'
                : 'Search matches the URLs, cache keys, and wildcard expressions a purge ran on.'
            "
          >
            <template #actions>
              <Button v-if="filtering" label="Clear filters" kind="outlined" size="medium" @click="clearFilters" />
            </template>
          </EmptyState>
        </template>
      </TableRoot>
    </template>
  </CardBox>
</section>`

const REPURGE_DIALOG = `<Dialog v-model:open="repurgeOpen" size="small" data-testid="confirm-dialog">
  <DialogPortal>
    <DialogOverlay />
    <DialogContent>
      <PanelHeader class="w-full">
        <DialogTitle>Repurge cached content?</DialogTitle>
        <DialogClose />
      </PanelHeader>

      <PanelContent>
        <DialogDescription class="m-0 text-body-sm text-(--text-muted)">
          {{ repurgeDescription }}
        </DialogDescription>
      </PanelContent>

      <PanelFooter class="flex-col md:flex-row md:justify-end">
        <Button class="w-full md:w-auto" label="Cancel" kind="text" size="medium" @click="repurgeOpen = false" />
        <Button
          class="w-full md:w-auto"
          label="Repurge"
          kind="primary"
          size="medium"
          data-testid="confirm-dialog__confirm"
          @click="repurgeOpen = false; confirmRepurge()"
        />
      </PanelFooter>
    </DialogContent>
  </DialogPortal>
</Dialog>`

const MARKUP = page(`<main class="layout-column flex min-h-full flex-col">
${indent(HEADING)}

  <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
    <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
${indent(CONTROLS, 3)}

${indent(FILTER_CHIPS.replace('v-if="filterChips.length"', 'v-if="purges.length && filterChips.length"'), 3)}

${indent(EMPTY, 3)}

${indent(TABLE, 3)}
    </section>
  </section>

${indent(REPURGE_DIALOG)}
</main>`)

const components = componentsFor(MARKUP)

const story = (options, description) => {
  const body = bodyOf(options)
  return {
    render: () => ({
      components,
      setup: () => runScript(body),
      template: MARKUP
    }),
    parameters: {
      docs: {
        description: { story: description },
        source: { code: toSfc(scriptOf(MARKUP, body), MARKUP) }
      }
    }
  }
}

const meta = {
  title: 'Templates/Platform/Observe/RealTimePurge',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Real-Time Purge history as the console renders it at /real-time-purge: the medium page heading with its Create Purge action, the list controls (the Filter popover over Type, Layer, Last Editor and Purged, the argument search, Refresh, Download CSV and the Columns panel), the applied-filter chips, and the purges of the last 30 days in a flush table. The Arguments cell shows the first URL, cache key or wildcard expression with a +N Tag that opens the rest in a Popover and a copy button pinned right; Type is a rounded secondary Tag, Layer plain text, Last Editor an Avatar with the name and Purged the relative time. Each row’s menu offers Repurge, which asks in a confirm Dialog before queuing the same purge again, and Edit and Purge, which opens the create page with the purge prefilled. A search or filter that matches nothing shows the table’s empty state, and an account with no purges shows the No purges yet card. Built from `Button`, `Badge`, `Popover`, `InputText`, `Avatar`, `CalendarRoot`, `IconButton`, `Tooltip`, `Switch`, `Chip`, `CardBox`, `TableRoot`, `Tag`, `CopyButton`, `Dropdown`, `EmptyState`, `Dialog` and its parts with `PanelHeader`, `PanelContent` and `PanelFooter`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = story(
  {},
  'The 30-day history: twelve purges over two pages, newest first. Open a +N Tag to read every argument, or a row’s menu to repurge it.'
)

export const NoMatch = story(
  { filters: "{ type: ['wildcard'], layer: ['tiered_cache'] }" },
  'Wildcard purges on the Tiered Cache layer: the Filter button counts two fields, both show as chips, and the table’s empty state offers Clear filters.'
)

export const Empty = story(
  { empty: true },
  'An account with no purges yet: the controls step aside and the No purges yet card offers Create Purge.'
)
