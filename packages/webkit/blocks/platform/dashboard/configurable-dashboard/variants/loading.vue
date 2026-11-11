<script setup>
  import BarList from '@aziontech/webkit/bar-list'
  import Button from '@aziontech/webkit/button'
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DonutChart from '@aziontech/webkit/donut-chart'
  import Hint from '@aziontech/webkit/hint'
  import PageHeader from '@aziontech/webkit/page-header'
  import Tag from '@aziontech/webkit/tag'
  import { computed, nextTick, ref } from 'vue'

  const loading = true

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

  const cards = {
    requests: {
      title: 'Requests over time',
      hint: 'Requests served by every service, per interval.',
      kind: 'area',
      format: 'count',
      series: [
        {
          id: 'requests',
          name: 'Requests',
          values: [
            2029738, 1799252, 1910217, 1633835, 1757364, 1722765, 2157932, 2151290, 2283541,
            2397218, 2545994, 2347243
          ]
        }
      ]
    },
    regions: {
      title: 'Requests by region',
      hint: 'Share of requests by the region that served them.',
      kind: 'donut',
      format: 'count',
      series: [
        {
          id: 'South America',
          name: 'South America',
          values: [9820000]
        },
        {
          id: 'North America',
          name: 'North America',
          values: [7410000]
        },
        {
          id: 'Europe',
          name: 'Europe',
          values: [4960000]
        },
        {
          id: 'Asia',
          name: 'Asia',
          values: [2230000]
        },
        {
          id: 'Oceania',
          name: 'Oceania',
          values: [610000]
        }
      ]
    },
    transfer: {
      title: 'Data transferred',
      hint: 'Data delivered to clients and received from them, per interval.',
      kind: 'line',
      format: 'bytes',
      series: [
        {
          id: 'out',
          name: 'Out',
          values: [
            7464097327, 8703777359, 8853256007, 10189608468, 10484778433, 10611102405, 9993797117,
            9768346098, 10386911277, 8642195236, 7365365394, 8004529693
          ]
        },
        {
          id: 'in',
          name: 'In',
          values: [
            1991543196, 1861411304, 1899395715, 1528384777, 1319208897, 1269798165, 1261414828,
            1391471001, 1417213338, 1614716457, 1979668469, 2070880025
          ]
        }
      ]
    },
    errors: {
      title: 'Errors by status',
      hint: 'Requests that ended in a client or server error, per interval.',
      kind: 'bar',
      format: 'count',
      series: [
        {
          id: '4xx',
          name: '4xx',
          values: [
            13707, 15864, 14544, 16239, 19681, 24625, 22235, 22216, 22808, 17486, 16275, 15501
          ]
        },
        {
          id: '5xx',
          name: '5xx',
          values: [8144, 8724, 9890, 8837, 7067, 7731, 5015, 3592, 4017, 3975, 5911, 7275]
        }
      ]
    },
    sources: {
      title: 'Top sources',
      hint: 'The services that received the most requests in the period.',
      kind: 'bar-list',
      format: 'count',
      items: [
        {
          id: 'web-app-prod',
          name: 'web-app-prod',
          value: 11420000
        },
        {
          id: 'payments-api',
          name: 'payments-api',
          value: 6240000
        },
        {
          id: 'storefront-checkout',
          name: 'storefront-checkout',
          value: 4910000
        },
        {
          id: 'marketing-site',
          name: 'marketing-site',
          value: 2380000
        },
        {
          id: 'status-page',
          name: 'status-page',
          value: 860000
        }
      ]
    },
    latency: {
      title: 'Response time',
      hint: 'Time to the first byte at the 95th percentile, per interval.',
      kind: 'line',
      format: 'ms',
      series: [
        {
          id: 'p95',
          name: 'p95',
          values: [166, 167, 151, 172, 200, 191, 205, 208, 205, 182, 165, 175]
        }
      ]
    }
  }

  const defaultLayout = [
    {
      id: 'requests',
      span: 8
    },
    {
      id: 'regions',
      span: 4
    },
    {
      id: 'transfer',
      span: 6
    },
    {
      id: 'errors',
      span: 6
    },
    {
      id: 'sources',
      span: 4
    },
    {
      id: 'latency',
      span: 8
    }
  ]

  const formatters = {
    count: (value) =>
      new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value),
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
    ms: (value) => `${Math.round(value)} ms`
  }

  const editing = ref(false)
  const layout = ref(defaultLayout.map((card) => ({ ...card })))
  const activeIndex = ref(null)
  const from = ref(-1)
  const announcement = ref('')
  const grid = ref(null)

  const customized = computed(() => JSON.stringify(layout.value) !== JSON.stringify(defaultLayout))

  const sizeLabel = (card) =>
    card.height === undefined
      ? `${card.span} of 12 columns`
      : `${card.span} of 12 columns, ${card.height} px`

  const reorder = (to) => {
    const index = from.value
    from.value = -1
    if (index < 0 || index === to) return
    const next = [...layout.value]
    const [card] = next.splice(index, 1)
    next.splice(to, 0, card)
    layout.value = next
    announcement.value = `${cards[card.id].title} moved to position ${to + 1} of ${next.length}.`
  }

  const move = async (index, direction) => {
    const to = index + (direction === 'up' || direction === 'left' ? -1 : 1)
    if (to < 0 || to >= layout.value.length) return
    const { id } = layout.value[index]
    from.value = index
    reorder(to)
    await nextTick()
    grid.value?.querySelector(`[data-card-id="${id}"] [data-testid$="__drag-handle"]`)?.focus()
  }

  const announceSize = (card) => {
    announcement.value = `${cards[card.id].title} resized to ${sizeLabel(card)}.`
  }

  const reset = () => {
    layout.value = defaultLayout.map((card) => ({ ...card }))
    announcement.value = 'Layout reset to the default.'
  }
