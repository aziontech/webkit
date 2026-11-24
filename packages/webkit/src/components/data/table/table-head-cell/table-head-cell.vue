<script setup lang="ts">
  import { computed, inject, ref, useAttrs, useId } from 'vue'

  import { useElementListener } from '../../../../composables/use-element-listener'
  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import { TableRowGroupInjectionKey, type TableSortDirection } from '../injection-key'
  import TableSortButton from '../table-sort-button/table-sort-button.vue'

  export type TableHeadCellType = 'default' | 'checkbox' | 'action' | 'slot'
  export type TableHeadCellAlign = 'start' | 'center' | 'end'
  export type TableHeadCellGrow = 1 | 2 | 3
  export type TableHeadCellFrozen = 'start' | 'end'
  export type { TableSortDirection }

  defineOptions({
    name: 'TableHeadCell',
    inheritAttrs: false
  })

  export interface TableHeadCellProps {
    /** checkbox = select-all column; action = 40px header matching an action body cell; slot = free-form. */
    type?: TableHeadCellType
    /** Renders the sort button and the sort affordance. */
    sortable?: boolean
    /** Current sort direction; controlled. */
    sortDirection?: TableSortDirection
    /** Text alignment. */
    align?: TableHeadCellAlign
    /** Flex weight; the principal column uses 2 (see `principal`). */
    grow?: TableHeadCellGrow
    /** Marks the principal column — defaults its weight to `grow: 2` when `grow` is not set. */
    principal?: boolean
    /** Pins the column to the start or end edge of the scroll container. */
    frozen?: TableHeadCellFrozen
    /** Renders a drag-to-resize handle on the right edge. */
    resizable?: boolean
    /** Whether this column is currently being resized (drag active). */
    resizing?: boolean
    /** Pointer handler (mousedown/touchstart) that starts the resize drag. */
    resizeHandler?: (event: MouseEvent | globalThis.TouchEvent) => void
  }
  const props = withDefaults(defineProps<TableHeadCellProps>(), {
    type: 'default',
    sortable: false,
    sortDirection: 'none',
    align: 'start',
    grow: undefined,
    principal: false,
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
  const { t } = useTranslate({
    tableHeadCell: en.tableHeadCell,
    tableSortButton: en.tableSortButton
  })
  const group = inject(TableRowGroupInjectionKey, { hoverable: false })
  const compact = computed<boolean>(() => group.compact === true)

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'table-head-cell'
  )

  const labelId = useId()
  const sortById = useId()
  const sortStateId = useId()
  const rootEl = ref<HTMLElement | null>(null)

  const growAttr = computed<number | null>(() =>
    props.type === 'checkbox' || props.type === 'action'
      ? null
      : (props.grow ?? (props.principal ? 2 : 1))
  )

  const ariaSort = computed<TableSortDirection | undefined>(() =>
    props.sortable ? props.sortDirection : undefined
  )

  const sortState = computed<string>(() => {
    if (!props.sortable) return ''
    if (props.sortDirection === 'ascending') return t('tableSortButton.ascending')
    if (props.sortDirection === 'descending') return t('tableSortButton.descending')
    return ''
  })

  const onSort = (direction: 'ascending' | 'descending') => {
    emit('sort', direction)
  }

  const toggleSort = () => {
    if (!props.sortable) return
    onSort(props.sortDirection === 'ascending' ? 'descending' : 'ascending')
  }

  useElementListener(rootEl, 'click', toggleSort)

  const ROOT_CLASS =
    'group/head relative flex h-11 min-w-0 items-center gap-(--spacing-xs) px-(--spacing-sm) ' +
    'data-[sortable]:cursor-pointer data-[sortable]:select-none ' +
    'data-[compact]:h-9 data-[compact]:px-(--spacing-xs) ' +
    'text-label-sm text-(--text-muted) ' +
    'data-[align=start]:text-start data-[align=center]:text-center data-[align=end]:text-end data-[align=start]:justify-start data-[align=center]:justify-center ' +
    'data-[align=end]:justify-end ' +
    'data-[grow=1]:flex-[1_0_5rem] data-[grow=2]:flex-[2_0_5rem] data-[grow=3]:flex-[3_0_5rem] ' +
    'data-[type=checkbox]:w-10 data-[type=checkbox]:flex-none data-[type=checkbox]:justify-center data-[type=checkbox]:px-0 data-[type=action]:ms-auto data-[type=action]:w-10 ' +
    'data-[type=action]:flex-none data-[type=action]:justify-center data-[type=action]:px-0 ' +
    'data-[frozen=start]:sticky data-[frozen=start]:start-0 data-[frozen=end]:sticky data-[frozen=end]:end-0 data-[frozen]:z-10 data-[frozen]:bg-[var(--table-row-bg,var(--bg-surface))] ' +
    'data-[frozen=start]:after:pointer-events-none data-[frozen=start]:after:absolute data-[frozen=start]:after:inset-y-0 data-[frozen=start]:after:-end-6 data-[frozen=start]:after:w-6 ' +
    "data-[frozen=start]:after:content-[''] " +
    'group-data-[overflow-start]/scroll:data-[frozen=start]:after:bg-gradient-to-l ' +
    'rtl:group-data-[overflow-start]/scroll:data-[frozen=start]:after:bg-gradient-to-r ' +
    'data-[frozen=start]:after:from-transparent data-[frozen=start]:after:to-[var(--table-row-bg,var(--bg-surface))] data-[frozen=end]:before:pointer-events-none ' +
    "data-[frozen=end]:before:absolute data-[frozen=end]:before:inset-y-0 data-[frozen=end]:before:-start-6 data-[frozen=end]:before:w-6 data-[frozen=end]:before:content-[''] " +
    'group-data-[overflow-end]/scroll:data-[frozen=end]:before:bg-gradient-to-r ' +
    'rtl:group-data-[overflow-end]/scroll:data-[frozen=end]:before:bg-gradient-to-l ' +
    'data-[frozen=end]:before:from-transparent data-[frozen=end]:before:to-[var(--table-row-bg,var(--bg-surface))]'

  const SORT_CLASS =
    'flex h-full shrink-0 items-center justify-center opacity-0 transition-opacity duration-150 ease-out ' +
    'motion-reduce:transition-none group-hover/head:opacity-100 focus-within:opacity-100 ' +
    'group-data-[sort=ascending]/head:opacity-100 group-data-[sort=descending]/head:opacity-100'

  const RESIZE_CLASS =
    'absolute inset-y-0 end-0 z-20 w-2 shrink-0 cursor-col-resize touch-none select-none ' +
    "before:absolute before:inset-y-2 before:end-0 before:w-[2px] before:rounded-full before:bg-transparent before:content-[''] before:transition-colors before:duration-150 " +
    'before:ease-out motion-reduce:before:transition-none hover:before:bg-(--border-strong) ' +
    'data-[resizing]:before:bg-(--ring-color)'
</script>

<template>
  <div
    ref="rootEl"
    v-bind="$attrs"
    role="columnheader"
    :data-testid="testId"
    :data-type="type"
    :data-sortable="sortable || null"
    :data-sort="sortable ? sortDirection : null"
    :data-align="align"
    :data-grow="growAttr"
    :data-frozen="frozen ?? null"
    :data-compact="compact || null"
    :aria-sort="ariaSort"
    :class="ROOT_CLASS"
  >
    <slot v-if="type === 'checkbox' || type === 'action'" />
    <template v-else>
      <span
        :id="labelId"
        class="min-w-0 flex-1 truncate text-[length:inherit]"
        ><slot
      /></span>
      <span
        v-if="sortable"
        :id="sortById"
        hidden
        >{{ t('tableHeadCell.sortBy') }}</span
      >
      <span
        v-if="sortState"
        :id="sortStateId"
        hidden
        >{{ sortState }}</span
      >
      <span
        v-if="sortable"
        :class="SORT_CLASS"
        @click.stop
        @keydown.stop
      >
        <TableSortButton
          :sort-direction="sortDirection"
          :aria-labelledby="`${sortById} ${labelId}`"
          :aria-describedby="sortState ? sortStateId : undefined"
          @sort="onSort"
        />
      </span>
    </template>
    <span
      v-if="resizable"
      aria-hidden="true"
      :data-resizing="resizing || null"
      :class="RESIZE_CLASS"
      @mousedown.stop="resizeHandler"
      @touchstart.stop="resizeHandler"
      @click.stop
    />
  </div>
</template>
