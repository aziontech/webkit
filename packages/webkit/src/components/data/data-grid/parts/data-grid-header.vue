<script setup lang="ts">
  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Checkbox from '../../../input/checkbox/checkbox.vue'
  import type { UseDataGridCellsReturn } from '../composables/use-data-grid-cells'
  import type { UseDataGridCursorReturn } from '../composables/use-data-grid-cursor'
  import { MAX_WIDTH, type UseDataGridResizeReturn } from '../composables/use-data-grid-resize'
  import { RESIZE_HANDLE_CLASS, SELECT_ALL_CLASS } from '../lib/grid-classes'
  import { HEADER } from '../lib/grid-values'
  import type { DataGridColumn } from '../types'

  defineOptions({ name: 'DataGridHeader', inheritAttrs: false })

  interface Props {
    /** Column geometry of the grid. */
    cells: UseDataGridCellsReturn
    /** Cursor of the grid. */
    cursor: UseDataGridCursorReturn
    /** Column resize state of the grid. */
    resize: UseDataGridResizeReturn
    /** Every row is selected. */
    allSelected: boolean
    /** At least one row is selected. */
    someSelected: boolean
    /** Test id of the grid. */
    testId: string
  }

  defineProps<Props>()

  const emit = defineEmits<{
    'focus-cell': [col: number]
    'press-cell': [event: PointerEvent, col: number]
    'toggle-all': []
  }>()

  const { t } = useTranslate({ dataGrid: en.dataGrid })
</script>

<template>
  <div
    role="row"
    aria-rowindex="1"
    class="sticky top-0 z-2 flex border-b-(length:--border-width-default) border-solid border-(--border-default) bg-(--bg-surface-raised)"
  >
    <div
      v-for="col in cells.colCount.value"
      :id="cells.cellId(HEADER, col - 1)"
      :key="col"
      role="columnheader"
      :tabindex="cursor.isActive(HEADER, col - 1) ? 0 : -1"
      :aria-colindex="col"
      :data-frozen="cells.frozen(col - 1)"
      :data-resizing="resize.resizing.value === cells.columnAt(col - 1)?.id || null"
      :data-testid="
        cells.columnAt(col - 1)
          ? `${testId}__head-${cells.columnAt(col - 1)?.id}`
          : `${testId}__select-all`
      "
      :style="{ width: `${cells.widthAt(col - 1)}px`, ...cells.frozenStyle(col - 1) }"
      :class="SELECT_ALL_CLASS"
      @focus="emit('focus-cell', col - 1)"
      @pointerdown="(event) => emit('press-cell', event, col - 1)"
    >
      <Checkbox
        v-if="col - 1 < cells.offset.value"
        :model-value="allSelected"
        :indeterminate="someSelected && !allSelected"
        :tabindex="-1"
        :aria-label="t('dataGrid.selectAll')"
        class="mx-auto"
        @update:model-value="emit('toggle-all')"
      />
      <template v-else>
        <span
          :data-align="cells.columnAt(col - 1)?.align ?? 'start'"
          class="min-w-0 flex-1 truncate text-start data-[align=end]:text-end"
          >{{ cells.columnAt(col - 1)?.header }}</span
        >
        <span
          :id="`${cells.cellId(HEADER, col - 1)}-resize`"
          role="separator"
          tabindex="-1"
          aria-orientation="vertical"
          :aria-valuenow="cells.widthAt(col - 1)"
          :aria-valuemin="cells.columnAt(col - 1)?.minWidth ?? 64"
          :aria-valuemax="MAX_WIDTH"
          :aria-label="t('dataGrid.resize', { column: cells.columnAt(col - 1)?.header ?? '' })"
          :data-testid="`${testId}__resize-${cells.columnAt(col - 1)?.id}`"
          :class="RESIZE_HANDLE_CLASS"
          @pointerdown="
            (event) => resize.startResize(event, cells.columnAt(col - 1) as DataGridColumn)
          "
        />
      </template>
    </div>
  </div>
</template>
