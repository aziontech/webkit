<script setup>
  import BarList from '@aziontech/webkit/bar-list'
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatTile from '@aziontech/webkit/stat-tile'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref } from 'vue'

  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
  const formatCount = (value) => compact.format(value)
  const formatPercent = (value) => `${value.toFixed(value >= 10 ? 0 : 1)}%`

  const requestsBlocked = null
  const requestsInspected = null
  const blockRate = null
  const requestsBlockedDelta = null
  const requestsBlockedTrend = []
  const requestsInspectedDelta = null
  const requestsInspectedTrend = []
  const blockRateDelta = null
  const blockRateTrend = []

  const labels = Array.from({ length: 24 }, (_, index) => new Date(Date.UTC(2026, 10, 9, index)))
  const matchedRequests = [
    {
      id: 'blocked',
      name: 'Blocked',
      color: 'danger',
      values: [
        1756, 2105, 1796, 2353, 2384, 2162, 2364, 2363, 2505, 2459, 2556, 2308, 2369, 2045, 1937,
        1999, 1679, 1838, 1773, 1812, 1698, 1314, 1494, 1839
      ]
    },
    {
      id: 'logged',
      name: 'Logged',
      color: 'warning',
      values: [
        485, 472, 605, 637, 609, 606, 778, 776, 705, 723, 754, 636, 571, 692, 619, 453, 487, 407,
        450, 378, 405, 416, 375, 369
      ]
    }
  ]
  const categories = [
    { id: 'SQL injection', name: 'SQL injection', value: 18420 },
    { id: 'Cross-site scripting', name: 'Cross-site scripting', value: 12960 },
    { id: 'Path traversal', name: 'Path traversal', value: 7310 },
    { id: 'Remote file inclusion', name: 'Remote file inclusion', value: 4180 },
    { id: 'Command injection', name: 'Command injection', value: 3240 },
    { id: 'Scanner probes', name: 'Scanner probes', value: 1870 }
  ]
  const countries = [
    { id: 'Brazil', name: 'Brazil', value: 14820 },
    { id: 'United States', name: 'United States', value: 10640 },
    { id: 'Germany', name: 'Germany', value: 6130 },
    { id: 'Netherlands', name: 'Netherlands', value: 4270 },
    { id: 'India', name: 'India', value: 3480 },
    { id: 'Singapore', name: 'Singapore', value: 2190 },
    { id: 'France', name: 'France', value: 1460 }
  ]
  const ipColumns = [
    {
      id: 'remoteAddress',
      accessorKey: 'remoteAddress',
      header: 'IP address',
      align: 'start',
      enableSorting: true,
      principal: true
    },
    {
      id: 'asn',
      accessorKey: 'asn',
      header: 'Network',
      align: 'start',
      enableSorting: true,
      principal: false
    },
    {
      id: 'country',
      accessorKey: 'country',
      header: 'Country',
      align: 'start',
      enableSorting: true,
      principal: false
    },
    {
      id: 'category',
      accessorKey: 'category',
      header: 'Main attack',
      align: 'start',
      enableSorting: true,
      principal: false
    },
    {
      id: 'requests',
      accessorKey: 'requests',
      header: 'Blocked requests',
      align: 'end',
      enableSorting: true,
      principal: false
    }
  ]
  const ipRows = [
    {
      id: '203.0.113.42',
      remoteAddress: '203.0.113.42',
      asn: 'AS64496 Hosting provider',
      country: 'Netherlands',
      category: 'SQL injection',
      requests: 4120
    },
    {
      id: '198.51.100.17',
      remoteAddress: '198.51.100.17',
      asn: 'AS64497 Anonymizing proxy',
      country: 'Germany',
      category: 'Cross-site scripting',
      requests: 3640
    },
    {
      id: '192.0.2.159',
      remoteAddress: '192.0.2.159',
      asn: 'AS64498 Unmanaged network',
      country: 'Romania',
      category: 'Path traversal',
      requests: 2910
    },
    {
      id: '203.0.113.172',
      remoteAddress: '203.0.113.172',
      asn: 'AS64496 Hosting provider',
      country: 'Netherlands',
      category: 'SQL injection',
      requests: 2480
    },
    {
      id: '198.51.100.139',
      remoteAddress: '198.51.100.139',
      asn: 'AS64499 VPN service',
      country: 'Seychelles',
      category: 'Command injection',
      requests: 1960
    },
    {
      id: '192.0.2.221',
      remoteAddress: '192.0.2.221',
      asn: 'AS64500 Research scanner',
      country: 'United States',
      category: 'Scanner probes',
      requests: 1390
    },
    {
      id: '198.51.100.130',
      remoteAddress: '198.51.100.130',
      asn: 'AS64501 Cloud provider',
      country: 'United States',
      category: 'Remote file inclusion',
      requests: 1120
    },
    {
      id: '192.0.2.23',
      remoteAddress: '192.0.2.23',
      asn: 'AS64502 Residential ISP',
      country: 'United States',
      category: 'Cross-site scripting',
      requests: 860
    }
  ]
  const forms = [
    { label: 'Line', value: 'line' },
    { label: 'Bar', value: 'bar' }
  ]

  const form = ref('line')
  const activeIndex = ref(null)
  const search = ref('')
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Security"
        description="Requests your rules blocked and inspected, and the settings that need a decision."
      />
      <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-3">
        <li class="flex min-w-0 flex-col">
          <StatTile
            label="Requests blocked"
            :value="requestsBlocked"
            :format-value="formatCount"
            :delta="requestsBlockedDelta"
            delta-label="vs previous 24 hours"
            inverse
            :trend="requestsBlockedTrend"
            loading
          >
            <template #aside>
              <Hint
                text="Requests a security rule identified as attacks and blocked before they reached a service."
              />
            </template>
          </StatTile>
        </li>
        <li class="flex min-w-0 flex-col">
          <StatTile
            label="Requests inspected"
            :value="requestsInspected"
            :format-value="formatCount"
            :delta="requestsInspectedDelta"
            delta-label="vs previous 24 hours"
            :trend="requestsInspectedTrend"
            loading
          >
            <template #aside>
              <Hint text="Requests checked against security rules across every service." />
            </template>
          </StatTile>
        </li>
        <li class="flex min-w-0 flex-col">
          <StatTile
            label="Block rate"
            :value="blockRate"
            :format-value="formatPercent"
            :delta="blockRateDelta"
            delta-label="vs previous 24 hours"
            inverse
            :trend="blockRateTrend"
            loading
          >
            <template #aside>
              <Hint text="Share of inspected requests blocked as attacks." />
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
              <ChartCard.Title>Matched requests over time</ChartCard.Title>
              <Hint text="Requests that matched a rule: blocked, or logged and allowed through." />
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
                  label="+19.01%"
                  severity="danger"
                  icon="pi pi-arrow-up-right"
                  size="small"
                />
                <ToggleGroup
                  v-model="form"
                  :options="forms"
                  size="small"
                  aria-label="Chart form for Matched requests over time"
                />
              </span>
              <Tooltip text="Expand">
                <IconButton
                  icon="pi pi-window-maximize"
                  kind="transparent"
                  size="small"
                  aria-label="Expand Matched requests over time"
                />
              </Tooltip>
              <DropdownMenu placement="bottom-end">
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Matched requests over time"
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
              :series="matchedRequests"
              :labels="labels"
              :format-value="formatCount"
              empty-title="No matched requests in this period"
              empty-description="Nothing was recorded in this period."
              loading
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
              <Chart.Bar
                v-if="form === 'bar'"
                stacked
              />
              <Chart.Line v-else />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend totals />
            </Chart>
          </ChartCard.Content>
        </ChartCard>
        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Needs attention</ChartCard.Title>
              <Hint text="Settings and traffic on your services that ask for a decision." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <div class="flex flex-col gap-(--spacing-md)">
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
          </ChartCard.Content>
        </ChartCard>
        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Blocked requests by attack category</ChartCard.Title>
              <Hint
                text="Blocked requests, broken down by the attack category of the rule they matched."
              />
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
                  label="-0.03%"
                  severity="success"
                  icon="pi pi-arrow-down-left"
                  size="small"
                />
              </span>
              <Tooltip text="Expand">
                <IconButton
                  icon="pi pi-window-maximize"
                  kind="transparent"
                  size="small"
                  aria-label="Expand Blocked requests by attack category"
                />
              </Tooltip>
              <DropdownMenu placement="bottom-end">
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Blocked requests by attack category"
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
            <BarList
              :items="categories"
              :format-value="formatCount"
              empty-title="No blocked requests in this period"
              loading
              aria-label="Blocked requests by attack category"
            />
          </ChartCard.Content>
        </ChartCard>
        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Blocked requests by country</ChartCard.Title>
              <Hint text="Blocked requests, broken down by the country they came from." />
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
                  label="+9.33%"
                  severity="danger"
                  icon="pi pi-arrow-up-right"
                  size="small"
                />
              </span>
              <Tooltip text="Expand">
                <IconButton
                  icon="pi pi-window-maximize"
                  kind="transparent"
                  size="small"
                  aria-label="Expand Blocked requests by country"
                />
              </Tooltip>
              <DropdownMenu placement="bottom-end">
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Blocked requests by country"
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
            <BarList
              :items="countries"
              :format-value="formatCount"
              empty-title="No blocked requests in this period"
              loading
              aria-label="Blocked requests by country"
            />
          </ChartCard.Content>
        </ChartCard>
        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Top source IPs by blocked requests</ChartCard.Title>
              <Hint text="The addresses blocked most often, with their network and main attack." />
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
                  label="-6.79%"
                  severity="success"
                  icon="pi pi-arrow-down-left"
                  size="small"
                />
              </span>
              <Tooltip text="Expand">
                <IconButton
                  icon="pi pi-window-maximize"
                  kind="transparent"
                  size="small"
                  aria-label="Expand Top source IPs by blocked requests"
                />
              </Tooltip>
              <DropdownMenu placement="bottom-end">
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Top source IPs by blocked requests"
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
                    placeholder="Search addresses, networks or attacks"
                    aria-label="Search addresses, networks or attacks"
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
                :data="ipRows"
                :columns="ipColumns"
                row-key="id"
                enable-sorting
                paginated
                :page-size="5"
                :rows-per-page-options="[5, 10, 25]"
                header-kind="compact"
                bordered
                loading
              >
                <template #empty>
                  <EmptyState
                    size="small"
                    icon="pi pi-search"
                    title="No matching rows"
                    description="Change the search."
                  />
                </template>
                <template #cell-requests="{ row }">
                  <span class="tabular-nums">{{ formatCount(row.requests) }}</span>
                </template>
              </TableRoot>
            </div>
          </ChartCard.Content>
        </ChartCard>
      </div>
    </div>
  </div>
</template>
