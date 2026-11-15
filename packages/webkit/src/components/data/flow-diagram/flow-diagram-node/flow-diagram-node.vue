<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'

  defineOptions({
    name: 'FlowNode',
    inheritAttrs: false
  })

  export interface FlowDiagramNodeProps {
    /** Marks the step as disabled; adjacent connectors render at reduced opacity. */
    disabled?: boolean
    /** Drops the default node box so the slot content defines the node's appearance. */
    unstyled?: boolean
    /** Ends its branch: the node receives an incoming connector but originates none. */
    terminal?: boolean
  }

  const props = withDefaults(defineProps<FlowDiagramNodeProps>(), {
    disabled: false,
    unstyled: false,
    terminal: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'flow-diagram-node'
  )

  const ROOT_CLASS =
    'group relative z-1 text-label-md text-(--text-default) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) data-[styled]:inline-flex data-[styled]:min-h-10 data-[styled]:items-center data-[styled]:justify-center data-[styled]:whitespace-nowrap data-[styled]:rounded-(--shape-button) data-[styled]:border-solid data-[styled]:border-[length:var(--border-width-default,1px)] data-[styled]:border-(--border-default) data-[styled]:bg-(--bg-surface-raised) data-[styled]:px-(--spacing-md) data-[styled]:py-(--spacing-sm) data-[styled]:shadow-(--shadow-xs) data-[disabled]:text-(--text-disabled) data-[disabled]:opacity-60'

  const PORT_CLASS =
    'pointer-events-none absolute top-1/2 size-2 -translate-y-1/2 rounded-(--radius-sm) border-solid border-[length:var(--border-width-default,1px)] border-(--border-muted) bg-(--accent) data-[side=end]:-start-px data-[side=end]:-translate-x-full data-[side=start]:-end-px data-[side=start]:translate-x-full rtl:data-[side=end]:translate-x-full rtl:data-[side=start]:-translate-x-full group-data-[disabled]:border-dashed'

  const rootClass = computed(() => cn(ROOT_CLASS, attrs.class as string | undefined))
</script>

<template>
  <div
    role="listitem"
    data-slot="flow-diagram-node"
    :data-flow-disabled="disabled ? 'true' : null"
    :data-flow-terminal="terminal ? 'true' : null"
    :data-disabled="disabled || null"
    :data-styled="props.unstyled ? null : ''"
    :aria-disabled="disabled || undefined"
    :data-testid="testId"
    :class="rootClass"
  >
    <span
      v-if="!unstyled"
      aria-hidden="true"
      data-slot="flow-port"
      data-side="end"
      :class="PORT_CLASS"
    />
    <slot />
    <span
      v-if="!unstyled && !terminal"
      aria-hidden="true"
      data-slot="flow-port"
      data-side="start"
      :class="PORT_CLASS"
    />
  </div>
</template>
