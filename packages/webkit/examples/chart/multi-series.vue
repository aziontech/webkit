<script setup>
  import Chart from '@aziontech/webkit/chart'

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
  const hosts = [
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
</script>

<template>
  <Chart
    :series="hosts"
    :labels="labels"
    aria-label="WAF threat requests by host"
  >
    <Chart.Grid />
    <Chart.Axis kind="y" />
    <Chart.Axis kind="x" />
    <Chart.Line />
    <Chart.Crosshair />
    <Chart.Tooltip />
    <Chart.Legend totals />
  </Chart>
</template>
