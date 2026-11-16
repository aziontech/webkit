<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import BarList, { type BarListItem } from '@aziontech/webkit/bar-list'
  import Button from '@aziontech/webkit/button'
  import Chart, { type ChartLabel, type ChartSeries } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatTile from '@aziontech/webkit/stat-tile'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { type CsvColumn, downloadCsv, toCsv } from '@aziontech/webkit/utils/csv'
  import { computed, ref } from 'vue'

  import {
    sampleAttention,
    sampleCardChanges,
    sampleCategories,
    sampleCountries,
    sampleMatchedRequests,
    samplePeriodRange,
    sampleSourceIps,
    sampleSummary
  } from './sample'

  /** The period every region reads. */
  export type SecurityPeriod = '1h' | '24h' | '7d' | '30d'
  /** The cards with a menu and an expanded view. */
  export type SecurityCardId = 'matched' | 'categories' | 'countries' | 'ips'

  /** One summary figure with its comparison. */
  export interface SecurityMetric {
    /** The figure; null shows a dash. */
    value: number | null
    /** Change against the previous period, in percent; null hides it. */
    delta: number | null
    /** The figure over the period, for the sparkline. */
    trend: number[]
  }

  /** The three summary tiles. */
  export interface SecuritySummary {
    /** Requests blocked as attacks. */
    blocked: SecurityMetric
    /** Requests checked against the rules. */
    inspected: SecurityMetric
    /** Share of inspected requests blocked, in percent. */
    blockRate: SecurityMetric
  }

  /** The Matched requests chart over the period. */
  export interface SecurityMatchedRequests {
    /** One label per point of the x axis. */
    labels: ChartLabel[]
    /** The Blocked and Logged series. */
    series: ChartSeries[]
  }

  /** One row of the Top source IPs table. */
  export interface SecuritySourceIp {
    /** Stable key. */
    id: string
    /** The address. */
    remoteAddress: string
    /** Its network, with the AS number. */
    asn: string
    /** The country it came from. */
    country: string
    /** The attack category it matched most. */
    category: string
    /** Blocked requests from it in the period. */
    requests: number
  }

  /** One entry of the Needs attention list. */
  export interface SecurityAttentionEntry {
    /** Stable key. */
    id: string
    /** Icon class. */
    icon: string
    /** What needs a decision. */
    title: string
    /** The detail. */
    description: string
    /** Color of the tag. */
    severity: TagSeverity
    /** Short tag text. */
    tag: string
    /** The link that resolves it. */
    action: { label: string; href: string }
  }

  /** Change of each card's sum against the previous period, in percent. */
  export type SecurityCardChanges = Record<SecurityCardId, number>

  /** The start and end of the period, as ISO dates, used in the copied query. */
  export interface SecurityPeriodRange {
    /** Start of the period. */
    begin: string
    /** End of the period. */
    end: string
  }

  export interface SecurityDashboardProps {
    /** The three summary tiles. Left out, the sample renders. */
    summary?: SecuritySummary
    /** The Matched requests chart. Left out, the sample renders. */
    matchedRequests?: SecurityMatchedRequests
    /** Blocked requests by attack category. Left out, the sample renders. */
    categories?: BarListItem[]
    /** Blocked requests by country. Left out, the sample renders. */
    countries?: BarListItem[]
    /** The Top source IPs rows. Left out, the sample renders. */
    sourceIps?: SecuritySourceIp[]
    /** The Needs attention list. Left out, the sample renders. */
    attention?: SecurityAttentionEntry[]
    /** Change of each card's sum against the previous period. Left out, the sample renders. */
    changes?: SecurityCardChanges
    /** The start and end of the period. Left out, the sample renders. */
    range?: SecurityPeriodRange
    /** The period is loading. */
    loading?: boolean
    /** Why the period could not load, shown after what did not load in each danger alert. */
    error?: string
  }

  const props = withDefaults(defineProps<SecurityDashboardProps>(), {
    summary: undefined,
    matchedRequests: undefined,
    categories: undefined,
    countries: undefined,
    sourceIps: undefined,
    attention: undefined,
    changes: undefined,
    range: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    retry: [event: MouseEvent]
  }>()

  const period = defineModel<SecurityPeriod>('period', { default: '24h' })

  const noMetric: SecurityMetric = { value: null, delta: null, trend: [] }
  const blocked = computed(() => props.loading || props.error !== '')
  const summary = computed<SecuritySummary>(
    () =>
      props.summary ??
      (blocked.value
        ? { blocked: noMetric, inspected: noMetric, blockRate: noMetric }
        : sampleSummary)
  )
  const matched = computed<SecurityMatchedRequests>(
    () =>
      props.matchedRequests ?? (blocked.value ? { labels: [], series: [] } : sampleMatchedRequests)
  )
  const categories = computed(() => props.categories ?? (blocked.value ? [] : sampleCategories))
  const countries = computed(() => props.countries ?? (blocked.value ? [] : sampleCountries))
  const sourceIps = computed(() => props.sourceIps ?? (blocked.value ? [] : sampleSourceIps))
  const attention = computed(() => props.attention ?? (blocked.value ? [] : sampleAttention))
  const changes = computed(() => props.changes ?? (blocked.value ? null : sampleCardChanges))
  const range = computed(() => props.range ?? samplePeriodRange)
  const empty = computed(
    () =>
      !blocked.value &&
      matched.value.series.length === 0 &&
      categories.value.length === 0 &&
      countries.value.length === 0 &&
      sourceIps.value.length === 0 &&
      attention.value.length === 0
  )

  const changeTag = (id: SecurityCardId) => {
    const change = changes.value?.[id]
    if (change === undefined) return null
    const rising = change > 0
    return {
      label: `${rising ? '+' : ''}${change.toFixed(2)}%`,
      severity: (rising ? 'danger' : 'success') as TagSeverity,
      icon: rising ? 'ai ai-arrow-up-right' : 'ai ai-arrow-down-left'
    }
  }

  const fallbackPeriod = {
    value: '24h',
    label: 'Last 24 hours',
    comparison: 'vs previous 24 hours'
  }
  const periods = [
    { value: '1h', label: 'Last hour', comparison: 'vs previous hour' },
    fallbackPeriod,
    { value: '7d', label: 'Last 7 days', comparison: 'vs previous 7 days' },
    { value: '30d', label: 'Last 30 days', comparison: 'vs previous 30 days' }
  ]
  const periodLabel = (value: string) => periods.find((entry) => entry.value === value)?.label ?? ''
  const currentPeriod = computed(
    () => periods.find((entry) => entry.value === period.value) ?? fallbackPeriod
  )
  const periodComparison = computed(() => currentPeriod.value.comparison)
  const periodSlug = computed(() => currentPeriod.value.label.toLowerCase().replaceAll(' ', '-'))

  const { formatNumber } = useLocale()

  const compact = (value: number) =>
    formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 })
  const formatCount = (value: number) => compact(value)
  const formatPercent = (value: number) => `${value.toFixed(value >= 10 ? 0 : 1)}%`

  const ipColumns: TableColumn[] = [
    {
      accessorKey: 'remoteAddress',
      id: 'remoteAddress',
      header: 'IP address',
      align: 'start',
      sortable: true,
      principal: true
    },
    {
      accessorKey: 'asn',
      id: 'asn',
      header: 'Network',
      align: 'start',
      sortable: true,
      principal: false
    },
    {
      accessorKey: 'country',
      id: 'country',
      header: 'Country',
      align: 'start',
      sortable: true,
      principal: false
    },
    {
      accessorKey: 'category',
      id: 'category',
      header: 'Main attack',
      align: 'start',
      sortable: true,
      principal: false
    },
    {
      accessorKey: 'requests',
      id: 'requests',
      header: 'Blocked requests',
      align: 'end',
      sortable: true,
      principal: false
    }
  ]
  const forms = [
    { label: 'Line', value: 'line' },
    { label: 'Bar', value: 'bar' }
  ]

  const form = ref('line')
  const activeIndex = ref<number | null>(null)
  const search = ref('')

  interface CardQuery {
    dataset: string
    fields: string[]
    orderBy: string
  }

  const cardQuery = (report: CardQuery) =>
    [
      'query {',
      `  ${report.dataset}(`,
      '    limit: 5000',
      '    aggregate: { sum: requests }',
      `    filter: { tsRange: { begin: "${range.value.begin}", end: "${range.value.end}" } }`,
      `    orderBy: [${report.orderBy}]`,
      '  ) {',
      ...report.fields.map((field) => `    ${field}`),
      '  }',
      '}'
    ].join('\n')

  const copyQuery = async (report: CardQuery) => {
    try {
      await globalThis.navigator.clipboard.writeText(cardQuery(report))
      toast.success('Query copied.', {
        description: 'Paste it into any GraphQL client that sends your token.'
      })
    } catch {
      toast.error('The query could not be copied.')
    }
  }

  const queries: Record<SecurityCardId, CardQuery> = {
    matched: {
      dataset: 'securityMetrics',
      fields: ['ts', 'action', 'requests'],
      orderBy: 'ts_ASC'
    },
    categories: {
      dataset: 'securityMetrics',
      fields: ['attackCategory', 'requests'],
      orderBy: 'requests_DESC'
    },
    countries: {
      dataset: 'securityMetrics',
      fields: ['country', 'requests'],
      orderBy: 'requests_DESC'
    },
    ips: {
      dataset: 'securityMetrics',
      fields: ['remoteAddress', 'asn', 'country', 'attackCategory', 'requests'],
      orderBy: 'requests_DESC'
    }
  }

  interface CardReport extends CardQuery {
    label: string
    description: string
    columns: CsvColumn[]
    rows: () => object[]
  }

  const seriesRows = (series: readonly ChartSeries[], axis: readonly ChartLabel[]) =>
    axis.map((label, index) => ({
      ts: label instanceof Date ? label.toISOString() : String(label),
      ...Object.fromEntries(series.map((entry) => [entry.id, entry.values[index] ?? '']))
    }))

  const expanded = ref(false)
  const expandedId = ref<SecurityCardId>('matched')
  const expandedReport = computed(() => reports[expandedId.value])

  const openExpanded = (id: SecurityCardId) => {
    expandedId.value = id
    expanded.value = true
  }

  const onCardOption = (id: SecurityCardId, value: string | number) => {
    const report = reports[id]
    if (value === 'query') {
      copyQuery(report)
      return
    }
    const filename = `${id}-${periodSlug.value}.csv`
    downloadCsv(filename, toCsv({ columns: report.columns, rows: report.rows() }))
    toast.success('CSV exported.', { description: filename })
  }

  const reports: Record<SecurityCardId, CardReport> = {
    matched: {
      ...queries.matched,
      label: 'Matched requests over time',
      description: 'Requests that matched a rule: blocked, or logged and allowed through.',
      columns: [
        { header: 'Time', id: 'ts' },
        { header: 'Blocked', id: 'blocked' },
        { header: 'Logged', id: 'logged' }
      ],
      rows: () => seriesRows(matched.value.series, matched.value.labels)
    },
    categories: {
      ...queries.categories,
      label: 'Blocked requests by attack category',
      description: 'Blocked requests, broken down by the attack category of the rule they matched.',
      columns: [
        { header: 'Attack category', id: 'name' },
        { header: 'Blocked requests', id: 'value' }
      ],
      rows: () => categories.value
    },
    countries: {
      ...queries.countries,
      label: 'Blocked requests by country',
      description: 'Blocked requests, broken down by the country they came from.',
      columns: [
        { header: 'Country', id: 'name' },
        { header: 'Blocked requests', id: 'value' }
      ],
      rows: () => countries.value
    },
    ips: {
      ...queries.ips,
      label: 'Top source IPs by blocked requests',
      description: 'The addresses blocked most often, with their network and main attack.',
      columns: [
        { header: 'IP address', id: 'remoteAddress' },
        { header: 'Network', id: 'asn' },
        { header: 'Country', id: 'country' },
        { header: 'Main attack', id: 'category' },
        { header: 'Blocked requests', id: 'requests' }
      ],
      rows: () => sourceIps.value
    }
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Security"
        description="Requests your rules blocked and inspected, and the settings that need a decision."
      >
        <template #actions>
          <Select
            v-model="period"
            size="medium"
            :display-value="periodLabel"
          >
            <Select.Trigger aria-label="Period" />
            <Select.Content>
              <Select.Item
                v-for="option in periods"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </Select.Item>
            </Select.Content>
          </Select>
        </template>
      </PageHeader>
      <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-3">
        <li class="flex min-w-0 flex-col">
          <StatTile
            label="Requests blocked"
            :value="summary.blocked.value"
            :format-value="formatCount"
            :delta="summary.blocked.delta"
            :delta-label="periodComparison"
            inverse
            :trend="summary.blocked.trend"
            :loading="loading"
          >
            <template #aside>
              <Hint
                content="Requests a security rule identified as attacks and blocked before they reached a service."
              />
            </template>
          </StatTile>
        </li>
        <li class="flex min-w-0 flex-col">
          <StatTile
            label="Requests inspected"
            :value="summary.inspected.value"
            :format-value="formatCount"
            :delta="summary.inspected.delta"
            :delta-label="periodComparison"
            :trend="summary.inspected.trend"
            :loading="loading"
          >
            <template #aside>
              <Hint content="Requests checked against security rules across every service." />
            </template>
          </StatTile>
        </li>
        <li class="flex min-w-0 flex-col">
          <StatTile
            label="Block rate"
            :value="summary.blockRate.value"
            :format-value="formatPercent"
            :delta="summary.blockRate.delta"
            :delta-label="periodComparison"
            inverse
            :trend="summary.blockRate.trend"
            :loading="loading"
          >
            <template #aside>
              <Hint content="Share of inspected requests blocked as attacks." />
            </template>
          </StatTile>
        </li>
      </ul>
      <EmptyState
        v-if="empty"
        title="No security rules protect your services"
        description="Security metrics and the Needs attention list appear once a rule set protects a service."
        icon="ai ai-shield"
        bordered
      >
        <template #actions>
          <Button
            label="Add rule set"
            variant="primary"
            size="medium"
            icon="ai ai-plus"
            href="/security/rules"
          />
        </template>
      </EmptyState>
      <div
        v-else
        class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <ChartCard :span="8">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Matched requests over time</ChartCard.Title>
              <Hint
                content="Requests that matched a rule: blocked, or logged and allowed through."
              />
            </span>
            <ChartCard.Action>
              <span
                class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
              >
                <Tag
                  label="Sum"
                  severity="neutral"
                  size="small"
                  icon="ai ai-calculator"
                />
                <Tag
                  v-if="changeTag('matched')"
                  :label="changeTag('matched')?.label"
                  :severity="changeTag('matched')?.severity"
                  :icon="changeTag('matched')?.icon"
                  size="small"
                />
                <ToggleGroup
                  v-model="form"
                  :options="forms"
                  size="small"
                  aria-label="Chart form for Matched requests over time"
                />
              </span>
              <Tooltip content="Expand">
                <IconButton
                  icon="ai ai-window-maximize"
                  variant="ghost"
                  size="small"
                  aria-label="Expand Matched requests over time"
                  :disabled="blocked"
                  @click="openExpanded('matched')"
                />
              </Tooltip>
              <DropdownMenu
                side="bottom"
                align="end"
                @select="(_event, value) => onCardOption('matched', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="ai ai-ellipsis"
                    variant="ghost"
                    size="small"
                    aria-label="More options for Matched requests over time"
                    :disabled="blocked"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    value="query"
                    label="Copy query"
                  />
                  <DropdownMenu.Item
                    value="export"
                    label="Export CSV"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="error"
              severity="danger"
              :label="`Couldn't load matched requests over time. ${error}`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <Chart
              v-else
              v-model:active-index="activeIndex"
              :series="matched.series"
              :labels="matched.labels"
              :format-value="formatCount"
              empty-title="No matched requests in this period"
              empty-description="Nothing was recorded in this period."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis type="y" />
              <Chart.Axis type="x" />
              <Chart.Bar
                v-if="form === 'bar'"
                stacked
              />
              <Chart.Line v-else />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend total />
            </Chart>
          </ChartCard.Content>
        </ChartCard>
        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Needs attention</ChartCard.Title>
              <Hint content="Settings and traffic on your services that ask for a decision." />
            </span>
            <ChartCard.Action v-if="!blocked">
              <Tag
                :label="`${attention.length} open`"
                severity="neutral"
                size="small"
              />
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="error"
              severity="danger"
              :label="`Couldn't load the attention list. ${error}`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <div
              v-else-if="loading"
              class="flex flex-col gap-(--spacing-md)"
            >
              <div
                v-for="row in 3"
                :key="row"
                class="flex flex-col gap-(--spacing-xs)"
              >
                <Skeleton
                  width="60%"
                  height="0.875rem"
                />
                <Skeleton
                  width="90%"
                  height="0.75rem"
                />
              </div>
            </div>
            <Item.List v-else>
              <Item
                v-for="entry in attention"
                :key="entry.id"
                role="listitem"
                variant="inline"
                size="small"
              >
                <Item.Media>
                  <i
                    :class="entry.icon"
                    class="text-body-sm leading-none text-(--text-muted)"
                    aria-hidden="true"
                  />
                </Item.Media>
                <Item.Content>
                  <Item.Title>{{ entry.title }}</Item.Title>
                  <Item.Description>{{ entry.description }}</Item.Description>
                  <span class="flex flex-wrap items-center gap-(--spacing-xs)">
                    <Tag
                      :label="entry.tag"
                      :severity="entry.severity"
                      size="small"
                    />
                    <Link
                      :label="entry.action.label"
                      :href="entry.action.href"
                      size="small"
                    />
                  </span>
                </Item.Content>
              </Item>
            </Item.List>
          </ChartCard.Content>
        </ChartCard>
        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Blocked requests by attack category</ChartCard.Title>
              <Hint
                content="Blocked requests, broken down by the attack category of the rule they matched."
              />
            </span>
            <ChartCard.Action>
              <span
                class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
              >
                <Tag
                  label="Sum"
                  severity="neutral"
                  size="small"
                  icon="ai ai-calculator"
                />
                <Tag
                  v-if="changeTag('categories')"
                  :label="changeTag('categories')?.label"
                  :severity="changeTag('categories')?.severity"
                  :icon="changeTag('categories')?.icon"
                  size="small"
                />
              </span>
              <Tooltip content="Expand">
                <IconButton
                  icon="ai ai-window-maximize"
                  variant="ghost"
                  size="small"
                  aria-label="Expand Blocked requests by attack category"
                  :disabled="blocked"
                  @click="openExpanded('categories')"
                />
              </Tooltip>
              <DropdownMenu
                side="bottom"
                align="end"
                @select="(_event, value) => onCardOption('categories', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="ai ai-ellipsis"
                    variant="ghost"
                    size="small"
                    aria-label="More options for Blocked requests by attack category"
                    :disabled="blocked"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    value="query"
                    label="Copy query"
                  />
                  <DropdownMenu.Item
                    value="export"
                    label="Export CSV"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="error"
              severity="danger"
              :label="`Couldn't load blocked requests by attack category. ${error}`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <BarList
              v-else
              :items="categories"
              :format-value="formatCount"
              empty-title="No blocked requests in this period"
              :loading="loading"
              aria-label="Blocked requests by attack category"
            />
          </ChartCard.Content>
        </ChartCard>
        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Blocked requests by country</ChartCard.Title>
              <Hint content="Blocked requests, broken down by the country they came from." />
            </span>
            <ChartCard.Action>
              <span
                class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
              >
                <Tag
                  label="Sum"
                  severity="neutral"
                  size="small"
                  icon="ai ai-calculator"
                />
                <Tag
                  v-if="changeTag('countries')"
                  :label="changeTag('countries')?.label"
                  :severity="changeTag('countries')?.severity"
                  :icon="changeTag('countries')?.icon"
                  size="small"
                />
              </span>
              <Tooltip content="Expand">
                <IconButton
                  icon="ai ai-window-maximize"
                  variant="ghost"
                  size="small"
                  aria-label="Expand Blocked requests by country"
                  :disabled="blocked"
                  @click="openExpanded('countries')"
                />
              </Tooltip>
              <DropdownMenu
                side="bottom"
                align="end"
                @select="(_event, value) => onCardOption('countries', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="ai ai-ellipsis"
                    variant="ghost"
                    size="small"
                    aria-label="More options for Blocked requests by country"
                    :disabled="blocked"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    value="query"
                    label="Copy query"
                  />
                  <DropdownMenu.Item
                    value="export"
                    label="Export CSV"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="error"
              severity="danger"
              :label="`Couldn't load blocked requests by country. ${error}`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <BarList
              v-else
              :items="countries"
              :format-value="formatCount"
              empty-title="No blocked requests in this period"
              :loading="loading"
              aria-label="Blocked requests by country"
            />
          </ChartCard.Content>
        </ChartCard>
        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Top source IPs by blocked requests</ChartCard.Title>
              <Hint
                content="The addresses blocked most often, with their network and main attack."
              />
            </span>
            <ChartCard.Action>
              <span
                data-wide
                class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
              >
                <Tag
                  label="Sum"
                  severity="neutral"
                  size="small"
                  icon="ai ai-calculator"
                />
                <Tag
                  v-if="changeTag('ips')"
                  :label="changeTag('ips')?.label"
                  :severity="changeTag('ips')?.severity"
                  :icon="changeTag('ips')?.icon"
                  size="small"
                />
              </span>
              <Tooltip content="Expand">
                <IconButton
                  icon="ai ai-window-maximize"
                  variant="ghost"
                  size="small"
                  aria-label="Expand Top source IPs by blocked requests"
                  :disabled="blocked"
                  @click="openExpanded('ips')"
                />
              </Tooltip>
              <DropdownMenu
                side="bottom"
                align="end"
                @select="(_event, value) => onCardOption('ips', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="ai ai-ellipsis"
                    variant="ghost"
                    size="small"
                    aria-label="More options for Top source IPs by blocked requests"
                    :disabled="blocked"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    value="query"
                    label="Copy query"
                  />
                  <DropdownMenu.Item
                    value="export"
                    label="Export CSV"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="error"
              severity="danger"
              :label="`Couldn't load top source IPs by blocked requests. ${error}`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <div
              v-else
              class="flex min-w-0 flex-col gap-(--spacing-sm)"
            >
              <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
                <div class="min-w-36 grow basis-(--container-3xs)">
                  <Input
                    v-model="search"
                    size="medium"
                    placeholder="Search addresses, networks or attacks"
                    aria-label="Search addresses, networks or attacks"
                  >
                    <template #leading>
                      <i
                        class="ai ai-search"
                        aria-hidden="true"
                      />
                    </template>
                  </Input>
                </div>
              </div>
              <DataTable
                v-model:global-filter="search"
                :data="sourceIps"
                :columns="ipColumns"
                row-key="id"
                sortable
                paginated
                :page-size="5"
                :page-size-options="[5, 10, 25]"
                density="compact"
                bordered
                :loading="loading"
              >
                <template #empty>
                  <EmptyState
                    size="small"
                    icon="ai ai-search"
                    title="No matching rows"
                    description="Change the search."
                  />
                </template>
                <template #cell-requests="{ row }">
                  <span class="tabular-nums">{{ formatCount(row.requests) }}</span>
                </template>
              </DataTable>
            </div>
          </ChartCard.Content>
        </ChartCard>
      </div>
    </div>
    <Dialog
      v-model:open="expanded"
      size="large"
    >
      <DialogContent>
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DialogTitle>{{ expandedReport.label }}</DialogTitle>
            <DialogDescription>{{ expandedReport.description }}</DialogDescription>
          </div>
        </PanelHeader>
        <PanelBody>
          <div class="flex min-w-0 flex-col gap-(--spacing-md)">
            <template v-if="expandedId === 'matched'">
              <div>
                <ToggleGroup
                  v-model="form"
                  :options="forms"
                  size="small"
                  :aria-label="`Chart form for ${expandedReport.label}`"
                />
              </div>
              <Chart
                :series="matched.series"
                :labels="matched.labels"
                :format-value="formatCount"
                :height="420"
                empty-title="No matched requests in this period"
                empty-description="Nothing was recorded in this period."
                :aria-label="expandedReport.label"
              >
                <Chart.Grid />
                <Chart.Axis type="y" />
                <Chart.Axis type="x" />
                <Chart.Bar
                  v-if="form === 'bar'"
                  stacked
                />
                <Chart.Line v-else />
                <Chart.Crosshair />
                <Chart.Tooltip />
                <Chart.Legend total />
              </Chart>
            </template>
            <BarList
              v-else-if="expandedId === 'categories' || expandedId === 'countries'"
              :items="expandedId === 'categories' ? categories : countries"
              :format-value="formatCount"
              empty-title="No blocked requests in this period"
              :aria-label="expandedReport.label"
            />
            <DataTable
              v-else
              :data="sourceIps"
              :columns="ipColumns"
              row-key="id"
              sortable
              paginated
              :page-size="10"
              density="compact"
              bordered
            >
              <template #empty>
                <EmptyState
                  size="small"
                  icon="ai ai-shield"
                  title="No blocked requests in this period"
                  description="Nothing was recorded in this period."
                />
              </template>
              <template #cell-requests="{ row }">
                <span class="tabular-nums">{{ formatCount(row.requests) }}</span>
              </template>
            </DataTable>
          </div>
        </PanelBody>
      </DialogContent>
    </Dialog>
  </div>
</template>
