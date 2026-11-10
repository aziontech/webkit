<script setup>
  import ChartCard from '@aziontech/webkit/chart-card'
  import Chart from '@aziontech/webkit/chart'
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
  const seriesFor = (id) =>
    ({
      threats: [
        {
          id: 'allowed',
          name: 'WAF requests allowed',
          color: 'success',
          values: [1210, 1340, 1295, 1480, 1530, 1460, 1610, 1580, 1720, 1690, 1810, 1760]
        },
        {
          id: 'blocked',
          name: 'WAF requests blocked',
          color: 'danger',
          values: [320, 410, 380, 520, 470, 430, 610, 580, 540, 690, 650, 720]
        },
        {
          id: 'threat',
          name: 'WAF requests threat',
          color: 'warning',
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
          id: 'status.example.com',
          name: 'status.example.com',
          values: [90, 95, 100, 110, 105, 115, 120, 125, 130, 128, 135, 140]
        },
        {
          id: 'cdn.example.com',
          name: 'cdn.example.com',
          values: [60, 65, 62, 70, 72, 75, 80, 78, 85, 88, 90, 92]
        },
        {
          id: 'blog.example.com',
          name: 'blog.example.com',
          values: [30, 32, 35, 33, 36, 38, 40, 42, 41, 44, 46, 48]
        },
        {
          id: 'auth.example.com',
          name: 'auth.example.com',
          values: [20, 22, 21, 24, 25, 23, 26, 28, 27, 29, 30, 31]
        }
      ]
    })[id]
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
  <div class="grid grid-cols-12 gap-(--spacing-md)">
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
          <Chart.Axis kind="y" />
          <Chart.Line />
          <Chart.Tooltip />
        </Chart>
      </ChartCard.Content>
    </ChartCard>
  </div>
</template>
