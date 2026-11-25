<script setup lang="ts">
  import Checkbox from '../../../input/checkbox/checkbox.vue'
  import SlotOutlet from '../../table/parts/slot-outlet'
  import TableHeadCell from '../../table/table-head-cell/table-head-cell.vue'
  import TableHeader from '../../table/table-header/table-header.vue'
  import TableRow from '../../table/table-row/table-row.vue'
  import { useDataTableContext } from '../composables/use-data-table-context'

  defineOptions({ name: 'DataTableHead' })

  const { view } = useDataTableContext()
  const {
    slots,
    hasSlot,
    t,
    props,
    stacked,
    headers,
    pageSelection,
    toggleAllPageRows,
    viewOf,
    sortDirectionOf,
    isResizable,
    resizingColumnId,
    startResize,
    selectionFrozen,
    selectionStyle,
    reorder
  } = view
  const { active: reorderActive, frozen: reorderFrozen } = reorder
</script>

<template>
  <TableHeader
    frozen
    :density="props.density"
    :class="stacked ? 'sr-only!' : undefined"
  >
    <TableRow>
      <TableHeadCell
        v-if="reorderActive"
        key="reorder"
        type="checkbox"
        :frozen="reorderFrozen ? 'start' : undefined"
        data-slot="reorder-cell"
      >
        <span class="sr-only">{{ t('dataTable.reorderColumn') }}</span>
      </TableHeadCell>
      <TableHeadCell
        v-if="props.selectable"
        key="select"
        type="checkbox"
        :frozen="selectionFrozen ? 'start' : undefined"
        :style="selectionStyle"
      >
        <Checkbox
          v-if="!stacked"
          :model-value="pageSelection === 'all'"
          :indeterminate="pageSelection === 'some'"
          :aria-label="t('table.selectAll')"
          @update:model-value="(v) => toggleAllPageRows(!!v)"
        />
      </TableHeadCell>
      <TableHeadCell
        v-for="header in headers"
        :key="header.id"
        :type="viewOf(header.column.id).type"
        :grow="viewOf(header.column.id).grow"
        :align="viewOf(header.column.id).align"
        :frozen="viewOf(header.column.id).frozen"
        :style="viewOf(header.column.id).style"
        :class="viewOf(header.column.id).cellClass"
        :sortable="header.column.getCanSort()"
        :sort-direction="sortDirectionOf(header)"
        :resizable="isResizable(header)"
        :resizing="resizingColumnId === header.column.id"
        :resize-handler="(event) => startResize(header, event)"
        @sort="(direction) => header.column.toggleSorting(direction === 'descending')"
      >
        <SlotOutlet
          v-if="hasSlot('header-' + header.column.id)"
          :slots="slots"
          :name="'header-' + header.column.id"
          :scope="{ column: header.column }"
        />
        <template v-else-if="header.column.columnDef.header">{{
          header.column.columnDef.header
        }}</template>
      </TableHeadCell>
    </TableRow>
  </TableHeader>
</template>
