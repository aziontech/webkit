<script setup lang="ts">
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import Checkbox from '../../../input/checkbox/checkbox.vue'
  import SlotOutlet from '../../table/parts/slot-outlet'
  import TableBody from '../../table/table-body/table-body.vue'
  import TableCell from '../../table/table-cell/table-cell.vue'
  import TableRow from '../../table/table-row/table-row.vue'
  import { useDataTableContext } from '../composables/use-data-table-context'
  import { principalIndexOf } from '../lib/column-meta'
  import { EXPAND_TOGGLE_CLASS } from '../lib/data-table-classes'

  defineOptions({ name: 'DataTableRows' })

  const DATA_ROW_CLASS =
    'relative transition-[opacity] duration-fast-02 ease-productive-entrance ' +
    'motion-reduce:transition-none after:pointer-events-none after:absolute after:inset-0 after:z-20 ' +
    'data-[dragging]:opacity-60 data-[dragging]:after:outline-dashed data-[dragging]:after:outline-2 data-[dragging]:after:-outline-offset-2 data-[dragging]:after:outline-(--accent) ' +
    'data-[drop=before]:after:shadow-[inset_0_2px_0_var(--accent)] data-[drop=after]:after:shadow-[inset_0_-2px_0_var(--accent)] ' +
    'data-[live-boundary]:shadow-[inset_0_2px_0_var(--success)] ' +
    'outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-solid focus-visible:after:outline-(--ring-color)'
  const STACKED_ROW_CLASS =
    'flex-wrap rounded-(--shape-control) border! py-(--spacing-2xs) before:hidden'
  const STACKED_CELL_CLASS = 'static! before:hidden! after:hidden!'
  const STRIPE_CLASS = '[--table-row-bg:var(--bg-surface-raised)]'

  const { view } = useDataTableContext()
  const {
    testId,
    slots,
    hasSlot,
    t,
    props,
    stacked,
    treeActive,
    rowTotal,
    renderedRows,
    columnViews,
    viewOf,
    windowed,
    windowStart,
    virtualActive,
    virtualPadding,
    lazyActive,
    lazyGap,
    setLazySentinelEl,
    trackRow,
    selectionFrozen,
    selectionStyle,
    stackedLabelOf,
    bodyTransition,
    onBodyEntered,
    onRowClick,
    rowFocusActive,
    treeTabStop,
    treePlacement,
    toggleTreeRow,
    onTreeFocusin,
    onTreeKeydown,
    liveBoundaryId,
    reorder
  } = view
  const {
    active: reorderActive,
    locked: reorderLocked,
    frozen: reorderFrozen,
    hintId: reorderHintId,
    dragId,
    orderedCount,
    dropOf,
    canMove,
    labelOf,
    onKeydown: onHandleKeydown,
    onPointerdown: onHandlePointerdown,
    onPointermove: onHandlePointermove,
    onPointerup: onHandlePointerup,
    onPointercancel: onHandlePointercancel
  } = reorder

  const rowNameOf = (record: Record<string, unknown>, id: string): string => {
    const column = props.columns[principalIndexOf(props.columns)]
    const key = column?.accessorKey ?? column?.id
    const value = key ? record[key] : undefined
    return value === undefined || value === null || value === '' ? id : String(value)
  }
</script>

