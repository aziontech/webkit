<script setup>
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import { ref } from 'vue'

  const labels = [
    '13:05',
    '13:10',
    '13:15',
    '13:20',
    '13:25',
    '13:30',
    '13:35',
    '13:40',
    '13:45',
    '13:50',
    '13:55',
    '14:00'
  ]
  const series = {
    threats: [
      {
        id: 'allowed',
        name: 'WAF requests allowed',
        values: [1210, 1340, 1295, 1480, 1530, 1460, 1610, 1580, 1720, 1690, 1810, 1760]
      },
      {
        id: 'blocked',
        name: 'WAF requests blocked',
        values: [320, 410, 380, 520, 470, 430, 610, 580, 540, 690, 650, 720]
      },
      {
        id: 'threat',
        name: 'WAF requests threat',
        values: [80, 95, 70, 120, 110, 90, 140, 130, 115, 160, 150, 170]
      }
    ],
    xss: [
      {
        id: 'xss',
        name: 'WAF requests XSS attacks',
        values: [42, 38, 51, 47, 63, 58, 72, 69, 81, 77, 90, 86]
      }
    ],
    hosts: [
      {
        id: 'www.example.com',
        name: 'www.example.com',
        values: [410, 430, 455, 470, 520, 540, 580, 600, 640, 660, 700, 720]
      },
      {
        id: 'api.example.com',
        name: 'api.example.com',
        values: [300, 310, 290, 330, 350, 340, 370, 390, 380, 410, 430, 420]
      },
      {
        id: 'shop.example.com',
        name: 'shop.example.com',
        values: [220, 240, 260, 250, 270, 300, 290, 310, 330, 320, 350, 360]
      },
      {
        id: 'docs.example.com',
        name: 'docs.example.com',
        values: [150, 160, 155, 170, 180, 175, 190, 200, 210, 205, 220, 230]
      },
      {
        id: 'other',
        name: 'Other hosts',
        color: 'other',
        values: [200, 214, 218, 237, 238, 251, 266, 273, 283, 289, 301, 311]
      }
    ]
  }
  const seriesFor = (id) => series[id]
  const cards = ref([
    { id: 'threats', title: 'Threats vs requests', span: 6 },
    { id: 'xss', title: 'Cross-site scripting threats', span: 6 },
    { id: 'hosts', title: 'WAF threat requests by host', span: 12 }
  ])
  const from = ref(-1)
  const reorder = (to) => {
    if (from.value < 0 || from.value === to) return
    const [card] = cards.value.splice(from.value, 1)
    cards.value.splice(to, 0, card)
    from.value = -1
  }
  const move = (index, direction) => {
    const step = direction === 'up' || direction === 'left' ? -1 : 1
    const to = index + step
    if (to < 0 || to >= cards.value.length) return
    from.value = index
    reorder(to)
  }
</script>

<template>
  <div
    class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] md:grid-cols-12 md:[--chart-grid-columns:12]"
  >
    <ChartCard
      v-for="(card, index) in cards"
      :key="card.id"
      v-model:span="card.span"
      draggable
      @drag-start="from = index"
      @dragover.prevent
      @drop="reorder(index)"
      @move="(event, direction) => move(index, direction)"
    >
      <ChartCard.Header>
        <ChartCard.DragHandle />
        <ChartCard.Title>{{ card.title }}</ChartCard.Title>
      </ChartCard.Header>
      <ChartCard.Content>
        <Chart
          :series="seriesFor(card.id)"
          :labels="labels"
          :height="160"
        >
          <Chart.Grid />
          <Chart.Axis type="y" />
          <Chart.Axis
            type="x"
            :ticks="4"
          />
          <Chart.Line />
          <Chart.Tooltip />
          <Chart.Legend />
        </Chart>
      </ChartCard.Content>
    </ChartCard>
  </div>
</template>
