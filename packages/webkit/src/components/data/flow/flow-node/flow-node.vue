<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { FlowInjectionKey } from '../injection-key'

  defineOptions({
    name: 'FlowNode',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Marks the step as disabled; adjacent connectors render at reduced opacity. */
      disabled?: boolean
      /** Drops the default node box so the slot content defines the node's appearance. */
      unstyled?: boolean
      /** Ends its branch: the node receives an incoming connector but originates none. */
      terminal?: boolean
    }>(),
    {
      disabled: false,
      unstyled: false,
      terminal: false
    }
  )

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(FlowInjectionKey)

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx?.testId ?? 'data-flow'}__node`
  )

  const ROOT_CLASS =
    'group relative z-[1] text-label-md text-[var(--text-default)] focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] data-[styled]:inline-flex data-[styled]:min-h-10 data-[styled]:items-center data-[styled]:justify-center data-[styled]:whitespace-nowrap data-[styled]:rounded-[var(--shape-button)] data-[styled]:border-solid data-[styled]:border-[length:var(--border-width-default,1px)] data-[styled]:border-[var(--border-default)] data-[styled]:bg-[var(--bg-surface-raised)] data-[styled]:px-[var(--spacing-md)] data-[styled]:py-[var(--spacing-sm)] data-[styled]:shadow-[var(--shadow-xs)] data-[disabled]:text-[var(--text-disabled)] data-[disabled]:opacity-60'

  // The connector port: an 8px square sitting entirely OUTSIDE the node box, flush against
  // the edge a connector attaches to. `data-flow-port` picks the edge; the border goes
  // dashed while the step is disabled.
  //
  // Two coupled offsets place it, and both are load-bearing. An absolutely positioned child
  // resolves its offsets against the PADDING box, so `-left-px` backs out the 1px border to
  // land on the border-box edge; `-translate-x-full` then pushes the whole square clear of
  // the box. Keeping the port outside the border means the node's surface and its
  // focus-visible ring never crop it. The border-box edge is the exact point connectors.ts
  // attaches to, so the line meets the port's inner edge and the square occludes the rest.
  const PORT_CLASS =
    'pointer-events-none absolute top-1/2 size-2 -translate-y-1/2 rounded-[var(--radius-sm)] border-solid border-[length:var(--border-width-default,1px)] border-[var(--border-muted)] bg-[var(--accent)] data-[flow-port=end]:-left-px data-[flow-port=end]:-translate-x-full data-[flow-port=start]:-right-px data-[flow-port=start]:translate-x-full group-data-[disabled]:border-dashed'

  const rootClass = computed(() => cn(ROOT_CLASS, attrs.class as string | undefined))
</script>

<template>
  <div
    role="listitem"
    data-flow-kind="node"
    :data-flow-disabled="disabled ? 'true' : null"
    :data-flow-terminal="terminal ? 'true' : null"
    :data-disabled="disabled || null"
    :data-styled="props.unstyled ? null : ''"
    :aria-disabled="disabled || undefined"
    :data-testid="testId"
    :class="rootClass"
  >
    <!-- An unstyled node owns its whole appearance, so it renders no ports — place a
         flow-anchor inside it to put ports on the parts a connector should touch. -->
    <span
      v-if="!unstyled"
      aria-hidden="true"
      data-flow-port="end"
      :class="PORT_CLASS"
    />
    <slot />
    <!-- A terminal node originates no connector, so it carries no outgoing port. -->
    <span
      v-if="!unstyled && !terminal"
      aria-hidden="true"
      data-flow-port="start"
      :class="PORT_CLASS"
    />
  </div>
</template>
