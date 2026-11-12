<script setup>
  import Button from '@aziontech/webkit/button'
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
  const series = [
    {
      id: 'xss',
      name: 'WAF requests XSS attacks',
      values: [null, null, null]
    }
  ]
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-3">
    <Chart
      :series="series"
      :labels="labels"
      aria-label="Cross-site scripting threats"
      empty-title="No requests in this range"
      empty-description="Nothing reached this workload in the last hour."
    >
      <Chart.Grid />
      <Chart.Axis kind="y" />
      <Chart.Axis kind="x" />
      <Chart.Line />
    </Chart>
    <Chart
      :series="series"
      :labels="labels"
      aria-label="Cross-site scripting threats"
      empty-title="No requests match these filters"
      empty-description="Choose another host or widen the time range."
    >
      <Chart.Grid />
      <Chart.Axis kind="y" />
      <Chart.Axis kind="x" />
      <Chart.Line />
      <template #empty-actions>
        <Button
          label="Clear filters"
          kind="outlined"
          size="small"
        />
      </template>
    </Chart>
    <Chart
      :series="series"
      :labels="labels"
      aria-label="Cross-site scripting threats"
      empty-title="No firewall on this workload"
      empty-description="Threat metrics appear once a firewall protects the workload."
    >
      <Chart.Grid />
      <Chart.Axis kind="y" />
      <Chart.Axis kind="x" />
      <Chart.Line />
      <template #empty-actions>
        <Button
          label="Add firewall"
          kind="secondary"
          size="small"
          icon="pi pi-plus"
        />
      </template>
    </Chart>
  </div>
</template>
