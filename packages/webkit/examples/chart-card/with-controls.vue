<script setup>
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu-root'
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
      <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
        <ChartCard.Title>Cross-site scripting threats</ChartCard.Title>
        <Hint text="Requests carrying cross-site scripting attacks against your domains." />
      </span>
      <ChartCard.Controls>
        <Tag
          label="Sum"
          severity="secondary"
          icon="pi pi-calculator"
        />
        <Tag
          label="+12.40%"
          severity="danger"
        />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <IconButton
              kind="transparent"
              size="small"
              icon="pi pi-ellipsis-h"
              aria-label="More options"
            />
          </DropdownMenuTrigger>
          <DropdownMenuGroup>
            <DropdownMenuOption
              value="copy-query"
              label="Copy query"
            />
            <DropdownMenuOption
              value="export-csv"
              label="Export CSV"
            />
            <DropdownMenuOption
              value="mean-line"
              label="Show mean line"
            />
          </DropdownMenuGroup>
        </DropdownMenu>
      </ChartCard.Controls>
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
