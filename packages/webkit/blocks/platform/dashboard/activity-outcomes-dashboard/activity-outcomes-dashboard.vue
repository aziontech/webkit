<script setup lang="ts">
  import BarList, { type BarListItem } from '@aziontech/webkit/bar-list'
  import Button from '@aziontech/webkit/button'
  import Chart, { type ChartSeries } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import EmptyState from '@aziontech/webkit/empty-state'
  import FilterMenu, {
    type FilterMenuField,
    type FilterMenuModel
  } from '@aziontech/webkit/filter-menu'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import SeverityTag, { type SeverityTagSeverity } from '@aziontech/webkit/severity-tag'
  import StatTile from '@aziontech/webkit/stat-tile'
  import Table from '@aziontech/webkit/table'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, ref } from 'vue'

  type Outcome = 'allowed' | 'blocked' | 'held' | 'approved' | 'denied'

  interface ActivityRow {
    id: string
    time: string
    actor: string
    outcome: Outcome
    category: string
    severity: SeverityTagSeverity
    destination: string
    method: string
    rule: string
  }

  const loading = false
  const comparison = 'vs prior day'
  const timeRange = ref('Last 24 hours')
  const filters = ref<FilterMenuModel>({})
  const destination = ref('')
  const activeIndex = ref<number | null>(null)

  const labels = Array.from(
    { length: 24 },
    (_, index) => new Date(Date.UTC(2026, 10, 9, 15 + index))
  )

  const timeRanges: SelectOptionItem[] = [
    {
      value: 'Last hour',
      label: 'Last hour'
    },
    {
      value: 'Last 24 hours',
      label: 'Last 24 hours'
    },
    {
      value: 'Last 7 days',
      label: 'Last 7 days'
    },
    {
      value: 'Last 30 days',
      label: 'Last 30 days'
    }
  ]

  const filterFields: FilterMenuField[] = [
    {
      id: 'actor',
      label: 'Actor',
      options: [
        'report-builder',
        'ticket-triage',
        'inventory-sync',
        'invoice-reader',
        'release-helper',
        'data-export',
        'calendar-sync'
      ].map((name) => ({ value: name, label: name }))
    },
    {
      id: 'outcome',
      label: 'Outcome',
      options: [
        { value: 'allowed', label: 'Allowed' },
        { value: 'blocked', label: 'Blocked' },
        { value: 'held', label: 'Held' },
        { value: 'approved', label: 'Approved' },
        { value: 'denied', label: 'Denied' }
      ]
    },
    {
      id: 'category',
      label: 'Category',
      options: ['Read', 'Write', 'Search', 'Export', 'Delete', 'Admin'].map((name) => ({
        value: name,
        label: name
      }))
    }
  ]

  const figures = [
    {
      id: 'requests',
      label: 'Requests',
      description: 'Every request the rules evaluated in the time range.',
      value: 14489,
      delta: 8.4,
      inverse: false
    },
    {
      id: 'allowed',
      label: 'Allowed',
      description: 'Requests a rule let through to their destination.',
      value: 12913,
      delta: 7.9,
      inverse: false
    },
    {
      id: 'blocked',
      label: 'Blocked',
      description: 'Requests a rule stopped before they reached their destination.',
      value: 1348,
      delta: 12.6,
      inverse: true
    },
    {
      id: 'held',
      label: 'Held',
      description: 'Requests a rule paused until someone approves or denies them.',
      value: 228,
      delta: 4.1,
      inverse: true
    },
    {
      id: 'approved',
      label: 'Approved',
      description: 'Held requests a reviewer approved.',
      value: 186,
      delta: 3.2,
      inverse: false
    },
    {
      id: 'denied',
      label: 'Denied',
      description: 'Held requests a reviewer denied.',
      value: 41,
      delta: -9.5,
      inverse: true
    },
    {
      id: 'over-budget',
      label: 'Over budget',
      description: 'Requests that went past the spending or volume budget set for their actor.',
      value: 73,
      delta: 21.7,
      inverse: true
    }
  ]

  const outcomes: ChartSeries[] = [
    {
      id: 'allowed',
      name: 'Allowed',
      color: 'success',
      values: [
        412, 386, 341, 318, 296, 305, 352, 448, 571, 664, 718, 742, 731, 756, 769, 748, 702, 655,
        598, 541, 503, 476, 451, 430
      ]
    },
    {
      id: 'blocked',
      name: 'Blocked',
      color: 'danger',
      values: [
        38, 35, 31, 29, 33, 30, 36, 47, 62, 71, 84, 79, 76, 91, 88, 82, 74, 69, 61, 55, 49, 46, 42,
        40
      ]
    },
    {
      id: 'held',
      name: 'Held',
      color: 'warning',
      values: [6, 5, 4, 3, 4, 3, 5, 8, 11, 14, 16, 15, 13, 17, 18, 15, 13, 12, 10, 9, 8, 7, 6, 6]
    }
  ]

  const actors: BarListItem[] = [
    {
      id: 'report-builder',
      name: 'report-builder',
      value: 4494
    },
    {
      id: 'ticket-triage',
      name: 'ticket-triage',
      value: 3187
    },
    {
      id: 'inventory-sync',
      name: 'inventory-sync',
      value: 2463
    },
    {
      id: 'invoice-reader',
      name: 'invoice-reader',
      value: 1738
    },
    {
      id: 'release-helper',
      name: 'release-helper',
      value: 1304
    },
    {
      id: 'data-export',
      name: 'data-export',
      value: 869
    },
    {
      id: 'calendar-sync',
      name: 'calendar-sync',
      value: 434
    }
  ]

  const categories: BarListItem[] = [
    {
      id: 'Read',
      name: 'Read',
      value: 7827
    },
    {
      id: 'Write',
      name: 'Write',
      value: 3042
    },
    {
      id: 'Search',
      name: 'Search',
      value: 1738
    },
    {
      id: 'Export',
      name: 'Export',
      value: 869
    },
    {
      id: 'Delete',
      name: 'Delete',
      value: 579
    },
    {
      id: 'Admin',
      name: 'Admin',
      value: 434
    }
  ]

  const destinations: BarListItem[] = [
    {
      id: 'api.example.com',
      name: 'api.example.com',
      value: 5508
    },
    {
      id: 'storage.example.com',
      name: 'storage.example.com',
      value: 2752
    },
    {
      id: 'crm.example.net',
      name: 'crm.example.net',
      value: 2318
    },
    {
      id: 'billing.example.com',
      name: 'billing.example.com',
      value: 1593
    },
    {
      id: 'mail.example.org',
      name: 'mail.example.org',
      value: 1304
    },
    {
      id: 'docs.example.com',
      name: 'docs.example.com',
      value: 1014
    }
  ]

  const columns: TableColumn[] = [
    {
      id: 'time',
      accessorKey: 'time',
      header: 'Time',
      align: 'start',
      enableSorting: true,
      principal: true
    },
    {
      id: 'actor',
      accessorKey: 'actor',
      header: 'Actor',
      align: 'start',
      enableSorting: true,
      principal: false
    },
    {
      id: 'outcome',
      accessorKey: 'outcome',
      header: 'Outcome',
      align: 'start',
      enableSorting: false,
      principal: false
    },
    {
      id: 'category',
      accessorKey: 'category',
      header: 'Category',
      align: 'start',
      enableSorting: false,
      principal: false
    },
    {
      id: 'severity',
      accessorKey: 'severity',
      header: 'Severity',
      align: 'start',
      enableSorting: false,
      principal: false
    },
    {
      id: 'destination',
      accessorKey: 'destination',
      header: 'Destination',
      align: 'start',
      enableSorting: true,
      principal: false
    },
    {
      id: 'method',
      accessorKey: 'method',
      header: 'Method',
      align: 'start',
      enableSorting: false,
      principal: false
    },
    {
      id: 'rule',
      accessorKey: 'rule',
      header: 'Rule',
      align: 'start',
      enableSorting: false,
      principal: false
    }
  ]

  const rows: ActivityRow[] = [
    {
      id: 'request-01',
      time: '14:52:08',
      actor: 'report-builder',
      outcome: 'allowed',
      category: 'Read',
      severity: 'info',
      destination: 'api.example.com',
      method: 'GET',
      rule: 'Read-only access'
    },
    {
      id: 'request-02',
      time: '14:51:47',
      actor: 'data-export',
      outcome: 'blocked',
      category: 'Export',
      severity: 'critical',
      destination: 'storage.example.com',
      method: 'PUT',
      rule: 'No bulk export'
    },
    {
      id: 'request-03',
      time: '14:51:12',
      actor: 'ticket-triage',
      outcome: 'held',
      category: 'Write',
      severity: 'medium',
      destination: 'crm.example.net',
      method: 'PATCH',
      rule: 'Review customer changes'
    },
    {
      id: 'request-04',
      time: '14:50:39',
      actor: 'invoice-reader',
      outcome: 'allowed',
      category: 'Read',
      severity: 'low',
      destination: 'billing.example.com',
      method: 'GET',
      rule: 'Read-only access'
    },
    {
      id: 'request-05',
      time: '14:49:58',
      actor: 'release-helper',
      outcome: 'approved',
      category: 'Admin',
      severity: 'high',
      destination: 'api.example.com',
      method: 'POST',
      rule: 'Approve admin actions'
    },
    {
      id: 'request-06',
      time: '14:49:21',
      actor: 'inventory-sync',
      outcome: 'blocked',
      category: 'Delete',
      severity: 'high',
      destination: 'api.example.com',
      method: 'DELETE',
      rule: 'No deletes outside hours'
    },
    {
      id: 'request-07',
      time: '14:48:44',
      actor: 'report-builder',
      outcome: 'allowed',
      category: 'Search',
      severity: 'info',
      destination: 'docs.example.com',
      method: 'GET',
      rule: 'Read-only access'
    },
    {
      id: 'request-08',
      time: '14:48:03',
      actor: 'ticket-triage',
      outcome: 'denied',
      category: 'Write',
      severity: 'medium',
      destination: 'mail.example.org',
      method: 'POST',
      rule: 'Review outbound mail'
    },
    {
      id: 'request-09',
      time: '14:47:26',
      actor: 'calendar-sync',
      outcome: 'allowed',
      category: 'Write',
      severity: 'low',
      destination: 'api.example.com',
      method: 'PUT',
      rule: 'Scheduled writes'
    },
    {
      id: 'request-10',
      time: '14:46:50',
      actor: 'data-export',
      outcome: 'blocked',
      category: 'Export',
      severity: 'critical',
      destination: 'storage.example.com',
      method: 'PUT',
      rule: 'No bulk export'
    },
    {
      id: 'request-11',
      time: '14:46:12',
      actor: 'invoice-reader',
      outcome: 'allowed',
      category: 'Read',
      severity: 'info',
      destination: 'billing.example.com',
      method: 'GET',
      rule: 'Read-only access'
    },
    {
      id: 'request-12',
      time: '14:45:37',
      actor: 'release-helper',
      outcome: 'held',
      category: 'Admin',
      severity: 'high',
      destination: 'api.example.com',
      method: 'POST',
      rule: 'Approve admin actions'
    }
  ]

  const { formatNumber } = useLocale()

  const compact = (value: number) =>
    formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 })

  const formatCount = (value: number) => compact(value)

  const outcomeTags: Record<Outcome, { label: string; severity: TagSeverity }> = {
    allowed: {
      label: 'Allowed',
      severity: 'success'
    },
    blocked: {
      label: 'Blocked',
      severity: 'danger'
    },
    held: {
      label: 'Held',
      severity: 'warning'
    },
    approved: {
      label: 'Approved',
      severity: 'neutral'
    },
    denied: {
      label: 'Denied',
      severity: 'neutral'
    }
  }

  const outcomeTag = (outcome: Outcome) => outcomeTags[outcome]

  const picked = (id: string) => (filters.value[id] ?? []).map(String)
  const keeps = (id: string, value: string) => {
    const values = picked(id)
    return !values.length || values.includes(value)
  }
  const host = computed(() => destination.value.trim().toLowerCase())

  const filtering = computed(
    () => Object.values(filters.value).some((values) => values.length > 0) || host.value !== ''
  )

  const filteredRows = computed(() =>
    rows.filter(
      (row) =>
        keeps('actor', row.actor) &&
        keeps('outcome', row.outcome) &&
        keeps('category', row.category) &&
        (!host.value || row.destination.toLowerCase().includes(host.value))
    )
  )

  const share = computed(() => (rows.length ? filteredRows.value.length / rows.length : 0))
  const outcomeIds: ReadonlySet<string> = new Set([
    'allowed',
    'blocked',
    'held',
    'approved',
    'denied'
  ])

  const visibleFigures = computed(() =>
    filtering.value
      ? figures.map((figure) => {
          if (!filteredRows.value.length) return { ...figure, value: null, delta: null }
          const excluded = outcomeIds.has(figure.id) && !keeps('outcome', figure.id)
          return {
            ...figure,
            value: excluded ? 0 : Math.round(figure.value * share.value),
            delta: null
          }
        })
      : figures
  )

  const visibleOutcomes = computed<ChartSeries[]>(() =>
    filtering.value
      ? filteredRows.value.length
        ? outcomes
            .filter((entry) => keeps('outcome', entry.id))
            .map((entry) => ({
              ...entry,
              values: entry.values.map((value) =>
                value === null ? null : Math.round(value * share.value)
              )
            }))
        : []
      : outcomes
  )

  const narrow = (items: BarListItem[], keep: (item: BarListItem) => boolean) =>
    filtering.value ? (filteredRows.value.length ? items.filter(keep) : []) : items

  const visibleActors = computed(() =>
    narrow(actors, (item) => keeps('actor', String(item.id ?? item.name)))
  )
  const visibleCategories = computed(() =>
    narrow(categories, (item) => keeps('category', String(item.id ?? item.name)))
  )
  const visibleDestinations = computed(() =>
    narrow(destinations, (item) => !host.value || item.name.toLowerCase().includes(host.value))
  )

  const emptyTitle = computed(() =>
    filtering.value ? 'No requests match these filters' : 'No requests in this time range'
  )
  const emptyDescription = computed(() =>
    filtering.value
      ? 'Clear the filters or pick other values.'
      : 'Requests the rules evaluate appear here. Widen the time range to see older ones.'
  )

  const clearFilters = () => {
    filters.value = {}
    destination.value = ''
  }

  const emit = defineEmits<{ refresh: [event: MouseEvent] }>()
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Request activity"
        description="What each actor requested through the rules: what was allowed, blocked or held for approval, and what went over budget, per actor, category and destination."
      >
        <template #actions>
          <div class="w-full sm:w-44">
            <Select
              v-model="timeRange"
              size="medium"
            >
              <Select.Trigger aria-label="Time range" />
              <Select.Content>
                <Select.Option
                  v-for="option in timeRanges"
                  :key="String(option.value)"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Option>
              </Select.Content>
            </Select>
          </div>
          <IconButton
            icon="pi pi-refresh"
            kind="outlined"
            size="medium"
            aria-label="Refresh"
            @click="(event: MouseEvent) => emit('refresh', event)"
          />
        </template>
      </PageHeader>

      <section
        aria-label="Filters"
        class="flex min-w-0 flex-col gap-(--spacing-xs)"
      >
        <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
          <FilterMenu
            v-model="filters"
            :fields="filterFields"
            size="medium"
          />
          <div class="w-full min-w-0 sm:w-(--container-3xs)">
            <Input
              v-model="destination"
              placeholder="api.example.com"
              size="medium"
              aria-label="Destination host"
            />
          </div>
        </div>
        <FilterMenu.Chips
          v-model="filters"
          :fields="filterFields"
        />
      </section>

      <section aria-label="Outcomes">
        <ul class="grid grid-cols-2 gap-(--spacing-md) sm:grid-cols-4 2xl:grid-cols-7">
          <li
            v-for="figure in visibleFigures"
            :key="figure.id"
            class="flex min-w-0 flex-col"
          >
            <StatTile
              :label="figure.label"
              :value="figure.value"
              :format-value="formatCount"
              :delta="figure.delta"
              :delta-label="comparison"
              :inverse="figure.inverse"
              :loading="loading"
            >
              <template #aside>
                <Hint :text="figure.description" />
              </template>
            </StatTile>
          </li>
        </ul>
      </section>

      <div
        class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Outcomes over time</ChartCard.Title>
              <Hint text="Requests per hour, stacked by the outcome the rules gave them." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <Chart
              v-model:active-index="activeIndex"
              :series="visibleOutcomes"
              :labels="labels"
              :format-value="formatCount"
              :empty-title="emptyTitle"
              :empty-description="emptyDescription"
              :loading="loading"
            >
              <template
                v-if="filtering"
                #empty-actions
              >
                <Button
                  label="Clear filters"
                  kind="outlined"
                  size="small"
                  @click="clearFilters"
                />
              </template>
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
              <Chart.Bar stacked />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend total />
            </Chart>
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Actors</ChartCard.Title>
              <Hint text="Requests per actor, every outcome included." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <BarList
              :items="visibleActors"
              :format-value="formatCount"
              :empty-title="emptyTitle"
              :loading="loading"
              aria-label="Requests by actor"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Categories</ChartCard.Title>
              <Hint text="Requests per category of action, every outcome included." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <BarList
              :items="visibleCategories"
              :format-value="formatCount"
              :color="2"
              :empty-title="emptyTitle"
              :loading="loading"
              aria-label="Requests by category"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Destinations</ChartCard.Title>
              <Hint text="Requests per destination host, every outcome included." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <BarList
              :items="visibleDestinations"
              :format-value="formatCount"
              :color="3"
              :empty-title="emptyTitle"
              :loading="loading"
              aria-label="Requests by destination"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Requests</ChartCard.Title>
              <Hint
                text="The latest requests, newest first, with the rule that decided each one."
              />
            </span>
            <ChartCard.Action>
              <Tag
                v-if="!loading && filteredRows.length"
                :label="filteredRows.length + ' requests'"
                severity="neutral"
                size="small"
              />
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <DataTable
              v-if="loading || filteredRows.length"
              :data="filteredRows"
              :columns="columns"
              row-key="id"
              enable-sorting
              paginated
              :page-size="10"
              :page-size-options="[10, 25, 50]"
              density="compact"
              bordered
              :loading="loading"
            >
              <template #cell-outcome="{ row }">
                <Table.CellStatus
                  :label="outcomeTag(row.outcome).label"
                  :severity="outcomeTag(row.outcome).severity"
                />
              </template>
              <template #cell-severity="{ row }">
                <SeverityTag
                  :severity="row.severity"
                  size="small"
                />
              </template>
              <template #cell-method="{ row }">
                <span class="font-mono text-body-sm">{{ row.method }}</span>
              </template>
            </DataTable>
            <EmptyState
              key="empty-state-1"
              v-else-if="filtering"
              size="small"
              icon="pi pi-filter-slash"
              title="No requests match these filters"
              description="Clear the filters or pick other values."
            >
              <template #actions>
                <Button
                  label="Clear filters"
                  kind="outlined"
                  size="small"
                  @click="clearFilters"
                />
              </template>
            </EmptyState>
            <EmptyState
              key="empty-state-2"
              v-else
              size="small"
              icon="pi pi-list"
              title="No requests in this time range"
              description="Requests the rules evaluate appear here. Widen the time range to see older ones."
            />
          </ChartCard.Content>
        </ChartCard>
      </div>
    </div>
  </div>
</template>
