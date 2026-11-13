<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { ref } from 'vue'

  const loading = false
  const comparison = 'vs previous month'

  const figures = [
    {
      id: 'total',
      label: 'Total spend',
      description: 'Everything billed to the organization this month.',
      value: null,
      delta: null,
      trend: []
    },
    {
      id: 'compute',
      label: 'Compute',
      description: 'Spend on compute this month, the share of the total it carries.',
      value: null,
      delta: null,
      trend: []
    },
    {
      id: 'database',
      label: 'Database',
      description: 'Spend on database this month, the share of the total it carries.',
      value: null,
      delta: null,
      trend: []
    },
    {
      id: 'storage',
      label: 'Storage',
      description: 'Spend on storage this month, the share of the total it carries.',
      value: null,
      delta: null,
      trend: []
    }
  ]

  const periods = [
    {
      label: 'Last 12 months',
      value: '12m'
    },
    {
      label: 'Last 6 months',
      value: '6m'
    },
    {
      label: 'This year',
      value: 'ytd'
    }
  ]

  const forms = [
    {
      label: 'Area',
      value: 'area'
    },
    {
      label: 'Bar',
      value: 'bar'
    }
  ]

  const spendFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1
  })

  const amountFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  })

  const formatters: Record<string, (value: number) => string> = {
    spend: (value: number) => spendFormat.format(value),
    amount: (value: number) => amountFormat.format(value),
    share: (value: number) => `${value.toFixed(1)}%`,
    change: (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const period = ref('12m')
  const trendForm = ref('area')

  const emit = defineEmits<{ retry: [event: MouseEvent] }>()
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col gap-(--spacing-lg)">
      <PageHeader
        title="Cost breakdown"
        description="How the organization’s spend splits across categories and the resources that drive it."
      >
        <template #actions>
          <div class="w-full md:w-48">
            <Select
              v-model="period"
              size="medium"
              :display-value="
                (value: string) => periods.find((option) => option.value === value)?.label ?? value
              "
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
          <Button
            label="Export CSV"
            icon="pi pi-download"
            kind="outlined"
            size="medium"
          />
        </template>
      </PageHeader>

      <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 xl:grid-cols-4">
        <li
          v-for="figure in figures"
          :key="figure.id"
          class="flex min-w-0 flex-col"
        >
          <StatTile
            :label="figure.label"
            :value="figure.value"
            :format-value="formatters.spend"
            :delta="figure.delta"
            :delta-label="comparison"
            inverse
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
        <ChartCard :span="8">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Spend by category</ChartCard.Title>
              <Hint
                text="Monthly spend stacked by category; the top edge is the total. Legend totals sum the whole range."
              />
            </span>
            <ChartCard.Controls>
              <ToggleGroup
                v-model="trendForm"
                :options="forms"
                size="small"
                aria-label="Chart form for Spend by category"
              />
              <DropdownMenu placement="bottom-end">
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Spend by category"
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
              label="Couldn't load spend by category. Check your connection and retry."
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Current split</ChartCard.Title>
              <Hint text="This month’s spend by category, with the total in the center." />
            </span>
            <ChartCard.Controls>
              <DropdownMenu placement="bottom-end">
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Current split"
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
              label="Couldn't load current split. Check your connection and retry."
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Top contributors</ChartCard.Title>
              <Hint
                text="The resources that cost the most this month, their share of the total and the change against last month."
              />
            </span>
            <ChartCard.Controls>
              <DropdownMenu placement="bottom-end">
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Top contributors"
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
              label="Couldn't load top contributors. Check your connection and retry."
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
          </ChartCard.Content>
        </ChartCard>
      </div>
    </div>
  </div>
</template>
