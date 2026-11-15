<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { FlowInjectionKey } from '../injection-key'

  defineOptions({
    name: 'FlowAnchor',
    inheritAttrs: false
  })

  /** Which connector attaches to the anchor. */
  export type FlowAnchorSide = 'start' | 'end'

  export interface FlowAnchorProps {
    /** Which connector attaches here: `end` is the incoming endpoint, `start` the outgoing origin; empty marks both. */
    side?: FlowAnchorSide
  }

  const props = withDefaults(defineProps<FlowAnchorProps>(), {
    side: undefined
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(FlowInjectionKey)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ?? `${ctx?.testId.value ?? 'data-flow'}__anchor`
  )

  const PORT_CLASS =
    'pointer-events-none absolute top-1/2 size-2 -translate-y-1/2 rounded-(--radius-sm) border-solid border-[length:var(--border-width-default,1px)] border-(--border-muted) bg-(--accent) data-[side=end]:start-0 data-[side=end]:-translate-x-full data-[side=start]:end-0 data-[side=start]:translate-x-full rtl:data-[side=end]:translate-x-full rtl:data-[side=start]:-translate-x-full group-data-[disabled]:border-dashed'

  const port = computed<FlowAnchorSide | undefined>(() => props.side)
</script>

<template>
  <div
    data-slot="flow-anchor"
    :data-side="port"
    :data-testid="testId"
    class="relative block"
    :class="attrs.class"
  >
    <span
      v-if="port !== 'start'"
      aria-hidden="true"
      data-slot="flow-port"
      data-side="end"
      :class="PORT_CLASS"
    />
    <slot />
    <span
      v-if="port !== 'end'"
      aria-hidden="true"
      data-slot="flow-port"
      data-side="start"
      :class="PORT_CLASS"
    />
  </div>
</template>