<template>
  <Transition
    appear
    :enter-active-class="bodyTransition.active"
    :enter-from-class="bodyTransition.from"
    :enter-to-class="bodyTransition.to"
    @after-enter="onBodyEntered"
    @enter-cancelled="onBodyEntered"
  >
    <TableBody
      v-if="!props.loading && !props.error && rowTotal > 0"
      key="rows"
      :class="stacked ? 'gap-(--spacing-xs) p-(--spacing-xs)' : undefined"
      :style="virtualPadding"
    >
      <TableRow
        v-for="(row, index) in renderedRows"
        :key="row.id"
        :ref="virtualActive ? (el) => trackRow(el, row.id) : undefined"
        v-memo="[
          row.getIsSelected(),
          row.original,
          columnViews,
          props.striped,
          windowed,
          virtualActive,
          windowStart + index,
          reorderActive,
          reorderLocked,
          dragId === row.id,
          dropOf(row.id),
          orderedCount,
          treeActive,
          rowFocusActive,
          row.getIsExpanded(),
          row.id === treeTabStop,
          treePlacement.get(row.id),
          row.id === liveBoundaryId
        ]"
        :selected="row.getIsSelected()"
        :aria-rowindex="windowed ? windowStart + index + 2 : undefined"
        :aria-level="treeActive ? row.depth + 1 : undefined"
        :aria-setsize="treePlacement.get(row.id)?.setsize"
        :aria-posinset="treePlacement.get(row.id)?.posinset"
        :aria-expanded="treeActive && row.getCanExpand() ? row.getIsExpanded() : undefined"
        :tabindex="rowFocusActive ? (row.id === treeTabStop ? 0 : -1) : undefined"
        :data-tree-row="treeActive ? row.id : undefined"
        :data-focus-row="rowFocusActive ? row.id : undefined"
        :data-depth="treeActive ? row.depth : undefined"
        :data-reorder-row="reorderActive ? row.id : undefined"
        :data-dragging="dragId === row.id || undefined"
        :data-drop="dropOf(row.id)"
        :data-live-boundary="row.id === liveBoundaryId || undefined"
        :class="[
          stacked ? STACKED_ROW_CLASS : undefined,
          props.striped && (windowStart + index) % 2 === 1 ? STRIPE_CLASS : undefined,
          DATA_ROW_CLASS
        ]"
        @click="onRowClick($event, row)"
        @keydown="onTreeKeydown($event, row)"
        @focusin="rowFocusActive && onTreeFocusin(row)"
      >
        <TableCell
          v-if="reorderActive"
          key="reorder"
          type="checkbox"
          :frozen="reorderFrozen ? 'start' : undefined"
          data-slot="reorder-cell"
          :class="stacked ? STACKED_CELL_CLASS : undefined"
        >
          <IconButton
            icon="az az-menu"
            variant="outline"
            size="small"
            :ariaLabel="labelOf(row.id, windowStart + index)"
            :aria-describedby="reorderHintId"
            :disabled="reorderLocked || !canMove(row.id)"
            :data-reorder-handle="row.id"
            :data-testid="`${testId}__reorder-handle`"
            class="cursor-grab touch-none active:cursor-grabbing"
            @click.stop
            @keydown="(event: KeyboardEvent) => onHandleKeydown(event, row.id)"
            @pointerdown="(event: PointerEvent) => onHandlePointerdown(event, row.id)"
            @pointermove="onHandlePointermove"
            @pointerup="onHandlePointerup"
            @pointercancel="onHandlePointercancel"
          />
        </TableCell>
        <TableCell
          v-if="props.selectable"
          key="select"
          type="checkbox"
          :frozen="selectionFrozen ? 'start' : undefined"
          :style="selectionStyle"
          :class="stacked ? STACKED_CELL_CLASS : undefined"
        >
          <Checkbox
            v-if="row.getCanSelect()"
            :model-value="row.getIsSelected()"
            :aria-label="t('table.selectRow', { row: rowNameOf(row.original, row.id) })"
            @update:model-value="(v) => row.toggleSelected(!!v)"
          />
        </TableCell>
        <TableCell
          v-for="cell in row.getVisibleCells()"
          :key="cell.id"
          :style="viewOf(cell.column.id).style"
          :grow="viewOf(cell.column.id).grow"
          :align="viewOf(cell.column.id).align"
          :frozen="viewOf(cell.column.id).frozen"
          :type="viewOf(cell.column.id).type"
          :class="viewOf(cell.column.id).cellClass"
        >
          <span
            v-if="viewOf(cell.column.id).stackedField"
            aria-hidden="true"
            :data-testid="`${testId}__stacked-label`"
            class="w-2/5 shrink-0 truncate text-label-sm text-(--text-muted)"
            >{{ stackedLabelOf(cell.column) }}</span
          >
          <span
            v-if="treeActive && viewOf(cell.column.id).principal"
            aria-hidden="true"
            data-slot="tree-gutter"
            class="flex shrink-0 justify-end"
            :style="{ inlineSize: `calc(var(--spacing-md) * ${row.depth} + var(--size-7))` }"
          >
            <span
              v-if="row.getCanExpand()"
              aria-hidden="true"
              :data-testid="`${testId}__expand-toggle`"
              :class="EXPAND_TOGGLE_CLASS"
              @click.stop="toggleTreeRow(row)"
            >
              <i
                class="text-body-xs"
                :class="
                  row.getIsExpanded()
                    ? 'az az-chevron-down'
                    : 'az az-chevron-right rtl:-scale-x-100'
                "
              />
            </span>
          </span>
          <SlotOutlet
            v-if="hasSlot('cell-' + cell.column.id)"
            :slots="slots"
            :name="'cell-' + cell.column.id"
            :scope="{ row: row.original, value: cell.getValue() }"
          />
          <span
            v-else
            dir="auto"
            class="min-w-0 flex-1 truncate"
            >{{ cell.getValue() }}</span
          >
        </TableCell>
      </TableRow>
      <div
        v-if="lazyActive"
        :ref="setLazySentinelEl"
        role="presentation"
        aria-hidden="true"
        :data-testid="`${testId}__lazy-rows`"
        :style="{ height: `${lazyGap}px` }"
      />
    </TableBody>
  </Transition>
</template>
