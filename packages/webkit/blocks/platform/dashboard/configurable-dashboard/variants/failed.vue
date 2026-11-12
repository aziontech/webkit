<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Board from '@aziontech/webkit/board'
  import Button from '@aziontech/webkit/button'
  import ChartCard from '@aziontech/webkit/chart-card'
  import Hint from '@aziontech/webkit/hint'
  import PageHeader from '@aziontech/webkit/page-header'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref } from 'vue'

  const cards: Record<
    string,
    {
      title: string
      hint: string
      kind: string
      format: string
      series?: unknown[]
      items?: unknown[]
    }
  > = {
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
  const announcement = ref('')

  const customized = computed(() => JSON.stringify(layout.value) !== JSON.stringify(defaultLayout))

  const reset = () => {
    layout.value = defaultLayout.map((card) => ({ ...card }))
    announcement.value = 'Layout reset to the default.'
  }

  const emit = defineEmits<{ retry: [] }>()
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

      <Board
        v-model:layout="layout"
        :editing="editing"
        aria-label="Traffic overview cards"
        :min-span="3"
        :max-span="12"
        :min-height="280"
        :max-height="720"
      >
        <Board.Item
          v-for="card in layout"
          :key="card.id"
          :item-id="card.id"
          :label="cards[card.id].title"
        >
          <ChartCard>
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
        </Board.Item>
      </Board>

      <p
        class="sr-only"
        aria-live="polite"
      >
        {{ announcement }}
      </p>
    </main>
  </div>
</template>
