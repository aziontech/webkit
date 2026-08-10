<script setup lang="ts">
  import { computed, provide, ref, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { useFlowConnectors } from './connectors'
  import { type FlowAlign, FlowInjectionKey } from './injection-key'

  defineOptions({
    name: 'Flow',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Vertical alignment of nodes within the diagram. */
      align?: FlowAlign
    }>(),
    {
      align: 'start'
    }
  )

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(() => (attrs['data-testid'] as string | undefined) ?? 'data-flow')

  const containerRef = ref<HTMLElement | null>(null)
  const { paths, viewBox } = useFlowConnectors(containerRef)

  provide(FlowInjectionKey, {
    testId: testId.value,
    align: props.align
  })

  const outerClass = computed(() =>
    cn('w-full overflow-x-auto p-(--spacing-md)', attrs.class as string | undefined)
  )
</script>

<template>
  <div
    role="list"
    :data-testid="testId"
    :class="outerClass"
  >
    <!-- The three `[&…[data-flow-…]]:hidden` rules drop every port that would attach to
         nothing: the leading child has no incoming connector, the trailing child no
         outgoing one, and a `terminal` node originates none at all — so the chain opens
         and closes on a node rather than on a stub. connectors.ts stamps leading /
         trailing as it measures; `data-flow-terminal` comes from the node's own prop.
         The terminal rule is a descendant match so it also covers the ports a
         flow-anchor renders inside a terminal node. -->
    <div
      ref="containerRef"
      :data-align="align"
      class="relative flex w-fit flex-row gap-(--spacing-xl) text-(--text-default) data-[align=center]:items-center data-[align=start]:items-start [&>[data-flow-leading]_[data-flow-port=end]]:hidden [&>[data-flow-trailing]_[data-flow-port=start]]:hidden [&_[data-flow-terminal]_[data-flow-port=start]]:hidden"
    >
      <!-- Connectors run port-to-port: each end terminates under a node's connector port,
           which paints over it (the nodes sit at z-1, this layer behind them).

           The stroke marches: `stroke-dasharray="4 4"` plus `animate-flow-dash` (which
           drives `stroke-dashoffset` 24 → 0) reads as the connection carrying something,
           the way a node-based / network diagram shows a live link. The dash cycle is 8
           and the travel is 24, so the pattern lands where it started and the loop has no
           visible seam. A FADED connector — one whose endpoint node is disabled — holds
           still: a disabled step is not flowing, so it keeps the dashes and drops the
           motion. `motion-reduce:animate-none` is what an endlessly moving line owes
           anyone who asked the OS for less motion. -->
      <svg
        v-if="paths.length"
        :viewBox="viewBox"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      >
        <path
          v-for="(path, index) in paths"
          :key="index"
          :d="path.d"
          stroke-width="1"
          stroke-dasharray="4 4"
          :data-faded="path.faded || null"
          class="animate-flow-dash stroke-(--accent) motion-reduce:animate-none data-[faded]:animate-none data-[faded]:opacity-50"
        />
      </svg>
      <slot />
    </div>
  </div>
</template>
