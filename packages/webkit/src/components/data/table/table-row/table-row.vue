<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

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

  const attrs = useAttrs()
  const ctx = inject(TableInjectionKey, null)
  const group = inject(TableRowGroupKey, { hoverable: true })

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__row` : 'data-table__row')
  )
</script>

<template>
  <!-- Native listeners (e.g. @click) fall through via $attrs; row activation is
       supplementary and keyboard-activatable controls live inside the cells. -->
  <div
    v-bind="$attrs"
    role="row"
    :data-testid="testId"
    :data-state="selected ? 'selected' : 'unselected'"
    :data-selected="selected || null"
    :data-frozen="frozen || null"
    :data-hoverable="group.hoverable || null"
    :aria-selected="selected || undefined"
    class="flex w-full items-stretch [--table-row-bg:var(--bg-surface)] bg-[var(--table-row-bg)] border-b-[length:var(--border-width-default)] border-solid border-[var(--border-default)] transition-colors duration-150 ease-out motion-reduce:transition-none data-[hoverable]:hover:[--table-row-bg:var(--bg-canvas)] data-[state=selected]:[--table-row-bg:var(--bg-selected)] data-[state=selected]:hover:[--table-row-bg:var(--bg-selected)] data-[frozen]:sticky data-[frozen]:top-0 data-[frozen]:z-10"
  >
    <slot />
  </div>
</template>
