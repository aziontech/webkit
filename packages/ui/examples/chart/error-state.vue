<script setup>
  import Button from '@aziontech/ui/button'
  import Chart from '@aziontech/ui/chart'
  import EmptyState from '@aziontech/ui/empty-state'

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
  ]
</script>

<template>
  <Chart
    :series="series"
    :labels="labels"
    aria-label="Threats vs requests"
    error="The analytics service did not answer. Check your connection and try again."
  >
    <template #error>
      <div
        role="alert"
        class="w-full"
      >
        <EmptyState
          title="Could not load this report"
          description="The analytics service did not answer. Check your connection and try again."
          icon="az az-triangle-alert"
          size="small"
        >
          <template #actions>
            <Button
              label="Try again"
              variant="secondary"
              size="small"
              icon="az az-refresh"
            />
          </template>
        </EmptyState>
      </div>
    </template>
    <Chart.Grid />
    <Chart.Axis type="y" />
    <Chart.Axis type="x" />
    <Chart.Area :ids="['allowed']" />
    <Chart.Line :ids="['blocked', 'threat']" />
    <Chart.Crosshair />
    <Chart.Tooltip />
    <Chart.Legend total />
  </Chart>
</template>
