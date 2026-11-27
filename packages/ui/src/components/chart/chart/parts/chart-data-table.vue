<script setup lang="ts">
  defineOptions({ name: 'ChartDataTable' })

  export interface ChartDataTableRow {
    /** Stable key of the row. */
    key: string | number
    /** Text of the row header cell. */
    header: string
    /** Text of the data cells, one per column after the first. */
    cells: readonly string[]
  }

  interface Props {
    /** Accessible caption of the table. */
    caption: string
    /** Column headings; the first heads the row header column. */
    columns: readonly string[]
    /** One entry per row. */
    rows: readonly ChartDataTableRow[]
  }

  defineProps<Props>()
</script>

<template>
  <table class="w-full border-collapse text-body-sm text-(--text-default)">
    <caption class="sr-only">
      {{
        caption
      }}
    </caption>
    <thead>
      <tr>
        <th
          v-for="(column, index) in columns"
          :key="index"
          scope="col"
          class="border-b border-(--border-default) px-(--spacing-xs) py-(--spacing-2xs) text-end text-label-sm text-(--text-muted) first:text-start"
        >
          {{ column }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="row in rows"
        :key="row.key"
      >
        <th
          scope="row"
          class="border-b border-(--border-muted) px-(--spacing-xs) py-(--spacing-2xs) text-start text-body-sm"
        >
          {{ row.header }}
        </th>
        <td
          v-for="(cell, index) in row.cells"
          :key="index"
          class="border-b border-(--border-muted) px-(--spacing-xs) py-(--spacing-2xs) text-end tabular-nums"
        >
          {{ cell }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
