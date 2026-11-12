<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Card from '@aziontech/webkit/card'
  import ChartCard from '@aziontech/webkit/chart-card'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import StatTile from '@aziontech/webkit/stat-tile'

  const loading = false
  const figures = [
    {
      id: 'submitted',
      label: 'Submitted',
      description: 'Items sent for analysis in the selected period.',
      value: null
    },
    {
      id: 'analyzing',
      label: 'In analysis',
      description: 'Items waiting for a verdict right now.',
      value: null
    },
    {
      id: 'last-24h',
      label: 'Last 24 hours',
      description: 'Items submitted in the last 24 hours.',
      value: null
    },
    {
      id: 'flagged',
      label: 'Flagged',
      description: 'Items whose verdict marks them as harmful.',
      value: null
    },
    {
      id: 'held',
      label: 'Held for a verdict',
      description: 'Deliveries paused until their analysis finishes.',
      value: null
    },
    {
      id: 'alerts',
      label: 'Open alerts',
      description: 'Items delivered before they were flagged that nobody has reviewed yet.',
      value: null
    }
  ]

  const count = new Intl.NumberFormat('en-US')

  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

  const UNITS = ['B', 'KB', 'MB', 'GB']

  const formatters: Record<string, (value: number) => string> = {
    count: (value: number) => count.format(value),
    compact: (value: number) => compact.format(value),
    score: (value: number | null) => (value === null ? '—' : String(value)),
    size: (value: number) => {
      let size = value
      let unit = 0
      while (size >= 1000 && unit < UNITS.length - 1) {
        size /= 1000
        unit += 1
      }
      return `${size.toFixed(unit ? 1 : 0)} ${UNITS[unit]}`
    }
  }

  const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Scan results"
        description="Items sent for analysis inline and through the API, their verdicts, the deliveries held for a verdict and the items delivered before they were flagged."
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

      <section aria-label="Summary">
        <ul
          class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        >
          <li
            v-for="figure in figures"
            :key="figure.id"
            class="flex min-w-0 flex-col"
          >
            <StatTile
              :label="figure.label"
              :value="figure.value"
              :format-value="formatters.compact"
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
        class="grid grid-cols-1 items-stretch gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Verdicts</ChartCard.Title>
              <Hint text="Every item analyzed in the period, by the verdict it received." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              severity="danger"
              label="Couldn't load verdicts. Check your connection and retry."
              action-label="Retry"
              @action="emit('retry')"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Sources</ChartCard.Title>
              <Hint
                text="Where the items came from: scanned inline, sent through the API, uploaded by hand or picked up by a scheduled scan."
              />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              severity="danger"
              label="Couldn't load sources. Check your connection and retry."
              action-label="Retry"
              @action="emit('retry')"
            />
          </ChartCard.Content>
        </ChartCard>

        <div class="lg:col-span-4">
          <Card title="Held and flagged">
            <template #content>
              <Alert
                severity="danger"
                label="Couldn't load held and flagged submissions. Check your connection and retry."
                action-label="Retry"
                @action="emit('retry')"
              />
            </template>
          </Card>
        </div>

        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Submissions</ChartCard.Title>
              <Hint
                text="Every item sent for analysis, newest first, with its verdict and where it came from."
              />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              severity="danger"
              label="Couldn't load submissions. Check your connection and retry."
              action-label="Retry"
              @action="emit('retry')"
            />
          </ChartCard.Content>
        </ChartCard>
      </div>
    </div>
  </div>
</template>
