<script setup lang="ts">
  import { inject } from 'vue'

  import { TableRowGroupInjectionKey } from '../injection-key'

  defineOptions({
    name: 'TableRow',
    inheritAttrs: false
  })

  export interface TableRowProps {
    /** Applies the selected row surface and aria-selected. */
    selected?: boolean
    /** Sticks the row to the top of the scroll container (pinned row). */
    frozen?: boolean
  }

  withDefaults(defineProps<TableRowProps>(), {
    selected: false,
    frozen: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const group = inject(TableRowGroupInjectionKey, { hoverable: true })
  const fallbackTestId = 'table-row'

  const ROOT_CLASS =
    'flex w-full items-stretch [--table-row-bg:var(--bg-surface)] bg-(--table-row-bg) border-b-(length:--border-width-default) border-solid border-(--border-default) transition-colors ' +
    'duration-150 ease-out motion-reduce:transition-none ' +
    'data-[hoverable]:hover:[--table-row-bg:var(--bg-canvas)] ' +
    'data-[state=selected]:[--table-row-bg:var(--bg-selected)] data-[state=selected]:hover:[--table-row-bg:var(--bg-selected)] ' +
    'relative data-[frozen]:sticky data-[frozen]:top-0 data-[frozen]:z-10 ' +
    'before:pointer-events-none before:absolute before:inset-x-0 before:-bottom-(--border-width-default) before:z-6 before:h-(--border-width-default) ' +
    "before:bg-(--border-default) before:content-[''] forced-colors:before:hidden"
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
    :class="ROOT_CLASS"
  >
    <slot />
  </div>
</template>
