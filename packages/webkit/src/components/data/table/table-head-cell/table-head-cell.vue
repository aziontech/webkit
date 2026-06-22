<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { TableInjectionKey, TableRowGroupKey } from '../injection-key'
  import TableSortButton from '../table-sort-button/table-sort-button.vue'

  export type TableHeadCellKind = 'default' | 'checkbox' | 'action' | 'slot'
  export type TableHeadCellAlign = 'start' | 'center' | 'end'
  export type TableHeadCellGrow = 1 | 2 | 3
  export type TableHeadCellFrozen = 'start' | 'end'
  export type SortDirection = 'none' | 'ascending' | 'descending'

  defineOptions({
    name: 'TableHeadCell',
    inheritAttrs: false
  })

  interface Props {
    /** checkbox = select-all column; action = 40px header matching an action body cell; slot = free-form. */
    kind?: TableHeadCellKind
    /** Renders the sort button and the sort affordance. */
    sortable?: boolean
    /** Current sort direction; controlled. */
    sortDirection?: SortDirection
    /** Text alignment. */
    align?: TableHeadCellAlign
    /** Flex weight; the emphasized first column uses 2. */
    grow?: TableHeadCellGrow
    /** Pins the column to the start or end edge of the scroll container. */
    frozen?: TableHeadCellFrozen
    /** Renders a drag-to-resize handle on the right edge. */
    resizable?: boolean
    /** Whether this column is currently being resized (drag active). */
    resizing?: boolean
    /** Pointer handler (mousedown/touchstart) that starts the resize drag. */
    resizeHandler?: (event: MouseEvent | globalThis.TouchEvent) => void
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'default',
    sortable: false,
    sortDirection: 'none',
    align: 'start',
    grow: 1,
    frozen: undefined,
    resizable: false,
    resizing: false,
    resizeHandler: undefined
  })

  const emit = defineEmits<{
    sort: [direction: 'ascending' | 'descending']
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(TableInjectionKey, null)
  // A compact TableHeader publishes density through the row-group context.
  const group = inject(TableRowGroupKey, { hoverable: false })
  const compact = computed<boolean>(() => group.compact === true)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__head-cell` : 'data-table__head-cell')
  )

  const growAttr = computed<number | null>(() =>
    props.kind === 'checkbox' || props.kind === 'action' ? null : props.grow
  )

  const ariaSort = computed<SortDirection | undefined>(() =>
    props.sortable ? props.sortDirection : undefined
  )

  const handleSort = (direction: 'ascending' | 'descending') => {
    emit('sort', direction)
  }
</script>

<template>
  <div
    v-bind="$attrs"
    role="columnheader"
    :data-testid="testId"
    :data-kind="kind"
    :data-sortable="sortable || null"
    :data-sort="sortable ? sortDirection : null"
    :data-align="align"
    :data-grow="growAttr"
    :data-frozen="frozen ?? null"
    :data-compact="compact || null"
    :aria-sort="ariaSort"
    class="group/head relative flex h-11 min-w-0 items-center gap-[var(--spacing-xs)] px-[var(--spacing-sm)] data-[compact]:h-9 data-[compact]:px-[var(--spacing-xs)] text-label-sm text-[var(--text-muted)] data-[align=start]:text-start data-[align=center]:text-center data-[align=end]:text-end data-[align=start]:justify-start data-[align=center]:justify-center data-[align=end]:justify-end data-[grow=1]:flex-[1_0_5rem] data-[grow=2]:flex-[2_0_5rem] data-[grow=3]:flex-[3_0_5rem] data-[kind=checkbox]:w-10 data-[kind=checkbox]:flex-none data-[kind=checkbox]:justify-center data-[kind=checkbox]:px-0 data-[kind=action]:ml-auto data-[kind=action]:w-10 data-[kind=action]:flex-none data-[kind=action]:justify-center data-[kind=action]:px-0 data-[frozen=start]:sticky data-[frozen=start]:left-0 data-[frozen=end]:sticky data-[frozen=end]:right-0 data-[frozen]:z-10 data-[frozen]:bg-[var(--table-row-bg,var(--bg-surface))] data-[frozen=start]:after:pointer-events-none data-[frozen=start]:after:absolute data-[frozen=start]:after:inset-y-0 data-[frozen=start]:after:-right-6 data-[frozen=start]:after:w-6 data-[frozen=start]:after:content-[''] data-[frozen=start]:after:bg-gradient-to-l data-[frozen=start]:after:from-transparent data-[frozen=start]:after:to-[var(--table-row-bg,var(--bg-surface))] data-[frozen=end]:before:pointer-events-none data-[frozen=end]:before:absolute data-[frozen=end]:before:inset-y-0 data-[frozen=end]:before:-left-6 data-[frozen=end]:before:w-6 data-[frozen=end]:before:content-[''] data-[frozen=end]:before:bg-gradient-to-r data-[frozen=end]:before:from-transparent data-[frozen=end]:before:to-[var(--table-row-bg,var(--bg-surface))]"
  >
    <slot v-if="kind === 'checkbox' || kind === 'action'" />
    <template v-else>
      <span class="min-w-0 flex-1 truncate text-[length:inherit]"><slot /></span>
      <span
        v-if="sortable"
        class="flex h-full shrink-0 items-center justify-center opacity-0 transition-opacity duration-150 ease-out motion-reduce:transition-none group-hover/head:opacity-100 focus-within:opacity-100 group-data-[sort=ascending]/head:opacity-100 group-data-[sort=descending]/head:opacity-100"
      >
        <TableSortButton
          :direction="sortDirection"
          @toggle="handleSort"
        />
      </span>
    </template>
    <span
      v-if="resizable"
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize column"
      :data-resizing="resizing || null"
      class="absolute inset-y-0 right-0 z-20 w-2 shrink-0 cursor-col-resize touch-none select-none before:absolute before:inset-y-2 before:right-0 before:w-[2px] before:rounded-full before:bg-transparent before:content-[''] before:transition-colors before:duration-150 before:ease-out motion-reduce:before:transition-none hover:before:bg-[var(--border-strong)] data-[resizing]:before:bg-[var(--ring-color)]"
      @mousedown.stop="resizeHandler"
      @touchstart.stop="resizeHandler"
      @click.stop
    />
  </div>
</template>
