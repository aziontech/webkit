<script setup lang="ts">
  import { inject } from 'vue'

  import { TableInjectionKey, TableRowGroupKey } from '../injection-key'

  defineOptions({
    name: 'TableRow',
    inheritAttrs: false
  })

  interface Props {
    /** Applies the selected row surface and aria-selected. */
    selected?: boolean
    /** Sticks the row to the top of the scroll container (pinned row). */
    frozen?: boolean
  }

  withDefaults(defineProps<Props>(), {
    selected: false,
    frozen: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const ctx = inject(TableInjectionKey, null)
  const group = inject(TableRowGroupKey, { hoverable: true })
  const fallbackTestId = ctx ? `${ctx.testId}__row` : 'data-table__row'
</script>

<template>
  <div
    v-bind="$attrs"
    role="row"
    :data-testid="$attrs['data-testid'] ?? fallbackTestId"
    :data-state="selected ? 'selected' : 'unselected'"
    :data-selected="selected || null"
    :data-frozen="frozen || null"
    :data-hoverable="group.hoverable || null"
    :aria-selected="selected || undefined"
    class="flex w-full items-stretch [--table-row-bg:var(--bg-surface)] bg-(--table-row-bg) border-b-(length:--border-width-default) border-solid border-(--border-default) transition-colors duration-150 ease-out motion-reduce:transition-none data-[hoverable]:hover:[--table-row-bg:var(--bg-canvas)] data-[state=selected]:[--table-row-bg:var(--bg-selected)] data-[state=selected]:hover:[--table-row-bg:var(--bg-selected)] data-[frozen]:sticky data-[frozen]:top-0 data-[frozen]:z-10"
  >
    <slot />
  </div>
</template>
