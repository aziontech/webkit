<script setup>
  import DashboardGrid from '@aziontech/webkit/dashboard-grid'
  import StatTile from '@aziontech/webkit/stat-tile'
  import { ref } from 'vue'

  const tiles = {
    requests: {
      title: 'Requests',
      value: 24910000,
      unit: '',
      delta: 4.2,
      inverse: false,
      trend: [1.9, 1.8, 1.9, 1.6, 1.8, 1.7, 2.2, 2.2, 2.3, 2.4, 2.5, 2.3]
    },
    bandwidth: {
      title: 'Data transferred',
      value: 1.2,
      unit: 'TB',
      delta: 1.8,
      inverse: false,
      trend: [7.5, 8.7, 8.9, 10.2, 10.5, 10.6, 10, 9.8, 10.4, 8.6, 7.4, 8]
    },
    errors: {
      title: 'Error rate',
      value: 0.41,
      unit: '%',
      delta: -0.3,
      inverse: true,
      trend: [0.5, 0.48, 0.52, 0.47, 0.45, 0.44, 0.46, 0.43, 0.42, 0.44, 0.41, 0.41]
    },
    latency: {
      title: 'Response time p95',
      value: 182,
      unit: 'ms',
      delta: -3.2,
      inverse: true,
      trend: [166, 167, 151, 172, 200, 191, 205, 208, 205, 182, 165, 175]
    }
  }

  const layout = ref([
    { id: 'requests', span: 6 },
    { id: 'bandwidth', span: 6 },
    { id: 'errors', span: 4 },
    { id: 'latency', span: 8 }
  ])
</script>

<template>
  <DashboardGrid v-model:layout="layout">
    <DashboardGrid.Item
      v-for="item in layout"
      :key="item.id"
      :item-id="item.id"
      :label="tiles[item.id].title"
    >
      <StatTile
        :label="tiles[item.id].title"
        :value="tiles[item.id].value"
        :unit="tiles[item.id].unit"
        :delta="tiles[item.id].delta"
        delta-label="vs previous 24 hours"
        :inverse="tiles[item.id].inverse"
        :trend="tiles[item.id].trend"
        class="flex-1"
      />
    </DashboardGrid.Item>
  </DashboardGrid>
</template>
