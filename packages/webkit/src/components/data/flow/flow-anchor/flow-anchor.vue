<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { FlowInjectionKey } from '../injection-key'

  defineOptions({
    name: 'FlowAnchor',
    inheritAttrs: false
  })

  const props = defineProps<{
    /** Which connector attaches here: `end` is the incoming endpoint, `start` the outgoing origin; omitted marks both. */
    type?: 'start' | 'end'
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(FlowInjectionKey)

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx?.testId ?? 'data-flow'}__anchor`
  )

  // Same port as flow-node, sitting outside the edge this anchor attaches to, so a connector
  // reaching into an unstyled node lands on a port instead of a bare edge. Inherits the
  // dashed treatment from the enclosing node's `group`.
  //
  // Unlike flow-node this uses a plain `left-0` / `right-0`: the anchor is an unbordered
  // block, so its padding box and border box coincide and no pull-back is needed. Adding
  // one here would push the port a pixel past the edge connectors.ts attaches to.
  const PORT_CLASS =
    'pointer-events-none absolute top-1/2 size-2 -translate-y-1/2 rounded-[var(--radius-sm)] border-solid border-[length:var(--border-width-default,1px)] border-[var(--border-muted)] bg-[var(--accent)] data-[flow-port=end]:left-0 data-[flow-port=end]:-translate-x-full data-[flow-port=start]:right-0 data-[flow-port=start]:translate-x-full group-data-[disabled]:border-dashed'

  const rootClass = computed(() => cn('relative block', attrs.class as string | undefined))
</script>

<template>
  <div
    :data-flow-anchor="props.type ?? 'both'"
    :data-testid="testId"
    :class="rootClass"
  >
    <span
      v-if="props.type !== 'start'"
      aria-hidden="true"
      data-flow-port="end"
      :class="PORT_CLASS"
    />
    <slot />
    <span
      v-if="props.type !== 'end'"
      aria-hidden="true"
      data-flow-port="start"
      :class="PORT_CLASS"
    />
  </div>
</template>
