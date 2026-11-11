<script setup>
  import Board from '@aziontech/webkit/board'
  import Button from '@aziontech/webkit/button'
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref } from 'vue'

  const labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']

  const cards = {
    requests: {
      title: 'Requests',
      series: [{ id: 'requests', name: 'Requests', values: [1820, 1640, 2210, 2480, 2390, 2050] }]
    },
    errors: {
      title: 'Errors',
      series: [{ id: 'errors', name: 'Errors', values: [42, 38, 61, 57, 49, 44] }]
    },
    latency: {
      title: 'Response time',
      series: [{ id: 'p95', name: 'p95', values: [166, 172, 205, 208, 182, 175] }]
    }
  }

  const defaultLayout = [
    { id: 'requests', span: 12 },
    { id: 'errors', span: 6 },
    { id: 'latency', span: 6 }
  ]

  const editing = ref(true)
  const layout = ref(defaultLayout.map((item) => ({ ...item })))
  const customized = computed(() => JSON.stringify(layout.value) !== JSON.stringify(defaultLayout))

  const reset = () => {
    layout.value = defaultLayout.map((item) => ({ ...item }))
  }
</script>

<template>
  <div class="flex w-full min-w-0 flex-col gap-(--spacing-md)">
    <div class="flex flex-wrap items-center justify-end gap-(--spacing-xs)">
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
    <Board
      v-model:layout="layout"
      :editing="editing"
      :min-span="4"
      :min-height="240"
      :max-height="560"
    >
      <Board.Item
        v-for="item in layout"
        :key="item.id"
        :item-id="item.id"
        :label="cards[item.id].title"
      >
        <ChartCard>
          <ChartCard.Header>
            <ChartCard.DragHandle :aria-label="'Move ' + cards[item.id].title" />
            <ChartCard.Title>{{ cards[item.id].title }}</ChartCard.Title>
            <ChartCard.Controls v-if="editing">
              <Tag
                :label="item.span + '/12'"
                severity="secondary"
                size="small"
                icon="pi pi-arrows-h"
              />
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <Chart
              :series="cards[item.id].series"
              :labels="labels"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
              <Chart.Line />
              <Chart.Tooltip />
            </Chart>
          </ChartCard.Content>
          <ChartCard.ResizeHandle :aria-label="'Resize ' + cards[item.id].title" />
        </ChartCard>
      </Board.Item>
    </Board>
  </div>
</template>
