<script setup lang="ts">
  import Skeleton from '../../../feedback/skeleton/skeleton.vue'
  import TableBody from '../../table/table-body/table-body.vue'
  import TableCell from '../../table/table-cell/table-cell.vue'
  import TableRow from '../../table/table-row/table-row.vue'
  import { useDataTableContext } from '../composables/use-data-table-context'

  defineOptions({ name: 'DataTableSkeleton' })

  const { view } = useDataTableContext()
  const { props, stacked, headers, skeletonRowCount, viewOf, selectionFrozen, selectionStyle } =
    view
  const { active: reorderActive, frozen: reorderFrozen } = view.reorder
</script>

<template>
  <TableBody
    key="skeleton"
    :class="stacked ? 'gap-(--spacing-xs) p-(--spacing-xs)' : undefined"
  >
    <TableRow
      v-for="n in skeletonRowCount"
      :key="'sk-' + n"
      :class="
        stacked ? 'flex-wrap rounded-(--shape-control) border! py-(--spacing-2xs)' : undefined
      "
    >
      <TableCell
        v-if="reorderActive"
        key="reorder"
        type="checkbox"
        :frozen="reorderFrozen ? 'start' : undefined"
        :class="stacked ? 'static! before:hidden! after:hidden!' : undefined"
      />
      <TableCell
        v-if="props.selectable"
        key="select"
        type="checkbox"
        :frozen="selectionFrozen ? 'start' : undefined"
        :style="selectionStyle"
        :class="stacked ? 'static! before:hidden! after:hidden!' : undefined"
      >
        <Skeleton
          variant="rectangle"
          width="16px"
          height="16px"
        />
      </TableCell>
      <TableCell
        v-for="header in headers"
        :key="header.id"
        :style="viewOf(header.column.id).style"
        :grow="viewOf(header.column.id).grow"
        :align="viewOf(header.column.id).align"
        :frozen="viewOf(header.column.id).frozen"
        :type="viewOf(header.column.id).type"
        :class="viewOf(header.column.id).stackedClass"
      >
        <Skeleton
          v-if="viewOf(header.column.id).type !== 'action'"
          height="0.875rem"
        />
      </TableCell>
    </TableRow>
  </TableBody>
</template>
