<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import { computed, ref } from 'vue'

  const loading = false

  const periods = [
    {
      value: '30d',
      label: 'Last 30 days',
      comparison: 'vs previous 30 days'
    },
    {
      value: '6w',
      label: 'Last 6 weeks',
      comparison: 'vs previous 6 weeks'
    },
    {
      value: '90d',
      label: 'Last 90 days',
      comparison: 'vs previous 90 days'
    }
  ]

  const segments = [
    {
      value: 'all',
      label: 'All users'
    },
    {
      value: 'self-serve',
      label: 'Self-serve'
    },
    {
      value: 'sales-assisted',
      label: 'Sales-assisted'
    },
    {
      value: 'partners',
      label: 'Partner referrals'
    }
  ]

  const figures = [
    {
      id: 'visitors',
      label: 'Visitors',
      description: 'Unique people who visited the product site in the period.',
      value: null,
      format: 'number',
      delta: null,
      trend: []
    },
    {
      id: 'sign-ups',
      label: 'Sign-ups',
      description: 'Visitors who created an account in the period.',
      value: null,
      format: 'number',
      delta: null,
      trend: []
    },
    {
      id: 'activated',
      label: 'Activated',
      description: 'New accounts that created their first project.',
      value: null,
      format: 'number',
      delta: null,
      trend: []
    },
    {
      id: 'paid',
      label: 'Paid',
      description: 'Activated accounts that started a paid plan.',
      value: null,
      format: 'number',
      delta: null,
      trend: []
    },
    {
      id: 'conversion',
      label: 'Overall conversion',
      description:
        'Paid accounts as a share of visitors, from the first visit to the first payment.',
      value: null,
      format: 'share',
      delta: null,
      trend: []
    }
  ]

  const grouped = new Intl.NumberFormat('en-US')
  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

  const formatters: Record<string, (value: number) => string> = {
    number: (value: number) => grouped.format(value),
    compact: (value: number) => compact.format(value),
    percent: (value: number | null) => (value === null ? '—' : `${value.toFixed(0)}%`),
    share: (value: number) => `${value.toFixed(1)}%`,
    drop: (value: number) => `−${value.toFixed(1)}%`
  }

  const period = ref('6w')
  const segment = ref('partners')

  const optionLabel = (options: SelectOptionItem[]) => (value: string) =>
    options.find((option) => option.value === value)?.label ?? ''
  const periodLabel = optionLabel(periods)
  const segmentLabel = optionLabel(segments)
  const comparison = computed(
    () => periods.find((option) => option.value === period.value)?.comparison ?? ''
  )

  const emit = defineEmits<{ retry: [event: MouseEvent] }>()
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-lg) p-(--spacing-lg)">
    <PageHeader
      title="Funnel and retention"
      description="How visitors move from a first visit to a paid plan, and how many of each weekly sign-up cohort keep coming back."
    />

    <div
      role="group"
      aria-label="Filters"
      class="flex min-w-0 flex-wrap items-center gap-(--spacing-sm)"
    >
      <div class="min-w-36 grow basis-(--container-3xs) sm:grow-0">
        <Select
          v-model="period"
          size="medium"
          class="w-full"
          :display-value="periodLabel"
        >
          <Select.Trigger aria-label="Period" />
          <Select.Content>
            <Select.Option
              v-for="option in periods"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </Select.Option>
          </Select.Content>
        </Select>
      </div>
      <div class="min-w-36 grow basis-(--container-3xs) sm:grow-0">
        <Select
          v-model="segment"
          size="medium"
          class="w-full"
          :display-value="segmentLabel"
        >
          <Select.Trigger aria-label="Segment" />
          <Select.Content>
            <Select.Option
              v-for="option in segments"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </Select.Option>
          </Select.Content>
        </Select>
      </div>
    </div>

    <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <li
        v-for="figure in figures"
        :key="figure.id"
        class="flex min-w-0 flex-col"
      >
        <StatTile
          :label="figure.label"
          :value="figure.value"
          :format-value="formatters[figure.format]"
          :delta="figure.delta"
          :delta-label="comparison"
          :trend="figure.trend"
          :loading="loading"
        >
          <template #aside>
            <Hint :text="figure.description" />
          </template>
        </StatTile>
      </li>
    </ul>

    <div
      class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
    >
      <ChartCard :span="12">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Conversion funnel</ChartCard.Title>
            <Hint
              text="Unique users who reached each step in the period, in order, with the share lost between steps."
            />
          </span>
          <ChartCard.Controls>
            <DropdownMenu placement="bottom-end">
              <DropdownMenu.Trigger>
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="transparent"
                  size="small"
                  aria-label="More options for Conversion funnel"
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Group>
                <DropdownMenu.Option
                  value="export"
                  label="Export CSV"
                />
              </DropdownMenu.Group>
            </DropdownMenu>
          </ChartCard.Controls>
        </ChartCard.Header>
        <ChartCard.Content>
          <Alert
            severity="danger"
            label="Couldn't load conversion funnel. Check your connection and retry."
            action-label="Retry"
            @action="(event) => emit('retry', event)"
          />
        </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="6">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Retention by cohort</ChartCard.Title>
            <Hint
              text="Share of each weekly sign-up cohort still active in each week since sign-up."
            />
          </span>
          <ChartCard.Controls>
            <DropdownMenu placement="bottom-end">
              <DropdownMenu.Trigger>
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="transparent"
                  size="small"
                  aria-label="More options for Retention by cohort"
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Group>
                <DropdownMenu.Option
                  value="export"
                  label="Export CSV"
                />
              </DropdownMenu.Group>
            </DropdownMenu>
          </ChartCard.Controls>
        </ChartCard.Header>
        <ChartCard.Content>
          <Alert
            severity="danger"
            label="Couldn't load retention by cohort. Check your connection and retry."
            action-label="Retry"
            @action="(event) => emit('retry', event)"
          />
        </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="6">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Weekly cohorts</ChartCard.Title>
            <Hint
              text="Users who signed up each week, and the share of them active in each week since. A dash marks a week that has not ended yet."
            />
          </span>
          <ChartCard.Controls>
            <DropdownMenu placement="bottom-end">
              <DropdownMenu.Trigger>
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="transparent"
                  size="small"
                  aria-label="More options for Weekly cohorts"
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Group>
                <DropdownMenu.Option
                  value="export"
                  label="Export CSV"
                />
              </DropdownMenu.Group>
            </DropdownMenu>
          </ChartCard.Controls>
        </ChartCard.Header>
        <ChartCard.Content>
          <Alert
            severity="danger"
            label="Couldn't load weekly cohorts. Check your connection and retry."
            action-label="Retry"
            @action="(event) => emit('retry', event)"
          />
        </ChartCard.Content>
      </ChartCard>
    </div>
  </div>
</template>
