<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'

  defineOptions({
    name: 'FlowDiagramNode',
    inheritAttrs: false
  })

  export interface FlowDiagramNodeProps {
    /** Identity of the node; the diagram's edges name it in from and to. */
    value?: string
    /** Dims the node and the connectors that touch it. */
    disabled?: boolean
    /** Drops the default box so the slot content is the whole node. */
    unstyled?: boolean
    /** Ends its branch: the node receives a connector and sends none. */
    terminal?: boolean
    /** Dashed outline, for a staged change or an unbound slot. */
    dashed?: boolean
  }

  const props = withDefaults(defineProps<FlowDiagramNodeProps>(), {
    value: '',
    disabled: false,
    unstyled: false,
    terminal: false,
    dashed: false
  })

  defineSlots<{
    /** Content of the node: a label, or the header, title, description and footer parts. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'flow-diagram-node'
  )

  const ROOT_CLASS =
    'group/node relative z-1 text-label-md text-(--text-default) ' +
    'data-[styled]:inline-flex data-[styled]:min-h-10 data-[styled]:items-center data-[styled]:justify-center data-[styled]:whitespace-nowrap data-[styled]:rounded-(--shape-button) ' +
    'data-[styled]:border-solid data-[styled]:border-[length:var(--border-width-default,1px)] data-[styled]:border-(--border-default) data-[styled]:bg-(--bg-surface-raised) ' +
    'data-[styled]:px-(--spacing-md) data-[styled]:py-(--spacing-sm) data-[styled]:shadow-(--shadow-xs) data-[styled]:has-[[data-slot=flow-diagram-title]]:flex ' +
    'data-[styled]:has-[[data-slot=flow-diagram-title]]:flex-col data-[styled]:has-[[data-slot=flow-diagram-title]]:items-stretch ' +
    'data-[styled]:has-[[data-slot=flow-diagram-title]]:justify-start data-[styled]:has-[[data-slot=flow-diagram-title]]:whitespace-normal ' +
    'data-[styled]:has-[[data-slot=flow-diagram-title]]:rounded-(--shape-card) data-[styled]:has-[[data-slot=flow-diagram-title]]:bg-(--bg-surface) ' +
    'data-[styled]:has-[[data-slot=flow-diagram-title]]:p-0 data-[styled]:has-[[data-slot=flow-diagram-title]]:text-start data-[styled]:data-[dashed]:border-dashed ' +
    'data-[styled]:has-[[data-pending]]:border-dashed ' +
    'data-[disabled]:text-(--text-disabled) data-[disabled]:opacity-60 ' +
    'transition-colors duration-moderate-01 ease-productive-entrance hover:data-[styled]:border-(--border-strong) motion-reduce:transition-none'

  const PORT_CLASS =
    'pointer-events-none absolute top-1/2 size-2 -translate-y-1/2 rounded-(--radius-sm) border-solid border-[length:var(--border-width-default,1px)] border-(--border-muted) ' +
    'bg-(--accent) ' +
    'group-has-[[data-slot=flow-diagram-anchor]]/node:hidden ' +
    'data-[side=end]:-start-px data-[side=end]:-translate-x-full data-[side=start]:-end-px data-[side=start]:translate-x-full ' +
    'rtl:data-[side=end]:translate-x-full rtl:data-[side=start]:-translate-x-full ' +
    'group-data-[disabled]/node:border-dashed'

  const rootClass = computed(() => cn(ROOT_CLASS, attrs.class as string | undefined))
</script>

<template>
  <div
    v-bind="$attrs"
    role="listitem"
    data-slot="flow-diagram-node"
    :data-node-key="value || null"
    :data-terminal="terminal || null"
    :data-disabled="disabled || null"
    :data-dashed="dashed || null"
    :data-styled="props.unstyled ? null : ''"
    :aria-disabled="disabled || undefined"
    :data-testid="testId"
    :class="rootClass"
  >
    <span
      v-if="!unstyled"
      aria-hidden="true"
      data-slot="flow-diagram-port"
      data-side="end"
      :class="PORT_CLASS"
    />
    <slot />
    <span
      v-if="!unstyled && !terminal"
      aria-hidden="true"
      data-slot="flow-diagram-port"
      data-side="start"
      :class="PORT_CLASS"
    />
  </div>
</template>
