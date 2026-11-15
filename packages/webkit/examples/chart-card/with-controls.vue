<script setup>
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tag from '@aziontech/webkit/tag'

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
      values: [42, 38, 51, 47, 63, 58, 72, 69, 81, 77, 90, 86]
    }
  ]
</script>

<template>
  <ChartCard class="max-w-(--container-3xl)">
    <ChartCard.Header>
      <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
        <ChartCard.Title>Cross-site scripting threats</ChartCard.Title>
        <Hint content="Requests carrying cross-site scripting attacks against your domains." />
      </span>
      <ChartCard.Action>
        <Tag
          label="Sum"
          severity="neutral"
          icon="ai ai-calculator"
        />
        <Tag
          label="+12.40%"
          severity="danger"
        />
        <DropdownMenuRoot>
          <DropdownMenuTrigger>
            <IconButton
              kind="transparent"
              size="small"
              icon="ai ai-ellipsis"
              aria-label="More options"
            />
          </DropdownMenuTrigger>
          <DropdownMenuGroup>
            <DropdownMenuItem
              value="copy-query"
              label="Copy query"
            />
            <DropdownMenuItem
              value="export-csv"
              label="Export CSV"
            />
            <DropdownMenuItem
              value="mean-line"
              label="Show mean line"
            />
          </DropdownMenuGroup>
        </DropdownMenuRoot>
      </ChartCard.Action>
    </ChartCard.Header>
    <ChartCard.Content>
      <Chart
        :series="series"
        :labels="labels"
      >
        <Chart.Grid />
        <Chart.Axis kind="y" />
        <Chart.Axis kind="x" />
        <Chart.Line />
        <Chart.Crosshair />
        <Chart.Tooltip />
      </Chart>
    </ChartCard.Content>
  </ChartCard>
</template>
