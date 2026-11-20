<script setup>
  import ChartCard from '@aziontech/webkit/chart-card'
  import StatTile from '@aziontech/webkit/stat-tile'

  const panels = [
    {
      id: 'requests',
      title: 'Requests',
      unit: '',
      value: 182400,
      delta: 4.2,
      trend: [150, 162, 158, 171, 168, 176, 181, 179, 184, 182]
    },
    {
      id: 'bandwidth',
      title: 'Data transferred',
      unit: 'GB',
      value: 912,
      delta: -1.8,
      trend: [940, 935, 928, 931, 925, 920, 918, 915, 914, 912]
    },
    {
      id: 'latency',
      title: 'Edge latency',
      unit: 'ms',
      inverse: true,
      value: 38,
      delta: -6.1,
      trend: [44, 43, 41, 42, 40, 40, 39, 39, 38, 38]
    }
  ]
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-md) md:grid-cols-3">
    <ChartCard
      v-for="panel in panels"
      :key="panel.id"
    >
      <ChartCard.Content>
        <StatTile
          :label="panel.title"
          :value="panel.value"
          :delta="panel.delta"
          :unit="panel.unit"
          :inverse="Boolean(panel.inverse)"
          delta-label="vs previous 24 hours"
          :trend="panel.trend"
        />
      </ChartCard.Content>
      <ChartCard.Footer>Last 24 hours</ChartCard.Footer>
    </ChartCard>
  </div>
</template>
