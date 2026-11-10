<script setup>
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import StatTile from '@aziontech/webkit/stat-tile'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref } from 'vue'

  const loading = false
  const comparison = 'vs previous 24 hours'

  const figures = [
    {
      id: 'requests',
      label: 'Requests',
      description: 'Sum of requests served by every service in the period.',
      value: null,
      format: 'count',
      delta: null,
      inverse: false,
      trend: []
    },
    {
      id: 'data-transferred',
      label: 'Data transferred',
      description: 'Sum of data delivered to users by every service in the period.',
      value: null,
      format: 'bytes',
      delta: null,
      inverse: false,
      trend: []
    },
    {
      id: 'success-rate',
      label: 'Success rate',
      description: 'Share of requests that ended in a 2xx or 3xx status.',
      value: null,
      format: 'percentage',
      delta: null,
      inverse: false,
      trend: []
    },
    {
      id: 'status-5xx',
      label: 'Status 5xx',
      description: 'Requests that ended in a server error. A rise is a regression.',
      value: null,
      format: 'count',
      delta: null,
      inverse: true,
      trend: []
    }
  ]

  const labels = [
    '11:00',
    '13:00',
    '15:00',
    '17:00',
    '19:00',
    '21:00',
    '23:00',
    '01:00',
    '03:00',
    '05:00',
    '07:00',
    '09:00'
  ]

  const requests = []

  const statusCodes = []

  const countries = []

  const countryRequests = []

  const hosts = []

  const hostColumns = [
    {
      id: 'host',
      accessorKey: 'host',
      header: 'Host',
      align: 'start',
      enableSorting: true,
      principal: true
    },
    {
      id: 'service',
      accessorKey: 'service',
      header: 'Service',
      align: 'start',
      enableSorting: true
    },
    {
      id: 'requests',
      accessorKey: 'requests',
      header: 'Requests',
      align: 'end',
      enableSorting: true
    }
  ]

  const variations = {
    requests: null,
    statusCodes: null
  }

  const forms = [
    {
      label: 'Line',
      value: 'line'
    },
    {
      label: 'Bar',
      value: 'bar'
    }
  ]

  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

  const formatters = {
    count: (value) => compact.format(value),
    bytes: (value) => {
      const steps = ['B', 'KB', 'MB', 'GB', 'TB']
      let current = value
      let index = 0
      while (current >= 1000 && index < steps.length - 1) {
        current /= 1000
        index += 1
      }
      return `${current.toFixed(current >= 100 || index === 0 ? 0 : 1)} ${steps[index]}`
    },
    percentage: (value) => `${value.toFixed(0)}%`
  }

  const requestsForm = ref('line')
  const statusForm = ref('line')
  const activeIndex = ref(null)
  const search = ref('')
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-md)">
    <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 xl:grid-cols-4">
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
          :inverse="figure.inverse"
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
            <ChartCard.Title>Requests over time</ChartCard.Title>
            <Hint text="Sum of requests served by every service, per interval." />
          </span>
          <ChartCard.Controls>
            <span
              data-wide
              class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
            >
              <Tag
                label="Sum"
                severity="secondary"
                size="small"
                icon="pi pi-calculator"
              />
              <Tag
                v-if="variations.requests"
                :label="variations.requests.label"
                :severity="variations.requests.severity"
                :icon="variations.requests.icon"
                size="small"
              />
              <ToggleGroup
                v-model="requestsForm"
                :options="forms"
                size="small"
                aria-label="Chart form for Requests over time"
              />
            </span>
            <Tooltip text="Expand">
              <IconButton
                icon="pi pi-window-maximize"
                kind="transparent"
                size="small"
                aria-label="Expand Requests over time"
              />
            </Tooltip>
            <DropdownMenu placement="bottom-end">
              <DropdownMenu.Trigger>
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="transparent"
                  size="small"
                  aria-label="More options for Requests over time"
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Group>
                <DropdownMenu.Option
                  value="query"
                  label="Copy query"
                />
                <DropdownMenu.Option
                  value="export"
                  label="Export CSV"
                />
              </DropdownMenu.Group>
            </DropdownMenu>
          </ChartCard.Controls>
        </ChartCard.Header>
        <ChartCard.Content>
          <Chart
            v-model:active-index="activeIndex"
            :series="requests"
            :labels="labels"
            :format-value="formatters.count"
            empty-title="No traffic yet"
            empty-description="Metrics appear here once a service serves requests."
            :loading="loading"
          >
            <Chart.Grid />
            <Chart.Axis kind="y" />
            <Chart.Axis kind="x" />
            <Chart.Bar v-if="requestsForm === 'bar'" />
            <Chart.Area v-else />
            <Chart.Crosshair />
            <Chart.Tooltip />
            <Chart.Legend totals />
          </Chart>
        </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="6">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Status codes</ChartCard.Title>
            <Hint text="Sum of requests per status class. Switch to Bar to stack the classes." />
          </span>
          <ChartCard.Controls>
            <span
              class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
            >
              <Tag
                label="Sum"
                severity="secondary"
                size="small"
                icon="pi pi-calculator"
              />
              <Tag
                v-if="variations.statusCodes"
                :label="variations.statusCodes.label"
                :severity="variations.statusCodes.severity"
                :icon="variations.statusCodes.icon"
                size="small"
              />
              <ToggleGroup
                v-model="statusForm"
                :options="forms"
                size="small"
                aria-label="Chart form for Status codes"
              />
            </span>
            <Tooltip text="Expand">
              <IconButton
                icon="pi pi-window-maximize"
                kind="transparent"
                size="small"
                aria-label="Expand Status codes"
              />
            </Tooltip>
            <DropdownMenu placement="bottom-end">
              <DropdownMenu.Trigger>
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="transparent"
                  size="small"
                  aria-label="More options for Status codes"
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Group>
                <DropdownMenu.Option
                  value="query"
                  label="Copy query"
                />
                <DropdownMenu.Option
                  value="export"
                  label="Export CSV"
                />
              </DropdownMenu.Group>
            </DropdownMenu>
          </ChartCard.Controls>
        </ChartCard.Header>
        <ChartCard.Content>
          <Chart
            v-model:active-index="activeIndex"
            :series="statusCodes"
            :labels="labels"
            :format-value="formatters.count"
            empty-title="No traffic yet"
            empty-description="Metrics appear here once a service serves requests."
            :loading="loading"
          >
            <Chart.Grid />
            <Chart.Axis kind="y" />
            <Chart.Axis kind="x" />
            <Chart.Bar
              v-if="statusForm === 'bar'"
              stacked
            />
            <Chart.Line v-else />
            <Chart.Crosshair />
            <Chart.Tooltip />
            <Chart.Legend totals />
          </Chart>
        </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="6">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Requests by country</ChartCard.Title>
            <Hint text="Sum of requests per country of origin, top countries first." />
          </span>
          <ChartCard.Controls>
            <span
              class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
            >
              <Tag
                label="Sum"
                severity="secondary"
                size="small"
                icon="pi pi-calculator"
              />
            </span>
            <Tooltip text="Expand">
              <IconButton
                icon="pi pi-window-maximize"
                kind="transparent"
                size="small"
                aria-label="Expand Requests by country"
              />
            </Tooltip>
            <DropdownMenu placement="bottom-end">
              <DropdownMenu.Trigger>
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="transparent"
                  size="small"
                  aria-label="More options for Requests by country"
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Group>
                <DropdownMenu.Option
                  value="query"
                  label="Copy query"
                />
                <DropdownMenu.Option
                  value="export"
                  label="Export CSV"
                />
              </DropdownMenu.Group>
            </DropdownMenu>
          </ChartCard.Controls>
        </ChartCard.Header>
        <ChartCard.Content>
          <Chart
            :series="countryRequests"
            :labels="countries"
            orientation="horizontal"
            :format-value="formatters.count"
            :height="240"
            empty-title="No traffic yet"
            empty-description="Metrics appear here once a service serves requests."
            :loading="loading"
          >
            <Chart.Grid />
            <Chart.Axis kind="y" />
            <Chart.Axis kind="x" />
            <Chart.Bar labeled />
            <Chart.Tooltip />
          </Chart>
        </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="12">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Top hosts</ChartCard.Title>
            <Hint text="Hosts that served the most requests in the period, with their service." />
          </span>
          <ChartCard.Controls>
            <span
              data-wide
              class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
            >
              <Tag
                label="Sum"
                severity="secondary"
                size="small"
                icon="pi pi-calculator"
              />
            </span>
            <Tooltip text="Expand">
              <IconButton
                icon="pi pi-window-maximize"
                kind="transparent"
                size="small"
                aria-label="Expand Top hosts"
              />
            </Tooltip>
            <DropdownMenu placement="bottom-end">
              <DropdownMenu.Trigger>
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="transparent"
                  size="small"
                  aria-label="More options for Top hosts"
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Group>
                <DropdownMenu.Option
                  value="query"
                  label="Copy query"
                />
                <DropdownMenu.Option
                  value="export"
                  label="Export CSV"
                />
              </DropdownMenu.Group>
            </DropdownMenu>
          </ChartCard.Controls>
        </ChartCard.Header>
        <ChartCard.Content>
          <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
            <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
              <div class="min-w-36 grow basis-(--container-3xs)">
                <Input
                  v-model="search"
                  size="medium"
                  placeholder="Search hosts or services"
                  aria-label="Search hosts or services"
                >
                  <template #iconLeft>
                    <i
                      class="pi pi-search"
                      aria-hidden="true"
                    />
                  </template>
                </Input>
              </div>
            </div>

            <TableRoot
              v-model:global-filter="search"
              :data="hosts"
              :columns="hostColumns"
              row-key="id"
              enable-sorting
              paginated
              :page-size="5"
              :rows-per-page-options="[5, 10, 25]"
              header-kind="compact"
              bordered
              :loading="loading"
            >
              <template #empty>
                <EmptyState
                  v-if="!hosts.length"
                  size="small"
                  icon="pi pi-chart-line"
                  title="No traffic yet"
                  description="Metrics appear here once a service serves requests."
                />
                <EmptyState
                  v-else
                  size="small"
                  icon="pi pi-search"
                  title="No matching rows"
                  description="Change the search."
                />
              </template>

              <template #cell-requests="{ row }">
                <span class="tabular-nums">{{ formatters.count(row.requests) }}</span>
              </template>
            </TableRoot>
          </div>
        </ChartCard.Content>
      </ChartCard>
    </div>
  </div>
</template>
