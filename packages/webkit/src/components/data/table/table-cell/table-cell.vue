<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref } from 'vue'

  export type TableCellType = 'default' | 'checkbox' | 'action'
  export type TableCellAlign = 'start' | 'center' | 'end'
  export type TableCellGrow = 1 | 2 | 3
  export type TableCellFrozen = 'start' | 'end'

  defineOptions({
    name: 'TableCell',
    inheritAttrs: false
  })

  export interface TableCellProps {
    /** checkbox holds the row checkbox; action holds the row menu trigger. */
    type?: TableCellType
    /** Text alignment. */
    align?: TableCellAlign
    /** Flex weight; the principal column uses 2 (see `principal`). */
    grow?: TableCellGrow
    /** Marks the principal column — defaults its weight to `grow: 2` when `grow` is not set. */
    principal?: boolean
    /** Pins the column to the start or end edge of the scroll container. */
    frozen?: TableCellFrozen
    /** Underlines the cell text to signal it links somewhere. */
    clickable?: boolean
  }

  const props = withDefaults(defineProps<TableCellProps>(), {
    type: 'default',
    align: 'start',
    grow: undefined,
    principal: false,
    frozen: undefined,
    clickable: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const fallbackTestId = 'table-cell'

  const stopOwnedClick = (event: MouseEvent) => {
    if (props.clickable || props.type === 'action' || props.type === 'checkbox')
      event.stopPropagation()
  }

  const cellEl = ref<HTMLElement | null>(null)
  onMounted(() => cellEl.value?.addEventListener('click', stopOwnedClick))
  onBeforeUnmount(() => cellEl.value?.removeEventListener('click', stopOwnedClick))

  const ROOT_CLASS =
    'flex min-h-12 min-w-0 max-w-[100cqi] items-center gap-(--spacing-xs) px-(--spacing-sm) py-(--spacing-xs) whitespace-nowrap text-label-md text-(--text-default) ' +
    'data-[align=start]:text-start data-[align=center]:text-center data-[align=end]:text-end data-[align=start]:justify-start data-[align=center]:justify-center ' +
    'data-[align=end]:justify-end ' +
    'data-[grow=1]:flex-[1_0_5rem] data-[grow=2]:flex-[2_0_5rem] data-[grow=3]:flex-[3_0_5rem] ' +
    'data-[principal]:max-w-[max(var(--size-48),50cqi)] ' +
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
    'data-[frozen=end]:before:from-transparent data-[frozen=end]:before:to-[var(--table-row-bg,var(--bg-surface))] ' +
    'data-[clickable]:cursor-pointer data-[clickable]:underline'
</script>

<template>
  <div
    ref="cellEl"
    v-bind="$attrs"
    role="cell"
    :data-testid="$attrs['data-testid'] ?? fallbackTestId"
    :data-type="type"
    :data-align="align"
    :data-grow="type === 'default' ? (grow ?? (principal ? 2 : 1)) : null"
    :data-frozen="frozen ?? null"
    :data-principal="(type === 'default' && principal) || null"
    :data-clickable="clickable || null"
    :class="ROOT_CLASS"
  >
    <slot />
  </div>
</template>
