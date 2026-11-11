<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import ChartCard from '@aziontech/webkit/chart-card'
  import Hint from '@aziontech/webkit/hint'
  import PageHeader from '@aziontech/webkit/page-header'
  import Tag from '@aziontech/webkit/tag'
  import { computed, nextTick, ref } from 'vue'

  const cards = {
    requests: {
      title: 'Requests over time',
      hint: 'Requests served by every service, per interval.',
      kind: 'area',
      format: 'count',
      series: []
    },
    regions: {
      title: 'Requests by region',
      hint: 'Share of requests by the region that served them.',
      kind: 'donut',
      format: 'count',
      series: []
    },
    transfer: {
      title: 'Data transferred',
      hint: 'Data delivered to clients and received from them, per interval.',
      kind: 'line',
      format: 'bytes',
      series: []
    },
    errors: {
      title: 'Errors by status',
      hint: 'Requests that ended in a client or server error, per interval.',
      kind: 'bar',
      format: 'count',
      series: []
    },
    sources: {
      title: 'Top sources',
      hint: 'The services that received the most requests in the period.',
      kind: 'bar-list',
      format: 'count',
      items: []
    },
    latency: {
      title: 'Response time',
      hint: 'Time to the first byte at the 95th percentile, per interval.',
      kind: 'line',
      format: 'ms',
      series: []
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

  const editing = ref(false)
  const layout = ref(defaultLayout.map((card) => ({ ...card })))
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

  const emit = defineEmits(['retry'])
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
            <Alert
              severity="danger"
              :label="`Couldn't load ${cards[card.id].title.toLowerCase()}. Check your connection and retry.`"
              action-label="Retry"
              @action="emit('retry')"
            />
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
