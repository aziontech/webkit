<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DateRangePicker, {
    type DateRangeUnit,
    type DateRangeValue,
    type RelativeOption
  } from '@aziontech/webkit/date-range-picker'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item-root'
  import Popover from '@aziontech/webkit/popover'
  import PropertyFilter, {
    type FilteringProperty,
    type PropertyFilterQuery,
    type PropertyFilterSubmit,
    type PropertyFilterToken
  } from '@aziontech/webkit/property-filter'
  import Select from '@aziontech/webkit/select'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { matchesQuery } from '@aziontech/webkit/use-collection'
  import { computed, onBeforeUnmount, ref } from 'vue'

  import { sampleEvents, sampleFields, sampleNow } from '../sample'
  import ViewEventsExplorer, {
    type EventsExplorerEvent,
    type EventsExplorerFilters
  } from '../view-events-explorer.vue'

  type FilterValue = EventsExplorerFilters[string][number]

  interface TimeWindow {
    start: Date
    end: Date
  }

  interface QueryEntry {
    text: string
    query: PropertyFilterQuery
  }

  interface SavedQuery extends QueryEntry {
    id: string
    name: string
  }

  const referenceNow = sampleNow.getTime()
  const fullWindowMinutes = 1440

  const timeZone = ref('UTC')

  const timeZones = ['UTC', 'America/Sao_Paulo', 'America/New_York', 'Europe/Lisbon', 'Asia/Tokyo']

  const zoneLabel = (zone: string) => {
    const offset =
      new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'longOffset' })
        .formatToParts(new Date(referenceNow))
        .find((part) => part.type === 'timeZoneName')
        ?.value.replace('GMT', 'UTC')
        .replace('-', '−') ?? zone
    const utcOffset = offset === 'UTC' ? 'UTC+00:00' : offset
    if (!zone.includes('/')) return utcOffset
    const city = zone.split('/').at(-1)?.replace(/_/g, ' ') ?? zone
    return `${utcOffset} · ${city}`
  }

  const setTimeZone = (zone: string | undefined) => {
    if (zone) timeZone.value = zone
  }

  const eventSources: Record<string, string> = {
    http: 'HTTP Requests',
    security: 'Security',
    services: 'Services',
    access: 'Access Control'
  }

  const eventSourceOptions = Object.entries(eventSources).map(([value, label]) => ({
    value,
    label
  }))

  const eventLevelOptions = ['Error', 'Warning', 'Info', 'Debug'].map((value) => ({
    value,
    label: value
  }))

  const fieldValueCounts = (list: EventsExplorerEvent[], id: string) => {
    const counts = new Map<string | number, number>()
    for (const event of list) {
      const value = event[id]
      if (typeof value !== 'string' && typeof value !== 'number') continue
      if (value === '') continue
      counts.set(value, (counts.get(value) ?? 0) + 1)
    }
    return [...counts.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count)
  }

  const valueFields = ['host', 'requestMethod', 'cacheStatus', 'country', 'ruleName', 'serviceName']

  const queryProperties: FilteringProperty[] = [
    { key: 'level', label: 'Level', options: eventLevelOptions },
    { key: 'source', label: 'Source', options: eventSourceOptions },
    ...sampleFields
      .filter((field) => !field.core)
      .map((field): FilteringProperty => {
        if (field.align === 'end') return { key: field.id, label: field.label, type: 'number' }
        if (!valueFields.includes(field.id)) return { key: field.id, label: field.label }
        return {
          key: field.id,
          label: field.label,
          options: fieldValueCounts(sampleEvents, field.id).map(({ value }) => ({
            value: String(value)
          }))
        }
      })
  ]

  const searchableFields = sampleFields.map((field) => field.id)

  const quoteValue = (value: string) =>
    /[\s"'=!:^<>]/.test(value) ? `"${value.replaceAll('"', '')}"` : value

  const queryToText = (query: PropertyFilterQuery) =>
    query.tokens
      .map((token) =>
        token.propertyKey
          ? `${token.propertyKey} ${token.operator} ${quoteValue(token.value)}`
          : quoteValue(token.value)
      )
      .join(query.operation === 'or' ? ' OR ' : ' AND ')

  const initialQuery: PropertyFilterQuery = {
    tokens: [
      { propertyKey: 'level', operator: '=', value: 'Error' },
      { propertyKey: 'host', operator: '=', value: 'api.example.com' }
    ],
    operation: 'and'
  }

  const queryText = ref(queryToText(initialQuery))
  const appliedQuery = ref<PropertyFilterQuery>(initialQuery)
  const appliedText = ref(queryText.value)
  const queryNotice = ref('')
  const page = ref(1)

  const recentLimit = 8

  const recentQueries = ref<QueryEntry[]>([
    {
      text: 'status >= 500',
      query: { tokens: [{ propertyKey: 'status', operator: '>=', value: '500' }], operation: 'and' }
    },
    {
      text: 'source = security AND level = Warning',
      query: {
        tokens: [
          { propertyKey: 'source', operator: '=', value: 'security' },
          { propertyKey: 'level', operator: '=', value: 'Warning' }
        ],
        operation: 'and'
      }
    }
  ])

  const applyQuery = ({ text, query }: PropertyFilterSubmit) => {
    if (!query) {
      queryNotice.value =
        'This query mixes AND and OR. Use one of them throughout, then press Enter again.'
      return
    }
    queryNotice.value = ''
    appliedQuery.value = query
    appliedText.value = text.trim()
    page.value = 1
    if (!appliedText.value) return
    recentQueries.value = [
      { text: appliedText.value, query },
      ...recentQueries.value.filter((entry) => entry.text !== appliedText.value)
    ].slice(0, recentLimit)
  }

  const submitQuery = (_event: KeyboardEvent, payload: PropertyFilterSubmit) => applyQuery(payload)

  const matchesAppliedQuery = (event: EventsExplorerEvent) =>
    matchesQuery(
      { ...event, sourceLabel: eventSources[event.source] ?? event.source },
      appliedQuery.value,
      queryProperties,
      searchableFields
    )

  const runQuery = (entry: QueryEntry) => {
    queryText.value = entry.text
    applyQuery(entry)
  }

  const savedQueries = ref<SavedQuery[]>([
    {
      id: 'q1',
      name: 'Server errors',
      text: 'status >= 500',
      query: { tokens: [{ propertyKey: 'status', operator: '>=', value: '500' }], operation: 'and' }
    },
    {
      id: 'q2',
      name: 'Cache misses on the API',
      text: 'cacheStatus = MISS AND host = api.example.com',
      query: {
        tokens: [
          { propertyKey: 'cacheStatus', operator: '=', value: 'MISS' },
          { propertyKey: 'host', operator: '=', value: 'api.example.com' }
        ],
        operation: 'and'
      }
    }
  ])
  let savedSeed = 2
  const savedOpen = ref(false)
  const recentOpen = ref(false)
  const saveName = ref('')
  const savedStatus = ref('')

  const canSave = computed(() => Boolean(saveName.value.trim() && appliedText.value))

  const saveQuery = () => {
    if (!canSave.value) return
    savedSeed += 1
    const name = saveName.value.trim()
    savedQueries.value = [
      ...savedQueries.value,
      { id: `q${savedSeed}`, name, text: appliedText.value, query: appliedQuery.value }
    ]
    saveName.value = ''
    savedStatus.value = `Saved “${name}”.`
  }

  const deleteSavedQuery = (entry: SavedQuery) => {
    const snapshot = [...savedQueries.value]
    savedQueries.value = savedQueries.value.filter((saved) => saved.id !== entry.id)
    savedStatus.value = `Deleted “${entry.name}”.`
    toast.info(`Saved query “${entry.name}” deleted.`, {
      id: 'events-saved-query',
      actions: [
        {
          label: 'Undo',
          onClick: () => {
            savedQueries.value = snapshot
            savedStatus.value = `Restored “${entry.name}”.`
          }
        }
      ]
    })
  }

  const useSavedQuery = (entry: SavedQuery) => {
    runQuery(entry)
    savedOpen.value = false
  }

  const useRecentQuery = (entry: QueryEntry) => {
    runQuery(entry)
    recentOpen.value = false
  }

  const clearRecentQueries = () => {
    const snapshot = [...recentQueries.value]
    recentQueries.value = []
    recentOpen.value = false
    toast.info('Recent queries cleared.', {
      id: 'events-recent-queries',
      actions: [{ label: 'Undo', onClick: () => (recentQueries.value = snapshot) }]
    })
  }

  const relativeOptions: RelativeOption[] = [
    { key: 'last-15-minutes', amount: 15, unit: 'minute' },
    { key: 'last-1-hour', amount: 1, unit: 'hour' },
    { key: 'last-6-hours', amount: 6, unit: 'hour' },
    { key: 'last-24-hours', amount: 24, unit: 'hour' }
  ]

  const range = ref<DateRangeValue | null>({
    type: 'relative',
    amount: 24,
    unit: 'hour',
    key: 'last-24-hours'
  })
  const rangeNow = new Date(referenceNow)
  const rangeMin = new Date(referenceNow - 7 * 24 * 3600000)

  const unitMs: Record<DateRangeUnit, number> = {
    second: 1000,
    minute: 60000,
    hour: 3600000,
    day: 86400000,
    week: 604800000,
    month: 2592000000,
    year: 31536000000
  }

  const activeWindow = computed<TimeWindow>(() => {
    const value = range.value
    if (!value) {
      return { start: new Date(referenceNow - fullWindowMinutes * 60000), end: rangeNow }
    }
    if (value.type === 'relative') {
      return { start: new Date(referenceNow - value.amount * unitMs[value.unit]), end: rangeNow }
    }
    if (value.type === 'since') return { start: new Date(value.start), end: rangeNow }
    return { start: new Date(value.start), end: new Date(value.end) }
  })

  const presetMinutes: Record<string, number> = { '15m': 15, '1h': 60, '6h': 360, '24h': 1440 }

  const periodValue = computed<FilterValue>(() => {
    const value = range.value
    if (!value) return '24h'
    if (value.type === 'relative') {
      const minutes = (value.amount * unitMs[value.unit]) / 60000
      const preset = Object.entries(presetMinutes).find(([, length]) => length === minutes)
      if (preset) return preset[0]
    }
    return { start: activeWindow.value.start, end: activeWindow.value.end }
  })

  const setPeriod = (value: FilterValue | undefined) => {
    if (value && typeof value === 'object') {
      if (!value.start) return
      range.value = {
        type: 'absolute',
        start: value.start.toISOString(),
        end: (value.end ?? rangeNow).toISOString()
      }
      return
    }
    const minutes = presetMinutes[String(value ?? '24h')] ?? fullWindowMinutes
    range.value =
      relativeOptions.find((option) => option.amount * unitMs[option.unit] === minutes * 60000) ??
      null
  }

  const inWindow = (date: unknown) => {
    if (!(date instanceof Date)) return false
    const time = date.getTime()
    return time >= activeWindow.value.start.getTime() && time <= activeWindow.value.end.getTime()
  }

  const matchedCount = computed(
    () => sampleEvents.filter((event) => inWindow(event.at) && matchesAppliedQuery(event)).length
  )

  const rawValue = (id: string, text: string): FilterValue => {
    const needle = text.toLowerCase()
    for (const event of sampleEvents) {
      const value = event[id]
      if (
        (typeof value === 'string' || typeof value === 'number') &&
        String(value).toLowerCase() === needle
      )
        return value
    }
    return text
  }

  const sameValue = (a: FilterValue, b: FilterValue) =>
    typeof a !== 'object' &&
    typeof b !== 'object' &&
    String(a).toLowerCase() === String(b).toLowerCase()

  const filters = computed<EventsExplorerFilters>({
    get: () => {
      const out: EventsExplorerFilters = { period: [periodValue.value] }
      const { tokens, operation } = appliedQuery.value
      if (operation === 'or' && tokens.length > 1) return out
      for (const token of tokens) {
        if (!token.propertyKey || token.operator !== '=') continue
        out[token.propertyKey] = [
          ...(out[token.propertyKey] ?? []),
          rawValue(token.propertyKey, token.value)
        ]
      }
      return out
    },
    set: (next) => {
      const current = filters.value
      if (next.period?.[0] !== current.period?.[0]) setPeriod(next.period?.[0])
      let tokens: PropertyFilterToken[] = [...appliedQuery.value.tokens]
      let changed = false
      const ids = new Set([...Object.keys(current), ...Object.keys(next)])
      ids.delete('period')
      for (const id of ids) {
        const before = current[id] ?? []
        const after = next[id] ?? []
        for (const value of before.filter((item) => !after.some((v) => sameValue(v, item)))) {
          tokens = tokens.filter(
            (token) =>
              !(token.propertyKey === id && token.operator === '=' && sameValue(token.value, value))
          )
          changed = true
        }
        for (const value of after.filter((item) => !before.some((v) => sameValue(v, item)))) {
          if (typeof value === 'object') continue
          tokens = [...tokens, { propertyKey: id, operator: '=', value: String(value) }]
          changed = true
        }
      }
      if (!changed) return
      const query = { tokens, operation: appliedQuery.value.operation }
      queryText.value = queryToText(query)
      applyQuery({ text: queryText.value, query })
    }
  })

  const loading = ref(false)
  const refreshInterval = ref(300)
  let refreshTimer: ReturnType<typeof setTimeout> | undefined
  const refresh = () => {
    if (loading.value) return
    loading.value = true
    clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => {
      loading.value = false
    }, 700)
  }

  onBeforeUnmount(() => {
    clearTimeout(refreshTimer)
    toast.dismiss('events-saved-query')
    toast.dismiss('events-recent-queries')
  })
