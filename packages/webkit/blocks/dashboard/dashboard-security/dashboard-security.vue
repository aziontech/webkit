<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import BarList, { type BarListItem } from '@aziontech/webkit/bar-list'
  import Button from '@aziontech/webkit/button'
  import type { ChartLabel, ChartSeries } from '@aziontech/webkit/chart'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import type { TagSeverity } from '@aziontech/webkit/tag'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, ref } from 'vue'

  import AttentionCard from './parts/attention-card.vue'
  import MatchedChart from './parts/matched-chart.vue'
  import SecurityCard from './parts/security-card.vue'
  import SecurityDialog from './parts/security-dialog.vue'
  import SourceIpSearch from './parts/source-ip-search.vue'
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
  import { runSecurityOption, securityCards, securityQuery } from './security-cards'

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
    /** The figure over the period, for the sparkline, null for an interval with no data. */
    trend: (number | null)[]
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
      label: `${rising ? '+' : ''}${fixed(change, 2)}%`,
      severity: (rising ? 'danger' : 'success') as TagSeverity,
      icon: rising ? 'az az-arrow-up-right' : 'az az-arrow-down-left'
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
  const fixed = (value: number, digits: number) =>
    formatNumber(value, { minimumFractionDigits: digits, maximumFractionDigits: digits })

  const formatCount = (value: number) =>
    formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 })
  const formatPercent = (value: number) => `${fixed(value, value >= 10 ? 0 : 1)}%`

  const forms = [
    { label: 'Line', value: 'line' },
    { label: 'Bar', value: 'bar' }
  ]

  const form = ref('line')
  const activeIndex = ref<number | null>(null)
  const search = ref('')

  const seriesRows = (series: readonly ChartSeries[], axis: readonly ChartLabel[]) =>
    axis.map((label, index) => ({
      ts: label instanceof Date ? label.toISOString() : String(label),
      ...Object.fromEntries(series.map((entry) => [entry.id, entry.values[index] ?? '']))
    }))

  const cardRows: Record<SecurityCardId, () => object[]> = {
    matched: () => seriesRows(matched.value.series, matched.value.labels),
    categories: () => categories.value,
    countries: () => countries.value,
    ips: () => sourceIps.value
  }

  const expanded = ref(false)
  const expandedId = ref<SecurityCardId>('matched')

  const openExpanded = (id: SecurityCardId) => {
    expandedId.value = id
    expanded.value = true
  }

  const card = (id: SecurityCardId) => ({
    title: securityCards[id].label,
    hint: securityCards[id].description,
    subject: securityCards[id].subject,
    change: changeTag(id),
    blocked: blocked.value,
    error: props.error
  })

  const onCardOption = (id: SecurityCardId, value: string | number) =>
    runSecurityOption(value, {
      query: securityQuery(securityCards[id], range.value),
      filename: `${id}-${periodSlug.value}.csv`,
      columns: securityCards[id].columns,
      rows: cardRows[id]
    })

  const barCards = ['categories', 'countries'] as const
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
            variant="ghost"
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
      <Alert
        v-if="error"
        severity="danger"
        :label="`Couldn't load security data. ${error}`"
        action-label="Retry"
        data-testid="dashboard-security__error"
        @action="(event: MouseEvent) => emit('retry', event)"
      />
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
            :error="error"
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
            :error="error"
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
            :error="error"
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
        icon="az az-shield"
        bordered
      >
        <template #actions>
          <Button
            label="Add rule set"
            variant="primary"
            size="medium"
            icon="az az-plus"
            href="/security/rules"
          />
        </template>
      </EmptyState>
      <div
        v-else
        class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <SecurityCard
          v-model:form="form"
          :span="8"
          v-bind="card('matched')"
          :forms="forms"
          @expand="openExpanded('matched')"
          @select="(_event, value) => onCardOption('matched', value)"
        >
          <MatchedChart
            v-model:active-index="activeIndex"
            :matched="matched"
            :format-value="formatCount"
            :bar="form === 'bar'"
            :loading="loading"
          />
        </SecurityCard>
        <AttentionCard
          :attention="attention"
          :blocked="blocked"
          :loading="loading"
          :error="error"
        />
        <SecurityCard
          v-for="id in barCards"
          :key="id"
          :span="6"
          v-bind="card(id)"
          @expand="openExpanded(id)"
          @select="(_event, value) => onCardOption(id, value)"
        >
          <BarList
            :items="id === 'categories' ? categories : countries"
            :format-value="formatCount"
            empty-title="No blocked requests in this period"
            :loading="loading"
            :aria-label="securityCards[id].label"
          />
        </SecurityCard>
        <SecurityCard
          :span="12"
          v-bind="card('ips')"
          wide
          @expand="openExpanded('ips')"
          @select="(_event, value) => onCardOption('ips', value)"
        >
          <SourceIpSearch
            v-model:search="search"
            :rows="sourceIps"
            :format-count="formatCount"
            :loading="loading"
          />
        </SecurityCard>
      </div>
    </div>
    <SecurityDialog
      v-model:open="expanded"
      v-model:form="form"
      :card-id="expandedId"
      :matched="matched"
      :categories="categories"
      :countries="countries"
      :source-ips="sourceIps"
      :forms="forms"
      :format-count="formatCount"
    />
  </div>
</template>
