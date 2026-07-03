<script setup lang="ts">
  import type { Column } from '@tanstack/vue-table'
  import { computed, inject, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'

  import { usePlacement } from '../../../../composables/use-placement'
  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import Checkbox from '../../../inputs/checkbox/checkbox.vue'
  import { TableInjectionKey, type TableRowRecord } from '../injection-key'

  defineOptions({
    name: 'TableColumnSelector',
    inheritAttrs: false
  })

  withDefaults(
    defineProps<{
      /** Popover heading. */
      title?: string
    }>(),
    {
      title: 'Columns'
    }
  )

  defineSlots<{
    /** Replace the default trigger button. */
    trigger(props: { open: () => void }): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(TableInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__column-selector` : 'data-table__column-selector')
  )

  // --- Anchored popover (use-placement + Teleport; no Drawer) -----------------
  const open = ref<boolean>(false)
  const triggerRef = ref<HTMLElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)
  const { panelStyle } = usePlacement({
    triggerRef,
    panelRef,
    isOpen: open,
    placement: 'bottom-end',
    offset: 4
  })
  const toggle = (): void => {
    open.value = !open.value
  }
  const close = (): void => {
    open.value = false
  }
  const onPointerDown = (event: MouseEvent): void => {
    if (!open.value) return
    const target = event.target as Node | null
    if (!target) return
    if (triggerRef.value?.contains(target) || panelRef.value?.contains(target)) return
    close()
  }
  const onKeydown = (event: globalThis.KeyboardEvent): void => {
    if (open.value && event.key === 'Escape') close()
  }
  onMounted(() => {
    globalThis.document?.addEventListener('mousedown', onPointerDown)
    globalThis.document?.addEventListener('keydown', onKeydown)
  })
  onBeforeUnmount(() => {
    globalThis.document?.removeEventListener('mousedown', onPointerDown)
    globalThis.document?.removeEventListener('keydown', onKeydown)
  })

  // Context-aware: reads the hideable leaf columns and toggles visibility through
  // the injected table (which routes back to v-model:columnVisibility).
  const columns = computed<Column<TableRowRecord, unknown>[]>(() => {
    const table = ctx?.table.value
    return table ? table.getAllLeafColumns().filter((column) => column.getCanHide()) : []
  })

  const labelOf = (column: Column<TableRowRecord, unknown>): string => {
    const meta = column.columnDef.meta as { label?: string } | undefined
    const header = column.columnDef.header
    return meta?.label || (typeof header === 'string' && header ? header : column.id)
  }
</script>

<template>
  <div class="relative inline-flex">
    <span
      ref="triggerRef"
      class="inline-flex"
    >
      <slot
        name="trigger"
        :open="() => (open = true)"
      >
        <IconButton
          :data-testid="testId"
          icon="ai ai-column"
          :ariaLabel="title"
          kind="outlined"
          size="medium"
          :aria-expanded="open"
          @click="toggle"
        />
      </slot>
    </span>

    <Teleport to="body">
      <Transition
        enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
        leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
      >
        <div
          v-if="open"
          ref="panelRef"
          role="dialog"
          :aria-label="title"
          :data-testid="`${testId}__panel`"
          :style="panelStyle"
          class="flex min-w-[var(--container-3xs)] max-w-[var(--container-2xs)] flex-col gap-[var(--spacing-xs)] rounded-[var(--shape-card)] border border-solid border-[length:var(--border-width-default)] border-[var(--border-default)] bg-[var(--bg-surface)] p-[var(--spacing-sm)] shadow-[var(--shadow-sm)] outline-none [transform-origin:var(--popup-origin,top_left)]"
        >
          <p class="text-label-md text-[var(--text-default)]">{{ title }}</p>
          <label
            v-for="column in columns"
            :key="column.id"
            class="flex items-center gap-[var(--spacing-sm)] text-body-sm text-[var(--text-default)]"
          >
            <Checkbox
              binary
              :model-value="column.getIsVisible()"
              @update:model-value="(value) => column.toggleVisibility(!!value)"
            />
            <span class="min-w-0 truncate">{{ labelOf(column) }}</span>
          </label>
          <p
            v-if="columns.length === 0"
            class="text-body-sm text-[var(--text-muted)]"
          >
            No hideable columns.
          </p>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
