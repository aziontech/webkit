<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'

  import { TableInjectionKey } from '../injection-key'

  export type TableCellKind = 'default' | 'checkbox' | 'action'
  export type TableCellAlign = 'start' | 'center' | 'end'
  export type TableCellGrow = 1 | 2 | 3
  export type TableCellFrozen = 'start' | 'end'

  defineOptions({
    name: 'TableCell',
    inheritAttrs: false
  })

  interface Props {
    /** checkbox holds the row checkbox; action holds the row menu trigger. */
    kind?: TableCellKind
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

  const props = withDefaults(defineProps<Props>(), {
    kind: 'default',
    align: 'start',
    grow: undefined,
    principal: false,
    frozen: undefined,
    clickable: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(TableInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__cell` : 'data-table__cell')
  )

  const growAttr = computed<number | null>(() =>
    props.kind === 'default' ? (props.grow ?? (props.principal ? 2 : 1)) : null
  )

  const cellRef = ref<HTMLElement | null>(null)

  // The cell decides whether a click belongs to it or to the row. A cell that
  // owns its click — a link/clickable cell, the selection checkbox, or a
  // row-action control — swallows the click so it never also fires the
  // row-level click; an inert cell lets it bubble to the row, so a table with
  // no owning cells stays fully row-clickable. The listener is attached
  // natively (not via @click) so an inert cell remains a plain, non-interactive
  // element with no implied keyboard affordance.
  const ownsClick = computed<boolean>(
    () => props.clickable || props.kind === 'action' || props.kind === 'checkbox'
  )

  const stopOwnedClick = (event: MouseEvent) => {
    if (ownsClick.value) event.stopPropagation()
  }

  onMounted(() => cellRef.value?.addEventListener('click', stopOwnedClick))
  onBeforeUnmount(() => cellRef.value?.removeEventListener('click', stopOwnedClick))
</script>

<template>
  <div
    ref="cellRef"
    v-bind="$attrs"
    role="cell"
    :data-testid="testId"
    :data-kind="kind"
    :data-align="align"
    :data-grow="growAttr"
    :data-frozen="frozen ?? null"
    :data-clickable="clickable || null"
    class="flex min-h-12 min-w-0 items-center gap-[var(--spacing-xs)] px-[var(--spacing-sm)] whitespace-nowrap text-label-md text-[var(--text-default)] data-[align=start]:text-start data-[align=center]:text-center data-[align=end]:text-end data-[align=start]:justify-start data-[align=center]:justify-center data-[align=end]:justify-end data-[grow=1]:flex-[1_0_5rem] data-[grow=2]:flex-[2_0_5rem] data-[grow=3]:flex-[3_0_5rem] data-[kind=checkbox]:w-10 data-[kind=checkbox]:flex-none data-[kind=checkbox]:justify-center data-[kind=checkbox]:px-0 data-[kind=action]:ml-auto data-[kind=action]:w-10 data-[kind=action]:flex-none data-[kind=action]:justify-center data-[kind=action]:px-0 data-[frozen=start]:sticky data-[frozen=start]:left-0 data-[frozen=end]:sticky data-[frozen=end]:right-0 data-[frozen]:z-10 data-[frozen]:bg-[var(--table-row-bg,var(--bg-surface))] data-[frozen=start]:after:pointer-events-none data-[frozen=start]:after:absolute data-[frozen=start]:after:inset-y-0 data-[frozen=start]:after:-right-6 data-[frozen=start]:after:w-6 data-[frozen=start]:after:content-[''] data-[frozen=start]:after:bg-gradient-to-l data-[frozen=start]:after:from-transparent data-[frozen=start]:after:to-[var(--table-row-bg,var(--bg-surface))] data-[frozen=end]:before:pointer-events-none data-[frozen=end]:before:absolute data-[frozen=end]:before:inset-y-0 data-[frozen=end]:before:-left-6 data-[frozen=end]:before:w-6 data-[frozen=end]:before:content-[''] data-[frozen=end]:before:bg-gradient-to-r data-[frozen=end]:before:from-transparent data-[frozen=end]:before:to-[var(--table-row-bg,var(--bg-surface))] data-[clickable]:cursor-pointer data-[clickable]:underline"
  >
    <slot />
  </div>
</template>