</script>

<template>
  <div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
    <main class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Traffic overview"
        description="Requests, regions, errors and response time for the period, in the layout you set."
      />
      <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
        <p
          v-if="editing"
          class="m-0 min-w-0 grow text-body-sm text-(--text-muted)"
        >
          Drag a card by its handle to move it, or by its corner to resize it. Focus a handle to use
          the arrow keys.
        </p>
        <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xs)">
          <Button
            v-if="customized"
            label="Reset layout"
            kind="transparent"
            size="medium"
            icon="pi pi-replay"
            @click="reset"
          />
          <Button
            :label="editing ? 'Done' : 'Edit layout'"
            :kind="editing ? 'primary' : 'outlined'"
            size="medium"
            :icon="editing ? 'pi pi-check' : 'pi pi-th-large'"
            :aria-pressed="editing"
            @click="editing = !editing"
          />
        </div>
      </div>

      <div
        ref="grid"
        class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <ChartCard
          v-for="(card, index) in layout"
          :key="card.id"
          v-model:span="card.span"
          v-model:height="card.height"
          :data-card-id="card.id"
          :draggable="editing"
          :resizable="editing"
          :min-span="3"
          :max-span="12"
          :min-height="280"
          :max-height="720"
          @drag-start="from = index"
          @dragover.prevent
          @drop="reorder(index)"
          @move="(event, direction) => move(index, direction)"
          @resize-end="announceSize(card)"
        >
          <ChartCard.Header>
            <ChartCard.DragHandle :aria-label="'Move ' + cards[card.id].title" />
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>{{ cards[card.id].title }}</ChartCard.Title>
              <Hint :text="cards[card.id].hint" />
            </span>
            <ChartCard.Controls v-if="editing">
              <Tag
                :label="card.span + '/12'"
                severity="secondary"
                size="small"
                icon="pi pi-arrows-h"
              />
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <DonutChart
              v-if="cards[card.id].kind === 'donut'"
              :series="cards[card.id].series"
              :format-value="formatters[cards[card.id].format]"
              empty-title="No requests yet"
              empty-description="Metrics appear here once a service serves requests."
              :loading="loading"
              :aria-label="cards[card.id].title"
            />
            <BarList
              v-else-if="cards[card.id].kind === 'bar-list'"
              :items="cards[card.id].items"
              sort="descending"
              :format-value="formatters[cards[card.id].format]"
              empty-title="No requests yet"
              :loading="loading"
              :aria-label="cards[card.id].title"
            />
            <Chart
              v-else
              v-model:active-index="activeIndex"
              :series="cards[card.id].series"
              :labels="labels"
              :format-value="formatters[cards[card.id].format]"
              empty-title="No requests yet"
              empty-description="Metrics appear here once a service serves requests."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
              <Chart.Bar
                v-if="cards[card.id].kind === 'bar'"
                stacked
              />
              <Chart.Area v-else-if="cards[card.id].kind === 'area'" />
              <Chart.Line v-else />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend
                v-if="cards[card.id].series.length > 1"
                totals
              />
            </Chart>
          </ChartCard.Content>
          <ChartCard.ResizeHandle :aria-label="'Resize ' + cards[card.id].title" />
        </ChartCard>
      </div>

      <p
        class="sr-only"
        aria-live="polite"
      >
        {{ announcement }}
      </p>
    </main>
  </div>
</template>
