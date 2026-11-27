<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'FlowDiagramAnchor',
    inheritAttrs: false
  })

  /** Which connector attaches to the anchor. */
  export type FlowDiagramAnchorSide = 'start' | 'end'

  export interface FlowDiagramAnchorProps {
    /** Which connector attaches here: end is the incoming one, start the outgoing one; empty marks both. */
    side?: FlowDiagramAnchorSide
  }

  const props = withDefaults(defineProps<FlowDiagramAnchorProps>(), {
    side: undefined
  })

  defineSlots<{
    /** The part of the node a connector touches. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'flow-diagram-anchor'
  )

  const PORT_CLASS =
    'pointer-events-none absolute top-1/2 size-2 -translate-y-1/2 rounded-(--radius-sm) border-solid border-[length:var(--border-width-default,1px)] border-(--border-muted) ' +
    'bg-(--accent) ' +
    'data-[side=end]:-start-px data-[side=end]:-translate-x-full data-[side=start]:-end-px data-[side=start]:translate-x-full ' +
    'rtl:data-[side=end]:translate-x-full rtl:data-[side=start]:-translate-x-full ' +
    'group-data-[disabled]/node:border-dashed'
</script>

<template>
  <div
    data-slot="flow-diagram-anchor"
    :data-side="props.side"
    :data-testid="testId"
    class="relative block"
    :class="attrs.class"
  >
    <span
      v-if="props.side !== 'start'"
      aria-hidden="true"
      data-slot="flow-diagram-port"
      data-side="end"
      :class="PORT_CLASS"
    />
    <slot />
    <span
      v-if="props.side !== 'end'"
      aria-hidden="true"
      data-slot="flow-diagram-port"
      data-side="start"
      :class="PORT_CLASS"
    />
  </div>
</template>
