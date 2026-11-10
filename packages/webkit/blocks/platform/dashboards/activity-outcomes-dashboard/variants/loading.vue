<script setup>
  import BarList from '@aziontech/webkit/bar-list'
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import FieldSelect from '@aziontech/webkit/field-select'
  import FieldText from '@aziontech/webkit/field-text'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import StatTile from '@aziontech/webkit/stat-tile'
  import TableRoot from '@aziontech/webkit/table-root'
  import SeverityTag from '@aziontech/webkit/severity-tag'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  const loading = true
  const comparison = 'vs prior day'
  const timeRange = ref('Last 24 hours')
  const actor = ref('Any actor')
  const outcome = ref('Any outcome')
  const category = ref('Any category')
  const destination = ref('')
  const activeIndex = ref(null)

  const labels = Array.from(
    { length: 24 },
    (_, index) => new Date(Date.UTC(2026, 10, 9, 15 + index))
  )

  const timeRanges = [
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

  const actorOptions = [
    {
      value: 'Any actor',
      label: 'Any actor'
    },
    {
      value: 'report-builder',
      label: 'report-builder'
    },
    {
      value: 'ticket-triage',
      label: 'ticket-triage'
    },
    {
      value: 'inventory-sync',
      label: 'inventory-sync'
    },
    {
      value: 'invoice-reader',
      label: 'invoice-reader'
    },
    {
      value: 'release-helper',
      label: 'release-helper'
    },
    {
      value: 'data-export',
      label: 'data-export'
    },
    {
      value: 'calendar-sync',
      label: 'calendar-sync'
    }
  ]

  const outcomeOptions = [
    {
      value: 'Any outcome',
      label: 'Any outcome'
    },
    {
      value: 'Allowed',
      label: 'Allowed'
    },
    {
      value: 'Blocked',
      label: 'Blocked'
    },
    {
      value: 'Held',
      label: 'Held'
    },
    {
      value: 'Approved',
      label: 'Approved'
    },
    {
      value: 'Denied',
      label: 'Denied'
    }
  ]

  const categoryOptions = [
    {
      value: 'Any category',
      label: 'Any category'
    },
    {
      value: 'Read',
      label: 'Read'
    },
    {
      value: 'Write',
      label: 'Write'
    },
    {
      value: 'Search',
      label: 'Search'
    },
    {
      value: 'Export',
      label: 'Export'
    },
    {
      value: 'Delete',
      label: 'Delete'
    },
    {
      value: 'Admin',
      label: 'Admin'
    }
  ]

  const figures = [
    {
      id: 'requests',
      label: 'Requests',
      description: 'Every request the rules evaluated in the time range.',
      value: null,
      delta: null,
      inverse: false
    },
    {
      id: 'allowed',
      label: 'Allowed',
      description: 'Requests a rule let through to their destination.',
      value: null,
      delta: null,
      inverse: false
    },
    {
      id: 'blocked',
      label: 'Blocked',
      description: 'Requests a rule stopped before they reached their destination.',
      value: null,
      delta: null,
      inverse: true
    },
    {
      id: 'held',
      label: 'Held',
      description: 'Requests a rule paused until someone approves or denies them.',
      value: null,
      delta: null,
      inverse: true
    },
    {
      id: 'approved',
      label: 'Approved',
      description: 'Held requests a reviewer approved.',
      value: null,
      delta: null,
      inverse: false
    },
    {
      id: 'denied',
      label: 'Denied',
      description: 'Held requests a reviewer denied.',
      value: null,
      delta: null,
      inverse: true
    },
    {
      id: 'over-budget',
      label: 'Over budget',
      description: 'Requests that went past the spending or volume budget set for their actor.',
      value: null,
      delta: null,
      inverse: true
    }
  ]

  const outcomes = [
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

  const actors = [
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

  const categories = [
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

  const destinations = [
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

  const columns = [
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

  const rows = []

  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

  const formatCount = (value) => compact.format(value)

  const outcomeTags = {
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
      severity: 'secondary'
    },
    denied: {
      label: 'Denied',
      severity: 'secondary'
    }
  }

  const outcomeTag = (outcome) => outcomeTags[outcome]
</script>

<template>
  <div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
    <main class="layout-column flex flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Request activity"
        description="What each actor requested through the rules: what was allowed, blocked or held for approval, and what went over budget, per actor, category and destination."
      >
        <template #actions>
          <IconButton
            icon="pi pi-refresh"
            kind="outlined"
            size="medium"
            aria-label="Refresh"
          />
        </template>
      </PageHeader>

      <section
        aria-label="Filters"
        class="grid grid-cols-1 items-start gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-5"
      >
        <FieldSelect
          v-model="timeRange"
          input-id="activity-time-range"
          label="Time range"
          size="medium"
          :options="timeRanges"
        />
        <FieldSelect
          v-model="actor"
          input-id="activity-actor"
          label="Actor"
          size="medium"
          :options="actorOptions"
        />
        <FieldSelect
          v-model="outcome"
          input-id="activity-outcome"
          label="Outcome"
          size="medium"
          :options="outcomeOptions"
        />
        <FieldSelect
          v-model="category"
          input-id="activity-category"
          label="Category"
          size="medium"
          :options="categoryOptions"
        />
        <FieldText
          v-model="destination"
          input-id="activity-destination"
          label="Destination"
          placeholder="api.example.com"
          helper-text="Exact host."
          size="medium"
        />
      </section>

      <section aria-label="Outcomes">
        <ul class="grid grid-cols-2 gap-(--spacing-md) sm:grid-cols-4 2xl:grid-cols-7">
          <li
            v-for="figure in figures"
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
              :series="outcomes"
              :labels="labels"
              :format-value="formatCount"
              empty-title="No requests in this time range"
              empty-description="Requests the rules evaluate appear here. Widen the time range to see older ones."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
              <Chart.Bar stacked />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend totals />
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
              :items="actors"
              :format-value="formatCount"
              empty-title="No request in this time range"
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
              :items="categories"
              :format-value="formatCount"
              :color="2"
              empty-title="No request in this time range"
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
              :items="destinations"
              :format-value="formatCount"
              :color="3"
              empty-title="No request in this time range"
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
            <ChartCard.Controls>
              <Tag
                v-if="!loading && rows.length"
                :label="rows.length + ' requests'"
                severity="secondary"
                size="small"
              />
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <TableRoot
              v-if="loading || rows.length"
              :data="rows"
              :columns="columns"
              row-key="id"
              enable-sorting
              paginated
              :page-size="10"
              :rows-per-page-options="[10, 25, 50]"
              header-kind="compact"
              border
              :loading="loading"
            >
              <template #cell-outcome="{ row }">
                <Tag
                  :label="outcomeTag(row.outcome).label"
                  :severity="outcomeTag(row.outcome).severity"
                  size="small"
                />
              </template>
              <template #cell-severity="{ row }">
                <SeverityTag
                  :level="row.severity"
                  size="small"
                />
              </template>
              <template #cell-method="{ row }">
                <span class="font-mono text-body-sm">{{ row.method }}</span>
              </template>
            </TableRoot>
            <EmptyState
              v-else
              size="small"
              icon="pi pi-list"
              title="No requests in this time range"
              description="Requests the rules evaluate appear here. Widen the time range to see older ones."
            />
          </ChartCard.Content>
        </ChartCard>
      </div>
    </main>
  </div>
</template>