</script>

<template>
  <ViewEventsExplorer
    v-model:filters="filters"
    v-model:page="page"
    :events="sampleEvents"
    :match="matchesAppliedQuery"
    :time-zone="timeZone"
    :loading="loading"
  >
    <template #toolbar="{ exportCsv, exportDisabled }">
      <header class="flex items-center gap-(--layout-group-gap)">
        <div class="flex min-w-0 grow flex-wrap items-center gap-(--spacing-xs)">
          <div class="flex shrink-0 items-center">
            <DateRangePicker
              v-model="range"
              v-model:time-zone="timeZone"
              v-model:refresh-interval="refreshInterval"
              :relative-options="relativeOptions"
              :now="rangeNow"
              :min="rangeMin"
              :max="rangeNow"
              show-step
              aria-label="Events time range"
              data-testid="events-range"
              @refresh="refresh"
            />
          </div>
          <div class="flex shrink-0 items-center">
            <Select
              :model-value="timeZone"
              :display-value="zoneLabel"
              size="medium"
              variant="ghost"
              aria-label="Time zone"
              data-testid="events-time-zone"
              @update:model-value="setTimeZone"
            >
              <Select.Trigger>
                <template #leading>
                  <i
                    class="az az-globe text-(--text-muted)"
                    aria-hidden="true"
                  />
                </template>
              </Select.Trigger>
              <Select.Content>
                <Select.Item
                  v-for="zone in timeZones"
                  :key="zone"
                  :value="zone"
                >
                  {{ zoneLabel(zone) }}
                </Select.Item>
              </Select.Content>
            </Select>
          </div>
          <div class="flex min-w-36 grow basis-(--container-xs)">
            <PropertyFilter
              v-model:text="queryText"
              mode="query"
              :properties="queryProperties"
              :total-count="matchedCount"
              aria-label="Query events"
              placeholder="Query events, for example status >= 500 AND host = example.com"
              data-testid="events-query"
              @submit="submitQuery"
            />
          </div>
        </div>
        <div class="flex shrink-0 items-center gap-(--spacing-xs)">
          <Popover
            v-model:open="savedOpen"
            side="bottom"
            align="end"
            size="small"
          >
            <Popover.Trigger>
              <Tooltip content="Saved queries">
                <IconButton
                  icon="az az-bookmark"
                  variant="outline"
                  size="medium"
                  aria-label="Saved queries"
                  data-testid="saved-queries__trigger"
                />
              </Tooltip>
            </Popover.Trigger>
            <Popover.Content>
              <div
                class="flex flex-col gap-(--spacing-xs) p-(--spacing-2xs)"
                data-testid="saved-queries"
              >
                <h2 class="px-(--spacing-xs) pt-(--spacing-2xs) text-label-sm text-(--text-muted)">
                  Saved queries
                </h2>
                <ul
                  v-if="savedQueries.length"
                  class="flex flex-col"
                  aria-label="Saved queries"
                >
                  <li
                    v-for="entry in savedQueries"
                    :key="entry.id"
                    class="flex min-w-0 items-center gap-(--spacing-2xs)"
                  >
                    <Item
                      clickable
                      variant="option"
                      class="min-w-0 flex-1"
                      data-testid="saved-queries__apply"
                      @click="useSavedQuery(entry)"
                    >
                      <span class="flex min-w-0 flex-1 flex-col items-start">
                        <span class="max-w-full truncate text-label-sm text-(--text-default)">
                          {{ entry.name }}
                        </span>
                        <span class="max-w-full truncate text-label-code-sm text-(--text-muted)">
                          {{ entry.text }}
                        </span>
                      </span>
                    </Item>
                    <Tooltip content="Delete">
                      <IconButton
                        icon="az az-trash"
                        variant="ghost"
                        size="small"
                        :aria-label="`Delete ${entry.name}`"
                        data-testid="saved-queries__delete"
                        @click="deleteSavedQuery(entry)"
                      />
                    </Tooltip>
                  </li>
                </ul>
                <p
                  v-else
                  class="px-(--spacing-xs) text-body-sm text-(--text-muted)"
                >
                  No saved queries yet. Name the current query to keep it.
                </p>
                <div
                  class="flex items-center gap-(--spacing-xs) border-t border-(--border-default) px-(--spacing-2xs) pt-(--spacing-xs)"
                >
                  <div class="min-w-0 flex-1">
                    <Input
                      v-model="saveName"
                      size="small"
                      placeholder="Name the current query"
                      aria-label="Name for the current query"
                      class="w-full"
                      data-testid="saved-queries__name"
                      @keydown.enter.prevent="saveQuery"
                    />
                  </div>
                  <Button
                    label="Save"
                    variant="secondary"
                    size="small"
                    :disabled="!canSave"
                    data-testid="saved-queries__save"
                    @click="saveQuery"
                  />
                </div>
                <p
                  role="status"
                  class="sr-only"
                >
                  {{ savedStatus }}
                </p>
              </div>
            </Popover.Content>
          </Popover>
          <Popover
            v-model:open="recentOpen"
            side="bottom"
            align="end"
            size="small"
          >
            <Popover.Trigger>
              <Tooltip content="Recent queries">
                <IconButton
                  icon="az az-history"
                  variant="outline"
                  size="medium"
                  aria-label="Recent queries"
                  data-testid="recent-queries__trigger"
                />
              </Tooltip>
            </Popover.Trigger>
            <Popover.Content>
              <div
                class="flex flex-col gap-(--spacing-xs) p-(--spacing-2xs)"
                data-testid="recent-queries"
              >
                <h2 class="px-(--spacing-xs) pt-(--spacing-2xs) text-label-sm text-(--text-muted)">
                  Recent queries
                </h2>
                <ul
                  v-if="recentQueries.length"
                  class="flex flex-col"
                  aria-label="Recent queries"
                >
                  <li
                    v-for="entry in recentQueries"
                    :key="entry.text"
                  >
                    <Item
                      clickable
                      variant="option"
                      data-testid="recent-queries__apply"
                      @click="useRecentQuery(entry)"
                    >
                      <span class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)">
                        <i
                          class="az az-history shrink-0 text-(--text-muted)"
                          aria-hidden="true"
                        />
                        <span
                          class="min-w-0 flex-1 truncate text-label-code-sm text-(--text-default)"
                        >
                          {{ entry.text }}
                        </span>
                      </span>
                    </Item>
                  </li>
                </ul>
                <p
                  v-else
                  class="px-(--spacing-xs) text-body-sm text-(--text-muted)"
                >
                  Queries you run appear here.
                </p>
                <div
                  v-if="recentQueries.length"
                  class="border-t border-(--border-default) pt-(--spacing-2xs)"
                >
                  <Button
                    label="Clear history"
                    variant="ghost"
                    size="small"
                    data-testid="recent-queries__clear"
                    @click="clearRecentQueries"
                  />
                </div>
              </div>
            </Popover.Content>
          </Popover>
          <Tooltip
            content="Refresh"
            class="shrink-0"
          >
            <IconButton
              icon="az az-refresh"
              variant="outline"
              size="medium"
              :loading="loading"
              aria-label="Refresh"
              data-testid="refresh-button"
              @click="refresh"
            />
          </Tooltip>
          <Tooltip
            content="Download CSV"
            class="shrink-0"
          >
            <IconButton
              icon="az az-download"
              variant="outline"
              size="medium"
              :disabled="exportDisabled"
              aria-label="Download CSV"
              data-testid="export-button"
              @click="exportCsv"
            />
          </Tooltip>
        </div>
      </header>

      <p
        role="status"
        class="text-body-sm text-(--danger-foreground) empty:hidden"
        data-testid="query-notice"
      >
        {{ queryNotice }}
      </p>
    </template>
  </ViewEventsExplorer>
</template>
